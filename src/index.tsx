import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { DownloadModalProvider } from "./providers/modalProvider";



createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <DownloadModalProvider>
      <App />
    </DownloadModalProvider>
  </StrictMode>
);