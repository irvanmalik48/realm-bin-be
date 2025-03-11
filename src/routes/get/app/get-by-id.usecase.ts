import { GetPasteRepository } from "../infra/get.repository";

export const getById = async (id: string): Promise<string> => {
  return await GetPasteRepository.get(id);
};
