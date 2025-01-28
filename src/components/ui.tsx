import { Logout } from "./logout";
import { AdminPanel } from "../panel";
import { useUser } from "@/context";

export const UserInterface = () => {
  const { user } = useUser();

  return (
    <div>
      <header>
        <Logout />
      </header>
      {/* {user?.appRole === "admin" && ( */}
      <main>
        <AdminPanel />
      </main>
      {/* )} */}
    </div>
  );
};
