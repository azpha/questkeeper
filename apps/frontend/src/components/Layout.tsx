import type { ReactNode } from "react";
import Header from "@/components/Header";
import { useAuth } from "./contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser && auth.hasAuthLoaded) {
      navigate("/login");
    }
  }, [auth]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      {children}
    </div>
  );
}
