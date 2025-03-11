import { GetPasteRepository } from "../infra/get.repository";

export const getOnboarding = (): string => {
  return GetPasteRepository.onboarding();
};
