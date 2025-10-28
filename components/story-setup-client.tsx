"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { CharacterCreateSchema } from "@/schemas";
import { Loader2, ArrowLeft, Users, Plus, Trash2, X } from "lucide-react";
import { createCharacter } from "@/actions/create-character";
import { deleteCharacter } from "@/actions/delete-character";
import { updateStory } from "@/actions/update-story";
import { ROLE_OPTIONS } from "@/lib/role-utils";

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

interface Character {
  id?: string;
  name: string;
  description: string;
  role: string;
  tempId?: string;
}

export default function StorySetupClient({
  storyId,
  initialCharacters,
}: {
  storyId: string;
  initialCharacters: Character[];
}) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [characters, setCharacters] = useState<Character[]>(
    () => initialCharacters || []
  );
  const [selectedTheme, setSelectedTheme] = useState<string>("other");
  const [customTheme, setCustomTheme] = useState<string>("");
  const [showCustomTheme, setShowCustomTheme] = useState<boolean>(false);

  const form = useForm<z.infer<typeof CharacterCreateSchema>>({
    resolver: zodResolver(CharacterCreateSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      description: "",
      role: "PROTAGONIST",
    },
  });

  const handleAddCharacter = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const values = form.getValues();
    const tempId = Math.random().toString(36).substr(2, 9);

    setCharacters((prev) => [
      ...prev,
      {
        ...values,
        tempId,
      },
    ]);

    form.reset();
  };

  const handleRemoveCharacter = async (idOrTempId: string) => {
    // If id exists in characters, remove and call delete action
    const found = characters.find(
      (c) => c.id === idOrTempId || c.tempId === idOrTempId
    );
    if (!found) return;

    if (found.id) {
      // existing character -> delete on server
      const ok = confirm("Are you sure you want to delete this character?");
      if (!ok) return;
      try {
        setIsLoading(true);
        const res = await deleteCharacter(found.id);
        if (res?.success) {
          setCharacters((prev) => prev.filter((c) => c.id !== found.id));
        } else {
          alert(res?.error || "Failed to delete character");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to delete character");
      } finally {
        setIsLoading(false);
      }
    } else {
      // temporary character -> just remove locally
      setCharacters((prev) => prev.filter((c) => c.tempId !== idOrTempId));
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

  const handleFinish = async () => {
    // Create only characters that don't have an id (new ones)
    const newChars = characters.filter((c) => !c.id);
    if (characters.length === 0) {
      setError("Veuillez ajouter au moins un personnage avant de continuer");
      return;
    }

    const themeToSave = showCustomTheme ? customTheme : selectedTheme;
    if (!themeToSave.trim()) {
      setError("Veuillez sélectionner ou entrer un thème");
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      let hasError = false;

      for (const character of newChars) {
        const result = await createCharacter(storyId, {
          name: character.name,
          description: character.description,
          role: character.role as "PROTAGONIST" | "ANTAGONIST" | "SECONDARY" | "MINOR",
        });

        if (result.error) {
          setError(result.error);
          hasError = true;
          break;
        }

        if (result.success && result.character) {
          // Replace temp entry with created character
          setCharacters((prev) =>
            prev.map((c) =>
              c.tempId === character.tempId ? result.character : c
            )
          );
        }
      }

      if (!hasError) {
        // Update story theme
        await updateStory(storyId, { theme: themeToSave });
        setSuccess("Personnages créés avec succès! Redirection...");
        setTimeout(() => {
          router.push(`/story/${storyId}`);
        }, 800);
      }
    } catch (err) {
      setError("Erreur lors de la création des personnages. Veuillez réessayer.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push(`/story/${storyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-4 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            disabled={isLoading}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>

        <Card className="p-8 bg-gradient-to-br from-sky-50 to-transparent border-sky-200">
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-sky-600" />
              <h2 className="text-2xl font-bold text-gray-900">Créez Vos Personnages</h2>
            </div>
            <p className="text-gray-600">
              Ajoutez les personnages principaux de votre histoire. Vous pouvez en ajouter d'autres plus tard.
            </p>
          </div>

          {/* Add Character Form */}
          <div className="bg-white rounded-lg border border-sky-200 p-6 mb-8 space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Ajouter un Personnage</h3>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">
                Nom du Personnage
              </Label>
              <Input
                id="name"
                placeholder="Ex: Aria l'Ombre"
                disabled={isLoading}
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <FormError message={form.formState.errors.name.message} />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-base font-semibold">
                Rôle du Personnage
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => form.setValue("role", r.value as "PROTAGONIST" | "ANTAGONIST" | "SECONDARY" | "MINOR")}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      form.watch("role") === r.value
                        ? "border-sky-600 bg-sky-50"
                        : "border-gray-200 hover:border-sky-300"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              {form.formState.errors.role && (
                <FormError message={form.formState.errors.role.message} />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Description du Personnage
              </Label>
              <p className="text-sm text-gray-500 mb-3">
                Décrivez son apparence, sa personnalité et son contexte.
              </p>
              <Textarea
                id="description"
                placeholder="Ex: Un mage des ombres mystérieux avec des yeux perçants..."
                className="min-h-[100px] resize-none"
                disabled={isLoading}
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <FormError
                  message={form.formState.errors.description.message}
                />
              )}
            </div>

            <Button
              type="button"
              onClick={handleAddCharacter}
              disabled={isLoading}
              className="w-full bg-sky-600 hover:bg-sky-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter un Personnage
            </Button>
          </div>

          {/* Characters List */}
          {characters.length > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-lg text-gray-900">
                Personnages ({characters.length})
              </h3>
              <div className="space-y-3">
                {characters.map((character) => (
                  <div
                    key={character.id ?? character.tempId}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold">{character.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {ROLE_OPTIONS.find((r) => r.value === character.role)?.label}
                        </p>
                        <p className="text-sm text-gray-700">
                          {character.description}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemoveCharacter(
                            character.id ?? character.tempId!
                          )
                        }
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}

          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={isLoading}
              className="flex-1"
            >
              Passer
            </Button>
            <Button
              type="button"
              onClick={handleFinish}
              disabled={isLoading || characters.length === 0}
              className="flex-1 bg-sky-600 hover:bg-sky-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer les Personnages & Continuer"
              )}
            </Button>
          </div>

          <div className="mt-6 bg-sky-50 border border-sky-200 rounded-lg p-4 text-sm text-sky-800">
            <p className="font-semibold mb-2">Prochaines étapes :</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Vous pouvez ajouter ou modifier des personnages plus tard</li>
              <li>Ensuite, vous écrirez votre premier épisode</li>
              <li>Votre histoire est enregistrée en tant que brouillon jusqu'à sa publication</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
