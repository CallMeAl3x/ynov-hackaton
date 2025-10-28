"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateStory } from "@/actions/update-story";
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
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const THEMES = [
  { value: "fantasy", label: "Fantasy" },
  { value: "sci-fi", label: "Sci-Fi" },
  { value: "romance", label: "Romance" },
  { value: "mystery", label: "Mystery" },
  { value: "horror", label: "Horror" },
  { value: "adventure", label: "Adventure" },
  { value: "drama", label: "Drama" },
  { value: "other", label: "Other" },
];

type Story = {
  id: string;
  name: string;
  description: string | null;
  subject: string;
  theme: string;
  status: string;
  coverImage: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

interface EditStoryPageProps {
  story: Story;
}

export function EditStoryPage({ story }: EditStoryPageProps) {
  const router = useRouter();
  const [name, setName] = useState(story.name);
  const [theme, setTheme] = useState(story.theme);
  const [description, setDescription] = useState(story.description || "");
  const [subject, setSubject] = useState(story.subject);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const result = await updateStory(story.id, {
        name,
        theme,
        description,
        subject,
      });

      if (result.success) {
        setSuccess("Histoire mise à jour avec succès!");
        setTimeout(() => {
          router.push(`/story/${story.id}`);
        }, 1000);
      } else {
        setError(result.error || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      setError("Une erreur s'est produite");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 px-4">
      {/* Back Button */}
      <Link
        href={`/story/${story.id}`}
        className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à l'histoire
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Modifier l'histoire
        </h1>
        <p className="mt-2 text-gray-600">
          Mettez à jour les informations de votre histoire
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="name">Titre</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Entrez le titre de l'histoire"
            disabled={isLoading}
            required
            minLength={1}
            maxLength={200}
          />
        </div>

        {/* Theme */}
        <div className="space-y-2">
          <Label htmlFor="theme">Thème</Label>
          <Select value={theme} onValueChange={setTheme} disabled={isLoading}>
            <SelectTrigger id="theme">
              <SelectValue placeholder="Sélectionnez un thème" />
            </SelectTrigger>
            <SelectContent>
              {THEMES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Sujet / Intrigue</Label>
          <Textarea
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Décrivez le sujet principal de votre histoire"
            disabled={isLoading}
            required
            minLength={10}
            maxLength={5000}
            rows={4}
          />
          <p className="text-xs text-gray-500">
            Minimum 10 caractères, maximum 5000
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (optionnel)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description courte de votre histoire"
            disabled={isLoading}
            maxLength={1000}
            rows={3}
          />
          <p className="text-xs text-gray-500">Maximum 1000 caractères</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
            {success}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-gray-200 flex-col-reverse">
          <Link
            href={`/story/${story.id}`}
            className="inline-flex justify-center items-center gap-2 rounded-md border border-slate-200 px-6 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            Annuler
          </Link>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>
    </div>
  );
}
