import { createContext } from "react";
import type { Workspace } from "../types";

interface WorkspaceContextValue {
  workspaces: Workspace[];
  isLoading: boolean;
  error: string;
  addWorkspace: (workspace: Workspace) => void;
  refreshWorkspaces: () => Promise<void>;
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(
  null,
);
