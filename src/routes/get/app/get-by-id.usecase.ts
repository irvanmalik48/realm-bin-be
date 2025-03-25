import { GetPasteRepository } from "../infra/get.repository";

export const getById = async (
  id: string,
  password: string | undefined
): Promise<string> => {
  return await GetPasteRepository.get(id, password);
};
