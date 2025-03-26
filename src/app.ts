import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { AppRoutes } from "./app.routes";
import { config } from "../config";
import { welcomePage } from "./routes/static/app/welcome.usecase";

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
    if (config.prefix) {
      return redirect(`/${config.prefix}`, 308);
    } else {
      return welcomePage();
    }
  });

app.listen(config.port, () => {
  console.log(`[RB-E] Server is running on port 9944.`);
});

export { app };
