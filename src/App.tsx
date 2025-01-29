import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context";
import { Auth } from "@/app/auth";
import { Admin } from "@/app/admin";
import { Progress } from "@radix-ui/react-progress";
import { Main } from "./app";

export const App: React.FC = () => {
  const { userLoaded } = useUser();

  return userLoaded === null ? <Progress /> : <AppInner />;
};

const AppInner = () => {
  const { user } = useUser();
  const role = user?.appRole ?? "guest";

  return (
    <Routes>
      <Route
        path="/auth"
        element={role === "guest" ? <Auth /> : <Navigate to="/" />}
      />
      <Route
        path="/"
        element={
          role === "user" || role === "admin" ? (
            <Main />
          ) : (
            <Navigate to="/auth" />
          )
        }
      />
      <Route
        path="/admin"
        element={role === "admin" ? <Admin /> : <Navigate to="/" />}
      />
    </Routes>
  );
};

export default App;
