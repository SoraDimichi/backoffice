import { useState } from "react";
import { Login } from "./Login";
import { Register } from "./Register";

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin((prev) => !prev);

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {isLogin ? (
          <Login toggle={toggleForm} />
        ) : (
          <Register toggle={toggleForm} />
        )}
      </div>
    </div>
  );
};
