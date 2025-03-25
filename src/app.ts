import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
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
  .get("/", ({ redirect }) => {
    return redirect("/v2", 308);
  });

app.listen(config.port, () => {
  console.log(`[RB-E] Server is running on port 9944.`);
});

export { app };
