import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { User, Workspace } from "../../types";
import { userServices } from "../../services/user.services";
import { workspaceService } from "../../services/workspace.services";
import ViewToggle from "../../components/dashboard/board/ViewToggle";
import BoardGrid from "../../components/dashboard/board/BoardGrid";
import BoardTable from "../../components/dashboard/board/BoardTable";
import Breadcrumb from "../../components/Breadcrumb";
import { FaUsers } from "react-icons/fa";
import UserManagement from "../../components/dashboard/board/UserManagement";

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

  return "Unable to load workspace.";
};

const Board = () => {
  const { workspaceId } = useParams();
  const [user] = useState<User | null>(() => userServices.getStoredUser());
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
  const [workspaceError, setWorkspaceError] = useState("");
  const [showUserManagement, setShowUserManagement] = useState(false);

  const storageKey = user?.email ? `workspace-view-${user.email}` : null;

  const [view, setView] = useState<"grid" | "list">(() => {
    if (!storageKey) return "grid";

    const saved = localStorage.getItem(storageKey);
    return saved === "list" ? "list" : "grid";
  });

  const handleViewChange = (v: "grid" | "list") => {
    setView(v);

    if (!storageKey) return;
    localStorage.setItem(storageKey, v);
  };

  useEffect(() => {
    let isMounted = true;

    const loadWorkspace = async () => {
      if (!workspaceId) {
        setWorkspaceError("Workspace id is missing.");
        setIsLoadingWorkspace(false);
        return;
      }

      setIsLoadingWorkspace(true);
      setWorkspaceError("");

      try {
        const res = await workspaceService.getWorkspaceById(workspaceId);

        if (isMounted) {
          setWorkspace(res.data);
        }
      } catch (error) {
        if (isMounted) {
          setWorkspaceError(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsLoadingWorkspace(false);
        }
      }
    };

    loadWorkspace();

    return () => {
      isMounted = false;
    };
  }, [workspaceId]);

  const workspaceName = workspace?.name ?? "Workspace";

  return (
    <div className="px-6 py-4 space-y-8 bg-white/50 min-h-screen">
      <Breadcrumb
        items={[
          { label: "Work Space", to: "/user/work-space" },
          { label: isLoadingWorkspace ? "Loading..." : workspaceName },
        ]}
      />

      {workspaceError && (
        <p className="text-sm font-medium text-red-600">{workspaceError}</p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-5xl font-extrabold text-[#24184f]">
          {workspaceName}
        </p>

        <button
          onClick={() => setShowUserManagement(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white font-medium hover:bg-indigo-700 transition"
        >
          <span className="material-symbols-outlined text-lg"><FaUsers size={24} /></span>
          Manage Members
        </button>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-gray-600">
          Organize your projects with dedicated workspaces.
        </span>

        <ViewToggle view={view} onChange={handleViewChange} />
      </div>

      <p className="text-3xl font-bold text-indigo-600 mb-4">
        Last Modified Boards
      </p>
      {view === "grid" ? <BoardGrid /> : <BoardTable />}

      <p className="text-3xl font-bold text-indigo-600 mb-4">All Boards</p>
      {view === "grid" ? <BoardGrid /> : <BoardTable />}

      {showUserManagement && workspace && (
        <UserManagement
          isOpen={showUserManagement}
          onClose={() => setShowUserManagement(false)}
          workspace={workspace}
        />
      )}
    </div>
  );
};

export default Board;
