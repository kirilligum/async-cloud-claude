import { Context } from "hono";
import { daytona } from "../services/daytonaService.ts";
import {
  addTask,
  getTask,
  removeTask,
  updateTaskStatus,
} from "../services/taskStore.ts";
import { logger } from "../utils/logger.ts";
import { getEnv } from "../utils/os.ts";

const REPO_URL = "https://github.com/sugyan/claude-code-webui.git"; // Replace with dynamic value if needed

/**
 * Handles POST /api/tasks/start requests
 * Creates a new Git branch and Daytona sandbox for the task
 * @param c - Hono context object
 * @returns JSON response with branch and sandbox details
 */
export async function handleStartTaskRequest(c: Context) {
  const { baseBranch, workingDirectory } = await c.req.json();
  const newBranchName = `claude-task/${Date.now()}`;

  try {
    // Step 1: Create branch locally
    const { runtime } = c.var.config;
    await runtime.runCommand("git", ["checkout", baseBranch]);
    await runtime.runCommand("git", ["pull"]);
    await runtime.runCommand("git", ["checkout", "-b", newBranchName]);

    // Step 2: Create Daytona Sandbox (using Ubuntu image)
    const envVars: Record<string, string> = {
      GIT_BRANCH_NAME: newBranchName,
      GIT_REPO_URL: REPO_URL,
    };

    // Add GitHub PAT if available for authenticated git operations
    const githubPat = getEnv("GITHUB_PAT");
    if (githubPat) {
      envVars.GITHUB_PAT = githubPat;
    }

    const sandbox = await daytona.create({
      image: "ubuntu:22.04",
      name: `claude-task-${newBranchName.replace("/", "-")}`,
      envVars,
    });

    addTask(newBranchName, { sandboxId: sandbox.id, status: "creating" });

    // Don't wait for sandbox to be ready, return immediately
    return c.json(
      { branchName: newBranchName, sandboxId: sandbox.id, status: "creating" },
      202,
    );
  } catch (error) {
    logger.api.error("Failed to start task: {error}", { error });
    return c.json({ error: "Failed to start task" }, 500);
  }
}

/**
 * Handles POST /api/tasks/commit requests
 * Commits and pushes changes from the Daytona sandbox
 * @param c - Hono context object
 * @returns JSON response with success status
 */
export async function handleCommitRequest(c: Context) {
  const { branchName, message, author, email } = await c.req.json();
  const task = getTask(branchName);

  if (!task) {
    return c.json({ error: "Active task not found for this branch" }, 404);
  }

  try {
    const sandbox = await daytona.get(task.sandboxId);
    await sandbox.process.executeCommand(
      `git config --global user.name "${author}"`,
    );
    await sandbox.process.executeCommand(
      `git config --global user.email "${email}"`,
    );
    await sandbox.process.executeCommand("git add .");
    await sandbox.process.executeCommand(`git commit -m "${message}"`);
    await sandbox.process.executeCommand(`git push origin ${branchName}`);

    return c.json({ success: true });
  } catch (error) {
    logger.api.error("Failed to commit changes: {error}", { error });
    return c.json({ error: "Failed to commit and push changes" }, 500);
  }
}

/**
 * Handles POST /api/tasks/stop requests
 * Stops and deletes the Daytona sandbox for a task
 * @param c - Hono context object
 * @returns JSON response with success status
 */
export async function handleStopTaskRequest(c: Context) {
  const { branchName } = await c.req.json();
  const task = getTask(branchName);

  if (!task) {
    return c.json({ error: "Active task not found for this branch" }, 404);
  }

  try {
    const sandbox = await daytona.get(task.sandboxId);
    await sandbox.delete();
    removeTask(branchName);

    return c.json({ success: true });
  } catch (error) {
    logger.api.error("Failed to stop task: {error}", { error });
    return c.json({ error: "Failed to stop task" }, 500);
  }
}
