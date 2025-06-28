import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Database from "../services/Database";
import Schemas from "../utils/ZodSchemas";
import Environment from "../utils/Environment";
import type { Request, Response, NextFunction } from "express";

async function RegisterAccount(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    Schemas.auth.register.parse(req.body);

    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const user = await Database.user.create({
      data: {
        email: req.body.email,
        name: req.body.name,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      Environment!.JWT_SECRET,
      { expiresIn: "48h" }
    );

    res.setHeader(
      "Set-Cookie",
      `authToken=${token}; HttpOnly; Secure; Domain .${Environment!.HOSTNAME}; SameSite=Strict; Path=/; Max-Age=172800;`
    );

    res.status(200).json({
      status: 200,
      user,
      token,
    });
  } catch (e) {
    next(e);
  }
}

async function LogIn(req: Request, res: Response, next: NextFunction) {
  try {
    Schemas.auth.login.parse(req.body);

    const user = await Database.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (!user) {
      res.status(404).json({
        status: 404,
        message: "User not found",
      });
      return;
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );
    if (!validPassword) {
      res.status(401).json({
        status: 401,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      Environment!.JWT_SECRET,
      { expiresIn: "48h" }
    );

    const cookie =
      Environment!.NODE_ENV === "development"
        ? `authToken=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=172800;`
        : `authToken=${token}; HttpOnly; Secure; Domain .${Environment!.HOSTNAME}; SameSite=Strict; Path=/; Max-Age=172800;`;
    res.setHeader("Set-Cookie", cookie);

    res.status(200).json({
      status: 200,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (e) {
    next(e);
  }
}

async function LogOut(req: Request, res: Response, next: NextFunction) {
  try {
    const cookie =
      Environment!.NODE_ENV === "development"
        ? `authToken=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0;`
        : `authToken=; HttpOnly; Secure; Domain .${Environment!.HOSTNAME}; SameSite=Strict; Path=/; Max-Age=0;`;
    res.setHeader("Set-Cookie", cookie);

    res.status(200).json({
      status: 200,
    });
  } catch (e) {
    next(e);
  }
}

async function GetCurrentUser(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user) {
      const user = await Database.user.findFirst({
        where: {
          id: req.user?.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          games: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      res.status(200).json({
        status: 200,
        user,
      });
    } else {
      res.status(401).json({
        status: 401,
        message: "Invalid auth",
      });
    }
  } catch (e) {
    next(e);
  }
}

export default {
  RegisterAccount,
  LogIn,
  LogOut,
  GetCurrentUser,
};
