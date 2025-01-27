import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { WithUser } from "./context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WithUser>
      <App />
    </WithUser>
  </StrictMode>,
);
