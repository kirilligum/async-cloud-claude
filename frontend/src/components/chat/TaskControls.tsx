interface TaskControlsProps {
  branchName: string;
  onCommit: () => void;
  onPush: () => void;
  onClose: () => void;
}

export function TaskControls({
  branchName,
  onCommit,
  onPush,
  onClose,
}: TaskControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-600 dark:text-slate-400">
        Task: {branchName}
      </span>
      <button
        onClick={onCommit}
        className="p-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        title="Commit changes locally"
      >
        Commit
      </button>
      <button
        onClick={onPush}
        className="p-2 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
        title="Push committed changes to remote"
      >
        Push
      </button>
      <button
        onClick={onClose}
        className="p-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        title="Close task and delete sandbox"
      >
        Close Task
      </button>
    </div>
  );
}
