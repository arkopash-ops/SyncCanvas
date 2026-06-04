const DeleteAccount = () => {
  return (
    <div className="bg-white/50 shadow-md rounded-lg border border-red-200 p-6 space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-red-600">Delete Workspace</h2>

        <p className="text-sm text-gray-600">
          Once you delete a workspace, there is no going back.
        </p>
      </div>

      <div className="bg-red-50 border border-red-100 p-4">
        <p className="text-sm text-red-700 font-medium flex justify-center">
          This action is permanent and will remove all associated data.
        </p>
      </div>

      <div className="mt-6 flex justify-center">
        <button className="h-12 px-6 bg-red-600 text-white font-semibold hover:bg-red-700 transition w-full sm:w-auto">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;
