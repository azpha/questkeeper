type Game = {
  id: number;
  title: string;
  summary: string;
  coverId?: string;
  coverUrl?: string;
  screenshotIds?: string[];
  screenshotUrls?: string[];
  platforms: string[];
  developer: string;
  publisher: string;
  releaseDate: string;
  gameSlug: string;
  genres: string[];
  storyline?: string;
  review: string | null;
  reviewStars: number | null;
  currentState: PossibleGameStates;
};
type SteamGame = {
  appid: number;
  playtime_forever: number;
};

type User = {
  name: string;
  email: string;
  userId: number;
  steamId?: string;
};

enum PossibleGameStates {
  PLAYING = "PLAYING",
  PAUSED = "PAUSED",
  PLANNED = "PLANNED",
  WISHLIST = "WISHLIST",
  COMPLETED = "COMPLETED",
}

export type { Game, User, SteamGame };
export { PossibleGameStates };
