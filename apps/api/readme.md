# questkeeper-api

The backend Express application for Questkeeper

## Development

You'll need to set up a Postgres database before you begin, alongside having an instance of Redis running locally as it is used to cache credentials from Twitch + other data.

Before you begin, apply the existing migrations to your environment:

```
pnpm exec prisma migrate dev
```

and then run the development server

```
pnpm run dev
```

You'll need to restart the server manually when making changes.

## Structure

- `controllers`; endpoint business logic.
- `routes`; Express endpoint routers;
- `services`; various active services, like the Database, Auth and Redis.
- `utils`; various utilities, like environment variables, image utilities and more.

## Schemas

Each request should be validated with its own schema. You can find this in [ZodSchemas.ts](./src/utils/ZodSchemas.ts).
