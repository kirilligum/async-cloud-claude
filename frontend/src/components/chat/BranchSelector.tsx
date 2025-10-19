import { useState, useEffect } from "react";
import type { BranchesResponse } from "../../../../shared/types";

interface BranchSelectorProps {
  selectedBranch: string;
  onSelectBranch: (branchName: string) => void;
}

export function BranchSelector({
  selectedBranch,
  onSelectBranch,
}: BranchSelectorProps) {
  const [branches, setBranches] = useState<BranchesResponse["branches"]>([]);

  useEffect(() => {
    fetch("/api/git/branches")
      .then((res) => res.json())
      .then((data: BranchesResponse) => setBranches(data.branches))
      .catch((error) => console.error("Failed to fetch git branches:", error));
  }, [selectedBranch]); // Refetch when branch changes to update status

  return (
    <select
      value={selectedBranch}
      onChange={(e) => onSelectBranch(e.target.value)}
      className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {branches.map((branch) => (
        <option key={branch.name} value={branch.name}>
          {branch.isActive ? "☁️ " : ""}
          {branch.name}
        </option>
      ))}
    </select>
  );
}
