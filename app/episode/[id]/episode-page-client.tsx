"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EpisodeClient } from "./episode-client";
import { EditEpisodeModal } from "./edit-episode-modal";
import { deleteEpisode } from "@/actions/delete-episode";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

interface EpisodePageClientProps {
  episodeId: string;
  storyId: string;
  storyName: string;
  episodeNumber: number;
  episodeTitle: string;
  episodeContent: string;
  createdAt: string;
  isAuthor: boolean;
}

export function EpisodePageClient({
  episodeId,
  storyId,
  storyName,
  episodeNumber,
  episodeTitle,
  episodeContent,
  createdAt,
  isAuthor,
}: EpisodePageClientProps) {
  const router = useRouter();
  const [content, setContent] = useState(episodeContent);
  const [title, setTitle] = useState(episodeTitle);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(createdAt));

  const handleEditSuccess = (updatedData: { name: string; content: string }) => {
    setTitle(updatedData.name);
    setContent(updatedData.content);
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet épisode ?")) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const result = await deleteEpisode(episodeId);

      if (result.success) {
        router.push(`/story/${storyId}`);
      } else {
        setError(result.error || "Erreur lors de la suppression");
        setIsDeleting(false);
      }
    } catch (err) {
      setError("Une erreur s'est produite");
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href={`/story/${storyId}`}
            className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'histoire
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{storyName}</p>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            </div>
            {isAuthor && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                  className="inline-flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center gap-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? "Suppression..." : "Supprimer"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Episode Info Card */}
        <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <span className="text-sm">Numéro d'épisode</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{episodeNumber}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <span className="text-sm">Nombre de mots</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{wordCount}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <span className="text-sm">Date de création</span>
              </div>
              <p className="text-sm text-gray-900">{formattedDate}</p>
            </div>
          </div>
        </Card>

        {/* Episode Content */}
        <Card className="p-8">
          <EpisodeClient content={content} />
        </Card>

        {error && (
          <div className="mt-6 text-sm text-red-600 bg-red-50 p-4 rounded">
            {error}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <Link href={`/story/${storyId}`}>
            <Button variant="outline" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour à l'histoire
            </Button>
          </Link>
        </div>
      </main>

      {/* Edit Modal */}
      <EditEpisodeModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        episodeId={episodeId}
        initialName={title}
        initialContent={content}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
