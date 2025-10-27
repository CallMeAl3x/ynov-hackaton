"use client";

import { useState } from "react";
import { createCharacter } from "@/actions/create-character";
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

const ROLES = [
  { value: "PROTAGONIST", label: "Protagonist" },
  { value: "ANTAGONIST", label: "Antagonist" },
  { value: "SECONDARY", label: "Secondary" },
  { value: "MINOR", label: "Minor" },
];

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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState("PROTAGONIST");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await createCharacter(storyId, { name, description, role });

      if (result.success && result.character) {
        onSuccess(result.character);
        setName("");
        setDescription("");
        setRole("PROTAGONIST");
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Character</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Character Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter character name"
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
              placeholder="Enter character description"
              disabled={isLoading}
              required
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole} disabled={isLoading}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
