import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { StoreProvider } from "./app/store.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StoreProvider>
    <App />
  </StoreProvider>
);

// Fade out the branded splash once the app has painted (min display ~700ms).
requestAnimationFrame(() => {
  const splash = document.getElementById("wetigo-splash");
  if (!splash) return;
  setTimeout(() => {
    splash.classList.add("ws-hide");
    setTimeout(() => splash.remove(), 500);
  }, 600);
});
