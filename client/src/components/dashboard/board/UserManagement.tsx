import { useCallback, useEffect, useState } from "react";
import type { Workspace, WorkspaceMemberDetails, User } from "../../../types";
import { workspaceService } from "../../../services/workspace.services";
import { userServices } from "../../../services/user.services";
import { BsXLg } from "react-icons/bs";

interface UserManagementProps {
  isOpen: boolean;
  onClose: () => void;
  onLeft: () => void;
  workspace: Workspace;
}

const getErrorMessage = (error: unknown, fallback: string) => {
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

  return fallback;
};

const UserManagement = ({
  isOpen = true,
  onClose,
  onLeft,
  workspace,
}: UserManagementProps) => {
  const [currentUser] = useState<User | null>(() =>
    userServices.getStoredUser(),
  );
  const [members, setMembers] = useState<WorkspaceMemberDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("editor");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const ownerId =
    typeof workspace.owner === "object" && workspace.owner
      ? workspace.owner._id
      : workspace.owner;
  const isOwner = currentUser?._id === ownerId;

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await workspaceService.getWorkspaceMember(workspace._id);
      setMembers(res.data || []);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load workspace members."));
    } finally {
      setIsLoading(false);
    }
  }, [workspace._id]);

  useEffect(() => {
    if (isOpen) {
      const runFetch = () => {
        void fetchMembers();
      };

      queueMicrotask(runFetch);
    }
  }, [fetchMembers, isOpen]);

  const handleRoleChange = async (
    memberId: string | undefined,
    roleValue: string,
  ) => {
    if (!memberId) return;
    setError("");
    setSuccessMsg("");
    try {
      if (roleValue === "remove") {
        const res = await workspaceService.removeMember(
          workspace._id,
          memberId,
        );
        setSuccessMsg(res.message || "Member removed successfully.");
      } else {
        await workspaceService.updateMemberRole(
          workspace._id,
          memberId,
          roleValue as "editor" | "viewer",
        );
        setSuccessMsg("Member role updated successfully.");
      }
      fetchMembers();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to change member role."));
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setError("");
    setSuccessMsg("");
    setInviteLoading(true);
    try {
      const res = await workspaceService.inviteUserToWorkspace(workspace._id, {
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      setSuccessMsg(res.message || "Invitation sent successfully!");
      setInviteEmail("");
      fetchMembers();
    } catch (err) {
      setError(getErrorMessage(err, "Failed to invite user."));
    } finally {
      setInviteLoading(false);
    }
  };

  const handleLeaveWorkspace = async () => {
    setError("");
    setSuccessMsg("");

    try {
      const res = await workspaceService.leaveWorkspace(workspace._id);
      setSuccessMsg(res.message || "You left the workspace.");

      onClose();
      onLeft?.();

      window.location.replace("/user/work-space")
    } catch (err) {
      setError(getErrorMessage(err, "Failed to leave workspace."));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl border border-gray-300 bg-white shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-8 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-[#24184f]">
              Workspace Members
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage access and permissions for "{workspace.name}"
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <BsXLg />
          </button>
        </div>

        {/* Notifications Bar */}
        {(error || successMsg) && (
          <div className="px-8 pt-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 font-medium">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 font-medium">
                {successMsg}
              </div>
            )}
          </div>
        )}

        {/* Invite Section (Owner Only) */}
        {isOwner && (
          <div className="flex flex-col sm:flex-row gap-3 px-8 py-4 bg-gray-50/50 border-b border-gray-100">
            <input
              type="email"
              placeholder="Enter user email address..."
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 border border-gray-300 px-4 py-3 outline-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              disabled={inviteLoading}
            />

            <div className="flex gap-3">
              <select
                value={inviteRole}
                onChange={(e) =>
                  setInviteRole(e.target.value as "editor" | "viewer")
                }
                className="border border-gray-300 px-4 py-3 outline-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                disabled={inviteLoading}
              >
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>

              <button
                onClick={handleInvite}
                disabled={inviteLoading || !inviteEmail.trim()}
                className="bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300 transition-colors text-sm flex items-center justify-center min-w-20"
              >
                {inviteLoading ? "Inviting..." : "Invite"}
              </button>
            </div>
          </div>
        )}

        {/* Members List */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Members ({members.length})
          </h3>

          {isLoading ? (
            <p className="text-sm text-gray-500">Loading members...</p>
          ) : members.length === 0 ? (
            <p className="text-sm text-gray-500">No members found.</p>
          ) : (
            <div className="space-y-4">
              {members.map((member, idx) => {
                const userObj = member.user;
                if (!userObj) return null;
                const name = userObj.name || "Unknown User";
                const email = userObj.email || "";
                const avatar = userObj.avatar;
                const initials = name.trim().charAt(0).toUpperCase() || "U";

                return (
                  <div
                    key={userObj._id || idx}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={name}
                          className="h-10 w-10 rounded-full object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-800 text-sm">
                          {initials}
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                          {name}
                          {userObj._id === currentUser?._id && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-normal">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Role badge */}
                      <span
                        className={`px-3 py-1 text-xs font-semibold border rounded-full capitalize ${
                          member.role === "owner"
                            ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                            : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {member.role}
                      </span>

                      {/* Owner controls (only workspace owner can manage others) */}
                      {isOwner && member.role !== "owner" && (
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleRoleChange(userObj._id, e.target.value)
                          }
                          className="px-2 py-1 text-xs text-gray-600 border border-gray-300 bg-white font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                          <option value="remove">Remove</option>
                        </select>
                      )}

                      {/* Leave button (only for current user if not owner of workspace) */}
                      {!isOwner &&
                        userObj._id === currentUser?._id &&
                        member.role !== "owner" && (
                          <button
                            onClick={handleLeaveWorkspace}
                            className="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition"
                          >
                            Leave
                          </button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t bg-gray-50/50 px-8 py-5">
          <button
            onClick={onClose}
            className="border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition bg-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
