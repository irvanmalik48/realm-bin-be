import fastJson from "fast-json-stringify";
import { config } from "../../../../config";

export interface IPostOnboarding {
  title: string;
  description: string;
  rules: {
    post: {
      method: string;
      accepts: string[];
      isLocked: {
        optional: boolean;
        type: string;
        password: {
          required: boolean;
          min: number;
        };
        description: string;
      };
      description: string;
    };
    put: {
      method: string;
      accepts: string[];
      isLocked: {
        optional: boolean;
        type: string;
        password: {
          required: boolean;
          min: number;
        };
        description: string;
      };
      description: string;
    };
  };
}

export class PostOnboardingRepository {
  static onboarding(): string {
    const onboardingSchema = fastJson({
      title: "Onboarding Schema",
      type: "object",
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        rules: {
          type: "object",
          properties: {
            post: {
              type: "object",
              properties: {
                method: { type: "string" },
                accepts: { type: "array", items: { type: "string" } },
                isLocked: {
                  type: "object",
                  properties: {
                    optional: { type: "boolean" },
                    type: { type: "string" },
                    password: {
                      type: "object",
                      properties: {
                        required: { type: "boolean" },
                        min: { type: "number" },
                      },
                    },
                    description: { type: "string" },
                  },
                },
                description: { type: "string" },
              },
            },
            put: {
              type: "object",
              properties: {
                method: { type: "string" },
                accepts: { type: "array", items: { type: "string" } },
                isLocked: {
                  type: "object",
                  properties: {
                    optional: { type: "boolean" },
                    type: { type: "string" },
                    password: {
                      type: "object",
                      properties: {
                        required: { type: "boolean" },
                        min: { type: "number" },
                      },
                    },
                    description: { type: "string" },
                  },
                },
                description: { type: "string" },
              },
            },
          },
        },
      },
    });

    const message = onboardingSchema<IPostOnboarding>({
      title: "Post Paste Endpoint",
      description:
        "You can post a paste/file by sending a POST/PUT request to this endpoint.",
      rules: {
        post: {
          method: "POST",
          accepts: [
            "application/json",
            "application/x-www-form-urlencoded",
            "multipart/form-data",
          ],
          isLocked: {
            optional: true,
            type: "string",
            password: {
              required: true,
              min: 8,
            },
            description:
              "If isLocked is true, a password is required. Password must be at least 8 characters long. If you don't want to lock the paste, set isLocked to false or don't include it at all.",
          },
          description: `This endpoint is reserved for text-only paste. There's a limit of ${config.maxPasteLength} characters per paste. It has a 7-day expiration time.`,
        },
        put: {
          method: "PUT",
          accepts: ["multipart/form-data"],
          isLocked: {
            optional: true,
            type: "string",
            password: {
              required: true,
              min: 8,
            },
            description:
              "If isLocked is true, a password is required. Password must be at least 8 characters long. If you don't want to lock the paste, set isLocked to false or don't include it at all.",
          },
          description: `This endpoint is reserved for file-based paste. There's a limit of ${
            config.maxFileSize / 1024 / 1024
          }MB of size per paste. It has a 7-day expiration time.`,
        },
      },
    });

    if (config.environment === "development")
      console.log("[RB-E] `/v2/post` accessed. Onboarding message sent.");

    return message;
  }
}
