import { createClient } from "redis";
import Environment from "../utils/Environment";

const client = createClient({
  url: Environment!.REDIS_URL || undefined,
});
client.connect();

export default client;
