import { FaPlus } from "react-icons/fa";

interface CreateWorkspaceCardProps {
  onClick: () => void;
}

const NewWorkspaceSideBar = ({ onClick }: CreateWorkspaceCardProps) => {
  return (
    <div className="px-6 mt-6">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-center gap-2 bg-[#3f28d9] text-white py-2 rounded-md hover:bg-indigo-700 transition"
      >
        <FaPlus />
        New Workspace
      </button>
    </div>
  );
};

export default NewWorkspaceSideBar;
