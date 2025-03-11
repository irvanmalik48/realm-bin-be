import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import fastJson from "fast-json-stringify";
import { AppRoutes } from "./app.routes";

const app = new Elysia()
  .use(
    cors({
      origin: /.*irvanma\.eu\.org$/, // Change this if you want to self host
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

    if (Bun.env.RUNNING_ENV === "development")
      console.log("[RB-E] `/` accessed. You shouldn't be here.");

    return message;
  });

app.listen(9944, () => {
  console.log(`[RB-E] Server is running on port 9944.`);
});

export { app };
