import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { AppRoutes } from "./app.routes";
import { config } from "../config";
import { welcomePage } from "./routes/static/app/welcome.usecase";
import { deleteExpiredFilesListener } from "./shared/listeners/pubsub";
import swagger from "@elysiajs/swagger";
import { DisableSwaggerController } from "./shared/infrastructure/disable-swagger";
import { rateLimit } from "elysia-rate-limit";
import { pluginGracefulServer } from "graceful-server-elysia";

const app = new Elysia()
  .use(
    cors({
      origin:
        (config.environment as string) === "production"
          ? config.corsDomainRegex
          : "localhost",
      methods: ["GET", "POST", "PUT"],
    })
  )
  .use(AppRoutes)
  .use(
    config.environment === "development"
      ? swagger({
          scalarConfig: {
            customCss: "",
          },
          documentation: {
            info: {
              title: "Realm Bin BE API",
              description: "API Documentation for Realm Bin BE.",
              version: "1.0.3",
              contact: {
                name: "Irvan Malik",
                url: "https://irvanma.eu.org",
                email: "me@irvanma.eu.org",
              },
              license: {
                name: "RCCL",
                url: "https://github.com/irvanmalik48/realm-bin-be/blob/main/LICENSE",
              },
            },
          },
          path: "/v2/swagger",
        })
      : DisableSwaggerController
  )
  .use(
    rateLimit({
      max: 25,
      errorResponse: JSON.stringify({
        err: "Rate Limit Exceeded",
        message: "You have exceeded the rate limit.",
      }),
    })
  )
  .get("/", ({ redirect }) => {
    if (config.prefix) {
      return redirect(`/${config.prefix}`, 308);
    } else {
      return welcomePage();
    }
  })
  .use(
    pluginGracefulServer({
      livenessEndpoint: "/v2/live",
      readinessEndpoint: "/v2/ready",
    })
  );

app.listen(config.port, () => {
  deleteExpiredFilesListener();
  console.log(`[RB-E] Server is running on port 9944.`);
});

export { app };
