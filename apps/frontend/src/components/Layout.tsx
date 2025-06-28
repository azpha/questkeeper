import type { ReactNode } from "react";
import Header from "@/components/Header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      {" "}
      <Header />
      {children}
    </div>
  );
}
