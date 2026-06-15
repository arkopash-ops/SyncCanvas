import { useEffect, useRef, useState } from "react";
import { FaEllipsisVertical, FaStar } from "react-icons/fa6";
import type { Board } from "../../../types";
import { BiRightArrow } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

interface BoardGridProps {
  boards: Board[];
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

const BoardGrid = ({
  boards,
  isLoading = false,
  error = "",
  emptyMessage = "No boards found.",
}: BoardGridProps) => {
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [starred, setStarred] = useState<Record<string, boolean>>({});

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleStar = (boardId: string) => {
    setStarred((prev) => ({
      ...prev,
      [boardId]: !prev[boardId],
    }));
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
          className="group w-full overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          onClick={() => {
            setOpenMenuId(null);
            navigate(`/user/canvas/${board._id}`);
          }}
        >
          {/* IMAGE AREA */}
          <div ref={menuRef} className="relative">
            <div className="relative h-64 w-full overflow-hidden">
              {board.thumbnail ? (
                <img
                  src={board.thumbnail}
                  alt={board.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-600 via-indigo-500 to-indigo-400">
                  <span className="text-7xl font-black text-white">
                    {board.title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            {/* STAR + MENU (top right like WorkspaceCard) */}
            <div className="absolute right-3 top-3 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(board._id);
                }}
                className="rounded-full bg-white/40 p-2 text-white backdrop-blur-md transition hover:bg-white/30"
              >
                <FaStar
                  className={
                    starred[board._id] ? "text-amber-400" : "text-white/80"
                  }
                />
              </button>

              <button
                type="button"
                className="rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition hover:bg-white/30"
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
                <div className="absolute right-0 top-12 w-44 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                  <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50">
                    Rename
                  </button>

                  <button className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50">
                    {board.isActive ? "Make inactive" : "Make active"}
                  </button>

                  <button className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50">
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* BOTTOM LEFT TEXT OVER IMAGE (same as WorkspaceCard) */}
            <div className="absolute bottom-5 left-5">
              <h2 className="max-w-55 truncate text-xl font-bold text-white">
                {board.title}
              </h2>

              <p className="mt-1 text-sm text-white/80">
                Updated {formatDate(board.updatedAt)}
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="p-5">
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

              <span className="text-sm font-medium text-indigo-600 transition group-hover:translate-x-1 flex items-center gap-1">
                Open <BiRightArrow />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardGrid;
