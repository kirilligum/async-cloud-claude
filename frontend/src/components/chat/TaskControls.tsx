interface TaskControlsProps {
  branchName: string;
  onCommit: () => void;
  onClose: () => void;
}

export function TaskControls({ onCommit, onClose }: TaskControlsProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onCommit}
        className="p-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        title="Commit changes"
      >
        Commit 💾
      </button>
      <button
        onClick={onClose}
        className="p-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        title="Close task and delete sandbox"
      >
        Close Task ❌
      </button>
    </div>
  );
}
