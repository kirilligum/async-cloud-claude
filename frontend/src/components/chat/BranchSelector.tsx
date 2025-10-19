import { useEffect, useState } from "react";

interface Branch {
  name: string;
  isActive: boolean;
}

interface BranchSelectorProps {
  selectedBranch: string;
  onSelectBranch: (branchName: string) => void;
}

export function BranchSelector({
  selectedBranch,
  onSelectBranch,
}: BranchSelectorProps) {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/git/branches");
        if (response.ok) {
          const data = await response.json();
          setBranches(data.branches || []);
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };
    fetchBranches();
  }, []);

  return (
    <select
      value={selectedBranch}
      onChange={(e) => onSelectBranch(e.target.value)}
      className="px-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {branches.map((branch) => (
        <option key={branch.name} value={branch.name}>
          {branch.name}
          {branch.isActive ? " (active)" : ""}
        </option>
      ))}
    </select>
  );
}
