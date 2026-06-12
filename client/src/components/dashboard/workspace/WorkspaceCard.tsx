import { useEffect, useRef, useState, type FormEvent } from "react";
import { FaEllipsisVertical } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { workspaceService } from "../../../services/workspace.services";
import type { User, Workspace } from "../../../types";
import { useWorkspaceContext } from "../../../hooks/workspace.hook";
import { BiRightArrow } from "react-icons/bi";

interface WorkspaceCardProps {
  workspace: Workspace;
}

const isUser = (value: unknown): value is User =>
  typeof value === "object" && value !== null && "name" in value;

const getOwnerName = (owner: Workspace["owner"]) => {
  if (isUser(owner)) {
    return owner.name;
  }

  return "owner";
};

const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

const formatCreatedAt = (dateValue: string | Date, owner?: string) => {
  const date = new Date(dateValue);
  const now = new Date();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const formattedDate = `${pad(date.getDate())}-${pad(
    date.getMonth() + 1,
  )}-${date.getFullYear().toString().slice(-2)}`;

  if (isSameDay(date, now)) {
    return `Today by ${owner}`;
  }

  if (isSameDay(date, yesterday)) {
    return `Yesterday by ${owner}`;
  }

  return `${formattedDate} by ${owner}`;
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
  const [newName, setNewName] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);

  const ownerName = getOwnerName(workspace.owner);

  const openRenameModal = () => {
    setNewName(workspace.name);
    setError("");
    setRenameOpen(true);
    setOpenMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const executeAction = async (action: () => Promise<void>) => {
    setIsWorking(true);
    setError("");

    try {
      await action();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsWorking(false);
    }
  };

  const handleRename = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = newName.trim();
    if (!name) {
      setError("Workspace name is required.");
      return;
    }

    await executeAction(async () => {
      const res = await workspaceService.renameWorkspace(workspace._id, {
        name,
      });
      updateWorkspace(res.data);
      setRenameOpen(false);
    });
  };

  const handleToggleStatus = async () => {
    await executeAction(async () => {
      const res = await workspaceService.toggleWorkspaceStatus(workspace._id);
      updateWorkspace(res.data);
    });
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${workspace.name}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    await executeAction(async () => {
      await workspaceService.deleteWorkspace(workspace._id);
      removeWorkspace(workspace._id);
    });
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        className="group w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        onClick={() => {
          if (!renameOpen) {
            navigate(`/user/work-space/${workspace._id}`);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            if (!renameOpen) {
              navigate(`/user/work-space/${workspace._id}`);
            }
          }
        }}
      >
        <div ref={menuRef} className="relative">
          {workspace.image ? (
            <img
              src={workspace.image}
              alt={workspace.name}
              className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-64 w-full items-center justify-center bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-500">
              <span className="text-7xl font-black text-white">
                {workspace.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute bottom-5 left-5">
            <h2 className="max-w-55 truncate text-xl font-bold text-white">
              {workspace.name}
            </h2>

            <p className="mt-1 text-sm text-white/80">{ownerName}</p>
          </div>

          <button
            type="button"
            disabled={isWorking}
            aria-label="Workspace actions"
            aria-expanded={openMenu}
            className="absolute right-3 top-3 rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-white/30 disabled:cursor-not-allowed"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenu((prev) => !prev);
            }}
          >
            <FaEllipsisVertical size={18} />
          </button>

          {openMenu && (
            <div
              role="menu"
              className="absolute right-3 top-14 z-20 w-44 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl"
            >
              <button
                className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  openRenameModal();
                }}
              >
                Rename
              </button>

              <button
                disabled={isWorking}
                className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 disabled:cursor-not-allowed"
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
                className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed"
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
        <div className="p-5">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                workspace.isActive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-rose-100 text-rose-700"
              }`}
              >
              <span
                className={`h-2 w-2 rounded-full ${
                  workspace.isActive ? "bg-emerald-500" : "bg-rose-500"
                }`}
                />
              {workspace.isActive ? "Active" : "Inactive"}
            </span>

            <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 transition group-hover:translate-x-1 whitespace-nowrap">
              Open <BiRightArrow className="inline-block" />
            </span>
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-500">
              {formatCreatedAt(workspace.createdAt, ownerName)}
            </p>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>

      {renameOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setRenameOpen(false);
            setError("");
          }}
        >
          <form
            onSubmit={handleRename}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              Rename Workspace
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Update the workspace name.
            </p>

            <input
              value={newName}
              onChange={(event) => {
                setNewName(event.target.value);
                setError("");
              }}
              disabled={isWorking}
              className="mt-5 w-full rounded-2xl border border-gray-200 px-4 py-3 focus:border-indigo-500 focus:outline-none"
              placeholder="Workspace name"
            />

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={isWorking}
                onClick={() => {
                  setRenameOpen(false);
                  setError("");
                }}
                className="flex-1 rounded-2xl border border-gray-200 py-3 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isWorking}
                className="flex-1 rounded-2xl bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700 disabled:bg-indigo-300"
              >
                {isWorking ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default WorkspaceCard;
