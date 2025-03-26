import { PostOnboardingRepository } from "../infra/onboarding.repository";

export const postOnboarding = (): string => {
  return PostOnboardingRepository.onboarding();
};
