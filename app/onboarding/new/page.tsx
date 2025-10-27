import OnboardingNewWrapper from "@/components/onboarding/new-wrapper";
import { currentUser } from "@/lib/auth";

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function OnBoardingNew({ searchParams }: Props) {
  const user = await currentUser();
  const isAuthenticated = !!(user && user.id);

  const type = Array.isArray(searchParams?.type)
    ? searchParams?.type[0]
    : searchParams?.type;

  const creationType =
    type === "ai-guided" || type === "manual" ? type : "manual";

  return (
    <OnboardingNewWrapper
      creationType={creationType}
      isAuthenticated={isAuthenticated}
    />
  );
}
