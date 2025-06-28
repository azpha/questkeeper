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
  logUserIn,
  fetchCurrentUser,
  logUserOut,
};
