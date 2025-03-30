import Elysia, { t } from "elysia";

import { postPaste } from "../app/post-paste.usecase";

export const PostController = new Elysia({
  name: "Post POST Controller",
}).post(
  "/post",
  ({ body }) =>
    postPaste(body.content, body.isLocked ?? "false", body.password),
  {
    body: t.Object({
      content: t.String(),
      isLocked: t.Optional(t.Union([t.Literal("true"), t.Literal("false")])),
      password: t.Optional(t.String()),
    }),
  }
);
