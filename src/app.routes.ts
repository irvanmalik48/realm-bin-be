import Elysia from "elysia";

import { RootController } from "./routes/static/infra/static.controller";
import { GetController } from "./routes/get/infra/get.controller";
import { PostController } from "./routes/post/infra/post.controller";
import { config } from "../config";
import { PutController } from "./routes/post/infra/put.controller";
import { PostOnboardingController } from "./routes/post/infra/onboarding.controller";

const routes = new Elysia({ prefix: config.prefix })
  .use(RootController)
  .use(GetController)
  .use(PostController)
  .use(PutController)
  .use(PostOnboardingController);

export { routes as AppRoutes };
