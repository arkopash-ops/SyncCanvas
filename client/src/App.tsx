import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/dashboard/Dashboard";

import NotFound from "./pages/404/NotFound";
import { authService } from "./services/auth.services";

type RouteGuardProps = {
  children: ReactNode;
};

const PublicOnlyRoute = ({ children }: RouteGuardProps) => {
  if (authService.isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
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
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* catch all routes "*" */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
