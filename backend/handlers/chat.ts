import { Context } from "hono";
import { query, type PermissionMode } from "@anthropic-ai/claude-code";
import type { ChatRequest, StreamResponse } from "../../shared/types.ts";
import { logger } from "../utils/logger.ts";
import { getTask } from "../services/taskStore.ts";
import { daytona } from "../services/daytonaService.ts";

/**
 * Executes Claude inside a Daytona sandbox
 * @param sandboxId - Daytona sandbox ID
 * @param message - User message
 * @param repoPath - Path to repo inside sandbox
 * @param sessionId - Optional session ID
 * @param requestId - Request ID for abort
 * @returns AsyncGenerator yielding StreamResponse objects
 */
async function* executeClaudeInSandbox(
  sandboxId: string,
  message: string,
  repoPath: string,
  sessionId?: string,
  requestId?: string,
): AsyncGenerator<StreamResponse> {
  try {
    const sandbox = await daytona.get(sandboxId);

    // Get API key from environment
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }

    // Escape single quotes in message for bash command
    const escapedMessage = message.replace(/'/g, "'\\''");

    // Build Claude CLI command with API key export
    // Use single quotes to avoid escaping issues
    // Note: --verbose is required when using --output-format stream-json with -p
    let command = `export ANTHROPIC_API_KEY='${apiKey}' && cd ${repoPath} && claude --output-format stream-json --verbose -p '${escapedMessage}'`;
    if (sessionId) {
      command += ` --resume ${sessionId}`;
    }

    logger.chat.info("Executing Claude in sandbox: {command}", {
      command: command.replace(apiKey, "***"), // Hide API key in logs
    });

    // Execute command in sandbox
    const result = await sandbox.process.executeCommand(command, repoPath);

    // Parse the output as streaming JSON
    const lines = result.artifacts.stdout.split("\n");
    for (const line of lines) {
      if (line.trim()) {
        try {
          const sdkMessage = JSON.parse(line);
          yield {
            type: "claude_json",
            data: sdkMessage,
          };
        } catch (parseError) {
          logger.chat.warn("Failed to parse line as JSON: {line}", { line });
        }
      }
    }

    yield { type: "done" };
  } catch (error) {
    logger.chat.error("Claude execution in sandbox failed: {error}", { error });
    yield {
      type: "error",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Executes a Claude command and yields streaming responses
 * @param message - User message or command
 * @param requestId - Unique request identifier for abort functionality
 * @param requestAbortControllers - Shared map of abort controllers
 * @param cliPath - Path to actual CLI script (detected by validateClaudeCli)
 * @param sessionId - Optional session ID for conversation continuity
 * @param allowedTools - Optional array of allowed tool names
 * @param workingDirectory - Optional working directory for Claude execution
 * @param permissionMode - Optional permission mode for Claude execution
 * @returns AsyncGenerator yielding StreamResponse objects
 */
async function* executeClaudeCommand(
  message: string,
  requestId: string,
  requestAbortControllers: Map<string, AbortController>,
  cliPath: string,
  sessionId?: string,
  allowedTools?: string[],
  workingDirectory?: string,
  permissionMode?: PermissionMode,
): AsyncGenerator<StreamResponse> {
  let abortController: AbortController;

  try {
    // Process commands that start with '/'
    let processedMessage = message;
    if (message.startsWith("/")) {
      // Remove the '/' and send just the command
      processedMessage = message.substring(1);
    }

    // Create and store AbortController for this request
    abortController = new AbortController();
    requestAbortControllers.set(requestId, abortController);

    for await (const sdkMessage of query({
      prompt: processedMessage,
      options: {
        abortController,
        executable: "node" as const,
        executableArgs: [],
        pathToClaudeCodeExecutable: cliPath,
        ...(sessionId ? { resume: sessionId } : {}),
        ...(allowedTools ? { allowedTools } : {}),
        ...(workingDirectory ? { cwd: workingDirectory } : {}),
        ...(permissionMode ? { permissionMode } : {}),
      },
    })) {
      // Debug logging of raw SDK messages with detailed content
      logger.chat.debug("Claude SDK Message: {sdkMessage}", { sdkMessage });

      yield {
        type: "claude_json",
        data: sdkMessage,
      };
    }

    yield { type: "done" };
  } catch (error) {
    // Check if error is due to abort
    // TODO: Re-enable when AbortError is properly exported from Claude SDK
    // if (error instanceof AbortError) {
    //   yield { type: "aborted" };
    // } else {
    {
      logger.chat.error("Claude Code execution failed: {error}", { error });
      yield {
        type: "error",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  } finally {
    // Clean up AbortController from map
    if (requestAbortControllers.has(requestId)) {
      requestAbortControllers.delete(requestId);
    }
  }
}

/**
 * Handles POST /api/chat requests with streaming responses
 * @param c - Hono context object with config variables
 * @param requestAbortControllers - Shared map of abort controllers
 * @returns Response with streaming NDJSON
 */
export async function handleChatRequest(
  c: Context,
  requestAbortControllers: Map<string, AbortController>,
) {
  const chatRequest: ChatRequest = await c.req.json();
  const { cliPath } = c.var.config;

  logger.chat.debug(
    "Received chat request {*}",
    chatRequest as unknown as Record<string, unknown>,
  );

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // IMPORTANT: NEVER run Claude locally - must ALWAYS execute in Daytona container
        // The whole purpose of this project is async execution in containers with branches
        const task = chatRequest.branchName && getTask(chatRequest.branchName);

        if (!task) {
          const errorResponse: StreamResponse = {
            type: "error",
            error: `No active Daytona container found for branch: ${chatRequest.branchName || "unknown"}. Please click "New Task" to create a container first.`,
          };
          controller.enqueue(
            new TextEncoder().encode(JSON.stringify(errorResponse) + "\n"),
          );
          controller.close();
          return;
        }

        logger.chat.info("Routing request to Daytona sandbox: {sandboxId}", {
          sandboxId: task.sandboxId,
        });

        // Execute in Daytona sandbox
        for await (const chunk of executeClaudeInSandbox(
          task.sandboxId,
          chatRequest.message,
          task.repoPath || "/workspace/repo",
          chatRequest.sessionId,
          chatRequest.requestId,
        )) {
          const data = JSON.stringify(chunk) + "\n";
          controller.enqueue(new TextEncoder().encode(data));
        }
        controller.close();
      } catch (error) {
        const errorResponse: StreamResponse = {
          type: "error",
          error: error instanceof Error ? error.message : String(error),
        };
        controller.enqueue(
          new TextEncoder().encode(JSON.stringify(errorResponse) + "\n"),
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
