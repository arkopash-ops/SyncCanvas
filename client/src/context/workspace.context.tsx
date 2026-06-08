import { createContext } from "react";
import type { Workspace } from "../types";

interface WorkspaceContextValue {
  workspaces: Workspace[];
  ownedWorkspaces: Workspace[];
  joinedWorkspaces: Workspace[];
  isLoading: boolean;
  error: string;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (workspace: Workspace) => void;
  removeWorkspace: (workspaceId: string) => void;
  refreshWorkspaces: () => Promise<void>;
}

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(
  null,
);
