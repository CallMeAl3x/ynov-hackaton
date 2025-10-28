"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EpisodeClient } from "./episode-client";
import { deleteEpisode } from "@/actions/delete-episode";
import { publishEpisode } from "@/actions/publish-episode";
import { unpublishEpisode } from "@/actions/unpublish-episode";
import { ArrowLeft, Edit, Trash2, Globe, EyeOff, FileDown } from "lucide-react";
import { EditEpisodeModal } from "@/components/modals/edit-episode-modal";

interface EpisodePageClientProps {
  episodeId: string;
  storyId: string;
  storyName: string;
  episodeNumber: number;
  episodeTitle: string;
  episodeContent: string;
  createdAt: string;
  isAuthor: boolean;
  isPublished: boolean;
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
  isPublished,
}: EpisodePageClientProps) {
  const router = useRouter();
  const [content, setContent] = useState(episodeContent);
  const [title, setTitle] = useState(episodeTitle);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [episodePublished, setEpisodePublished] = useState(isPublished);
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

  const handleEditSuccess = (updatedData: {
    name: string;
    content: string;
  }) => {
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

  const handlePublish = async () => {
    setIsPublishing(true);
    setError("");

    try {
      const result = await publishEpisode(episodeId);

      if (result.success) {
        setEpisodePublished(true);
        router.refresh();
      } else {
        setError(result.error || "Erreur lors de la publication");
        setIsPublishing(false);
      }
    } catch (err) {
      setError("Une erreur s'est produite");
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (
      !confirm("Êtes-vous sûr de vouloir remettre cet épisode en brouillon ?")
    ) {
      return;
    }

    setIsPublishing(true);
    setError("");

    try {
      const result = await unpublishEpisode(episodeId);

      if (result.success) {
        setEpisodePublished(false);
        router.refresh();
      } else {
        setError(result.error || "Erreur lors de la dépublication");
        setIsPublishing(false);
      }
    } catch (err) {
      setError("Une erreur s'est produite");
      setIsPublishing(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const { marked } = await import("marked");
      const html2pdf = (await import("html2pdf.js")).default;

      // Parse markdown to HTML
      const htmlContent = await marked(content);

      // Create a container with the episode content
      const element = document.createElement("div");
      element.innerHTML = `
        <div style="padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <h1 style="margin: 0 0 10px 0; font-size: 28px; color: #1a1a1a;">${title}</h1>
          <p style="color: #666; margin: 0 0 10px 0; font-size: 14px;">
            ${storyName} - Épisode ${episodeNumber}
          </p>
          <p style="color: #999; margin: 0 0 20px 0; font-size: 12px;">
            ${formattedDate}
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <div style="line-height: 1.8; color: #333; font-size: 14px;">
            ${htmlContent}
          </div>
        </div>
      `;

      // Apply styles to markdown-generated elements
      const styles = `
        <style>
          h1, h2, h3, h4, h5, h6 {
            margin: 24px 0 12px 0;
            font-weight: 600;
            color: #1a1a1a;
          }
          h1 { font-size: 24px; }
          h2 { font-size: 20px; }
          h3 { font-size: 18px; }
          h4, h5, h6 { font-size: 16px; }
          p {
            margin: 12px 0;
            line-height: 1.8;
          }
          ul, ol {
            margin: 12px 0;
            padding-left: 24px;
          }
          li {
            margin: 6px 0;
          }
          blockquote {
            margin: 12px 0;
            padding: 12px 16px;
            border-left: 4px solid #ddd;
            background-color: #f9f9f9;
            color: #666;
          }
          code {
            background-color: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 13px;
          }
          pre {
            background-color: #f5f5f5;
            padding: 12px;
            border-radius: 3px;
            overflow-x: auto;
            margin: 12px 0;
          }
          pre code {
            background-color: transparent;
            padding: 0;
          }
          strong {
            font-weight: 600;
          }
          em {
            font-style: italic;
          }
          a {
            color: #0066cc;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          hr {
            border: none;
            border-top: 1px solid #ddd;
            margin: 20px 0;
          }
          table {
            border-collapse: collapse;
            width: 100%;
            margin: 12px 0;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px 12px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
            font-weight: 600;
          }
        </style>
      `;

      element.innerHTML = styles + element.innerHTML;

      const options = {
        margin: 10,
        filename: `${title}.pdf`,
        image: { type: "png" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait" as const, unit: "mm", format: "a4" },
      };

      html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error("Error exporting PDF:", error);
      setError("Erreur lors de l'export PDF");
    }
  };

  return (
    <>
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Link
            href={`/story/${storyId}`}
            className="inline-flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l'histoire
          </Link>
          <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">{storyName}</p>
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              {/* PDF Button - Visible to everyone */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                className="inline-flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                <span className="hidden sm:inline">Télécharger PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>

              {isAuthor && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Modifier
                  </Button>
                  {!episodePublished && (
                    <Button
                      size="sm"
                      onClick={handlePublish}
                      disabled={isPublishing}
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Globe className="w-4 h-4" />
                      {isPublishing ? "Publication..." : "Publier"}
                    </Button>
                  )}
                  {episodePublished && (
                    <Button
                      size="sm"
                      onClick={handleUnpublish}
                      disabled={isPublishing}
                      className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <EyeOff className="w-4 h-4" />
                      {isPublishing ? "Dépublication..." : "Dépublier"}
                    </Button>
                  )}
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
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Episode Info Card */}
        <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <span className="text-sm">Numéro d'épisode</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {episodeNumber}
              </p>
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
            <Button
              variant="outline"
              className="inline-flex items-center gap-2"
            >
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
