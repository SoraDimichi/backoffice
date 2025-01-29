import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context";
import { useNavigate, useLocation } from "react-router-dom";
import { Boundary } from "./ui/Boundary";

const logout = async () => {
  const { error } = await supabase.auth.signOut();
  throw error;
};
const LogoutInner = () => (
  <Button onClick={logout} className="ml-auto">
    Logout
  </Button>
);
const Logout = () => (
  <Boundary>
    <LogoutInner />
  </Boundary>
);

const ButtonResolver = () => {
  const { pathname } = useLocation();
  const push = useNavigate();

  switch (pathname) {
    case "/admin":
      return (
        <Button className="w-15" onClick={() => push("/")}>
          Home
        </Button>
      );
    case "/":
    default:
      return (
        <Button className="w-15" onClick={() => push("/admin")}>
          Panel
        </Button>
      );
  }
};

const AdminNavigation = () => {
  const { user } = useUser();
  const role = user?.appRole ?? "guest";

  if (role !== "admin") return null;

  return (
    <div className="flex space-x-2.5">
      <ButtonResolver />
    </div>
  );
};

export const Header = () => (
  <header className="flex justify-between items-center p-4 bg-gray-800">
    <AdminNavigation />
    <Logout />
  </header>
);
