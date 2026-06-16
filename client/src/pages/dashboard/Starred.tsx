import { useEffect, useState } from "react";
import { boardService } from "../../services/board.services";
import type { Board } from "../../types";
import BoardGrid from "../../components/dashboard/board/BoardGrid";

const Starred = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStarredBoards = async () => {
      try {
        setLoading(true);
        const data = await boardService.starredBoard();
        setBoards(data.board || []);
        setError(null);
      } catch (err) {
        setError("Failed to load starred boards");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStarredBoards();
  }, []);

  return (
    <div className="px-6 py-4 space-y-8 bg-white/50 min-h-screen">
      <h1 className="mt-2 text-3xl font-extrabold text-[#24184f]">Starred</h1>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="bg-white/50 shadow-md rounded-lg border border-gray-200 p-4">
        <BoardGrid
          boards={boards}
          isLoading={loading}
          error={error || ""}
          emptyMessage="No starred boards yet."
          onBoardsChange={setBoards}
        />
      </div>
    </div>
  );
};

export default Starred;
