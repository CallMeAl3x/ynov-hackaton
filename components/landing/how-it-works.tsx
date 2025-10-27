import { BookText, Users2, Sparkles, Rocket } from "lucide-react";

const steps = [
  {
    icon: BookText,
    number: "01",
    title: "Définissez votre univers",
    description:
      "Choisissez le thème, les personnages et le cadre de votre histoire. Notre IA vous guide étape par étape.",
  },
  {
    icon: Sparkles,
    title: "L'IA génère votre histoire",
    number: "02",
    description:
      "Notre intelligence artificielle crée le premier épisode en fonction de vos choix et préférences.",
  },
  {
    icon: Users2,
    number: "03",
    title: "Partagez avec la communauté",
    description:
      "Publiez votre histoire et recevez des retours de milliers de lecteurs passionnés.",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Continuez l'aventure",
    description:
      "Créez de nouveaux épisodes, gagnez de l'XP et devenez un auteur reconnu.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Créez votre première histoire en 4 étapes simples
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Hidden on mobile */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-2xl border-2 border-gray-100 hover:border-purple-200 transition-colors h-full">
                  {/* Number Badge */}
                  <div className="relative inline-block mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
