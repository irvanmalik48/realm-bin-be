import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import fastJson from "fast-json-stringify";
import { AppRoutes } from "./app.routes";
import { config } from "../config";

const app = new Elysia()
  .use(
    cors({
      origin:
        (config.environment as string) === "production"
          ? config.corsDomainRegex
          : "localhost",
    })
  )
  .use(AppRoutes)
  .get("/", () => {
    const wrongRootSchema = fastJson({
      title: "You are in the wrong place",
      type: "object",
      properties: {
        prefix: { type: "string" },
        message: { type: "string" },
        visit: { type: "string" },
      },
    });

    const message = wrongRootSchema({
      prefix: "v2",
      message: "You are in the wrong root route. Please visit `/v2`.",
      visit: "/v2",
    });

    if (config.environment === "development")
      console.log("[RB-E] `/` accessed. You shouldn't be here.");

    return message;
  });

app.listen(config.port, () => {
  console.log(`[RB-E] Server is running on port 9944.`);
});

export { app };
