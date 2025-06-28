type Game = {
  id: number;
  title: string;
  summary: string;
  coverId: string;
  gameSlug: string;
  review: string | null;
  reviewStars: number | null;
  currentState: PossibleGameStates;
};

type User = {
  email: string;
  userId: number;
};

enum PossibleGameStates {
  PLAYING,
  PAUSED,
  PLANNED,
  WISHLIST,
  COMPLETED,
}

export type { Game, User };
export { PossibleGameStates };
