import { PostPasteRepository } from "../infra/post.repository";

export const postOnboarding = (): string => {
  return PostPasteRepository.onboarding();
};
