import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/contexts/AuthContext.tsx";
import "./assets/main.css";

// pages
import App from "./pages/App.tsx";
import Login from "./pages/Login.tsx";
import Game from "./pages/Game.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/game/:slug",
    element: <Game />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </AuthProvider>
);
