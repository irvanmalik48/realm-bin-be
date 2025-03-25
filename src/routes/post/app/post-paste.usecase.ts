import { PostPasteRepository } from "../infra/post.repository";

export const postPaste = async (
  content: string,
  isLocked: "true" | "false",
  password: string | undefined
): Promise<string> => {
  return await PostPasteRepository.post(content, isLocked, password);
};
