import { useState } from "react";
import type { User } from "../../types";
import { userServices } from "../../services/user.services";
import ViewToggle from "../../components/dashboard/board/ViewToggle";
import BoardGrid from "../../components/dashboard/board/BoardGrid";
import BoardTable from "../../components/dashboard/board/BoardTable";

const Board = () => {
  const [user] = useState<User | null>(() => userServices.getStoredUser());

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

  return (
    <div className="px-6 py-4 space-y-8 bg-white/50 min-h-screen">
      <p className="text-5xl font-extrabold text-[#24184f]">
        {user?.name}'s Board
      </p>

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
    </div>
  );
};

export default Board;
