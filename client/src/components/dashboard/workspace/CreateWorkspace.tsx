import { useMemo, useState, type FormEvent } from "react";
import { FaPlus } from "react-icons/fa";
import { workspaceService } from "../../../services/workspace.services";
import type { Workspace } from "../../../types";

interface CreateWorkspaceProps {
  onClose: () => void;
  onCreated: (workspace: Workspace) => void;
}

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return "Unable to create workspace. Please try again.";
};

const CreateWorkspace = ({ onClose, onCreated }: CreateWorkspaceProps) => {
  const [workspaceName, setWorkspaceName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const previewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : ""),
    [image]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = workspaceName.trim();

    if (!name) {
      setError("Workspace name is required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await workspaceService.createWorkspace({
        name,
        image,
      });

      onCreated(res.data);
      onClose();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 w-full max-w-md">
      <h2 className="text-2xl font-bold text-[#24184f] mb-6">
        Create Workspace
      </h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Workspace Name
        </label>
        <input
          type="text"
          value={workspaceName}
          onChange={(e) => {
            setWorkspaceName(e.target.value);
            setError("");
          }}
          placeholder="Enter workspace name"
          disabled={isSubmitting}
          className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Workspace Image
        </label>

        <label
          htmlFor="workspace-image"
          className="flex flex-col items-center justify-center w-full h-48 bg-white/50 border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors group cursor-pointer overflow-hidden"
        >
          {image ? (
            <img
              src={previewUrl}
              alt="Workspace Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <div className="flex items-center justify-center w-12 h-16 bg-[#e0e7ff] mb-4 group-hover:bg-indigo-100 transition-colors">
                <FaPlus className="w-6 h-6 text-indigo-700" />
              </div>

              <span className="text-slate-700 font-bold text-sm">
                Upload Workspace Image
              </span>
            </>
          )}
        </label>

        <input
          id="workspace-image"
          type="file"
          accept="image/*"
          disabled={isSubmitting}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setImage(e.target.files[0]);
            }
          }}
        />
      </div>

      {error && <p className="mb-4 text-sm font-medium text-red-600">{error}</p>}

      <div className="grid grid-cols-3 gap-3 w-full">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="col-span-1 py-3 border border-gray-300 font-medium hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="col-span-2 py-3 bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300 transition-colors"
        >
          {isSubmitting ? "Creating..." : "Create Workspace"}
        </button>
      </div>
    </form>
  );
};

export default CreateWorkspace;
