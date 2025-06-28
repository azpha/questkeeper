# questkeeper

A self-hosted solution for hosting your game wishlist or currently playing stats.

## Setup

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

The API is available on the `/api/` path.

### Building the app

Simply run `pnpm run build` from root. You can build each individual project by running their respective `build` scripts as well.
