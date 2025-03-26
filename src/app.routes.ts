import Elysia from "elysia";

import { RootController } from "./routes/static/infra/static.controller";
import { GetController } from "./routes/get/infra/get.controller";
import { PostController } from "./routes/post/infra/post.controller";
import { config } from "../config";

const routes = new Elysia({ prefix: config.prefix })
  .use(RootController)
  .use(GetController)
  .use(PostController);

export { routes as AppRoutes };
