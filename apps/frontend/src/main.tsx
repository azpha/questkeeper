import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./components/contexts/AuthContext.tsx";
import { scan } from "react-scan";
import "./assets/main.css";

// pages
import App from "./pages/App.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Game from "./pages/Game.tsx";
import Search from "./pages/Search.tsx";
import Import from "./pages/Import.tsx";

scan({
  enabled: process.env.NODE_ENV !== "production",
});
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
    path: "/register",
    element: <Register />,
  },
  {
    path: "/:type/:slug",
    element: <Game />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/import",
    element: <Import />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
