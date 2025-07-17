import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { InstructionsModalProvider } from "./providers/modalProvider";



createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <InstructionsModalProvider>
      <App />
    </InstructionsModalProvider>
  </StrictMode>
);