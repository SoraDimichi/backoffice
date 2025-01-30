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

const Admin = () => {
  const { user } = useUser();
  const { pathname } = useLocation();
  const push = useNavigate();
  const role = user?.appRole ?? "guest";

  if (role !== "admin" || pathname === "/admin") return null;

  return (
    <Button className="w-20" onClick={() => push("/admin")}>
      Panel
    </Button>
  );
};

const Home = () => {
  const { pathname } = useLocation();
  const push = useNavigate();

  if (pathname === "/") return;

  return (
    <Button className="w-20" onClick={() => push("/")}>
      Home
    </Button>
  );
};

const Dashboard = () => {
  const { pathname } = useLocation();
  const push = useNavigate();

  if (pathname === "/dashboard") return;

  return (
    <Button className="w-20" onClick={() => push("/dashboard")}>
      Revenue
    </Button>
  );
};

export const Header = () => (
  <header className="flex justify-between items-center p-4 bg-gray-900">
    <div className="flex gap-4">
      <Home />
      <Admin />
      <Dashboard />
    </div>
    <Logout />
  </header>
);
