import { ZodError } from "zod";
import Schemas from "./ZodSchemas";
import dotenv from "dotenv";
dotenv.config();

function createEnv() {
  try {
    const env = Schemas.environment.parse(process.env);
    return env;
  } catch (e) {
    if (e instanceof ZodError) {
      const missingErrVars = e.errors.map((err) => err.path.join("."));
      console.error("Invalid environment vars, check your config!", e.format());
      throw new Error(
        `Missing or invalid environment variables: ${missingErrVars.join(", ")}`
      );
    }
  }
}

export default createEnv();
