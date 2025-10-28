"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { deleteCharacter } from "@/actions/delete-character";
import { getRoleLabel, getRoleBadgeColor } from "@/lib/role-utils";
import { EditCharacterModal } from "@/components/modals/edit-character-modal";

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

interface CharacterDetailClientProps {
  character: Character;
  story: Story;
  isAuthor: boolean;
}

export function CharacterDetailClient({
  character: initialCharacter,
  story,
  isAuthor,
}: CharacterDetailClientProps) {
  const router = useRouter();
  const [character, setCharacter] = useState(initialCharacter);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this character? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteCharacter(character.id);
      if (result.success) {
        router.push(`/story/${story.id}`);
      } else {
        alert(
          "Failed to delete character: " + (result.error || "Unknown error")
        );
      }
    } catch (error) {
      alert("An error occurred while deleting the character");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
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
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900">
              {character.name}
            </h1>
            <div className="mt-3 flex items-center gap-2">
              <Badge className={getRoleBadgeColor(character.role)}>
                {getRoleLabel(character.role)}
              </Badge>
              <span className="text-sm text-gray-600">
                de <span className="font-semibold">{story.name}</span>
              </span>
            </div>
          </div>
          {isAuthor && (
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8 mb-8">
        {/* Description Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed text-base">
            {character.description}
          </p>
        </div>

        {/* Relationships Section */}
        {character.relationships && (
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Relations
            </h2>
            <p className="text-gray-700 leading-relaxed text-base">
              {character.relationships}
            </p>
          </div>
        )}

        {/* Story Connection Section */}
        <div className="pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Histoire</h2>
          <Link
            href={`/story/${story.id}`}
            className="text-sky-600 hover:text-sky-700 font-medium"
          >
            {story.name}
          </Link>
          {story.description && (
            <p className="mt-3 text-sm text-gray-700">{story.description}</p>
          )}
        </div>

        {/* Metadata Section */}
        <div className="pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Créé le</p>
            <p className="mt-1 text-gray-900">
              {typeof character.createdAt === "string"
                ? new Date(character.createdAt).toLocaleDateString("fr-FR")
                : character.createdAt.toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">
              Dernière modification
            </p>
            <p className="mt-1 text-gray-900">
              {typeof character.updatedAt === "string"
                ? new Date(character.updatedAt).toLocaleDateString("fr-FR")
                : character.updatedAt.toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      {isAuthor && (
        <div className="flex gap-3 pt-6 border-t border-gray-200 flex-col-reverse">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-6 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Modifier le personnage
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Suppression..." : "Supprimer le personnage"}
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {isAuthor && (
        <EditCharacterModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          characterId={character.id}
          initialName={character.name}
          initialDescription={character.description}
          initialRole={character.role}
          onSuccess={(updatedData) => {
            setCharacter({
              ...character,
              name: updatedData.name,
              description: updatedData.description,
              role: updatedData.role as
                | "PROTAGONIST"
                | "ANTAGONIST"
                | "SECONDARY"
                | "MINOR",
            });
          }}
        />
      )}
    </div>
  );
}
