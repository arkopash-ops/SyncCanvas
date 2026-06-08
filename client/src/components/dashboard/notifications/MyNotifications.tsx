import { useCallback, useEffect, useState } from "react";
import type { Notification, WorkspaceInvitation } from "../../../types";
import { notificationService } from "../../../services/notification.services";
import { invitationService } from "../../../services/invitation.services";
import { useWorkspaceContext } from "../../../hooks/workspace.hook";

interface MyNotificationsProps {
  onClose: () => void;
  onUnreadCountChange: (count: number) => void;
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

const MyNotifications = ({ onClose, onUnreadCountChange }: MyNotificationsProps) => {
  const { refreshWorkspaces } = useWorkspaceContext();
  const [activeTab, setActiveTab] = useState<"notifications" | "invitations">("notifications");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [invitations, setInvitations] = useState<WorkspaceInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [unreadCount, setLocalUnreadCount] = useState(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    try {
      if (activeTab === "notifications") {
        const notifyRes = await notificationService.getNotifications();
        setNotifications(notifyRes.data || []);
        
        const countRes = await notificationService.getUnreadNotificationCount();
        setLocalUnreadCount(countRes.count);
        onUnreadCountChange(countRes.count);
      } else {
        const inviteRes = await invitationService.getPendingInvitation();
        setInvitations(inviteRes.data || []);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to fetch data."));
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, onUnreadCountChange]);

  useEffect(() => {
    const runFetch = () => {
      void fetchData();
    };

    queueMicrotask(runFetch);
  }, [fetchData]);

  // Initial fetch for count to sync badge on mount
  useEffect(() => {
    const fetchCountOnly = async () => {
      try {
        const countRes = await notificationService.getUnreadNotificationCount();
        setLocalUnreadCount(countRes.count);
        onUnreadCountChange(countRes.count);
      } catch (e) {
        console.error("Failed to fetch notification count", e);
      }
    };
    fetchCountOnly();
  }, [onUnreadCountChange]);

  const handleMarkAsRead = async (notifyId: string) => {
    setError("");
    try {
      await notificationService.markOneNotificationRead(notifyId);
      // Update local state to avoid refetching
      setNotifications((prev) =>
        prev.map((n) => (n._id === notifyId ? { ...n, isRead: true } : n))
      );
      
      const newCount = Math.max(0, unreadCount - 1);
      setLocalUnreadCount(newCount);
      onUnreadCountChange(newCount);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to mark notification as read."));
    }
  };

  const handleMarkAllAsRead = async () => {
    setError("");
    try {
      await notificationService.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setLocalUnreadCount(0);
      onUnreadCountChange(0);
      setSuccess("All notifications marked as read.");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to mark all as read."));
    }
  };

  const handleAcceptInvite = async (inviteId: string) => {
    setError("");
    setSuccess("");
    try {
      const res = await invitationService.acceptInvitation(inviteId);
      setSuccess(res.message || "Invitation accepted!");
      setInvitations((prev) => prev.filter((i) => i._id !== inviteId));
      refreshWorkspaces(); // Reload workspaces in UI
    } catch (err) {
      setError(getErrorMessage(err, "Failed to accept invitation."));
    }
  };

  const handleRejectInvite = async (inviteId: string) => {
    setError("");
    setSuccess("");
    try {
      const res = await invitationService.rejectInvitation(inviteId);
      setSuccess(res.message || "Invitation rejected.");
      setInvitations((prev) => prev.filter((i) => i._id !== inviteId));
    } catch (err) {
      setError(getErrorMessage(err, "Failed to reject invitation."));
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-80 sm:w-96 border border-gray-300 bg-white shadow-lg overflow-hidden flex flex-col max-h-125">
      {/* Popover Header */}
      <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
        <span className="font-bold text-[#24184f] text-sm">Inbox</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xs font-medium"
        >
          Close
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-50 text-xs">
        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex-1 py-3 text-center font-bold border-b-2 transition ${
            activeTab === "notifications"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Notifications
          {unreadCount > 0 && (
            <span className="ml-1 bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("invitations")}
          className={`flex-1 py-3 text-center font-bold border-b-2 transition ${
            activeTab === "invitations"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Invitations
          {invitations.length > 0 && (
            <span className="ml-1 bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
              {invitations.length}
            </span>
          )}
        </button>
      </div>

      {/* Messages / Alerts */}
      {(error || success) && (
        <div className="px-4 pt-2">
          {error && <div className="text-[11px] font-medium text-red-600 border border-red-200 bg-red-50 p-2">{error}</div>}
          {success && <div className="text-[11px] font-medium text-green-600 border border-green-200 bg-green-50 p-2">{success}</div>}
        </div>
      )}

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto min-h-50">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-gray-400">Loading...</div>
        ) : activeTab === "notifications" ? (
          notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">No notifications yet</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {notifications.map((notify) => (
                <div
                  key={notify._id}
                  onClick={() => handleMarkAsRead(notify._id)}
                  className={`p-4 transition cursor-pointer text-left relative ${
                    !notify.isRead ? "bg-indigo-50/30 hover:bg-indigo-50/50" : "hover:bg-gray-50"
                  }`}
                >
                  {!notify.isRead && (
                    <span className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 rounded-full"></span>
                  )}
                  <p className="font-bold text-gray-900 text-xs pr-4">{notify.title}</p>
                  <p className="text-gray-600 text-[11px] mt-1 pr-2">{notify.message}</p>
                  <p className="text-[10px] text-gray-400 mt-2">{formatTime(notify.createdAt)}</p>
                </div>
              ))}
            </div>
          )
        ) : invitations.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">No pending invitations</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {invitations.map((invite) => {
              const wsName = typeof invite.workspaceId === "object" && invite.workspaceId ? invite.workspaceId.name : "Workspace";
              const senderName = typeof invite.invitedBy === "object" && invite.invitedBy ? invite.invitedBy.name : "Someone";
              const senderEmail = typeof invite.invitedBy === "object" && invite.invitedBy ? invite.invitedBy.email : "";

              return (
                <div key={invite._id} className="p-4 text-left">
                  <p className="font-bold text-gray-900 text-xs">
                    Workspace Invitation
                  </p>
                  <p className="text-gray-600 text-[11px] mt-1">
                    <span className="font-semibold text-gray-800">{senderName}</span> ({senderEmail}) has invited you to join workspace{" "}
                    <span className="font-semibold text-gray-800">"{wsName}"</span> as an{" "}
                    <span className="font-semibold capitalize text-indigo-600">{invite.role}</span>.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleAcceptInvite(invite._id)}
                      className="bg-indigo-600 text-white px-3 py-1.5 text-[11px] font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectInvite(invite._id)}
                      className="border border-gray-300 text-gray-600 px-3 py-1.5 text-[11px] font-medium hover:bg-gray-50 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">{formatTime(invite.createdAt)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Popover Footer (Notifications Tab Only) */}
      {activeTab === "notifications" && notifications.some((n) => !n.isRead) && (
        <div className="px-4 py-2 border-t border-gray-50 bg-gray-50/30 flex justify-end">
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold transition"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};

export default MyNotifications;
