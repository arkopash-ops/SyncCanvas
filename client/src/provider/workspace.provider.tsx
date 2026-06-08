import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { workspaceService } from "../services/workspace.services";
import type { Workspace, WorkspaceGroups } from "../types";
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
  const [workspaceGroups, setWorkspaceGroups] = useState<WorkspaceGroups>({
    owned: [],
    joined: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const workspaces = useMemo(
    () => [...workspaceGroups.owned, ...workspaceGroups.joined],
    [workspaceGroups],
  );

  const refreshWorkspaces = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const res = await workspaceService.getUserWorkspace();
      setWorkspaceGroups({
        owned: res.data.owned || [],
        joined: res.data.joined || [],
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addWorkspace = useCallback((workspace: Workspace) => {
    setWorkspaceGroups((prev) => ({
      ...prev,
      owned: [workspace, ...prev.owned],
    }));
  }, []);

  const updateWorkspace = useCallback((workspace: Workspace) => {
    setWorkspaceGroups((prev) => ({
      owned: prev.owned.map((item) =>
        item._id === workspace._id ? workspace : item,
      ),
      joined: prev.joined.map((item) =>
        item._id === workspace._id ? workspace : item,
      ),
    }));
  }, []);

  const removeWorkspace = useCallback((workspaceId: string) => {
    setWorkspaceGroups((prev) => ({
      owned: prev.owned.filter((item) => item._id !== workspaceId),
      joined: prev.joined.filter((item) => item._id !== workspaceId),
    }));
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
      ownedWorkspaces: workspaceGroups.owned,
      joinedWorkspaces: workspaceGroups.joined,
      isLoading,
      error,
      addWorkspace,
      updateWorkspace,
      removeWorkspace,
      refreshWorkspaces,
    }),
    [
      workspaces,
      workspaceGroups.owned,
      workspaceGroups.joined,
      isLoading,
      error,
      addWorkspace,
      updateWorkspace,
      removeWorkspace,
      refreshWorkspaces,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
