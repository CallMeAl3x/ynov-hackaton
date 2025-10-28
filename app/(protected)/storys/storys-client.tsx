"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteStory } from "@/actions/delete-story";
import { Edit, Trash2, BookOpen } from "lucide-react";

type Story = {
  id: string;
  name: string;
  description: string | null;
  theme: string;
  status: string;
  createdAt: Date;
};

interface StorysClientProps {
  stories: Story[];
}

export function StorysClient({ stories }: StorysClientProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (storyId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette histoire?")) {
      return;
    }

    setDeletingId(storyId);
    try {
      const res = await deleteStory(storyId);
      if (res?.success) {
        router.refresh();
      } else {
        alert(res?.error || "Erreur lors de la suppression");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <Card key={story.id} className="h-full p-6 hover:shadow-lg transition-shadow group">
          <div className="flex items-start justify-between mb-4">
            <BookOpen className="w-8 h-8 text-sky-600 group-hover:scale-110 transition-transform" />
            <Badge
              className={
                story.status === "PUBLISHED"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }
            >
              {story.status === "PUBLISHED" ? "Publié" : "Brouillon"}
            </Badge>
          </div>

          <Link href={`/story/${story.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-sky-600 transition-colors cursor-pointer">
              {story.name}
            </h3>
          </Link>

          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {story.description || "Aucune description"}
          </p>

          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
            <Badge variant="outline" className="capitalize">
              {story.theme}
            </Badge>
            <span className="text-xs text-gray-500">{formatDate(story.createdAt)}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Link href={`/story/${story.id}`} className="flex-1">
              <Button variant="outline" className="w-full" size="sm">
                <BookOpen className="w-4 h-4 mr-1" />
                Voir
              </Button>
            </Link>

            <Link href={`/story/${story.id}/edit`} className="flex-1">
              <Button variant="outline" className="w-full" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Éditer
              </Button>
            </Link>

            <button
              onClick={() => {
                handleDelete(story.id);
              }}
              disabled={deletingId === story.id}
              className="flex-1 rounded-md border border-red-200 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 inline mr-1" />
              {deletingId === story.id ? "..." : "Supprimer"}
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
