interface JWTPayload {
  userId: number;
  email: string;
}

// express type override
declare module "express" {
  interface Request {
    user?: JWTPayload;
  }
}

export type { JWTPayload };
