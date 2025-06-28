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

interface IGDBGameAddition {
  id: number;
  cover: {
    id: number;
    url: string;
  };
  first_release_date: number;
  genres: IGDBGenres[];
  storyline: string;
  involved_companies: InvolvedCompanies[];
  name: string;
  platforms: Platforms[];
  screenshots: Screenshots[];
  summary: string;
}
interface IGDBSearchData {
  id: number;
  name: string;
  slug: string;
  summary: string;
}

type IGDBGenres = {
  id: number;
  name: string;
};
type InvolvedCompanies = {
  id: number;
  company: {
    id: number;
    name: string;
  };
  developer: boolean;
  publisher: boolean;
};
type Platforms = {
  id: number;
  name: string;
};
type Screenshots = {
  id: number;
  url: string;
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

export type { Game, User, IGDBGameAddition, IGDBSearchData };
export { PossibleGameStates };
