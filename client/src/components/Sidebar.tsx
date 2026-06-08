import { FaPuzzlePiece, FaStar, FaCog } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.services";
import { useState } from "react";
import NewWorkspaceSideBar from "./NewWorkspaceSideBar";
import CreateWorkspace from "./dashboard/workspace/CreateWorkspace";
import { useWorkspaceContext } from "../hooks/workspace.hook";

const menuItems = [
  { icon: FaPuzzlePiece, label: "Work Space", path: "/user/work-space" },
  { icon: FaStar, label: "Starred", path: "/user/starred" },
  { icon: FaCog, label: "Settings", path: "/user/settings" },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { addWorkspace } = useWorkspaceContext();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white/70">
        {/* Top Section */}
        <div className="flex-1">
          <NewWorkspaceSideBar onClick={() => setOpen(true)} />

          <div className="px-6 mt-6 text-xs text-gray-400 font-semibold tracking-widest uppercase">
            Main Menu
          </div>

          {/* Menu */}
          <nav className="flex flex-col gap-2 px-6 mt-4">
            {menuItems.map(({ icon: Icon, label, path }) => (
              <NavLink
                key={label}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-indigo-600 hover:bg-indigo-50"
                  }`
                }
              >
                <Icon className="text-current" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-200/80">
          <button
            type="button"
            className="group flex w-full items-center gap-4 px-4 py-3 rounded-2xl hover:bg-red-50 transition-all duration-300"
            onClick={() => setShowLogoutModal(true)}
          >
            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
              <BiLogOut />
            </div>

            <div className="text-left">
              <p className="font-semibold text-sm text-red-500">Logout</p>
              <p className="text-xs text-red-400">Secure sign out</p>
            </div>
          </button>
        </div>

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 w-120 shadow-xl">
              <h3 className="text-lg font-semibold text-red-600">
                Confirm Logout
              </h3>

              <p className="mt-2 text-gray-600">
                Once you log out, you will need to sign in again to continue.
                <br />
                Do you really want to logout?
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>

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

export default Sidebar;
