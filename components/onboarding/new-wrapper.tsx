"use client";

import { useRouter } from "next/navigation";
import { AIGuidedCreation } from "@/components/onboarding/ai-guided-creation";
import { ManualStorySetup } from "@/components/onboarding/manual-story-setup";

type Props = {
  creationType: "ai-guided" | "manual";
  isAuthenticated: boolean;
};

export default function OnboardingNewWrapper({
  creationType,
  isAuthenticated,
}: Props) {
  const router = useRouter();

  const handleBack = () => router.back();

  const handleStoryCreated = (storyId: string | null) => {
    if (!storyId) return;
    router.push(`/story/${storyId}/setup`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          {creationType === "ai-guided" && (
            <AIGuidedCreation
              onBack={handleBack}
              onStoryCreated={handleStoryCreated}
              isAuthenticated={isAuthenticated}
            />
          )}

          {creationType === "manual" && (
            <ManualStorySetup
              onBack={handleBack}
              onStoryCreated={handleStoryCreated}
              isAuthenticated={isAuthenticated}
            />
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            {isAuthenticated
              ? "Your story will be saved to your account."
              : "You'll need to create an account to save your story."}
          </p>
        </div>
      </div>
    </div>
  );
}
