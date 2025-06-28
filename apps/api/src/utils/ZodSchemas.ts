import { z } from "zod";

const schemas = {
  environment: z.object({
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url().optional(),
    JWT_SECRET: z.string().min(32),
    HOSTNAME: z.string().url().optional(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    IGDB_CLIENT_ID: z.string().min(1),
    IGDB_CLIENT_SECRET: z.string().min(1),
  }),
  auth: {
    register: z.object({
      email: z.string().email(),
      name: z.string().min(1),
      password: z.string().min(8),
    }),
    login: z.object({
      username: z.string().min(1),
      password: z.string().min(8),
    }),
  },
  igdb: {
    search: z.string().min(1),
    getBySlug: z.string().min(1),
    getById: z.coerce.number().positive(),
  },
  games: {
    id: z.coerce.number(),
    steamIds: z.string().min(1),
    getCover: z.string().min(1),
    create: z.object({
      gameSlug: z.string().min(1),
      currentState: z.enum([
        "PLAYING",
        "PLANNED",
        "PAUSED",
        "WISHLIST",
        "COMPLETED",
      ]),
    }),
    update: z.object({
      gameSlug: z.string().min(1).optional(),
      currentState: z
        .enum(["PLAYING", "PLANNED", "PAUSED", "WISHLIST", "COMPLETED"])
        .optional(),
    }),
    delete: z.coerce.number(),
    get: z.string().min(1),
  },
};

export default schemas;

export type Env = z.infer<typeof schemas.environment>;
