import Elysia from "elysia";

import { postOnboarding } from "../app/onboarding.usecase";

export const PostOnboardingController = new Elysia({
  name: "Post GET Controller",
}).get("/post", () => postOnboarding());
