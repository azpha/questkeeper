import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ZodError } from "zod";
import path from "path";

// routes
import AuthRouter from "./routes/AuthRouter";
import IgdbRouter from "./routes/IgdbRouter";
import GamesRouter from "./routes/GameRouter";
import Environment from "./utils/Environment";

const app = express();
const FRONTEND_APP_DIST_PATH = path.join(__dirname, "../../frontend/dist");
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("trust proxy", 1);
app.disable("x-powered-by");

if (Environment!.NODE_ENV !== "development") {
  app.use(express.static(FRONTEND_APP_DIST_PATH));
  app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(FRONTEND_APP_DIST_PATH, "index.html"));
  });
} else {
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
      status: 200,
    });
  });
}

// routes
app.use("/api/images", express.static(path.join(__dirname, "../files")));
app.use("/api/auth", AuthRouter);
app.use("/api/igdb", IgdbRouter);
app.use("/api/games", GamesRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV === "development") console.error(err);

  if (err instanceof ZodError) {
    res.status(400).json({
      status: 400,
      message: "Failed to validate content, check your request body",
      errors: err.errors,
    });
  } else {
    res.status(500).json({
      status: 500,
      message: "Something unexpected went wrong :(",
      error: err.message,
    });
  }
});
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    message: "Resource not found on this server",
  });
});

app.listen(3000, async () => {
  console.log("[Server] API server has started");
});
