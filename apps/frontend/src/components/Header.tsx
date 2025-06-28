import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="text-black border-b">
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/">
              <h1 className="text-white text-2xl font-semibold">
                Game Tracker
              </h1>
            </Link>
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
