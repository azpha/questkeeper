import type { Game } from "@/utils/types";
import GamePill from "./GamePill";
import { Link } from "react-router-dom";

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link to={`/game/${game.gameSlug}`}>
      <div className="bg-white rounded-lg max-w-fit max-h-fit text-black relative">
        <GamePill type={game.currentState} />

        <img
          src={`/api/games/image/${game.coverId}`}
          alt={game.title}
          className="object-cover rounded-t-sm"
        />

        <div className="my-2 px-4 relative max-w-[315px] truncate whitespace-nowrap">
          <h1 className="font-semibold">{game.title}</h1>
        </div>
      </div>
    </Link>
  );
}
