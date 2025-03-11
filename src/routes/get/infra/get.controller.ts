import Elysia from "elysia";

import { getOnboarding } from "../app/onboarding.usecase";
import { getById } from "../app/get-by-id.usecase";

export const GetController = new Elysia()
  .get("/get", () => getOnboarding())
  .get("/get/:id", (req) => getById(req.params.id));
