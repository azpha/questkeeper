import type { Game, User } from "./types";

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
  updateGame,
  logUserIn,
  fetchCurrentUser,
  logUserOut,
};
