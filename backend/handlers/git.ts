import { Context } from "hono";
import { listActiveBranches } from "../services/taskStore.ts";
import type { BranchesResponse } from "../../shared/types.ts";
import { logger } from "../utils/logger.ts";
import type { ConfigContext } from "../middleware/config.ts";

/**
 * Handles GET /api/git/branches requests
 * Returns a list of active task branches
 * @param c - Hono context object
 * @returns JSON response with branch list
 */
export async function handleListBranchesRequest(c: Context) {
  try {
    const branches = listActiveBranches();
    const response: BranchesResponse = {
      branches: branches.map((b) => ({
        name: b.branchName,
        sandboxId: b.task.sandboxId,
        status: b.task.status,
      })),
    };
    return c.json(response);
  } catch (error) {
    logger.api.error("Failed to list branches: {error}", { error });
    return c.json({ error: "Failed to list branches" }, 500);
  }
}
