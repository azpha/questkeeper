import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ZodError } from "zod";
import Auth from "./services/Auth";

// routes
import SettingsRouter from "./routes/SettingsRouter";
import AuthRouter from "./routes/AuthRouter";
import IgdbRouter from "./routes/IgdbRouter";
import GamesRouter from "./routes/GameRouter";

const app = express();
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

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: 200,
  });
});

// routes
app.use("/settings", SettingsRouter);
app.use("/auth", AuthRouter);
app.use("/igdb", IgdbRouter);
app.use("/games", GamesRouter);

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

app.listen(3001, async () => {
  console.log("[Server] API server has started");
});
