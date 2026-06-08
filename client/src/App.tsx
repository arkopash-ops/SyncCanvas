import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import WorkSpace from "./pages/dashboard/WorkSpace";

import NotFound from "./pages/404/NotFound";
import { authService } from "./services/auth.services";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import Settings from "./pages/dashboard/Settings";
import Starred from "./pages/dashboard/Starred";
import Board from "./pages/dashboard/Board";

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
          <Route path="work-space/:workspaceId" element={<Board />} />
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
