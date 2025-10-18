import type { ActiveTask } from "../../shared/types.ts";

const activeTasks = new Map<string, ActiveTask>();

export function getTask(branchName: string): ActiveTask | undefined {
  return activeTasks.get(branchName);
}

export function addTask(
  branchName: string,
  task: Omit<ActiveTask, "branchName">,
): void {
  activeTasks.set(branchName, { ...task, branchName });
}

export function updateTaskStatus(
  branchName: string,
  status: ActiveTask["status"],
): void {
  const task = activeTasks.get(branchName);
  if (task) {
    task.status = status;
    console.log(`Task status for ${branchName} updated to ${status}`);
  }
}

export function removeTask(branchName: string): void {
  activeTasks.delete(branchName);
}

export function listActiveBranches(): string[] {
  return Array.from(activeTasks.keys());
}
