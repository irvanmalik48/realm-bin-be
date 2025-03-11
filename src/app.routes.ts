import Elysia from "elysia";

import { RootController } from "./routes/static/infra/static.controller";
import { GetController } from "./routes/get/infra/get.controller";
import { PostController } from "./routes/post/infra/post.controller";

const routes = new Elysia({ prefix: "v2" })
  .use(RootController)
  .use(GetController)
  .use(PostController);

export { routes as AppRoutes };
