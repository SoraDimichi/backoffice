import { Logout } from "./logout";
import { AdminPanel } from "../panel";

export const UserInterface = () => {
  return (
    <div>
      <header>
        <Logout />
      </header>
      <main>
        <AdminPanel />
      </main>
    </div>
  );
};
