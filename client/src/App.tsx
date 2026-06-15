import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import Auth from "./pages/Auth";
import WorkSpace from "./pages/dashboard/WorkSpace";

import NotFound from "./pages/404/NotFound";
import { authService } from "./services/auth.services";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Settings from "./pages/dashboard/Settings";
import Starred from "./pages/dashboard/Starred";
import Board from "./pages/dashboard/Board";
import { workspaceService } from "./services/workspace.services";
import Canvas from "./pages/dashboard/Canvas";

type RouteGuardProps = {
  children: ReactNode;
};

const PublicOnlyRoute = ({ children }: RouteGuardProps) => {
  if (authService.isAuthenticated()) {
    return <Navigate to="/user/work-space" replace />;
  }

  return children;
};

const ProtectedRoute = ({ children }: RouteGuardProps) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const WorkspaceGuard = ({ children }: { children: React.ReactNode }) => {
  const { workspaceId } = useParams();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        await workspaceService.getWorkspaceById(workspaceId!);
        setAllowed(true);
      } catch {
        setAllowed(false);
      }
    };

    checkAccess();
  }, [workspaceId]);

  if (allowed === null) return null;

  if (!allowed) {
    return <Navigate to="/user/work-space" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicOnlyRoute>
              <Auth />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Auth />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Auth />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="work-space" element={<WorkSpace />} />

          <Route
            path="work-space/:workspaceId"
            element={
              <WorkspaceGuard>
                <Board />
              </WorkspaceGuard>
            }
          />

          <Route path="canvas/:boardId" element={<Canvas />} />

          <Route path="starred" element={<Starred />} />

          <Route path="settings" element={<Settings />} />
        </Route>

        {/* catch all routes "*" */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
