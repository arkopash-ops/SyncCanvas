import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { workspaceService } from "../services/workspace.services";
import type { Workspace } from "../types";
import { WorkspaceContext } from "../context/workspace.context";

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return "Unable to load workspaces.";
};

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshWorkspaces = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await workspaceService.getUserWorkspace();
      setWorkspaces(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addWorkspace = useCallback((workspace: Workspace) => {
    setWorkspaces((prev) => [workspace, ...prev]);
  }, []);

  useEffect(() => {
    const load = async () => {
      await refreshWorkspaces();
    };

    load();
  }, [refreshWorkspaces]);

  const value = useMemo(
    () => ({
      workspaces,
      isLoading,
      error,
      addWorkspace,
      refreshWorkspaces,
    }),
    [workspaces, isLoading, error, addWorkspace, refreshWorkspaces]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};