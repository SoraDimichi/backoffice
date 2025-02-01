import { Button } from "@/components/ui/button";
import { logout } from "./api";
import { Boundary } from "../ui/Boundary";
import { ReactNode } from "react";

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

type LayoutP = { children: ReactNode; buttons: ReactNode };
export const Layout = ({ children, buttons }: LayoutP) => (
  <div className="min-h-dvh grid grid-rows-[min-content_1fr]">
    <header className="flex justify-between items-center p-4 bg-gray-900">
      <div className="flex gap-4">{buttons}</div>
      <Logout />
    </header>
    <main className="container mx-auto py-10  p-4">{children}</main>
  </div>
);

export { Home } from "./Home";
