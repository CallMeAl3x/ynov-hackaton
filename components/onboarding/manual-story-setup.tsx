"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { StoryBasicSchema } from "@/schemas";
import { Loader2, ArrowLeft, Sliders, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createStory } from "@/actions/create-story";

interface ManualStorySetupProps {
  onBack: () => void;
  onStoryCreated: (storyId: string | null) => void;
  isAuthenticated?: boolean;
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

export const ManualStorySetup = ({ onBack, onStoryCreated, isAuthenticated = false }: ManualStorySetupProps) => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [customTheme, setCustomTheme] = useState<string>("");
  const [showCustomTheme, setShowCustomTheme] = useState<boolean>(false);

  const form = useForm<z.infer<typeof StoryBasicSchema>>({
    resolver: zodResolver(StoryBasicSchema),
    mode: "onBlur", // Only validate on blur, not on change
    defaultValues: {
      name: "",
      theme: "",
      subject: "",
      description: ""
    },
    shouldFocusError: false // Don't focus on first error
  });

  const handleNextClick = async () => {
    // Validate based on current step
    let fieldsToValidate: (keyof z.infer<typeof StoryBasicSchema>)[] = [];

    if (step === 1) {
      fieldsToValidate = ["name", "theme"];
    } else if (step === 2) {
      fieldsToValidate = ["subject"];
    }

    // Trigger validation for ONLY these fields
    const isValid = await form.trigger(fieldsToValidate, { shouldFocus: true });

    if (isValid) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  };

  const onSubmit = async (values: z.infer<typeof StoryBasicSchema>) => {
    // Validate all fields before submission
    const isValid = await form.trigger();

    if (!isValid) {
      return;
    }

    // Get final theme value
    const finalTheme = showCustomTheme ? customTheme : values.theme;

    if (!finalTheme || !finalTheme.trim()) {
      setError("Veuillez sélectionner ou entrer un thème");
      return;
    }

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Update values with final theme
      const finalValues = { ...values, theme: finalTheme };

      // If not authenticated, redirect to signup with story data in state
      if (!isAuthenticated) {
        // Store form data in localStorage for recovery after signup
        localStorage.setItem("storyDraft", JSON.stringify(finalValues));
        router.push("/auth/register");
        return;
      }

      // Call the create story server action
      const result = await createStory(finalValues);

      if (result.error === "LOGIN_REQUIRED") {
        // Store form data and redirect to signup
        localStorage.setItem("storyDraft", JSON.stringify(finalValues));
        router.push("/auth/register");
        return;
      }

      if (result.error) {
        setError(result.error);
        return;
      }

      setSuccess("Histoire créée avec succès! Redirection...");
      if (result.storyId) {
        setTimeout(() => {
          onStoryCreated(result.storyId);
        }, 1000);
      }

    } catch (err) {
      setError("Erreur lors de la création de l'histoire. Veuillez réessayer.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = (theme: string) => {
    form.setValue("theme", theme);
    if (theme === "custom") {
      setShowCustomTheme(true);
    } else {
      setShowCustomTheme(false);
      setCustomTheme("");
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 max-w-2xl mx-auto px-4 md:px-0">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          disabled={isLoading}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between gap-1 md:gap-3">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`w-6 md:w-8 h-6 md:h-8 rounded-full flex items-center justify-center font-semibold transition-colors text-xs md:text-sm ${
                s < step
                  ? "bg-green-600 text-white"
                  : s === step
                  ? "bg-sky-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {s < step ? <Check className="w-3 md:w-4 h-3 md:h-4" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`flex-1 h-1 transition-colors ${
                  s < step ? "bg-green-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card className="p-6 md:p-8 bg-gradient-to-br from-sky-50 to-transparent">
        <div className="space-y-2 mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 md:w-6 h-5 md:h-6 text-sky-600" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Créez Votre Histoire</h2>
          </div>
          <p className="text-sm md:text-base text-gray-600">Étape {step} sur 3</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Ne rien faire ici - la soumission se fait via le bouton
          }}
          className="space-y-4 md:space-y-6"
        >
          {/* Step 1: Title and Theme */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm md:text-base font-semibold">
                  Titre de l'Histoire
                </Label>
                <Input
                  id="name"
                  placeholder="Par exemple : Le Dernier Royaume"
                  disabled={isLoading}
                  className="text-sm md:text-base"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <FormError message={form.formState.errors.name.message} />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm md:text-base font-semibold">Choisir un Thème</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {PREDEFINED_THEMES.map((theme) => (
                    <button
                      key={theme.value}
                      type="button"
                      onClick={() => handleThemeChange(theme.value)}
                      className={`p-2 md:p-3 rounded-lg border-2 transition-all text-xs md:text-sm font-medium ${
                        form.watch("theme") === theme.value && !showCustomTheme
                          ? "border-sky-600 bg-sky-50"
                          : "border-gray-200 hover:border-sky-300"
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleThemeChange("custom")}
                    className={`p-2 md:p-3 rounded-lg border-2 transition-all text-xs md:text-sm font-medium ${
                      showCustomTheme
                        ? "border-sky-600 bg-sky-50"
                        : "border-gray-200 hover:border-sky-300"
                    }`}
                  >
                    Personnalisé
                  </button>
                </div>

                {/* Custom Theme Input */}
                {showCustomTheme && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-sky-200 space-y-2">
                    <Label htmlFor="custom-theme" className="text-xs md:text-sm font-medium">
                      Entrez votre thème personnalisé
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="custom-theme"
                        value={customTheme}
                        onChange={(e) => setCustomTheme(e.target.value)}
                        placeholder="Ex: Cyberpunk, Steampunk, etc."
                        disabled={isLoading}
                        className="flex-1 text-xs md:text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleThemeChange("other")}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Annuler le thème personnalisé"
                      >
                        <X className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {form.formState.errors.theme && (
                  <FormError message={form.formState.errors.theme.message} />
                )}
              </div>
            </>
          )}

          {/* Step 2: Story Subject/Plot */}
          {step === 2 && (
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm md:text-base font-semibold">
                Sujet et Intrigue de l'Histoire
              </Label>
              <p className="text-xs md:text-sm text-gray-500 mb-3">
                Décrivez l'intrigue principale, le décor et les éléments clés de votre histoire.
              </p>
              <Textarea
                id="subject"
                placeholder="Par exemple : Dans un sombre royaume médiéval, un jeune paysan découvre qu'il a le pouvoir de contrôler les ombres. Il doit cacher son pouvoir à la classe dirigeante tandis qu'une guerre se prépare..."
                className="min-h-[120px] md:min-h-[150px] resize-none text-sm md:text-base"
                disabled={isLoading}
                {...form.register("subject")}
              />
              {form.formState.errors.subject && (
                <FormError message={form.formState.errors.subject.message} />
              )}
            </div>
          )}

          {/* Step 3: Description */}
          {step === 3 && (
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm md:text-base font-semibold">
                Description (Optionnelle)
              </Label>
              <p className="text-xs md:text-sm text-gray-500 mb-3">
                Ajoutez un court résumé qui apparaîtra sur le profil de votre histoire. Cela aide les lecteurs à comprendre de quoi parle votre histoire.
              </p>
              <Textarea
                id="description"
                placeholder="Une brève description de votre histoire pour les lecteurs..."
                className="min-h-[100px] md:min-h-[120px] resize-none text-sm md:text-base"
                disabled={isLoading}
                {...form.register("description")}
              />
              {form.formState.errors.description && (
                <FormError message={form.formState.errors.description.message} />
              )}
            </div>
          )}

          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}

          <div className="flex gap-2 md:gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={isLoading}
                className="flex-1 text-sm md:text-base"
              >
                Précédent
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNextClick}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-sm md:text-base"
                disabled={isLoading}
              >
                Suivant
              </Button>
            ) : (
              <Button
                type="button"
                onClick={async () => {
                  const values = form.getValues();
                  await onSubmit(values);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700 text-sm md:text-base"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  "Créer l'Histoire"
                )}
              </Button>
            )}
          </div>
        </form>

        <div className="mt-4 md:mt-6 bg-sky-50 border border-sky-200 rounded-lg p-3 md:p-4 text-xs md:text-sm text-sky-800">
          <p className="font-semibold mb-2">Prochaines étapes :</p>
          <ul className="space-y-1 ml-4 list-disc">
            <li>Après avoir créé votre histoire, vous configurerez les personnages principaux</li>
            <li>Ensuite, vous pourrez écrire votre premier épisode</li>
            <li>Vous pouvez toujours modifier ces détails plus tard</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
