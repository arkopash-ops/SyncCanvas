import { useEffect, useRef, useState } from "react";
import { BiRightArrow } from "react-icons/bi";
import { FaEllipsisVertical, FaStar } from "react-icons/fa6";
import type { Board } from "../../../types";

interface BoardTableProps {
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

const BoardTable = ({
  boards,
  isLoading = false,
  error = "",
  emptyMessage = "No boards found.",
}: BoardTableProps) => {
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

  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading boards...</p>;
  }

  if (error) {
    return <p className="text-sm font-medium text-red-600">{error}</p>;
  }

  if (boards.length === 0) {
    return <p className="text-sm text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {boards.map((board) => (
        <div
          key={board._id}
          role="button"
          tabIndex={0}
          className="group relative flex cursor-pointer overflow-visible rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
        >
          <div
            ref={menuRef}
            className="absolute right-3 top-3 z-20 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleStar(board._id);
              }}
              className="rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition hover:bg-black/60"
            >
              <FaStar
                className={
                  starred[board._id] ? "text-amber-400" : "text-white/80"
                }
              />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId((prev) =>
                  prev === board._id ? null : board._id,
                );
              }}
              className="rounded-full bg-black/20 p-2 text-white backdrop-blur-md transition hover:bg-black/60"
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

          <div className="relative h-full w-44 shrink-0 overflow-hidden">
            {board.thumbnail ? (
              <img
                src={board.thumbnail}
                alt={board.title}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-600 via-indigo-500 to-indigo-400">
                <span className="text-4xl font-black text-white">
                  {board.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
          </div>

          <div className="min-w-0 flex-1 p-4">
            <div className="flex items-center gap-3">
              <h3 className="truncate text-lg font-bold text-[#24184f]">
                {board.title}
              </h3>

              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
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
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 font-medium text-violet-600">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                Updated {formatDate(board.updatedAt)}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-indigo-600 transition group-hover:translate-x-1">
                Open <BiRightArrow className="inline-block" />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardTable;
