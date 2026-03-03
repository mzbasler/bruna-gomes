import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Relatorio from "./Relatorio";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Relatorio />
  </StrictMode>
);
