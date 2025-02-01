import { TransactionsTable } from "./DataTable";
import { Layout } from "@/components/layout";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context";

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

const Dashboard = () => {
  const push = useNavigate();

  return (
    <Button className="w-20" onClick={() => push("/dashboard")}>
      Revenue
    </Button>
  );
};

const Buttons = () => (
  <>
    <Dashboard />
    <Admin />
  </>
);

export const Main = () => {
  return (
    <Layout buttons={<Buttons />}>
      <h1 className="text-xl font-bold mb-4">Transactions</h1>
      <TransactionsTable />
    </Layout>
  );
};
