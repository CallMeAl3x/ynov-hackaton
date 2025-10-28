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
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
            Créez Votre Première Histoire
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto">
            Quel niveau de contrôle souhaitez-vous sur la création de votre histoire ?
          </p>
        </div>

        {/* Main Content */}
        <ControlLevelChoice onChoose={handleControlChoice} />

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Aucun compte nécessaire pour créer. Vous pouvez enregistrer votre histoire une fois terminée.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnBoarding;
