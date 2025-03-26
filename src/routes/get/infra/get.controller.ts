import Elysia from "elysia";

import { getOnboarding } from "../app/onboarding.usecase";
import { getById } from "../app/get-by-id.usecase";

export const GetController = new Elysia({
  name: "Get Controller",
})
  .get("/get", () => getOnboarding())
  .get("/get/:id", (req) =>
    getById(
      req.params.id,
      req.query.type as "text" | "file" | undefined,
      req.query.password
    )
  );
