import { useEffect, type FC } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { WorkspaceProvider } from "../../provider/workspace.provider";
import { userServices } from "../../services/user.services";
import { socket } from "../../lib/socket";

const DashboardLayout: FC = () => {
  const user = userServices.getStoredUser();
  const location = useLocation();
  const isCanvasPage = location.pathname.startsWith("/user/canvas");

  useEffect(() => {
    if (!user?._id) return;

    const joinUserRoom = () => {
      // inform server about the logged-in user
      socket.emit("join_user", user._id);
    };

    joinUserRoom();
    socket.on("connect", joinUserRoom);

    return () => {
      socket.off("connect", joinUserRoom);
    };
  }, [user?._id]);

  return (
    <WorkspaceProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        {!isCanvasPage && <Navbar />}

        <div className="flex flex-1 overflow-hidden">
          {!isCanvasPage && <Sidebar />}

          <main className={isCanvasPage ? "flex-1 overflow-hidden" : "flex-1 overflow-y-auto p-6"}>
            <Outlet />
          </main>
        </div>
      </div>
    </WorkspaceProvider>
  );
};

export default DashboardLayout;
