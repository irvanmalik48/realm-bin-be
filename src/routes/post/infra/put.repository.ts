import fastJson from "fast-json-stringify";
import { valkey } from "../../../shared/infrastructure/valkey";
import { createId } from "../../../shared/infrastructure/cuid2";
import { config } from "../../../../config";

export interface IPutPaste {
  id: string;
  isLocked: "true" | "false";
  password?: string;
  paste: File;
}

export class PutPasteRepository {
  static async handleFile(id: string, paste: File) {
    const file = new Blob([paste], { type: paste.type });
    const extension = paste.name.split(".")[paste.name.split(".").length - 1];
    const filePath = `${config.defaultPasteFolder}/${id}.${extension}`;
    const saving = await Bun.write(filePath, file, {
      createPath: false,
    }).catch((err) => {
      console.error(err);
      return -1;
    });

    return {
      path: filePath,
      status: saving,
    };
  }

  static async put(
    paste: File,
    isLocked: "true" | "false",
    password: string | undefined
  ): Promise<string> {
    const putPasteSchema = fastJson({
      title: "Put Paste Schema",
      type: "object",
      properties: {
        id: { type: "string" },
        isLocked: { type: "string" },
        password: { type: "string" },
        paste: { type: "string" },
      },
    });

    let bcryptHash: string | undefined;

    const putErrorSchema = fastJson({
      title: "Put Error Schema",
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

    if (paste.size > config.maxFileSize) {
      const message = putErrorSchema({
        err: "File too large",
        message: `File size must be at most ${
          config.maxFileSize / 1024 / 1024
        } MB.`,
      });

      if (config.environment === "development")
        console.log("[RB-E] `/v2/post` accessed. Error message sent.");

      return message;
    }

    if (isLocked === "true" && !password) {
      const message = putErrorSchema({
        err: "Password is required",
        message: "Password is required if isLocked is true.",
      });

      if (config.environment === "development")
        console.log("[RB-E] `/v2/post` accessed. Error message sent.");

      return message;
    }

    if (isLocked === "false" && password) {
      const message = putErrorSchema({
        err: "Password is not required",
        message: "If you want to lock the paste, set isLocked to true.",
      });

      if (config.environment === "development")
        console.log("[RB-E] `/v2/post` accessed. Error message sent.");

      return message;
    }

    if (isLocked === "true" && password) {
      if (password.length < 8) {
        const message = putErrorSchema({
          err: "Password is too short",
          message: "Password must be at least 8 characters.",
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

    const id = createId();

    const handleFile = await this.handleFile(id, paste);

    if (handleFile.status === -1) {
      const message = putErrorSchema({
        err: "Internal Server Error",
        message: "Failed to save file. Please try again later.",
      });

      if (config.environment === "development")
        console.log("[RB-E] `/v2/post` accessed. Error message sent.");

      return message;
    }

    const pasteToDB = pasteToDBSchema({
      paste: `is-file-paste:::${handleFile.path}`,
      isLocked,
      password: bcryptHash || "",
    });

    const res = await valkey.set(id, pasteToDB);
    await valkey.set(`${id}-shadow`, "", "EX", 7 * 24 * 60 * 60);

    if (!res) {
      const message = putErrorSchema({
        err: "Internal Server Error",
        message: "Failed to save paste to database.",
      });

      if (config.environment === "development")
        console.log("[RB-E] `/v2/post` accessed. Error message sent.");

      return message;
    }

    const message = putPasteSchema({
      id: id,
      paste: `is-file-paste:::${handleFile.path}`,
      isLocked,
      password: bcryptHash || "",
    });

    if (config.environment === "development")
      console.log("[RB-E] `/v2/post` accessed. Paste sent.");

    return message;
  }
}
