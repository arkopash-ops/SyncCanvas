const BoardTable = () => {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full rounded-xl overflow-hidden">
          <thead className="bg-white/40 backdrop-blur-md">
            <tr className="border-b border-white/30">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Owner</th>
              <th className="p-4 text-left">Created</th>
            </tr>
          </thead>

          <tbody className="bg-white/20 backdrop-blur-md">
            <tr className="border-b border-white/30">
              <td className="p-4">Board 1</td>
              <td className="p-4">John</td>
              <td className="p-4">2025-06-01</td>
            </tr>
            <tr>
              <td className="p-4">Board 2</td>
              <td className="p-4">Jane</td>
              <td className="p-4">2025-06-02</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BoardTable;
