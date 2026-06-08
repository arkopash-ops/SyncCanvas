import type { FC } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import { WorkspaceProvider } from "../../provider/workspace.provider";

const DashboardLayout: FC = () => {
  return (
    <WorkspaceProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </WorkspaceProvider>
  );
};

export default DashboardLayout;
