import { FaPlus } from "react-icons/fa";

interface CreateWorkspaceCardProps {
  onClick: () => void;
}

const CreateWorkspaceCard = ({ onClick }: CreateWorkspaceCardProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-64 h-48 bg-white/50 border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors group"
    >
      <div className="flex items-center justify-center w-12 h-16 bg-[#e0e7ff] mb-4 group-hover:bg-indigo-100 transition-colors">
        <FaPlus className="w-6 h-6 text-indigo-700" strokeWidth={3} />
      </div>
      <span className="text-slate-700 font-bold text-sm">
        Create New Workspace
      </span>
    </button>
  );
};

export default CreateWorkspaceCard;
