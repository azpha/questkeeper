interface JWTPayload {
  userId: number;
  email: string;
}

interface IGDBGameAddition {
  id: number;
  cover: {
    id: number;
    url: string;
  };
  first_release_date: number;
  genres: IGDBGenres[];
  storyline?: string;
  involved_companies: InvolvedCompanies[];
  name: string;
  platforms: Platforms[];
  screenshots: Screenshots[];
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

// express type override
declare module "express" {
  interface Request {
    user?: JWTPayload;
  }
}

export type { JWTPayload, IGDBGameAddition };
