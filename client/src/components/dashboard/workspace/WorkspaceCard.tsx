import { useEffect, useRef, useState, type FormEvent } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { workspaceService } from "../../../services/workspace.services";
import type { User, Workspace } from "../../../types";
import { useWorkspaceContext } from "../../../hooks/workspace.hook";

interface WorkspaceCardProps {
  workspace: Workspace;
}

const formatCreatedAt = (dateValue: string | Date, owner?: string) => {
  const date = new Date(dateValue);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const pad = (n: number) => n.toString().padStart(2, "0");

  const formattedDate = `${pad(date.getDate())}-${pad(
    date.getMonth() + 1,
  )}-${date.getFullYear().toString().slice(-2)}`;

  if (isToday) return `Today by ${owner}`;
  if (isYesterday) return `Yesterday by ${owner}`;

  return `${formattedDate} by ${owner}`;
};

const getOwnerName = (owner: Workspace["owner"]) => {
  if (typeof owner === "object" && owner !== null && "name" in owner) {
    return (owner as User).name;
  }

  return "owner";
};

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

  return "Something went wrong. Please try again.";
};

const WorkspaceCard = ({ workspace }: WorkspaceCardProps) => {
  const navigate = useNavigate();
  const { updateWorkspace, removeWorkspace } = useWorkspaceContext();
  const [openMenu, setOpenMenu] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState(workspace.name);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const ownerName = getOwnerName(workspace.owner);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRename = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = newName.trim();
    if (!name) {
      setError("Workspace name is required.");
      return;
    }

    setIsWorking(true);
    setError("");

    try {
      const res = await workspaceService.renameWorkspace(workspace._id, {
        name,
      });
      updateWorkspace(res.data);
      setRenameOpen(false);
    } catch (renameError) {
      setError(getErrorMessage(renameError));
    } finally {
      setIsWorking(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsWorking(true);
    setError("");

    try {
      const res = await workspaceService.toggleWorkspaceStatus(workspace._id);
      updateWorkspace(res.data);
    } catch (toggleError) {
      setError(getErrorMessage(toggleError));
    } finally {
      setIsWorking(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${workspace.name}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setIsWorking(true);
    setError("");

    try {
      await workspaceService.deleteWorkspace(workspace._id);
      removeWorkspace(workspace._id);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/user/work-space/${workspace._id}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          navigate(`/user/work-space/${workspace._id}`);
        }
      }}
      className="h-85 w-full cursor-pointer overflow-hidden border border-gray-200 bg-white/70 hover:shadow-md transition"
    >
      <div ref={menuRef} className="relative group">
        {workspace.image ? (
          <img
            src={workspace.image}
            alt={workspace.name}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center bg-indigo-50 text-5xl font-extrabold text-indigo-200">
            {workspace.name.charAt(0).toUpperCase()}
          </div>
        )}

        <button
          disabled={isWorking}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-white/60 hover:bg-white disabled:cursor-not-allowed p-1 shadow"
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenu((prev) => !prev);
          }}
        >
          <FaEllipsisVertical size={18} />
        </button>

        {openMenu && (
          <div className="absolute top-10 right-2 z-10 w-40 bg-white shadow-md overflow-hidden rounded-md">
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                setNewName(workspace.name);
                setRenameOpen(true);
                setOpenMenu(false);
              }}
            >
              Rename
            </button>

            <button
              disabled={isWorking}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 disabled:cursor-not-allowed"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(false);
                handleToggleStatus();
              }}
            >
              {workspace.isActive ? "Make inactive" : "Make active"}
            </button>

            <button
              disabled={isWorking}
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenu(false);
                handleDelete();
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="p-3">
        <h1 className="truncate font-bold text-indigo-600">{workspace.name}</h1>

        <div className="mt-1">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium ${
              workspace.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                workspace.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {workspace.isActive ? "Active" : "Inactive"}
          </span>

          <span className="ml-2 text-xs text-gray-500">
            {formatCreatedAt(workspace.createdAt, ownerName)}
          </span>
        </div>

        {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}
      </div>

      {renameOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(event) => event.stopPropagation()}
        >
          <form onSubmit={handleRename} className="w-full max-w-sm bg-white p-5">
            <h2 className="text-xl font-bold text-[#24184f]">
              Rename Workspace
            </h2>

            <input
              value={newName}
              onChange={(event) => {
                setNewName(event.target.value);
                setError("");
              }}
              disabled={isWorking}
              className="mt-4 w-full border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Workspace name"
            />

            {error && (
              <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
            )}

            <div className="mt-5 grid grid-cols-3 gap-3">
              <button
                type="button"
                disabled={isWorking}
                onClick={() => {
                  setRenameOpen(false);
                  setError("");
                }}
                className="border border-gray-300 py-3 font-medium hover:bg-gray-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isWorking}
                className="col-span-2 bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
              >
                {isWorking ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default WorkspaceCard;
