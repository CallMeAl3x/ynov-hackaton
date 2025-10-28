"use client";

import { useState } from "react";
import { createCharacter } from "@/actions/create-character";
import { generateCharacterWithAI } from "@/actions/generate-character";
import { ROLE_OPTIONS } from "@/lib/role-utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles } from "lucide-react";

interface CreateCharacterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storyId: string;
  onSuccess: (character: {
    id: string;
    name: string;
    description: string;
    role: string;
    storyId: string;
    relationships: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) => void;
}

export function CreateCharacterModal({
  open,
  onOpenChange,
  storyId,
  onSuccess,
}: CreateCharacterModalProps) {
  const [mode, setMode] = useState<"manual" | "ai" | "ai-prompt">("manual");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("PROTAGONIST");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateAI = async (prompt?: string) => {
    setError("");
    setIsLoading(true);

    try {
      const result = await generateCharacterWithAI(storyId, prompt);

      if (result.success && result.character) {
        setName(result.character.name);
        setDescription(result.character.description);
        setRole(result.character.role);
        setMode("manual"); // Switch to manual mode to allow editing
        setAiPrompt("");
      } else {
        setError(result.error || "Failed to generate character");
      }
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await createCharacter(storyId, { name, description, role: role as "PROTAGONIST" | "ANTAGONIST" | "SECONDARY" | "MINOR" });

      if (result.success && result.character) {
        onSuccess(result.character);
        setName("");
        setDescription("");
        setRole("PROTAGONIST");
        setMode("manual");
        setAiPrompt("");
        onOpenChange(false);
      } else {
        setError(result.error || "Failed to create character");
      }
    } catch (err) {
      setError("An error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setRole("PROTAGONIST");
    setAiPrompt("");
    setError("");
  };

  const handleDialogOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
      setMode("manual");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau personnage</DialogTitle>
        </DialogHeader>

        {mode === "manual" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du personnage</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Entrez le nom du personnage"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Entrez la description du personnage"
                disabled={isLoading}
                required
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select value={role} onValueChange={setRole} disabled={isLoading}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode("ai")}
                disabled={isLoading}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Générer avec l'IA
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDialogOpenChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Création en cours..." : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {mode === "ai" && (
          <div className="space-y-4">
            <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
              <p className="text-sm text-sky-800">
                L'IA génèrera un personnage qui s'intègre bien à votre histoire. Vous pouvez ajouter une description pour guider la génération, ou laisser l'IA créer librement.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-prompt">Description du personnage (optionnel)</Label>
              <Textarea
                id="ai-prompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ex: Un chevalier mystérieux avec des pouvoirs cachés, ou laissez vide pour une génération libre..."
                disabled={isLoading}
                rows={4}
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setMode("manual");
                  setError("");
                }}
                disabled={isLoading}
              >
                Retour
              </Button>
              <Button
                type="button"
                onClick={() => handleGenerateAI(aiPrompt || undefined)}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Générer
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
