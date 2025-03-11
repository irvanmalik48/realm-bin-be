import fastJson from "fast-json-stringify";
import { valkey } from "../../../shared/infrastructure/valkey";
import { createId } from "@paralleldrive/cuid2";

export interface IPostOnboarding {
  title: string;
  description: string;
}

export interface IPostPaste {
  id: string;
  paste: string;
}

export class PostPasteRepository {
  static onboarding(): string {
    const onboardingSchema = fastJson({
      title: "Onboarding Schema",
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
    });

    const message = onboardingSchema({
      title: "Post Paste Endpoint",
      description: "POST JSON to this endpoint to send paste.",
    });

    if (process.env.NODE_ENV === "development")
      console.log("[RB-E] `/v2/post` accessed. Onboarding message sent.");

    return message;
  }

  static async post(paste: string): Promise<string> {
    const postPasteSchema = fastJson({
      title: "Post Paste Schema",
      type: "object",
      properties: {
        id: { type: "string" },
        paste: { type: "string" },
      },
    });

    const id = createId();
    const res = await valkey.set(id, paste, "EX", 7 * 24 * 60 * 60);

    if (!res) {
      const message = postPasteSchema({
        id: "",
        paste: "",
      });

      if (process.env.NODE_ENV === "development")
        console.log("[RB-E] `/v2/post` accessed. Error message sent.");

      return message;
    }

    const message = postPasteSchema({
      id,
      paste,
    });

    if (process.env.NODE_ENV === "development")
      console.log("[RB-E] `/v2/post` accessed. Paste sent.");

    return message;
  }
}
