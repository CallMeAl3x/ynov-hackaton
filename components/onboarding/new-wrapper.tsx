"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AIGuidedCreation } from "@/components/onboarding/ai-guided-creation";
import { ManualStorySetup } from "@/components/onboarding/manual-story-setup";
import { ControlLevelChoice } from "@/components/onboarding/control-level-choice";

type Props = {
  creationType: "ai-guided" | "manual" | null;
  isAuthenticated: boolean;
};

export default function OnboardingNewWrapper({
  creationType: initialCreationType,
  isAuthenticated,
}: Props) {
  const router = useRouter();
  const [creationType, setCreationType] = useState<
    "ai-guided" | "manual" | null
  >(initialCreationType);

  const handleChoose = (choice: "ai-guided" | "manual") => {
    // Update URL with the type parameter
    router.push(`/onboarding/new?type=${choice}`);
    setCreationType(choice);
  };

  const handleBack = () => {
    if (creationType) {
      setCreationType(null);
    } else {
      router.back();
    }
  };

  const handleStoryCreated = (storyId: string | null) => {
    if (!storyId) return;

    // Redirect to AI review page for AI-guided creation, or setup for manual
    if (creationType === "ai-guided") {
      router.push(`/story/${storyId}/ai-review`);
    } else {
      router.push(`/story/${storyId}/setup`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Show choice screen if no type selected yet */}
        {!creationType ? (
          <>
            {/* Header */}
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
                Créez Votre Première Histoire
              </h1>
              <p className="text-center text-gray-600 max-w-2xl mx-auto">
                Quel niveau de contrôle souhaitez-vous sur la création de votre
                histoire ?
              </p>
            </div>

            {/* Main Content */}
            <div>
              <ControlLevelChoice onChoose={handleChoose} />
            </div>

            {/* Footer Info */}
            <div className="mt-12 text-center text-gray-500 text-sm">
              <p>
                Aucun compte nécessaire pour créer. Vous pouvez enregistrer
                votre histoire une fois terminée.
              </p>
            </div>
          </>
        ) : (
          <>
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
                  ? "Votre histoire sera enregistrée sur votre compte."
                  : "Vous devrez créer un compte pour enregistrer votre histoire."}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
