import { PutPasteRepository } from "../infra/put.repository";

export const putPaste = async (
  content: File,
  isLocked: "true" | "false",
  password: string | undefined
): Promise<string> => {
  return await PutPasteRepository.put(content, isLocked, password);
};
