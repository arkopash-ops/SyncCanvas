import empty from "../../../assets/images/empty.png";

const NoWorkspaceFound = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-md text-center">
        <img src={empty} alt="No workspace" className="mx-auto" />
        <p className="mt-4 text-pretty text-gray-700">
          No workspaces yet. Create your first workspace to get started.
        </p>
      </div>
    </div>
  );
};

export default NoWorkspaceFound;
