"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight, Trash2, Edit2, X } from "lucide-react";
import { deleteCharacter } from "@/actions/delete-character";
import { updateStory } from "@/actions/update-story";
import { getRoleLabel, getRoleBadgeColor } from "@/lib/role-utils";

interface Character {
  id: string;
  name: string;
  description: string;
  role: string;
}

interface Story {
  id: string;
  name: string;
  theme: string;
  subject: string;
  description?: string;
}

interface AIStoryReviewProps {
  story: Story;
  characters: Character[];
}

const PREDEFINED_THEMES = [
  { label: "Fantaisie", value: "fantasy" },
  { label: "Science-Fiction", value: "sci-fi" },
  { label: "Romance", value: "romance" },
  { label: "Mystère", value: "mystery" },
  { label: "Horreur", value: "horror" },
  { label: "Aventure", value: "adventure" },
  { label: "Drame", value: "drama" },
  { label: "Autre", value: "other" },
  { label: "Non défini", value: "undefined" }
];

// Map French theme names (from AI) to theme values
const FRENCH_TO_THEME_VALUE: Record<string, string> = {
  "fantaisie": "fantasy",
  "science-fiction": "sci-fi",
  "sci-fi": "sci-fi",
  "romance": "romance",
  "mystère": "mystery",
  "mystery": "mystery",
  "horreur": "horror",
  "aventure": "adventure",
  "drame": "drama",
  "autre": "other",
  "non défini": "undefined"
};

const mapThemeToValue = (theme: string): string => {
  const normalized = theme.toLowerCase().trim();
  return FRENCH_TO_THEME_VALUE[normalized] || theme;
};


export default function AIStoryReview({ story, characters }: AIStoryReviewProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [charList, setCharList] = useState<Character[]>(characters);

  // Map the theme from AI (might be in French) to the standard value
  const mappedTheme = mapThemeToValue(story.theme);
  const isCustomTheme = !PREDEFINED_THEMES.some(t => t.value === mappedTheme);

  const [selectedTheme, setSelectedTheme] = useState<string>(mappedTheme);
  const [customTheme, setCustomTheme] = useState<string>(isCustomTheme ? story.theme : "");
  const [showCustomTheme, setShowCustomTheme] = useState<boolean>(isCustomTheme);

  const handleDeleteCharacter = async (characterId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce personnage ?")) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await deleteCharacter(characterId);
      if (res?.success) {
        setCharList((prev) => prev.filter((c) => c.id !== characterId));
      } else {
        alert(res?.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
    if (theme === "custom") {
      setShowCustomTheme(true);
    } else {
      setShowCustomTheme(false);
      setCustomTheme("");
    }
  };

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      const themeToSave = showCustomTheme ? customTheme : selectedTheme;

      if (!themeToSave.trim()) {
        alert("Veuillez sélectionner ou entrer un thème");
        return;
      }

      // Update story theme
      await updateStory(story.id, { theme: themeToSave });
      router.push(`/story/${story.id}`);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du thème");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCharacters = () => {
    router.push(`/story/${story.id}/setup`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-4 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-18 h-18 bg-sky-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-sky-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Votre Histoire Générée</h1>
            <p className="text-gray-600 mt-1">
              Voici un aperçu de votre histoire et de ses personnages générés par l'IA
            </p>
          </div>
        </div>

        {/* Story Card */}
        <Card className="p-6 bg-gradient-to-br from-sky-50 to-transparent border-sky-200">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{story.name}</h2>
              <p className="text-gray-700 text-sm mb-4">{story.subject}</p>
              {story.description && (
                <div className="bg-white rounded-lg p-4 border border-sky-100">
                  <p className="text-gray-600 text-sm italic">"{story.description}"</p>
                </div>
              )}
            </div>

            {/* Theme Selection */}
            <div className="space-y-3 border-t border-sky-200 pt-6">
              <Label className="text-base font-semibold text-gray-900">
                Thème de l'Histoire
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {PREDEFINED_THEMES.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleThemeChange(theme.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      selectedTheme === theme.value && !showCustomTheme
                        ? "border-sky-600 bg-sky-50"
                        : "border-gray-200 hover:border-sky-300"
                    }`}
                    disabled={isLoading}
                  >
                    {theme.label}
                  </button>
                ))}
                <button
                  onClick={() => handleThemeChange("custom")}
                  className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                    showCustomTheme
                      ? "border-sky-600 bg-sky-50"
                      : "border-gray-200 hover:border-sky-300"
                  }`}
                  disabled={isLoading}
                >
                  Personnalisé
                </button>
              </div>

              {/* Custom Theme Input */}
              {showCustomTheme && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-sky-200 space-y-2">
                  <Label htmlFor="custom-theme" className="text-sm font-medium">
                    Entrez votre thème personnalisé
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom-theme"
                      value={customTheme}
                      onChange={(e) => setCustomTheme(e.target.value)}
                      placeholder="Ex: Cyberpunk, Steampunk, etc."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <button
                      onClick={() => handleThemeChange("other")}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Annuler le thème personnalisé"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Characters Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Personnages</h3>
            <span className="text-sm text-gray-600">
              {charList.length} personnage{charList.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid gap-4">
            {charList.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-gray-600">Aucun personnage généré</p>
              </Card>
            ) : (
              charList.map((character) => (
                <Card key={character.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-900">
                          {character.name}
                        </h4>
                        <Badge className={`${getRoleBadgeColor(character.role)} text-xs`}>
                          {getRoleLabel(character.role)}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {character.description}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCharacter(character.id)}
                      disabled={isLoading}
                      className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer ce personnage"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 flex-col sm:flex-row">
          <Button
            variant="outline"
            onClick={handleEditCharacters}
            disabled={isLoading}
            className="flex-1"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Modifier les Personnages
          </Button>
          <Button
            onClick={handleContinue}
            disabled={isLoading}
            className="flex-1 bg-sky-600 hover:bg-sky-700"
          >
            Continuer
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
