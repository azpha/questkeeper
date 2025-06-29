# questkeeper

A self-hosted solution for hosting your game wishlist or currently playing stats.

## Setup

Provided in this repository is a [docker-compose](./docker-compose.yml) configuration that you can use to easily deploy this application 🕺

### Steam Functionality

In order to utilize the Steam import functionality, you need a Steam API key. You can register one [here](https://steamcommunity.com/dev/apikey). Add it in the docker-compose environment variable `STEAM_API_KEY`.

### Obtaining Twitch authentication

In order to utilize IGDB, you need a Twitch developer application. To get one, all you need to do is

- have a Twitch account
- go to [Twitch's Developer Portal](https://dev.twitch.tv/console/apps/create) and create an application
- Go through the flow. If needed, set the OAuth redirect URL to `localhost`.
- Once you've done this, take note of both the client ID & secret

### Environment Variables

There are environment variables you'll need to set in order to get this working. All of these are defined in the sample docker configuration, you just need to update their values.

- `IGDB_CLIENT_SECRET`/`IGDB_CLIENT_ID`; your Twitch application's client ID and client secret. Used for authentication against the IGDB API.
- `STEAM_API_KEY` (optional); your Steam API key for library fetching
- `JWT_SECRET`; used for JWT secret decoding. You can generate a random string using `crypto.randomBytes(16).toString('hex')` in NodeJS
- `HOSTNAME`; used for issuing tokens to a domain. Requires a proper domain w/o a port to function properly (can be locally mapped via DNS)

## Development

This guide is the steps you need to take to run this app locally.

### Environment Setup

This repository uses PNPM. To get started, clone the repository & setup PNPM on your environment.

```
git clone https://github.com/azpha/questkeeper
npm i -g corepack
corepack enable
pnpm i
```

### Running the app

Simply run `pnpm run dev` from root. This will spin up both the API and the frontend development servers, which can be accessed through Vite's usual `localhost:5173` domain.

The API is available on the `/api/` path, both of the Vite dev server & the production server.

### Building the app

Simply run `pnpm run build` from root. You can build each individual project by running their respective `build` scripts as well.
