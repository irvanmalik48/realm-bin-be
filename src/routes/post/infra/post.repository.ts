import fastJson from "fast-json-stringify";
import { valkey } from "../../../shared/infrastructure/valkey";
import { createId } from "../../../shared/infrastructure/cuid2";
import { config } from "../../../../config";

export interface IPostOnboarding {
  title: string;
  description: string;
}

export interface IPostPaste {
  id: string;
  isLocked: "true" | "false";
  password?: string;
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

    if (config.environment === "development")
      console.log("[RB-E] `/v2/post` accessed. Onboarding message sent.");

    return message;
  }

  static async post(
    paste: string,
    isLocked: "true" | "false",
    password: string | undefined
  ): Promise<string> {
    const postPasteSchema = fastJson({
      title: "Post Paste Schema",
      type: "object",
      properties: {
        id: { type: "string" },
        isLocked: { type: "string" },
        password: { type: "string" },
        paste: { type: "string" },
      },
    });

    let bcryptHash: string | undefined;

    const postErrorSchema = fastJson({
      title: "Post Error Schema",
      type: "object",
      properties: {
        err: { type: "string" },
        message: { type: "string" },
      },
    });

    const pasteToDBSchema = fastJson({
      title: "Paste to DB Schema",
      type: "object",
      properties: {
        paste: { type: "string" },
        isLocked: { type: "string" },
        password: { type: "string" },
      },
    });

    if (isLocked === "true" && !password) {
      const message = postErrorSchema({
        err: "Password is required",
        message: "Password is required if isLocked is true.",
      });

      if (config.environment === "development")
        console.log("[RB-E] `/v2/post` accessed. Error message sent.");

      return message;
    }

    if (isLocked === "false" && password) {
      const message = postErrorSchema({
        err: "Password is not required",
        message: "If you want to lock the paste, set isLocked to true.",
      });

      if (config.environment === "development")
        console.log("[RB-E] `/v2/post` accessed. Error message sent.");

      return message;
    }

    if (isLocked === "true" && password) {
      if (password.length < 8) {
        const message = postErrorSchema({
          err: "Password is too short",
          message: "Password must be at least 8 characters.",
        });

        if (config.environment === "development")
          console.log("[RB-E] `/v2/post` accessed. Error message sent.");

        return message;
      }

      if (password.length > 64) {
        const message = postErrorSchema({
          err: "Password is too long",
          message: "Password must be at most 64 characters. I",
        });

        if (config.environment === "development")
          console.log("[RB-E] `/v2/post` accessed. Error message sent.");

        return message;
      }

      bcryptHash = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 12,
      });
    }

    const pasteToDB = pasteToDBSchema({
      paste,
      isLocked,
      password: bcryptHash || "",
    });

    const id = createId();
    const res = await valkey.set(id, pasteToDB, "EX", 7 * 24 * 60 * 60);

    if (!res) {
      const message = postErrorSchema({
        err: "Internal Server Error",
        message: "Failed to save paste to database.",
      });

      if (config.environment === "development")
        console.log("[RB-E] `/v2/post` accessed. Error message sent.");

      return message;
    }

    const message = postPasteSchema({
      id,
      paste,
      isLocked,
      password: bcryptHash || "",
    });

    if (config.environment === "development")
      console.log("[RB-E] `/v2/post` accessed. Paste sent.");

    return message;
  }
}
