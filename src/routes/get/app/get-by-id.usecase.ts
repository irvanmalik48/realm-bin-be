import { GetPasteRepository } from "../infra/get.repository";
import { ElysiaFile } from "elysia";

export const getById = async (
  id: string,
  type: "text" | "file" | undefined,
  password: string | undefined
): Promise<string | ElysiaFile> => {
  return await GetPasteRepository.get(id, type, password);
};
