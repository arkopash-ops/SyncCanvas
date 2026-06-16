import { FaPlus } from "react-icons/fa";

interface CreateWorkspaceCardProps {
  onClick: () => void;
}

const NewWorkspaceSideBar = ({ onClick }: CreateWorkspaceCardProps) => {
  return (
    <div className="px-2 md:px-6 mt-6">
      <button
        onClick={onClick}
        className="w-full h-12 flex items-center justify-center md:justify-center rounded-xl bg-[#3f28d9] text-white hover:bg-indigo-700 transition-all"
      >
        <FaPlus className="text-lg shrink-0" />
        <span className="hidden md:block ml-2">New Workspace</span>
      </button>
    </div>
  );
};

export default NewWorkspaceSideBar;
