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
import { Loader2, ArrowLeft, Sliders, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { createStory } from "@/actions/create-story";

interface ManualStorySetupProps {
  onBack: () => void;
  onStoryCreated: (storyId: string | null) => void;
  isAuthenticated?: boolean;
}

const THEMES = [
  { label: "Fantasy", value: "fantasy" },
  { label: "Science Fiction", value: "sci-fi" },
  { label: "Romance", value: "romance" },
  { label: "Mystery", value: "mystery" },
  { label: "Horror", value: "horror" },
  { label: "Adventure", value: "adventure" },
  { label: "Drama", value: "drama" },
  { label: "Other", value: "other" }
];

export const ManualStorySetup = ({ onBack, onStoryCreated, isAuthenticated = false }: ManualStorySetupProps) => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);

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

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // If not authenticated, redirect to signup with story data in state
      if (!isAuthenticated) {
        // Store form data in localStorage for recovery after signup
        localStorage.setItem("storyDraft", JSON.stringify(values));
        router.push("/auth/register");
        return;
      }

      // Call the create story server action
      const result = await createStory(values);

      if (result.error === "LOGIN_REQUIRED") {
        // Store form data and redirect to signup
        localStorage.setItem("storyDraft", JSON.stringify(values));
        router.push("/auth/register");
        return;
      }

      if (result.error) {
        setError(result.error);
        return;
      }

      setSuccess("Story created successfully! Redirecting...");
      if (result.storyId) {
        setTimeout(() => {
          onStoryCreated(result.storyId);
        }, 1000);
      }

    } catch (err) {
      setError("Failed to create story. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
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

      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold transition-colors ${
                s < step
                  ? "bg-green-600 text-white"
                  : s === step
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
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

      <Card className="p-8 bg-gradient-to-br from-blue-50 to-transparent">
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold">Create Your Story</h2>
          </div>
          <p className="text-gray-600">Step {step} of 3</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Ne rien faire ici - la soumission se fait via le bouton
          }}
          className="space-y-6"
        >
          {/* Step 1: Title and Theme */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-base font-semibold">
                  Story Title
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., The Last Kingdom"
                  disabled={isLoading}
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <FormError message={form.formState.errors.name.message} />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-base font-semibold">Choose a Theme</Label>
                <div className="grid grid-cols-2 gap-2">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.value}
                      type="button"
                      onClick={() => form.setValue("theme", theme.value)}
                      className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                        form.watch("theme") === theme.value
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
                {form.formState.errors.theme && (
                  <FormError message={form.formState.errors.theme.message} />
                )}
              </div>
            </>
          )}

          {/* Step 2: Story Subject/Plot */}
          {step === 2 && (
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-base font-semibold">
                Story Subject & Plot
              </Label>
              <p className="text-sm text-gray-500 mb-3">
                Describe the main plot, setting, and key elements of your story.
              </p>
              <Textarea
                id="subject"
                placeholder="e.g., In a dark medieval kingdom, a young peasant discovers they have the ability to control shadows. They must hide their power from the ruling class while a war is brewing..."
                className="min-h-[150px] resize-none"
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
              <Label htmlFor="description" className="text-base font-semibold">
                Description (Optional)
              </Label>
              <p className="text-sm text-gray-500 mb-3">
                Add a short summary that will appear on your story's profile. This helps readers understand what your story is about.
              </p>
              <Textarea
                id="description"
                placeholder="A brief description of your story for readers..."
                className="min-h-[100px] resize-none"
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

          <div className="flex gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                disabled={isLoading}
                className="flex-1"
              >
                Previous
              </Button>
            )}
            {step < 3 ? (
              <Button
                type="button"
                onClick={handleNextClick}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={async () => {
                  const values = form.getValues();
                  await onSubmit(values);
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Story"
                )}
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-semibold mb-2">What's next:</p>
          <ul className="space-y-1 ml-4 list-disc">
            <li>After creating your story, you'll set up main characters</li>
            <li>Then you can write your first episode</li>
            <li>You can always edit these details later</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
