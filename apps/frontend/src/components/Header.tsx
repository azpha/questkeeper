import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "./contexts/AuthContext";
import api from "@/utils/api";

export default function Header() {
  const auth = useAuth();

  return (
    <header className="text-black border-b">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/">
              <h1 className="text-white text-2xl font-semibold">
                Game Tracker
              </h1>
            </Link>
            {auth.currentUser ? (
              <p
                onClick={async () => {
                  auth.invalidateAuth();
                  await api.logUserOut();
                  location.reload();
                }}
                className="text-sm text-white flex items-end"
              >
                Log Out
              </p>
            ) : (
              <Link to="/login" className="text-sm text-white flex items-end">
                Login
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/search">
              <Button variant={"outline"} size="sm">
                Search Games
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
