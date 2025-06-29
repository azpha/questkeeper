import type { PossibleGameStates } from "@/utils/types";

export default function GamePill({ type }: { type: PossibleGameStates }) {
  const colors = {
    COMPLETED: "bg-green-500",
    PLAYING: "bg-blue-500",
    WISHLIST: "bg-zinc-500",
    PAUSED: "bg-yellow-500",
    PLANNED: "bg-orange-500",
  } as unknown as Record<PossibleGameStates, string>;
  const text = {
    COMPLETED: "Completed",
    PLAYING: "Playing",
    WISHLIST: "Wishlisted",
    PAUSED: "Paused",
    PLANNED: "Planned",
  } as unknown as Record<PossibleGameStates, string>;

  return (
    <div
      className={`${colors[type]} rounded-lg p-1 absolute font-bold text-xs top-2 right-2 select-none`}
    >
      <p>{text[type]}</p>
    </div>
  );
}
