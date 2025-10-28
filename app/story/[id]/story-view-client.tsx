"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Book,
  Users,
  Info,
  Trash2,
  Edit,
  FileText,
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";
import { deleteStory } from "@/actions/delete-story";
import { deleteCharacter } from "@/actions/delete-character";
import { publishStory } from "@/actions/publish-story";
import { unpublishStory } from "@/actions/unpublish-story";
import { publishEpisode } from "@/actions/publish-episode";
import { unpublishEpisode } from "@/actions/unpublish-episode";
import { deleteEpisode } from "@/actions/delete-episode";
import { getRoleLabel, getRoleBadgeColor } from "@/lib/role-utils";
import { EditStoryModal } from "./edit-story-modal";
import { EditCharacterModal } from "@/components/modals/edit-character-modal";
import { CreateCharacterModal } from "./create-character-modal";
import { EditEpisodeModal } from "@/components/modals/edit-episode-modal";

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

interface StoryViewClientProps {
  story: Story;
  characters: Character[];
  episodes: Episode[];
  isAuthor: boolean;
}

export function StoryViewClient({
  story,
  characters: initialCharacters,
  episodes: initialEpisodes,
  isAuthor,
}: StoryViewClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "info" | "characters" | "episodes"
  >("info");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateCharacterModalOpen, setIsCreateCharacterModalOpen] =
    useState(false);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(
    null
  );
  const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);
  const [characters, setCharacters] = useState(initialCharacters);
  const [episodes, setEpisodes] = useState(initialEpisodes);
  const [storyStatus, setStoryStatus] = useState(story.status);
  const [storyData, setStoryData] = useState({
    name: story.name ?? "Untitled story",
    theme: story.theme,
  });
  const [episodeActionsLoading, setEpisodeActionsLoading] = useState<
    string | null
  >(null);

  const title = storyData.name;
  const description = story.description ?? "";

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this story? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteStory(story.id);
      if (result.success) {
        router.push("/storys");
      } else {
        alert("Failed to delete story: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      alert("An error occurred while deleting the story");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const result = await publishStory(story.id);
      if (result.success) {
        setStoryStatus("PUBLISHED");
        router.refresh();
      } else {
        alert("Failed to publish story: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      alert("An error occurred while publishing the story");
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (
      !confirm(
        "Êtes-vous sûr de vouloir remettre cette histoire en brouillon ?"
      )
    ) {
      return;
    }

    setIsPublishing(true);
    try {
      const result = await unpublishStory(story.id);
      if (result.success) {
        setStoryStatus("DRAFT");
        router.refresh();
      } else {
        alert(
          "Failed to unpublish story: " + (result.error || "Unknown error")
        );
      }
    } catch (error) {
      alert("An error occurred while unpublishing the story");
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  // Filter episodes based on author status
  const visibleEpisodes = isAuthor
    ? episodes
    : episodes.filter((ep) => ep.published);

  // Episode action handlers
  const handlePublishEpisode = async (episodeId: string) => {
    setEpisodeActionsLoading(episodeId);
    try {
      const result = await publishEpisode(episodeId);
      if (result.success) {
        setEpisodes(
          episodes.map((ep) =>
            ep.id === episodeId ? { ...ep, published: true } : ep
          )
        );
        router.refresh();
      } else {
        alert(
          "Erreur lors de la publication: " +
            (result.error || "Erreur inconnue")
        );
      }
    } catch (error) {
      alert("Une erreur s'est produite");
      console.error(error);
    } finally {
      setEpisodeActionsLoading(null);
    }
  };

  const handleUnpublishEpisode = async (episodeId: string) => {
    if (
      !confirm("Êtes-vous sûr de vouloir remettre cet épisode en brouillon ?")
    ) {
      return;
    }
    setEpisodeActionsLoading(episodeId);
    try {
      const result = await unpublishEpisode(episodeId);
      if (result.success) {
        setEpisodes(
          episodes.map((ep) =>
            ep.id === episodeId ? { ...ep, published: false } : ep
          )
        );
        router.refresh();
      } else {
        alert(
          "Erreur lors de la dépublication: " +
            (result.error || "Erreur inconnue")
        );
      }
    } catch (error) {
      alert("Une erreur s'est produite");
      console.error(error);
    } finally {
      setEpisodeActionsLoading(null);
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet épisode ?")) {
      return;
    }
    setEpisodeActionsLoading(episodeId);
    try {
      const result = await deleteEpisode(episodeId);
      if (result.success) {
        setEpisodes(episodes.filter((ep) => ep.id !== episodeId));
        router.refresh();
      } else {
        alert(
          "Erreur lors de la suppression: " +
            (result.error || "Erreur inconnue")
        );
        setEpisodeActionsLoading(null);
      }
    } catch (error) {
      alert("Une erreur s'est produite");
      console.error(error);
      setEpisodeActionsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-8">
      {/* Mobile-friendly container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header - Improved for mobile */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Cover Image - Mobile optimized */}
        {story.coverImage && (
          <div className="px-4 pb-4 sm:pb-6">
            <img
              src={story.coverImage}
              alt={title}
              className="w-full h-48 sm:h-80 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Tab Navigation - Mobile optimized */}
        <div className="sticky top-12 bg-white z-30 border-b border-gray-200 overflow-x-auto scrollbar-hide flex">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-3 font-medium text-sm sm:text-base whitespace-nowrap transition-colors min-w-max sm:min-w-0 ${
              activeTab === "info"
                ? "text-sky-600 border-b-2 border-sky-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Info</span>
          </button>
          <button
            onClick={() => setActiveTab("characters")}
            className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-3 font-medium text-sm sm:text-base whitespace-nowrap transition-colors min-w-max sm:min-w-0 ${
              activeTab === "characters"
                ? "text-sky-600 border-b-2 border-sky-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Persos</span>
          </button>
          <button
            onClick={() => setActiveTab("episodes")}
            className={`flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-6 py-3 font-medium text-sm sm:text-base whitespace-nowrap transition-colors min-w-max sm:min-w-0 ${
              activeTab === "episodes"
                ? "text-sky-600 border-b-2 border-sky-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Épisodes</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="px-0 py-4 sm:py-6">
          {/* Info Tab */}
          {activeTab === "info" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Story Details Card */}
              <Card className="p-4 sm:p-6 mx-4 sm:mx-0 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Book className="w-5 h-5 text-sky-600" />
                    Story Details
                  </h2>
                  {isAuthor && (
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="inline-flex items-center gap-1 rounded px-3 py-1 text-sm text-sky-600 hover:bg-sky-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Subject</p>
                    <p className="mt-1 text-gray-900">{story.subject ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Theme</p>
                    <div className="mt-1">
                      <Badge variant="outline" className="capitalize">
                        {story.theme ?? "—"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <div className="mt-1">
                      <Badge
                        className={
                          story.status === "PUBLISHED"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {String(story.status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Created</p>
                    <p className="mt-1 text-gray-900">
                      {typeof story.createdAt === "string"
                        ? new Date(story.createdAt).toLocaleDateString()
                        : story.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Characters Tab */}
          {activeTab === "characters" && (
            <div className="space-y-3 sm:space-y-4 flex justify-end flex-col gap-0">
              {characters.length > 0 ? (
                characters.map((character) => (
                  <Card
                    key={character.id}
                    className="p-4 sm:p-6 mx-4 sm:mx-0 hover:shadow-lg transition-shadow cursor-pointer rounded-xl"
                    onClick={() =>
                      router.push(
                        `/story/${story.id}/character/${character.id}`
                      )
                    }
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          href={`/story/${story.id}/character/${character.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-sky-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {character.name}
                        </Link>
                        <Badge
                          className={`mt-2 ml-2 ${getRoleBadgeColor(
                            character.role
                          )}`}
                          variant="outline"
                        >
                          {getRoleLabel(character.role)}
                        </Badge>
                        <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                          {character.description}
                        </p>
                        {character.relationships && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-600">
                              Relationships
                            </p>
                            <p className="mt-1 text-sm text-gray-700">
                              {character.relationships}
                            </p>
                          </div>
                        )}
                      </div>
                      {isAuthor && (
                        <div className="ml-2 sm:ml-4 flex flex-col sm:flex-row gap-1 sm:gap-2">
                          <button
                            onClick={() => setEditingCharacterId(character.id)}
                            className="flex items-center justify-center sm:justify-start gap-1 rounded-lg px-3 py-2 sm:py-1 text-xs sm:text-sm text-sky-600 hover:bg-sky-100 active:bg-sky-200 transition-colors whitespace-nowrap"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Modifier</span>
                          </button>
                          <button
                            onClick={async () => {
                              if (
                                !confirm(
                                  "Are you sure you want to delete this character?"
                                )
                              ) {
                                return;
                              }
                              const result = await deleteCharacter(
                                character.id
                              );
                              if (result.success) {
                                setCharacters(
                                  characters.filter(
                                    (c) => c.id !== character.id
                                  )
                                );
                              } else {
                                alert("Failed to delete character");
                              }
                            }}
                            className="flex items-center justify-center sm:justify-start gap-1 rounded-lg px-3 py-2 sm:py-1 text-xs sm:text-sm text-red-600 hover:bg-red-100 active:bg-red-200 transition-colors whitespace-nowrap"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 sm:p-12 mx-4 sm:mx-0 text-center rounded-xl">
                  <Users className="w-10 sm:w-12 h-10 sm:h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Aucun personnage pour le moment
                  </p>
                  <Link
                    href={`/story/${story.id}/setup`}
                    className="inline-block rounded-lg bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700 font-medium"
                  >
                    Ajouter des personnages
                  </Link>
                </Card>
              )}
            </div>
          )}

          {/* Episodes Tab */}
          {activeTab === "episodes" && (
            <div className="space-y-3 sm:space-y-4">
              {visibleEpisodes.length > 0 ? (
                <div className="flex flex-col gap-3 sm:gap-4">
                  {visibleEpisodes.map((episode) => (
                    <Card
                      key={episode.id}
                      className="p-4 sm:p-6 mx-4 sm:mx-0 hover:shadow-lg transition-shadow rounded-xl"
                    >
                      <div className="flex items-start justify-between flex-col">
                        <Link
                          href={`/episode/${episode.id}`}
                          className="flex-1"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded">
                              Épisode {episode.order}
                            </span>
                            {!episode.published && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                Brouillon
                              </Badge>
                            )}
                            {episode.published && (
                              <Badge className="bg-green-100 text-green-800">
                                Publié
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-sky-600">
                            {episode.name}
                          </h3>
                          <div className="mt-3 text-gray-700 text-sm leading-relaxed prose prose-sm prose-slate max-w-none line-clamp-3 prose-p:m-0 prose-headings:m-0 prose-ul:m-0 prose-ol:m-0">
                            <ReactMarkdown
                              components={{
                                p: ({ node, ...props }) => (
                                  <p className="m-0 inline" {...props} />
                                ),
                                h1: ({ node, ...props }) => (
                                  <h1 className="inline text-sm font-bold m-0" {...props} />
                                ),
                                h2: ({ node, ...props }) => (
                                  <h2 className="inline text-sm font-bold m-0" {...props} />
                                ),
                                h3: ({ node, ...props }) => (
                                  <h3 className="inline text-sm font-bold m-0" {...props} />
                                ),
                                ul: ({ node, ...props }) => (
                                  <ul className="inline m-0" {...props} />
                                ),
                                ol: ({ node, ...props }) => (
                                  <ol className="inline m-0" {...props} />
                                ),
                                li: ({ node, ...props }) => (
                                  <li className="inline m-0" {...props} />
                                ),
                                strong: ({ node, ...props }) => (
                                  <strong className="font-bold" {...props} />
                                ),
                                em: ({ node, ...props }) => (
                                  <em className="italic" {...props} />
                                ),
                              }}
                            >
                              {episode.content}
                            </ReactMarkdown>
                          </div>
                          <p className="mt-3 text-xs text-gray-500">
                            Créé le{" "}
                            {typeof episode.createdAt === "string"
                              ? new Date(episode.createdAt).toLocaleDateString(
                                  "fr-FR"
                                )
                              : episode.createdAt.toLocaleDateString("fr-FR")}
                          </p>
                        </Link>

                        {isAuthor && (
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 w-full mt-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setEditingEpisodeId(episode.id);
                              }}
                              className="flex items-center justify-center sm:justify-start gap-1 rounded-lg px-3 py-2 sm:py-1 text-xs sm:text-sm text-sky-600 hover:bg-sky-100 active:bg-sky-200 transition-colors whitespace-nowrap"
                            >
                              <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Modifier</span>
                              <span className="sm:hidden">Édit.</span>
                            </button>
                            {!episode.published && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePublishEpisode(episode.id);
                                }}
                                disabled={episodeActionsLoading === episode.id}
                                className="flex items-center justify-center sm:justify-start gap-1 rounded-lg px-3 py-2 sm:py-1 text-xs sm:text-sm bg-green-600 text-white hover:bg-green-700 active:bg-green-800 transition-colors whitespace-nowrap disabled:opacity-50"
                              >
                                <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Publier</span>
                                <span className="sm:hidden">Pub.</span>
                              </button>
                            )}
                            {episode.published && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleUnpublishEpisode(episode.id);
                                }}
                                disabled={episodeActionsLoading === episode.id}
                                className="flex items-center justify-center sm:justify-start gap-1 rounded-lg px-3 py-2 sm:py-1 text-xs sm:text-sm bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 transition-colors whitespace-nowrap disabled:opacity-50"
                              >
                                <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden sm:inline">Dépublier</span>
                                <span className="sm:hidden">Dépub.</span>
                              </button>
                            )}
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleDeleteEpisode(episode.id);
                              }}
                              disabled={episodeActionsLoading === episode.id}
                              className="flex items-center justify-center sm:justify-start gap-1 rounded-lg px-3 py-2 sm:py-1 text-xs sm:text-sm text-red-600 hover:bg-red-100 active:bg-red-200 transition-colors whitespace-nowrap disabled:opacity-50"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Supprimer</span>
                              <span className="sm:hidden">Supp.</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 sm:p-12 mx-4 sm:mx-0 text-center rounded-xl">
                  <FileText className="w-10 sm:w-12 h-10 sm:h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">
                    Aucun épisode pour le moment
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions - Context Aware & Mobile Optimized */}
        <div className="mt-8 pt-6 sm:mt-12 sm:pt-8 border-t border-gray-200 px-4 sm:px-0">
          <div className="space-y-4">
            {/* Story Info Tab Footer */}
            {activeTab === "info" && isAuthor && (
              <>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Actions
                  </h3>
                  <div className="grid grid-cols-1 sm:flex sm:gap-3 sm:flex-wrap gap-2">
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 rounded-lg bg-sky-600 px-4 sm:px-6 py-3 sm:py-2 text-sm font-medium text-white hover:bg-sky-700 transition-colors active:bg-sky-800"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </button>

                    <Link
                      href={`/story/${story.id}/episodes`}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 sm:px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors active:bg-gray-100"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Créer un</span> Épisode
                    </Link>

                    {storyStatus !== "PUBLISHED" && (
                      <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 sm:px-6 py-3 sm:py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-green-800"
                      >
                        <Globe className="w-4 h-4" />
                        {isPublishing ? "..." : "Publier"}
                      </button>
                    )}

                    {storyStatus === "PUBLISHED" && (
                      <button
                        onClick={handleUnpublish}
                        disabled={isPublishing}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 sm:px-6 py-3 sm:py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-orange-800"
                      >
                        <EyeOff className="w-4 h-4" />
                        {isPublishing ? "..." : "Dépublier"}
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-red-600 mb-3">
                    Danger
                  </h3>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 sm:py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:bg-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                    {isDeleting ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </>
            )}

            {/* Characters Tab Footer */}
            {activeTab === "characters" && isAuthor && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Actions
                </h3>
                <button
                  onClick={() => setIsCreateCharacterModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-3 text-sm font-medium text-white hover:bg-sky-700 transition-colors active:bg-sky-800"
                >
                  + Ajouter un personnage
                </button>
              </div>
            )}

            {/* Episodes Tab Footer */}
            {activeTab === "episodes" && isAuthor && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Actions
                </h3>
                <Link
                  href={`/story/${story.id}/episodes`}
                  className="flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-3 text-sm font-medium text-white hover:bg-sky-700 transition-colors active:bg-sky-800 w-full"
                >
                  <FileText className="w-4 h-4" />+ Nouvel épisode
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditStoryModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        storyId={story.id}
        initialName={storyData.name}
        initialTheme={storyData.theme}
        initialSubject={story.subject}
        initialDescription={story.description || ""}
        onSuccess={(updatedData) => {
          setStoryData(updatedData);
        }}
      />

      {editingCharacterId && (
        <EditCharacterModal
          open={!!editingCharacterId}
          onOpenChange={(open) => {
            if (!open) setEditingCharacterId(null);
          }}
          characterId={editingCharacterId}
          initialName={
            characters.find((c) => c.id === editingCharacterId)?.name || ""
          }
          initialDescription={
            characters.find((c) => c.id === editingCharacterId)?.description ||
            ""
          }
          initialRole={
            characters.find((c) => c.id === editingCharacterId)?.role || "MINOR"
          }
          onSuccess={(updatedData) => {
            setCharacters(
              characters.map((c) =>
                c.id === editingCharacterId
                  ? {
                      ...c,
                      name: updatedData.name,
                      description: updatedData.description,
                      role: updatedData.role as
                        | "PROTAGONIST"
                        | "ANTAGONIST"
                        | "SECONDARY"
                        | "MINOR",
                    }
                  : c
              )
            );
            setEditingCharacterId(null);
          }}
        />
      )}

      <CreateCharacterModal
        open={isCreateCharacterModalOpen}
        onOpenChange={setIsCreateCharacterModalOpen}
        storyId={story.id}
        onSuccess={(newCharacter) => {
          setCharacters([
            ...characters,
            {
              ...newCharacter,
              role: newCharacter.role as
                | "PROTAGONIST"
                | "ANTAGONIST"
                | "SECONDARY"
                | "MINOR",
            },
          ]);
        }}
      />

      {editingEpisodeId && (
        <EditEpisodeModal
          open={!!editingEpisodeId}
          onOpenChange={(open) => {
            if (!open) setEditingEpisodeId(null);
          }}
          episodeId={editingEpisodeId}
          initialName={
            episodes.find((ep) => ep.id === editingEpisodeId)?.name || ""
          }
          initialContent={
            episodes.find((ep) => ep.id === editingEpisodeId)?.content || ""
          }
          onSuccess={(updatedData) => {
            setEpisodes(
              episodes.map((ep) =>
                ep.id === editingEpisodeId
                  ? {
                      ...ep,
                      name: updatedData.name,
                      content: updatedData.content,
                    }
                  : ep
              )
            );
            setEditingEpisodeId(null);
          }}
        />
      )}
    </div>
  );
}
