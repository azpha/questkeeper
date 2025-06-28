import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "./contexts/AuthContext";
import api from "@/utils/api";

export default function Header() {
  const auth = useAuth();

  return (
    <header className="text-black border-b select-none">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <Link to="/">
              <h1 className="text-white text-2xl font-semibold">QuestKeeper</h1>
            </Link>
            {auth.currentUser ? (
              <p className="text-white">
                Hi,{" "}
                <span className="font-semibold">{auth.currentUser.name}</span>!{" "}
                <span
                  className="hover:underline hover:cursor-pointer"
                  onClick={async () => {
                    auth.invalidateAuth();
                    await api.logUserOut();
                    location.reload();
                  }}
                >
                  Log Out
                </span>
              </p>
            ) : (
              <Link
                to="/login"
                className="text-sm text-white flex items-end select-none hover:cursor-pointer hover:underline"
              >
                Login
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/search">
              <Button
                variant={"outline"}
                className="hover:cursor-pointer"
                size="sm"
              >
                Search Games
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
