import fastJson from "fast-json-stringify";
import { valkey } from "../../../shared/infrastructure/valkey";

export interface IGetOnboarding {
  title: string;
  description: string;
}

export interface IGetPaste {
  id: string;
  paste: string;
}

export interface IGetError {
  error: string;
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

    if (process.env.NODE_ENV === "development")
      console.log("[RB-E] `/v2/get` accessed. Onboarding message sent.");

    return message;
  }

  static async get(id: string): Promise<string> {
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
        error: { type: "string" },
      },
    });

    const res = await valkey.get(id);

    if (!res) {
      if (process.env.NODE_ENV === "development")
        console.log(`[RB-E] \`/v2/get/${id}\` accessed. Paste not found.`);

      return getErrorSchema<IGetError>({ error: "Paste not found." });
    }

    const message = getPasteSchema<IGetPaste>({
      id,
      paste: res,
    });

    if (process.env.NODE_ENV === "development")
      console.log(`[RB-E] \`/v2/get/${id}\` accessed. Paste sent.`);

    return message;
  }
}
