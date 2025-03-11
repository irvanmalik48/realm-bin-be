import Elysia from "elysia";

import { postOnboarding } from "../app/onboarding.usecase";
import { postPaste } from "../app/post-paste.usecase";

export interface IPostRequestBody {
  content: string;
}

export const PostController = new Elysia()
  .post("/post", (req) => postPaste((req.body as IPostRequestBody).content))
  .get("/post", () => postOnboarding());
