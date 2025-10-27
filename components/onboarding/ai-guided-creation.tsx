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

  const onSubmit = async (values: z.infer<typeof AIStoryGenerationSchema>) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // If not authenticated, redirect to signup with story data in state
      if (!isAuthenticated) {
        // Store form data in localStorage for recovery after signup
        localStorage.setItem("aiStoryDraft", JSON.stringify(values));
        router.push("/auth/register");
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
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          disabled={isLoading}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <Card className="p-8 bg-gradient-to-br from-purple-50 to-transparent">
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold">AI-Powered Story Creation</h2>
          </div>
          <p className="text-gray-600">
            Tell us about your story idea and our AI will create the foundation for you.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-base font-semibold">
              Your Story Concept
            </Label>
            <p className="text-sm text-gray-500 mb-3">
              Describe the story you want to create. Include the main idea, genre, and any key elements you want.
            </p>
            <Textarea
              id="subject"
              placeholder="e.g., A fantasy adventure about a young warrior discovering hidden magical powers in a kingdom where magic is forbidden..."
              className="min-h-[150px] resize-none"
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
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Your Story...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Story with AI
              </>
            )}
          </Button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-2">How it works:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Our AI will analyze your concept</li>
              <li>Generate a title, theme, and first episode</li>
              <li>Create main characters automatically</li>
              <li>You can review and edit everything</li>
            </ul>
          </div>
        </form>
      </Card>
    </div>
  );
};
