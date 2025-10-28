import OnboardingNewWrapper from "@/components/onboarding/new-wrapper";
import { currentUser } from "@/lib/auth";

type Props = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function OnBoardingNew({ searchParams }: Props) {
  const user = await currentUser();
  const isAuthenticated = !!(user && user.id);

  const params = await searchParams;
  const type = Array.isArray(params?.type)
    ? params?.type[0]
    : params?.type;

  const creationType =
    type === "ai-guided" || type === "manual" ? type : "manual";

  return (
    <OnboardingNewWrapper
      creationType={creationType}
      isAuthenticated={isAuthenticated}
    />
  );
}
