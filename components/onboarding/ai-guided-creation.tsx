"use client";

import { useState, useEffect } from "react";
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
import { AIStoryGenerationSchema } from "@/schemas";
import { Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { generateStoryWithAI } from "@/actions/create-story";

interface AIGuidedCreationProps {
  onBack: () => void;
  onStoryCreated: (storyId: string | null) => void;
  isAuthenticated?: boolean;
}

export const AIGuidedCreation = ({ onBack, onStoryCreated, isAuthenticated = false }: AIGuidedCreationProps) => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof AIStoryGenerationSchema>>({
    resolver: zodResolver(AIStoryGenerationSchema),
    defaultValues: {
      subject: ""
    }
  });

  // Restore draft from localStorage when component mounts
  useEffect(() => {
    const savedDraft = localStorage.getItem("aiStoryDraft");
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        form.reset(draftData);
        localStorage.removeItem("aiStoryDraft"); // Clean up after restoring
      } catch (err) {
        console.error("Failed to restore draft:", err);
      }
    }
  }, [form]);

  const onSubmit = async (values: z.infer<typeof AIStoryGenerationSchema>) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // If not authenticated, redirect to signup with story data in state
      if (!isAuthenticated) {
        // Store form data in localStorage for recovery after signup
        localStorage.setItem("aiStoryDraft", JSON.stringify(values));
        // Preserve the callback URL to return to this page after registration
        const callbackUrl = encodeURIComponent("/onboarding/new?type=ai-guided");
        router.push(`/auth/register?callbackUrl=${callbackUrl}`);
        return;
      }

      // Call the AI story generation server action
      const result = await generateStoryWithAI(values.subject);

      if (result.error === "LOGIN_REQUIRED") {
        // Store form data and redirect to signup
        localStorage.setItem("aiStoryDraft", JSON.stringify(values));
        router.push("/auth/register");
        return;
      }

      if (result.error) {
        setError(result.error);
        return;
      }

      setSuccess("Story generated successfully! Redirecting...");
      if (result.storyId) {
        setTimeout(() => {
          onStoryCreated(result.storyId);
        }, 1000);
      }

    } catch (err) {
      setError("Failed to generate story. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
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

      <Card className="p-6 md:p-8 bg-gradient-to-br from-sky-50 to-transparent">
        <div className="space-y-2 mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 md:w-6 h-5 md:h-6 text-sky-600" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Création d'Histoire Assistée par IA</h2>
          </div>
          <p className="text-sm md:text-base text-gray-600">
            Décrivez-nous votre idée d'histoire et notre IA créera la base pour vous.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm md:text-base font-semibold">
              Votre Concept d'Histoire
            </Label>
            <p className="text-xs md:text-sm text-gray-500 mb-3">
              Décrivez l'histoire que vous souhaitez créer. Incluez l'idée principale, le genre et tout élément clé que vous désirez.
            </p>
            <Textarea
              id="subject"
              placeholder="Par exemple : Une aventure fantastique sur un jeune guerrier découvrant des pouvoirs magiques cachés dans un royaume où la magie est interdite..."
              className="min-h-[120px] md:min-h-[150px] resize-none text-sm md:text-base"
              disabled={isLoading}
              {...form.register("subject")}
            />
            {form.formState.errors.subject && (
              <FormError message={form.formState.errors.subject.message} />
            )}
          </div>

          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}

          <Button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération de votre histoire...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Générer une Histoire avec IA
              </>
            )}
          </Button>

          <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 md:p-4 text-xs md:text-sm text-sky-800">
            <p className="font-semibold mb-2">Comment ça fonctionne :</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Notre IA analysera votre concept</li>
              <li>Générera un titre, un thème et le premier épisode</li>
              <li>Créera les personnages principaux automatiquement</li>
              <li>Vous pouvez vérifier et modifier tout</li>
            </ul>
          </div>
        </form>
      </Card>
    </div>
  );
};
