import type { Game, PossibleGameStates, SteamGame, User } from "./types";

// game management endpoints
async function updateGame(id: number, body: object) {
  return fetch("/api/games/" + id, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => res.ok);
}
async function createGame(gameSlug: string, currentState: PossibleGameStates) {
  return fetch("/api/games/create", {
    method: "post",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      gameSlug,
      currentState,
    }),
  }).then((res) => {
    if (res.ok) {
      return res.ok;
    } else throw new Error("Failed to create game!");
  });
}
async function deleteGame(id: number) {
  return fetch("/api/games/" + id, {
    method: "delete",
    credentials: "include",
  }).then((res) => res.ok);
}

// game fetching endpoints
async function fetchGames(params?: string) {
  const url = params ? `/api/games?${params}` : "/api/games";
  return fetch(url, {
    method: "get",
    credentials: "include",
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data.games as Game[];
    } else throw new Error("Failed to fetch games!");
  });
}
async function fetchGame(slug: string) {
  return fetch("/api/games/" + slug, {
    method: "get",
    credentials: "include",
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data.game as Game;
    } else throw new Error("Failed to fetch game!");
  });
}
async function fetchBacklogGames() {
  return fetch("/api/games/backlog", {
    method: "get",
    credentials: "include",
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data.data as Game[];
    } else throw new Error("Failed to fetch backlog!");
  });
}
async function getAddedSlugs() {
  return fetch("/api/games/added", {
    method: "get",
    credentials: "include",
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data.slugs as string[];
    } else throw new Error("Failed to fetch added game slugs!");
  });
}

// igdb endpoints
async function fetchGameFromIgdb(slug: string) {
  return fetch("/api/igdb/game/" + slug, {
    method: "get",
    credentials: "include",
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data.game as Game;
    } else throw new Error("Failed to fetch game!");
  });
}
async function searchIgdb(query: string) {
  return fetch("/api/igdb/search?q=" + query, {
    method: "get",
    credentials: "include",
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data.games as Game[];
    } else throw new Error("Failed to search!");
  });
}
async function fetchSteamIgdbGames(ids: string) {
  return fetch("/api/igdb/steam?ids=" + ids, {
    method: "get",
    credentials: "include",
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data.games as Game[];
    } else throw new Error("Failed to fetch IGDB games using Steam ID!");
  });
}

// steam endpoints
async function fetchSteamGames() {
  return fetch("/api/steam/games", {
    method: "get",
    credentials: "include",
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data.games as SteamGame[];
    } else throw new Error("Failed to fetch steam games!");
  });
}

// authentication
async function fetchCurrentUser() {
  return fetch("/api/auth/@me", {
    method: "get",
    credentials: "include",
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data.user as User;
    } else throw new Error("Failed to fetch current user!");
  });
}
async function registerAccount(email: string, password: string, name: string) {
  return fetch("/api/auth/register", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      name,
    }),
  }).then((res) => res.ok);
}
async function checkRegistrationEligibility() {
  return fetch("/api/auth/eligibility", {
    method: "get",
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data.eligible;
    } else throw new Error("Failed to check eligibility!");
  });
}
async function logUserIn(username: string, password: string) {
  return fetch("/api/auth/login", {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  }).then((res) => res.ok);
}
async function logUserOut() {
  return fetch("/api/auth/logout", {
    method: "delete",
    credentials: "include",
  }).then((res) => res.ok);
}
async function updateUser(body: object) {
  return fetch("/api/auth/@me", {
    method: "PATCH",
    credentials: "include",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  }).then((res) => res.ok);
}

export default {
  fetchGames,
  fetchGame,
  fetchBacklogGames,
  fetchGameFromIgdb,
  getAddedSlugs,
  fetchSteamIgdbGames,
  searchIgdb,
  updateGame,
  fetchSteamGames,
  createGame,
  deleteGame,
  registerAccount,
  logUserIn,
  updateUser,
  fetchCurrentUser,
  checkRegistrationEligibility,
  logUserOut,
};
