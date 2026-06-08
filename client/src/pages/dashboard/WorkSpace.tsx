import type { User, Workspace } from "../../types";
import { useState } from "react";
import { userServices } from "../../services/user.services";
import CreateWorkspaceCard from "../../components/dashboard/workspace/CreateWorkspaceCard";
import CreateWorkspace from "../../components/dashboard/workspace/CreateWorkspace";
import WorkspaceCard from "../../components/dashboard/workspace/WorkspaceCard";
import NoWorkspaceFound from "../../components/dashboard/workspace/NoWorkspaceFound";
import { useWorkspaceContext } from "../../hooks/workspace.hook";

const WorkSpace = () => {
  const [user] = useState<User | null>(() => userServices.getStoredUser());
  const [open, setOpen] = useState(false);
  const {
    workspaces,
    ownedWorkspaces,
    joinedWorkspaces,
    isLoading,
    error,
    addWorkspace,
  } = useWorkspaceContext();

  return (
    <>
      <div className="min-h-screen bg-white/50 px-6 py-8">
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold text-[#24184f] mb-3">
            Good Morning, {user?.name}
          </h1>
          <p className="text-lg text-gray-600">
            Organize your projects with dedicated workspaces.
          </p>
        </div>

        <div>
          <CreateWorkspaceCard onClick={() => setOpen(true)} />
        </div>

        <div>
          {isLoading && (
            <p className="text-sm font-medium text-gray-500 mt-10">
              Loading workspaces...
            </p>
          )}

          {!isLoading && error && (
            <p className="text-sm font-medium text-red-600 mt-10">{error}</p>
          )}

          {!isLoading && !error && workspaces.length === 0 && (
            <div className="flex min-h-[10vh] items-center justify-center">
              <NoWorkspaceFound />
            </div>
          )}

          {!isLoading && !error && workspaces.length > 0 && (
            <div className="mt-10 space-y-12">
              {ownedWorkspaces.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#24184f] mb-6 flex items-center gap-2">
                    <span className="w-2.5 h-6 bg-[#24184f] rounded-full inline-block"></span>
                    Owned Workspaces
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ownedWorkspaces.map((workspace: Workspace) => (
                      <WorkspaceCard key={workspace._id} workspace={workspace} />
                    ))}
                  </div>
                </div>
              )}

              {joinedWorkspaces.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[#24184f] mb-6 flex items-center gap-2">
                    <span className="w-2.5 h-6 bg-[#635bff] rounded-full inline-block"></span>
                    Joined Workspaces
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {joinedWorkspaces.map((workspace: Workspace) => (
                      <WorkspaceCard key={workspace._id} workspace={workspace} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <CreateWorkspace
            onClose={() => setOpen(false)}
            onCreated={addWorkspace}
          />
        </div>
      )}
    </>
  );
};

export default WorkSpace;
