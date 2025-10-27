import { Sparkles, Users, TrendingUp, Heart, MessageSquare, Zap } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "IA Créative",
    description:
      "Notre IA vous guide dans la création de personnages, d'intrigues et de dialogues captivants.",
  },
  {
    icon: Zap,
    title: "Génération Rapide",
    description:
      "Créez des épisodes en quelques minutes grâce à notre moteur d'IA optimisé.",
  },
  {
    icon: Users,
    title: "Communauté Active",
    description:
      "Partagez vos histoires avec des milliers de lecteurs passionnés.",
  },
  {
    icon: Heart,
    title: "Likes & Favoris",
    description:
      "Recevez des retours de la communauté et suivez vos histoires préférées.",
  },
  {
    icon: MessageSquare,
    title: "Commentaires",
    description:
      "Échangez avec vos lecteurs et améliorez vos histoires ensemble.",
  },
  {
    icon: TrendingUp,
    title: "Système de Progression",
    description:
      "Gagnez de l'XP et des récompenses à chaque épisode publié.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Des outils puissants pour donner vie à vos idées et créer des
            histoires inoubliables
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
