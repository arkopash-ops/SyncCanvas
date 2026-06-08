const BoardGrid = () => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {["Board 1", "Board 2", "Board 3"].map((b) => (
          <div
            key={b}
            className="p-6 rounded-xl bg-white/30 backdrop-blur-md border border-white/30 shadow-sm hover:shadow-md transition"
          >
            {b}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardGrid;
