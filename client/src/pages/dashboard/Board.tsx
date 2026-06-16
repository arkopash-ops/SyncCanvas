import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Board as WorkspaceBoard, User, Workspace } from "../../types";
import { userServices } from "../../services/user.services";
import { workspaceService } from "../../services/workspace.services";
import { boardService } from "../../services/board.services";
import ViewToggle from "../../components/dashboard/board/ViewToggle";
import BoardGrid from "../../components/dashboard/board/BoardGrid";
import BoardTable from "../../components/dashboard/board/BoardTable";
import Breadcrumb from "../../components/Breadcrumb";
import { FaUsers } from "react-icons/fa";
import { FiPlus, FiX } from "react-icons/fi";
import UserManagement from "../../components/dashboard/board/UserManagement";
import { socket } from "../../lib/socket";

const getErrorMessage = (
  error: unknown,
  fallback = "Unable to load workspace.",
) => {
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

  return fallback;
};

const Board = () => {
  const navigate = useNavigate();
  const { workspaceId } = useParams();
  const [user] = useState<User | null>(() => userServices.getStoredUser());
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [boards, setBoards] = useState<WorkspaceBoard[]>([]);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
  const [isLoadingBoards, setIsLoadingBoards] = useState(true);
  const [workspaceError, setWorkspaceError] = useState("");
  const [boardError, setBoardError] = useState("");
  const [showUserManagement, setShowUserManagement] = useState(false);

  // Create board modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [lastModifiedBoards, setLastModifiedBoards] = useState<
    WorkspaceBoard[]
  >([]);
  const [isLoadingLastModified, setIsLoadingLastModified] = useState(true);
  const [lastModifiedError, setLastModifiedError] = useState("");

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
    const handleRemoved = (data: { workspaceId: string; message: string }) => {
      if (data.workspaceId === workspaceId) {
        alert("You have been removed by this workspace owner");
        navigate("/user/work-space");
      }
    };

    socket.on("member_remove_from_workspace", handleRemoved);

    return () => {
      socket.off("member_remove_from_workspace", handleRemoved);
    };
  }, [workspaceId, navigate]);

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

  useEffect(() => {
    let isMounted = true;

    const loadBoards = async () => {
      if (!workspaceId) {
        setBoardError("Workspace id is missing.");
        setIsLoadingBoards(false);
        return;
      }

      setIsLoadingBoards(true);
      setBoardError("");

      try {
        const res = await workspaceService.getWorkspaceBoard(workspaceId);

        if (isMounted) {
          setBoards(res.boards || []);
        }
      } catch (error) {
        if (isMounted) {
          setBoardError(getErrorMessage(error, "Unable to load boards."));
        }
      } finally {
        if (isMounted) {
          setIsLoadingBoards(false);
        }
      }
    };

    loadBoards();

    return () => {
      isMounted = false;
    };
  }, [workspaceId]);

  useEffect(() => {
    let isMounted = true;

    const loadLastModified = async () => {
      if (!workspaceId) return;

      setIsLoadingLastModified(true);
      setLastModifiedError("");

      try {
        const res = await boardService.lastModifiedBoard(workspaceId, 3);
        if (isMounted) setLastModifiedBoards(res.board || []);
      } catch (err) {
        if (isMounted)
          setLastModifiedError(
            getErrorMessage(err, "Unable to load last modified boards."),
          );
      } finally {
        if (isMounted) setIsLoadingLastModified(false);
      }
    };

    loadLastModified();

    return () => {
      isMounted = false;
    };
  }, [workspaceId, boards]);

  const handleCreateBoard = async () => {
    const title = newBoardTitle.trim();
    if (!title) {
      setCreateError("Board title is required.");
      return;
    }
    if (!workspaceId) return;

    setIsCreating(true);
    setCreateError("");

    try {
      const res = await boardService.createBoard({ workspaceId, title });
      setBoards((prev) => [res.board, ...prev]);
      setShowCreateModal(false);
      setNewBoardTitle("");
    } catch (err) {
      setCreateError(getErrorMessage(err, "Failed to create board."));
    } finally {
      setIsCreating(false);
    }
  };

  const workspaceName = workspace?.name ?? "Workspace";

  return (
    <>
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

        <div className="bg-white/50 shadow-md rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-3xl md:text-5xl font-extrabold text-[#24184f] wrap-break-word">
              {workspaceName}
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Create New Board */}
              <button
                onClick={() => {
                  setCreateError("");
                  setNewBoardTitle("");
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-white font-medium hover:bg-violet-700 transition"
              >
                <FiPlus size={20} />
                Create New Board
              </button>

              {/* Members */}
              <button
                onClick={() => setShowUserManagement(true)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white font-medium hover:bg-indigo-700 transition"
              >
                <FaUsers size={20} />
                Members
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <span className="text-gray-600">
              Organize your projects with dedicated workspaces.
            </span>

            <ViewToggle view={view} onChange={handleViewChange} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#24184f] mb-6 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-[#24184f] rounded-full inline-block"></span>
          Last Modified Boards
        </h2>
        {view === "grid" ? (
          <BoardGrid
            boards={lastModifiedBoards}
            isLoading={isLoadingLastModified}
            error={lastModifiedError}
            emptyMessage="No recently modified boards found."
            onBoardsChange={setBoards}
          />
        ) : (
          <BoardTable
            boards={lastModifiedBoards}
            isLoading={isLoadingLastModified}
            error={lastModifiedError}
            emptyMessage="No recently modified boards found."
            onBoardsChange={setBoards}
          />
        )}

        <h2 className="text-2xl font-bold text-[#24184f] mb-6 flex items-center gap-2">
          <span className="w-2.5 h-6 bg-[#635bff] rounded-full inline-block"></span>
          All Boards
        </h2>
        {view === "grid" ? (
          <BoardGrid
            boards={boards}
            isLoading={isLoadingBoards}
            error={boardError}
            emptyMessage="No boards found in this workspace."
            onBoardsChange={setBoards}
          />
        ) : (
          <BoardTable
            boards={boards}
            isLoading={isLoadingBoards}
            error={boardError}
            emptyMessage="No boards found in this workspace."
            onBoardsChange={setBoards}
          />
        )}
      </div>

      {/* User Management Modal */}
      {showUserManagement && workspace && (
        <UserManagement
          isOpen={showUserManagement}
          onClose={() => setShowUserManagement(false)}
          onLeft={() => navigate("/user/work-space")}
          workspace={workspace}
        />
      )}

      {/* Create Board Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="relative w-full max-w-md mx-4 rounded-3xl bg-white shadow-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute right-5 top-5 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
              <FiX size={20} />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-[#24184f]">
                Create New Board
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Give your board a name to get started.
              </p>
            </div>

            {/* Input */}
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Board Title
            </label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Product Roadmap"
              value={newBoardTitle}
              onChange={(e) => {
                setNewBoardTitle(e.target.value);
                setCreateError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateBoard();
                if (e.key === "Escape") setShowCreateModal(false);
              }}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-violet-200"
            />

            {createError && (
              <p className="mt-2 text-sm text-red-500">{createError}</p>
            )}

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBoard}
                disabled={isCreating}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {isCreating ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Creating…
                  </>
                ) : (
                  <>
                    <FiPlus size={16} />
                    Create Board
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Board;
