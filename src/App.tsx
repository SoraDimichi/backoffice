import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context";
import { Auth, Admin, Main, Dashboard } from "@/app";
import { Progress } from "@/components/ui/progress";

export const App: React.FC = () => {
  const { userLoaded } = useUser();

  return userLoaded === null ? <Progress /> : <AppInner />;
};

const AppInner = () => {
  const { user } = useUser();
  const role = user?.appRole ?? "guest";

  const isAuthenticated = role === "user" || role === "admin";

  return (
    <Routes>
      <Route
        path="/auth"
        element={role === "guest" ? <Auth /> : <Navigate to="/" />}
      />
      <Route
        path="/"
        element={isAuthenticated ? <Main /> : <Navigate to="/auth" />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />}
      />
      <Route
        path="/admin"
        element={role === "admin" ? <Admin /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default App;
