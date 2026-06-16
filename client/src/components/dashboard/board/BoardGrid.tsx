import { useEffect, useRef, useState } from "react";
import { FaEllipsisVertical, FaStar } from "react-icons/fa6";
import type { Board, User } from "../../../types";
import { BiRightArrow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { boardService } from "../../../services/board.services";
import { userServices } from "../../../services/user.services";

interface BoardGridProps {
  boards: Board[];
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
  onBoardsChange?: (boards: Board[]) => void;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

const resolveLastEditedBy = (lastEditedBy?: string | User | null): string => {
  if (!lastEditedBy) return "";
  if (typeof lastEditedBy === "object" && "name" in lastEditedBy)
    return `Edited by ${lastEditedBy.name}`;
  if (typeof lastEditedBy === "string") return `Edited by ${lastEditedBy}`;
  return "";
};

const BoardGrid = ({
  boards,
  isLoading = false,
  error = "",
  emptyMessage = "No boards found.",
  onBoardsChange,
}: BoardGridProps) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [user] = useState(() => userServices.getStoredUser());
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const menuRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const isStarred = (board: Board): boolean => {
    if (!user || !board.starredBy) return false;
    return board.starredBy.includes(user._id || "");
  };

  const toggleStar = async (boardId: string) => {
    try {
      const response = await boardService.toggleStar(boardId);
      const updatedBoard = response.board || response;
      const updatedBoards = boards.map((b) =>
        b._id === boardId ? updatedBoard : b,
      );
      onBoardsChange?.(updatedBoards);
    } catch (err) {
      console.error("Failed to toggle star:", err);
    }
  };

  const handleRename = async (boardId: string) => {
    const trimmed = renameValue.trim();
    if (!trimmed) {
      setRenamingId(null);
      return;
    }
    try {
      const response = await boardService.renameBoard(boardId, {
        title: trimmed,
      });
      const updatedBoard = response.board;
      const updatedBoards = boards.map((b) =>
        b._id === boardId ? updatedBoard : b,
      );
      onBoardsChange?.(updatedBoards);
    } catch (err) {
      console.error("Failed to rename board:", err);
    } finally {
      setRenamingId(null);
    }
  };

  const handleDelete = async (boardId: string) => {
    try {
      await boardService.deleteBoard(boardId);
      onBoardsChange?.(boards.filter((b) => b._id !== boardId));
    } catch (err) {
      console.error("Failed to delete board:", err);
    }
  };

  const handleDuplicate = async (boardId: string) => {
    try {
      const response = await boardService.duplicateBoard(boardId);
      onBoardsChange?.([...boards, ...response.board]);
    } catch (err) {
      console.error("Failed to duplicate board:", err);
    }
  };

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading boards...</p>;
  if (error) return <p className="text-sm font-medium text-red-600">{error}</p>;
  if (boards.length === 0)
    return <p className="text-sm text-gray-500">{emptyMessage}</p>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {boards.map((board) => (
        <div
          key={board._id}
          role="button"
          tabIndex={0}
          className="group relative w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          onClick={() => {
            if (renamingId === board._id) return;
            setOpenMenuId(null);
            navigate(`/user/canvas/${board._id}`);
          }}
        >
          {/* IMAGE SECTION */}
          <div className="relative h-64 w-full overflow-hidden">
            {board.thumbnail ? (
              <img
                src={board.thumbnail}
                alt={board.title}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-600 via-violet-600 to-fuchsia-500">
                <span className="text-7xl font-black text-white">
                  {board.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            {/* gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-5 left-5 right-16">
              {renamingId === board._id ? (
                <input
                  ref={renameInputRef}
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => handleRename(board._id)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") handleRename(board._id);
                    if (e.key === "Escape") setRenamingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full rounded-lg bg-white/20 px-2 py-1 text-xl font-bold text-white backdrop-blur-md outline-none focus:ring-2 focus:ring-white/50"
                />
              ) : (
                <h2 className="max-w-55 truncate text-xl font-bold text-white">
                  {board.title}
                </h2>
              )}

              {resolveLastEditedBy(board.lastEditedBy) && (
                <p className="mt-1 text-sm text-white/80">
                  {resolveLastEditedBy(board.lastEditedBy)}
                </p>
              )}
            </div>
          </div>

          {/* ACTIONS */}
          <div
            ref={menuRef}
            className="absolute right-3 top-3 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleStar(board._id);
              }}
              className="rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition hover:bg-white/30"
            >
              <FaStar
                className={
                  isStarred(board) ? "text-amber-400" : "text-white/80"
                }
              />
            </button>

            <button
              type="button"
              className="rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition hover:bg-black/30"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId((prev) =>
                  prev === board._id ? null : board._id,
                );
              }}
            >
              <FaEllipsisVertical />
            </button>

            {openMenuId === board._id && (
              <div className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                <button
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenameValue(board.title);
                    setRenamingId(board._id);
                    setOpenMenuId(null);
                  }}
                >
                  Rename
                </button>

                <button
                  className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicate(board._id);
                    setOpenMenuId(null);
                  }}
                >
                  Duplicate
                </button>

                <button
                  className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(board._id);
                    setOpenMenuId(null);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="p-5">
            {/* status + open */}
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  board.isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    board.isActive ? "bg-emerald-500" : "bg-rose-500"
                  }`}
                />
                {board.isActive ? "Active" : "Inactive"}
              </span>

              <span className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-indigo-600 transition group-hover:translate-x-1">
                Open <BiRightArrow className="inline-block" />
              </span>
            </div>

            {/* divider (WorkspaceCard-style separation) */}
            <div className="mt-4 border-t border-gray-100 pt-4">
              <p className="mt-1 text-sm text-black/80">
                Updated {formatDate(board.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardGrid;
