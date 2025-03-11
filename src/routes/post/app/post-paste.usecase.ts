import { PostPasteRepository } from "../infra/post.repository";

export const postPaste = async (content: string): Promise<string> => {
  return await PostPasteRepository.post(content);
};
