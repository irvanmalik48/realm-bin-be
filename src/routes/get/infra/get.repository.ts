import fastJson from "fast-json-stringify";
import { valkey } from "../../../shared/infrastructure/valkey";
import { config } from "../../../../config";
import destr from "destr";
import type { IPostPaste } from "../../post/infra/post.repository";
import { ElysiaFile, file } from "elysia";

export interface IGetOnboarding {
  title: string;
  description: string;
}

export interface IGetPaste {
  id: string;
  paste: string;
}

export interface IGetError {
  err: string;
  message: string;
}

export class GetPasteRepository {
  static onboarding(): string {
    const onboardingSchema = fastJson({
      title: "Onboarding Schema",
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
      },
    });

    const message = onboardingSchema<IGetOnboarding>({
      title: "Get Paste Endpoint",
      description: "Yeah, use :id slug to get the paste by ID.",
    });

    if (config.environment === "development")
      console.log("[RB-E] `/v2/get` accessed. Onboarding message sent.");

    return message;
  }

  static async get(
    id: string,
    type: "text" | "file" | undefined,
    password: string | undefined
  ): Promise<string | ElysiaFile> {
    const getPasteSchema = fastJson({
      title: "Get Paste Schema",
      type: "object",
      properties: {
        id: { type: "string" },
        paste: { type: "string" },
      },
    });

    const getErrorSchema = fastJson({
      title: "Get Error Schema",
      type: "object",
      properties: {
        err: { type: "string" },
        message: { type: "string" },
      },
    });

    const res = await valkey.get(id);

    if (!res) {
      if (config.environment === "development")
        console.log(`[RB-E] \`/v2/get/${id}\` accessed. Paste not found.`);

      return getErrorSchema<IGetError>({
        err: "Paste not found",
        message: "The paste you are looking for is not found.",
      });
    }

    const content = destr<Omit<IPostPaste, "id">>(res);

    if (content.isLocked === "true") {
      if (config.environment === "development")
        console.log(
          `[RB-E] \`/v2/get/${id}\` accessed. Paste is locked. Commencing password check.`
        );

      if (!password) {
        if (config.environment === "development")
          console.log(
            `[RB-E] \`/v2/get/${id}\` accessed. Paste is locked. Password not provided.`
          );

        return getErrorSchema<IGetError>({
          err: "Paste is locked",
          message: "The paste you are looking for is locked.",
        });
      }

      const compare = await Bun.password.verify(
        password,
        content.password as string
      );

      if (!compare) {
        if (config.environment === "development")
          console.log(
            `[RB-E] \`/v2/get/${id}\` accessed. Paste is locked. Password incorrect.`
          );

        return getErrorSchema<IGetError>({
          err: "Password incorrect",
          message: "The password you provided is incorrect.",
        });
      }
    }

    const message = getPasteSchema<IGetPaste>({
      id,
      paste: content.paste,
    });

    if (config.environment === "development")
      console.log(`[RB-E] \`/v2/get/${id}\` accessed. Paste sent.`);

    if (type === "file") {
      const path = content.paste.split(":::")[1];
      const res = file(path);

      if (!file) {
        if (config.environment === "development")
          console.log(
            `[RB-E] \`/v2/get/${id}\` accessed. Paste is file-based. File not found.`
          );

        return getErrorSchema<IGetError>({
          err: "File not found",
          message:
            "The file you are looking for is not found, but the paste is available somehow (weird).",
        });
      }

      return res;
    }

    return message;
  }
}
