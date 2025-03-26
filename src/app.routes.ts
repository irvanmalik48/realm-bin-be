import Elysia from "elysia";

import { RootController } from "./routes/static/infra/static.controller";
import { GetController } from "./routes/get/infra/get.controller";
import { PostOnboardingController } from "./routes/post/infra/onboarding.controller";
import { PostController } from "./routes/post/infra/post.controller";
import { PutController } from "./routes/post/infra/put.controller";
import { config } from "../config";

const routes = new Elysia({ prefix: config.prefix })
  .use(RootController)
  .use(GetController)
  .use(PostOnboardingController)
  .use(PostController)
  .use(PutController);

export { routes as AppRoutes };
