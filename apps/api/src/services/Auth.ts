import jwt from "jsonwebtoken";
import Environment from "../utils/Environment";
import Redis from "./Redis";
import type { JWTPayload } from "../utils/Types";
import type { Request, Response, NextFunction } from "express";

async function verifyJwt(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.authToken;

  if (!token) {
    res.status(401).json({
      status: 401,
      message: "Invalid authentication",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, Environment!.JWT_SECRET) as JWTPayload;
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({
      status: 401,
      message: "Invalid authentication",
    });
  }
}
async function laxVerifyJwt(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.authToken;
  const decoded = jwt.verify(token, Environment!.JWT_SECRET) as JWTPayload;
  req.user = decoded;
  next();
}

async function verifyAgainstTwitch() {
  const cachedKey = await Redis.get("twitchToken");

  if (cachedKey) {
    const cachedKeyData = JSON.parse(cachedKey);
    if (new Date(cachedKeyData.expiresAt).getTime() > new Date().getTime()) {
      return "Bearer " + cachedKeyData.token;
    } else {
      await Redis.del("twitchToken");
    }
  }

  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${Environment!.IGDB_CLIENT_ID}&client_secret=${Environment!.IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
    {
      method: "POST",
    }
  );

  if (res.ok) {
    const data = await res.json();

    if (data?.access_token) {
      await Redis.set(
        "twitchToken",
        JSON.stringify({
          token: data.access_token,
          expiresAt: new Date(new Date().getTime() + data.expires_in),
        })
      );
      return "Bearer " + data?.access_token;
    }
  }

  throw new Error("No token found!");
}

export default {
  verifyJwt,
  laxVerifyJwt,
  verifyAgainstTwitch,
};
