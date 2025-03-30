import Elysia from "elysia";

import { getOnboarding } from "../app/onboarding.usecase";
import { getById } from "../app/get-by-id.usecase";

export const GetController = new Elysia({
  name: "Get Controller",
})
  .get("/get", () => getOnboarding())
  .get("/get/:id", ({ query, params }) => {
    const type = query.type ?? query.t ?? undefined;
    const password = query.password ?? query.p ?? undefined;

    return getById(params.id, type as "text" | "file" | undefined, password);
  });
