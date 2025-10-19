import { Context } from "hono";
import { listActiveBranches } from "../services/taskStore.ts";
import type { BranchesResponse } from "../../shared/types.ts";
import { logger } from "../utils/logger.ts";
import type { ConfigContext } from "../middleware/config.ts";

/**
 * Handles GET /api/git/branches requests
 * Returns a list of active task branches (Daytona containers)
 * @param c - Hono context object
 * @returns JSON response with branch list
 */
export async function handleListBranchesRequest(c: Context) {
  try {
    const branches = listActiveBranches();
    const response: BranchesResponse = {
      branches: branches.map((b) => ({
        name: b.branchName,
        isActive: b.task.status === "ready", // Container is active if it's ready
        sandboxId: b.task.sandboxId,
        taskStatus: b.task.status,
      })),
    };
    return c.json(response);
  } catch (error) {
    logger.api.error("Failed to list branches: {error}", { error });
    return c.json({ error: "Failed to list branches" }, 500);
  }
}

/**
 * Handles GET /api/git/repo-branches requests
 * Returns a list of git branches from the repository
 * @param c - Hono context object
 * @returns JSON response with repository branch list
 */
export async function handleListRepoBranchesRequest(c: Context<ConfigContext>) {
  try {
    const { runtime } = c.var.config;

    // Get working directory from query parameter
    const workingDirectory = c.req.query("workingDirectory");
    if (!workingDirectory) {
      return c.json({ error: "workingDirectory is required" }, 400);
    }

    // Execute git branch command to list all branches
    const result = await runtime.runCommand(
      "git",
      ["branch", "-r", "--format=%(refname:short)"],
      { cwd: workingDirectory },
    );

    if (!result.success) {
      logger.api.error("Failed to list git branches: {error}", {
        error: result.stderr,
      });
      return c.json({ branches: ["main"] }); // Fallback to main
    }

    // Parse branch names (remove "origin/" prefix)
    const branches = result.stdout
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.replace(/^origin\//, ""))
      .filter((line) => line !== "HEAD"); // Remove HEAD reference

    // Ensure "main" is included even if not in remote
    if (!branches.includes("main")) {
      branches.unshift("main");
    }

    return c.json({ branches });
  } catch (error) {
    logger.api.error("Failed to list repository branches: {error}", { error });
    // Return default branches as fallback
    return c.json({ branches: ["main", "master", "develop"] });
  }
}
