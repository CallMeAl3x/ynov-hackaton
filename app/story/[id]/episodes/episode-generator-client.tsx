"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createEpisode } from "@/actions/create-episode";
import { generateEpisodeWithAI } from "@/actions/generate-episode";
import { buildEpisodePrompt } from "@/lib/prompts";
import { getRoleLabel, getRoleBadgeColor } from "@/lib/role-utils";
import { MarkdownPreview } from "./markdown-preview";
import { ArrowLeft, Sparkles, Loader, ChevronDown, ChevronUp } from "lucide-react";

type Character = {
  id: string;
  name: string;
  description: string;
  role: "PROTAGONIST" | "ANTAGONIST" | "SECONDARY" | "MINOR";
  storyId: string;
  relationships: string | null;
  createdAt: Date;
  updatedAt: Date;
};

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

type Episode = {
  id: string;
  name: string;
  content: string;
  order: number;
  published: boolean;
  storyId: string;
  createdAt: Date;
  updatedAt: Date;
};

interface EpisodeGeneratorClientProps {
  story: Story;
  characters: Character[];
  episodes: Episode[];
}

export function EpisodeGeneratorClient({
  story,
  characters,
  episodes,
}: EpisodeGeneratorClientProps) {
  const router = useRouter();
  const [episodeTitle, setEpisodeTitle] = useState(
    `Épisode ${episodes.length + 1}`
  );
  const [episodeContent, setEpisodeContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showGuidance, setShowGuidance] = useState(false);
  const [guidancePrompt, setGuidancePrompt] = useState("");

  const countWords = (text: string): number => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  const handleGenerateWithAI = async () => {
    setError("");
    setSuccess("");
    setIsGenerating(true);
    setEpisodeContent("");

    try {
      const result = await generateEpisodeWithAI(
        story,
        characters,
        episodes,
        guidancePrompt || undefined
      );

      if (result.success && result.content) {
        setEpisodeContent(result.content);
        const wordCount = countWords(result.content);

        if (wordCount > 2500) {
          setError(
            `Le contenu généré dépasse la limite de 2500 mots (${wordCount} mots générés). Veuillez réduire ou régénérer.`
          );
          setEpisodeContent("");
          setIsGenerating(false);
          return;
        }

        setSuccess("Épisode généré avec succès!");
        setShowGuidance(false);
      } else {
        setError(result.error || "Erreur lors de la génération");
        setEpisodeContent("");
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Erreur lors de la génération";
      setError(errorMsg);
      setEpisodeContent("");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEpisode = async () => {
    if (!episodeTitle.trim() || !episodeContent.trim()) {
      setError("Veuillez remplir le titre et le contenu");
      return;
    }

    setError("");
    setSuccess("");
    setIsGenerating(true);

    try {
      const result = await createEpisode(story.id, {
        name: episodeTitle,
        content: episodeContent,
        order: episodes.length + 1,
      });

      if (result.success) {
        setSuccess("Épisode créé avec succès!");
        setTimeout(() => {
          router.push(`/story/${story.id}`);
        }, 1500);
      } else {
        setError(result.error || "Erreur lors de la sauvegarde");
      }
    } catch (err) {
      setError("Une erreur s'est produite");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href={`/story/${story.id}`}
            className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'histoire
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{story.name}</h1>
          <p className="text-gray-600 mt-2">
            Génération d'épisode #{episodes.length + 1}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Story Context */}
        <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
          <h2 className="font-semibold text-gray-900 mb-4">Contexte</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Thème</p>
              <p className="font-medium text-gray-900">{story.theme}</p>
            </div>
            <div>
              <p className="text-gray-600">Personnages</p>
              <p className="font-medium text-gray-900">{characters.length}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600 mb-1">Sujet</p>
              <p className="text-gray-900 line-clamp-2">{story.subject}</p>
            </div>
          </div>
        </Card>

        {/* Characters List */}
        {characters.length > 0 && (
          <Card className="p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-4">Personnages</h2>
            <div className="space-y-2">
              {characters.map((char) => (
                <div key={char.id} className="flex items-start gap-2">
                  <Badge variant="outline" className={`flex-shrink-0 mt-1 ${getRoleBadgeColor(char.role)}`}>
                    {getRoleLabel(char.role)}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{char.name}</p>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {char.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Episode Form */}
        <div className="flex flex-col gap-6">
          <div>
            <Label htmlFor="title">Titre de l'épisode</Label>
            <Input
              id="title"
              value={episodeTitle}
              onChange={(e) => setEpisodeTitle(e.target.value)}
              placeholder="Ex: Le début du voyage"
              disabled={isGenerating}
              className="mt-2"
            />
          </div>

          {/* Two Column Layout: Editor and Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            {/* Editor */}
            <div>
              <Label htmlFor="content">Contenu (1500-2500 mots)</Label>
              <Textarea
                id="content"
                value={episodeContent}
                onChange={(e) => setEpisodeContent(e.target.value)}
                placeholder="Écrivez ou générez le contenu de l'épisode en markdown..."
                disabled={isGenerating}
                rows={6}
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-2">
                {countWords(episodeContent)} mots
              </p>
            </div>

            {/* Preview */}
            <div>
              <Label>Prévisualisation</Label>
              <MarkdownPreview
                content={episodeContent}
                isGenerating={isGenerating}
              />
            </div>
          </div>

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

          {/* Guidance Section */}
          <div className="border border-gray-200 rounded-lg bg-gray-50 mt-4">
            <button
              onClick={() => setShowGuidance(!showGuidance)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
              disabled={isGenerating}
            >
              <span className="font-medium text-gray-900">
                {showGuidance ? "Masquer" : "Afficher"} les options de génération
              </span>
              {showGuidance ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {showGuidance && (
              <div className="px-4 pb-4 border-t border-gray-200 space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
                  <p className="font-semibold mb-1">Comment guider la génération ?</p>
                  <ul className="space-y-1 text-xs ml-4 list-disc">
                    <li><strong>Aucun texte :</strong> L'IA générera librement basée sur votre histoire</li>
                    <li><strong>Avec guidage :</strong> Ex: "La protagoniste rencontre un mentor mystérieux"</li>
                    <li><strong>Spécifique :</strong> Ex: "Focus sur le combat final avec dialogue dramatique"</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guidance">Guidage optionnel pour la génération</Label>
                  <Textarea
                    id="guidance"
                    value={guidancePrompt}
                    onChange={(e) => setGuidancePrompt(e.target.value)}
                    placeholder="Décrivez ce que vous aimeriez voir dans cet épisode... (optionnel)"
                    disabled={isGenerating}
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    Laissez vide pour une génération complètement libre
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions - Mobile optimized */}
          <div className="grid grid-cols-1 sm:flex sm:gap-3 sm:flex-wrap gap-2 pt-4 border-t border-gray-200">
            <Button
              onClick={handleGenerateWithAI}
              disabled={isGenerating}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white py-3 sm:py-2 font-medium"
            >
              {isGenerating ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isGenerating ? "Génération..." : "Générer"}</span>
            </Button>

            <Button
              onClick={handleSaveEpisode}
              disabled={isGenerating || !episodeContent.trim()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white py-3 sm:py-2 font-medium"
            >
              Sauvegarder
            </Button>

            <Link href={`/story/${story.id}`} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full flex items-center justify-center py-3 sm:py-2 font-medium">
                Annuler
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
