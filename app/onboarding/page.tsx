"use client";

import { useRouter } from "next/navigation";
import { ControlLevelChoice } from "@/components/onboarding/control-level-choice";

const OnBoarding = () => {
  const router = useRouter();

  const handleControlChoice = (choice: "ai-guided" | "manual") => {
    // Navigate to /onboarding/new with the choice as a query parameter
    router.push(`/onboarding/new?type=${choice}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-center mb-2">
            Create Your First Story
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            How much control do you want over your story creation?
          </p>
        </div>

        {/* Main Content */}
        <ControlLevelChoice onChoose={handleControlChoice} />

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            No account needed to create. You can save your story after you're
            done.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnBoarding;
