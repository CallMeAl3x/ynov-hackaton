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
import { Loader2, ArrowLeft, Users, Plus, Trash2 } from "lucide-react";
import { createCharacter } from "@/actions/create-character";
import { deleteCharacter } from "@/actions/delete-character";

const ROLES = [
  { label: "Protagonist (Main Hero)", value: "PROTAGONIST" },
  { label: "Antagonist (Main Villain)", value: "ANTAGONIST" },
  { label: "Secondary Character", value: "SECONDARY" },
  { label: "Minor Character", value: "MINOR" },
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

  const handleFinish = async () => {
    // Create only characters that don't have an id (new ones)
    const newChars = characters.filter((c) => !c.id);
    if (characters.length === 0) {
      setError("Please add at least one character before continuing");
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
          role: character.role as any,
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
        setSuccess("Characters created successfully! Redirecting...");
        setTimeout(() => {
          router.push(`/story/${storyId}`);
        }, 800);
      }
    } catch (err) {
      setError("Failed to create characters. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    router.push(`/story/${storyId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-4">
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
            Back
          </Button>
        </div>

        <Card className="p-8 bg-gradient-to-br from-blue-50 to-transparent">
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Create Your Characters</h2>
            </div>
            <p className="text-gray-600">
              Add main characters for your story. You can add more later.
            </p>
          </div>

          {/* Add Character Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8 space-y-4">
            <h3 className="font-semibold text-lg">Add a Character</h3>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-base font-semibold">
                Character Name
              </Label>
              <Input
                id="name"
                placeholder="e.g., Aria Shadowborn"
                disabled={isLoading}
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <FormError message={form.formState.errors.name.message} />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-base font-semibold">
                Character Role
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => form.setValue("role", r.value as any)}
                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      form.watch("role") === r.value
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
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
                Character Description
              </Label>
              <p className="text-sm text-gray-500 mb-3">
                Describe their appearance, personality, and background.
              </p>
              <Textarea
                id="description"
                placeholder="e.g., A mysterious shadow mage with piercing eyes..."
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
              className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Character
            </Button>
          </div>

          {/* Characters List */}
          {characters.length > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-lg">
                Characters ({characters.length})
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
                          {ROLES.find((r) => r.value === character.role)?.label}
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

          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              disabled={isLoading}
              className="flex-1"
            >
              Skip
            </Button>
            <Button
              type="button"
              onClick={handleFinish}
              disabled={isLoading || characters.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Characters & Continue"
              )}
            </Button>
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <p className="font-semibold mb-2">What's next:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>You can add or edit characters later</li>
              <li>Next, you'll write your first episode</li>
              <li>Your story is saved as a draft until you publish it</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
