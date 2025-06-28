type Game = {
  id: number;
  title: string;
  summary: string;
  coverId: string;
  screenshotIds: string[];
  platforms: string[];
  developer: string;
  publisher: string;
  releaseDate: string;
  gameSlug: string;
  genres: string[];
  storyline: string;
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
