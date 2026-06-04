import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { userServices } from "../services/user.services";
import type { User } from "../types";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(() =>
    userServices.getStoredUser(),
  );
  const avatarInitial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  useEffect(() => {
    const syncUser = () => setUser(userServices.getStoredUser());

    window.addEventListener(userServices.userChangedEvent, syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener(userServices.userChangedEvent, syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white/50 shadow-md">
      <div className="text-[#3f28d9] text-3xl font-extrabold">SyncCanvas</div>

      <div className="flex-1 flex justify-center">
        <div className="flex items-center w-full max-w-md border border-gray-300 px-3 py-2">
          <FaSearch className="text-indigo-600 mr-2" />

          <input
            type="text"
            placeholder="Search boards"
            className="w-full outline-none font-bold placeholder:font-normal text-indigo-600"
          />
        </div>
      </div>

      <div className="flex items-center">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full border object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full border bg-white/70 flex items-center justify-center text-sm font-extrabold text-[#3f28d9]">
            {avatarInitial}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
