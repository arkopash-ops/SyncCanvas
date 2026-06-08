import type { Workspace } from "../../../types";

interface WorkspaceCardProps {
  workspace: Workspace;
}

const WorkspaceCard = ({ workspace }: WorkspaceCardProps) => {
  return (
    <div className="h-85 w-full overflow-hidden border border-gray-200 bg-white/70 hover:shadow-md transition">
      {workspace.image ? (
        <img
          src={workspace.image}
          alt={workspace.name}
          className="w-full h-64 object-cover"
        />
      ) : (
        <div className="flex h-32 w-full items-center justify-center bg-indigo-50 text-4xl font-extrabold text-indigo-200">
          {workspace.name.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="p-3">
        <h1 className="truncate font-bold text-indigo-600">{workspace.name}</h1>

        <div className="mt-1">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium ${
              workspace.isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                workspace.isActive ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {workspace.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceCard;
