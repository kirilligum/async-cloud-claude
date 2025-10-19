import { Context } from "hono";
import { daytona } from "../services/daytonaService.ts";
import {
  addTask,
  getTask,
  removeTask,
  updateTaskStatus,
} from "../services/taskStore.ts";
import { logger } from "../utils/logger.ts";

const REPO_URL = "https://github.com/sugyan/claude-code-webui.git"; // Replace with dynamic value if needed

/**
 * Handles POST /api/tasks/start requests
 * Creates a Daytona sandbox with a new Git branch inside it
 * @param c - Hono context object
 * @returns JSON response with branch and sandbox details
 */
export async function handleStartTaskRequest(c: Context) {
  const { baseBranch } = await c.req.json();
  const newBranchName = `claude-task/${Date.now()}`;

  try {
    logger.api.info("Creating Daytona sandbox for branch: {branch}", {
      branch: newBranchName,
    });

    // Step 1: Create Daytona Sandbox
    const sandbox = await daytona.create({
      image: "ubuntu:22.04",
      name: `claude-task-${newBranchName.replace("/", "-")}`,
    });

    logger.api.info("Sandbox created: {sandboxId}, waiting for it to start", {
      sandboxId: sandbox.id,
    });

    // Step 2: Wait for sandbox to be ready
    await sandbox.waitUntilStarted(120); // 2 minute timeout

    logger.api.info("Sandbox started, installing dependencies");

    // Step 2a: Install Node.js and Claude CLI
    await sandbox.process.executeCommand(
      "apt-get update && apt-get install -y curl git",
    );
    await sandbox.process.executeCommand(
      "curl -fsSL https://deb.nodesource.com/setup_20.x | bash -",
    );
    await sandbox.process.executeCommand("apt-get install -y nodejs");
    await sandbox.process.executeCommand(
      "npm install -g @anthropic-ai/claude-code",
    );

    logger.api.info("Dependencies installed, setting up git repository");

    // Step 3: Clone repository into sandbox
    const repoPath = "/workspace/repo";
    await sandbox.git.clone(REPO_URL, repoPath, baseBranch);

    logger.api.info("Repository cloned, creating branch: {branch}", {
      branch: newBranchName,
    });

    // Step 4: Create and checkout new branch inside sandbox
    await sandbox.git.createBranch(repoPath, newBranchName);
    await sandbox.git.checkoutBranch(repoPath, newBranchName);

    logger.api.info("Branch created and checked out in sandbox");

    // Step 5: Store task info
    addTask(newBranchName, {
      sandboxId: sandbox.id,
      status: "ready",
      repoPath,
    });

    return c.json(
      {
        branchName: newBranchName,
        sandboxId: sandbox.id,
        status: "ready",
        repoPath,
      },
      201,
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
    const repoPath = task.repoPath || "/workspace/repo";

    logger.api.info("Committing changes for branch: {branch}", {
      branch: branchName,
    });

    // Stage all changes
    await sandbox.git.add(repoPath, ["."]);

    // Commit changes
    const commitResult = await sandbox.git.commit(
      repoPath,
      message,
      author,
      email,
    );

    logger.api.info("Changes committed: {sha}", { sha: commitResult.sha });

    return c.json({ success: true, sha: commitResult.sha });
  } catch (error) {
    logger.api.error("Failed to commit changes: {error}", { error });
    return c.json({ error: "Failed to commit and push changes" }, 500);
  }
}

/**
 * Handles POST /api/tasks/push requests
 * Pushes committed changes from the Daytona sandbox to remote
 * @param c - Hono context object
 * @returns JSON response with success status
 */
export async function handlePushRequest(c: Context) {
  const { branchName } = await c.req.json();
  const task = getTask(branchName);

  if (!task) {
    return c.json({ error: "Active task not found for this branch" }, 404);
  }

  try {
    const sandbox = await daytona.get(task.sandboxId);
    const repoPath = task.repoPath || "/workspace/repo";

    logger.api.info("Pushing changes for branch: {branch}", {
      branch: branchName,
    });

    // Push to remote
    await sandbox.git.push(repoPath);

    logger.api.info("Changes pushed to remote");

    return c.json({ success: true });
  } catch (error) {
    logger.api.error("Failed to push changes: {error}", { error });
    return c.json({ error: "Failed to push changes" }, 500);
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
