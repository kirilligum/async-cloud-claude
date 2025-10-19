/**
 * Runtime-agnostic Hono application
 *
 * This module creates the Hono application with all routes and middleware,
 * but doesn't include runtime-specific code like CLI parsing or server startup.
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Runtime } from "./runtime/types.ts";
import {
  type ConfigContext,
  createConfigMiddleware,
} from "./middleware/config.ts";
import { handleProjectsRequest } from "./handlers/projects.ts";
import { handleHistoriesRequest } from "./handlers/histories.ts";
import { handleConversationRequest } from "./handlers/conversations.ts";
import { handleChatRequest } from "./handlers/chat.ts";
import { handleAbortRequest } from "./handlers/abort.ts";
import {
  handleListBranchesRequest,
  handleListRepoBranchesRequest,
} from "./handlers/git.ts";
import {
  handleStartTaskRequest,
  handleCommitRequest,
  handlePushRequest,
  handleStopTaskRequest,
} from "./handlers/tasks.ts";
import { logger } from "./utils/logger.ts";
import { readBinaryFile } from "./utils/fs.ts";
import { getTask } from "./services/taskStore.ts";
import { daytona } from "./services/daytonaService.ts";
import type { ChatRequest } from "../shared/types.ts";

export interface AppConfig {
  debugMode: boolean;
  staticPath: string;
  cliPath: string; // Actual CLI script path detected by validateClaudeCli
}

export function createApp(
  runtime: Runtime,
  config: AppConfig,
): Hono<ConfigContext> {
  const app = new Hono<ConfigContext>();

  // Store AbortControllers for each request (shared with chat handler)
  const requestAbortControllers = new Map<string, AbortController>();

  // CORS middleware
  app.use(
    "*",
    cors({
      origin: "*",
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type"],
    }),
  );

  // Configuration middleware - makes app settings available to all handlers
  app.use(
    "*",
    createConfigMiddleware({
      debugMode: config.debugMode,
      runtime,
      cliPath: config.cliPath,
    }),
  );

  // API routes
  app.get("/api/projects", (c) => handleProjectsRequest(c));

  app.get("/api/projects/:encodedProjectName/histories", (c) =>
    handleHistoriesRequest(c),
  );

  app.get("/api/projects/:encodedProjectName/histories/:sessionId", (c) =>
    handleConversationRequest(c),
  );

  app.post("/api/abort/:requestId", (c) =>
    handleAbortRequest(c, requestAbortControllers),
  );

  // New Task and Git Routes
  app.get("/api/git/branches", (c) => handleListBranchesRequest(c));
  app.get("/api/git/repo-branches", (c) => handleListRepoBranchesRequest(c));
  app.post("/api/tasks/start", (c) => handleStartTaskRequest(c));
  app.post("/api/tasks/commit", (c) => handleCommitRequest(c));
  app.post("/api/tasks/push", (c) => handlePushRequest(c));
  app.post("/api/tasks/stop", (c) => handleStopTaskRequest(c));

  // Chat handler - runs Claude CLI locally
  app.post("/api/chat", async (c) => {
    const chatRequest: ChatRequest = await c.req.json();
    const { branchName } = chatRequest;

    // Check if this is for a Daytona container task
    if (branchName && branchName !== "main") {
      const task = getTask(branchName);
      if (!task) {
        // Task not found, return error
        return c.json(
          {
            error: `No active Daytona container found for branch: ${branchName}. Please click "New Task" to create a container first.`,
          },
          404,
        );
      }
    }

    // Run Claude CLI locally
    return handleChatRequest(c, requestAbortControllers);
  });

  // Static file serving with SPA fallback
  // Serve static assets (CSS, JS, images, etc.)
  const serveStatic = runtime.createStaticFileMiddleware({
    root: config.staticPath,
  });
  app.use("/assets/*", serveStatic);

  // SPA fallback - serve index.html for all unmatched routes (except API routes)
  app.get("*", async (c) => {
    const path = c.req.path;

    // Skip API routes
    if (path.startsWith("/api/")) {
      return c.text("Not found", 404);
    }

    try {
      const indexPath = `${config.staticPath}/index.html`;
      const indexFile = await readBinaryFile(indexPath);
      return c.html(new TextDecoder().decode(indexFile));
    } catch (error) {
      logger.app.error("Error serving index.html: {error}", { error });
      return c.text("Internal server error", 500);
    }
  });

  return app;
}
