"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Sliders } from "lucide-react";

interface ControlLevelChoiceProps {
  onChoose: (controlLevel: "ai-guided" | "manual") => void;
  isLoading?: boolean;
}

export const ControlLevelChoice = ({ onChoose, isLoading = false }: ControlLevelChoiceProps) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI-Guided Path */}
        <Card
          className="p-6 cursor-pointer hover:border-sky-500 hover:shadow-lg transition-all border-2 hover:border-sky-400"
          onClick={() => !isLoading && onChoose("ai-guided")}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-sky-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900">Création Assistée par IA</h2>
              <p className="text-gray-600 text-sm">
                Laissez notre IA créer votre histoire. Décrivez simplement votre idée et nous générerons le reste !
              </p>
            </div>

            <div className="w-full space-y-2 text-left text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-sky-600 rounded-full" />
                <span>Décrivez votre concept</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-sky-600 rounded-full" />
                <span>L'IA génère l'histoire</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-sky-600 rounded-full" />
                <span>Vérifier et publier</span>
              </div>
            </div>

            <Button
              className="w-full bg-sky-600 hover:bg-sky-700 mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Chargement..." : "Laissez l'IA créer"}
            </Button>
          </div>
        </Card>

        {/* Manual Path */}
        <Card
          className="p-6 cursor-pointer hover:border-sky-500 hover:shadow-lg transition-all border-2 hover:border-sky-400"
          onClick={() => !isLoading && onChoose("manual")}
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
              <Sliders className="w-6 h-6 text-sky-600" />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900">Contrôle Total</h2>
              <p className="text-gray-600 text-sm">
                Construisez votre histoire étape par étape. Configurez les personnages, les thèmes et les détails du scénario à votre manière.
              </p>
            </div>

            <div className="w-full space-y-2 text-left text-sm">
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-sky-600 rounded-full" />
                <span>Définir les détails de l'histoire</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-sky-600 rounded-full" />
                <span>Créer des personnages</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-sky-600 rounded-full" />
                <span>Écrire des épisodes</span>
              </div>
            </div>

            <Button
              className="w-full bg-sky-600 hover:bg-sky-700 mt-4"
              disabled={isLoading}
            >
              {isLoading ? "Chargement..." : "Je construis moi-même"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
