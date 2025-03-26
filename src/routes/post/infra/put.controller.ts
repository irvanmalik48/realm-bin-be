import Elysia, { t } from "elysia";

import { putPaste } from "../app/put-paste.usecase";

export const PutController = new Elysia({
  name: "Post PUT Controller",
}).put(
  "/post",
  ({ body }) => putPaste(body.file, body.isLocked ?? "false", body.password),
  {
    body: t.Object({
      file: t.File(),
      isLocked: t.Optional(t.Union([t.Literal("true"), t.Literal("false")])),
      password: t.Optional(t.String()),
    }),
    parse: "formdata",
  }
);
