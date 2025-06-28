import type {
  Game,
  IGDBGameAddition,
  IGDBSearchData,
  PossibleGameStates,
  User,
} from "./types";

async function fetchGames() {
  return fetch("/api/games", {
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
async function fetchGameDataFromIgdb(slug: string) {
  return fetch("/api/igdb/game/" + slug, {
    method: "get",
    credentials: "include",
  }).then(async (res) => {
    if (res.ok) {
      const data = await res.json();
      return data.game as IGDBGameAddition;
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
      return data.data as IGDBSearchData[];
    } else throw new Error("Failed to search!");
  });
}
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

export default {
  fetchGames,
  fetchGame,
  fetchGameDataFromIgdb,
  searchIgdb,
  updateGame,
  createGame,
  deleteGame,
  registerAccount,
  logUserIn,
  fetchCurrentUser,
  checkRegistrationEligibility,
  logUserOut,
};
