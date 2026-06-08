import { useCallback, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { userServices } from "../services/user.services";
import { workspaceService } from "../services/workspace.services";
import { notificationService } from "../services/notification.services";
import MyNotifications from "./dashboard/notifications/MyNotifications";
import type { User, Workspace } from "../types";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(() =>
    userServices.getStoredUser(),
  );
  const avatarInitial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Workspace[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Notification States
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Synchronize stored user
  useEffect(() => {
    const syncUser = () => setUser(userServices.getStoredUser());

    window.addEventListener(userServices.userChangedEvent, syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener(userServices.userChangedEvent, syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  // Search Debounce Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await workspaceService.searchWorkspace(searchQuery);
        setSearchResults(res.data || []);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Fetch Unread Notification Count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await notificationService.getUnreadNotificationCount();
      setUnreadNotificationsCount(res.count);
    } catch (e) {
      console.error("Failed to fetch notification count", e);
    }
  }, []);

  useEffect(() => {
    const runFetch = () => {
      void fetchUnreadCount();
    };

    queueMicrotask(runFetch);
    const interval = setInterval(fetchUnreadCount, 20000); // Poll every 20s
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".search-container")) {
        setShowSearchResults(false);
      }
      if (!target.closest(".notifications-container")) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white/50 shadow-md">
      <div
        className="text-[#3f28d9] text-3xl font-extrabold cursor-pointer"
        onClick={() => navigate("/user/work-space")}
      >
        SyncCanvas
      </div>

      <div className="flex-1 flex justify-center relative search-container">
        <div className="flex items-center w-full max-w-md border border-gray-300 px-3 py-2 bg-white relative">
          <FaSearch className="text-indigo-600 mr-2" />

          <input
            type="text"
            placeholder="Search workspaces..."
            value={searchQuery}
            onChange={(e) => {
              const nextSearchQuery = e.target.value;

              setSearchQuery(nextSearchQuery);
              if (!nextSearchQuery.trim()) {
                setSearchResults([]);
              }
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            className="w-full outline-none font-bold placeholder:font-normal text-indigo-600"
          />

          {showSearchResults && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 shadow-md max-h-60 overflow-y-auto z-50 text-left">
              {isSearching ? (
                <p className="p-3 text-xs text-gray-505">Searching...</p>
              ) : searchResults.length === 0 ? (
                <p className="p-3 text-xs text-gray-500">No workspaces found</p>
              ) : (
                <div className="py-1">
                  {searchResults.map((ws) => {
                    const ownerName =
                      typeof ws.owner === "object" && ws.owner
                        ? ws.owner.name
                        : "Unknown";
                    return (
                      <button
                        key={ws._id}
                        onClick={() => {
                          setShowSearchResults(false);
                          setSearchQuery("");
                          navigate(`/user/work-space/${ws._id}`);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-indigo-50 flex items-center justify-between transition"
                      >
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{ws.name}</p>
                          <p className="text-[10px] text-gray-500">Owner: {ownerName}</p>
                        </div>
                        {ws.image && (
                          <img
                            src={ws.image}
                            alt={ws.name}
                            className="w-8 h-8 object-cover border border-gray-200"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-xl font-semibold">
          <span className="text-[#3f28d9]">Hello, </span>
          <span className="text-indigo-500">{user?.name}</span>
        </p>

        <div className="relative notifications-container">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="focus:outline-none relative block"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full border object-cover cursor-pointer hover:opacity-90 transition"
              />
            ) : (
              <div className="w-10 h-10 rounded-full border bg-white/70 flex items-center justify-center text-sm font-extrabold text-[#3f28d9] cursor-pointer hover:bg-white transition">
                {avatarInitial}
              </div>
            )}
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white">
                {unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 z-50">
              <MyNotifications
                onClose={() => setShowNotifications(false)}
                onUnreadCountChange={setUnreadNotificationsCount}
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
