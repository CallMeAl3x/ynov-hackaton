"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Book, Users, Info, Trash2, Edit } from "lucide-react";
import { deleteStory } from "@/actions/delete-story";

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

interface StoryViewClientProps {
  story: Story;
  characters: Character[];
}

export function StoryViewClient({ story, characters }: StoryViewClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"info" | "characters">("info");
  const [isDeleting, setIsDeleting] = useState(false);

  const title = story.name ?? "Untitled story";
  const description = story.description ?? "";

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "PROTAGONIST":
        return "bg-blue-100 text-blue-800";
      case "ANTAGONIST":
        return "bg-red-100 text-red-800";
      case "SECONDARY":
        return "bg-purple-100 text-purple-800";
      case "MINOR":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Back Button */}
      <Link href="/storys" className="text-sm text-sky-600 hover:text-sky-700 mb-4 inline-block">
        ← Back to stories
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-3 text-lg text-gray-600">{description}</p>
        )}
      </div>

      {/* Cover Image */}
      {story.coverImage && (
        <div className="mb-8">
          <img
            src={story.coverImage}
            alt={title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("info")}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
            activeTab === "info"
              ? "text-sky-600 border-b-2 border-sky-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Info className="w-5 h-5" />
          Story Info
        </button>
        <button
          onClick={() => setActiveTab("characters")}
          className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
            activeTab === "characters"
              ? "text-sky-600 border-b-2 border-sky-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Users className="w-5 h-5" />
          Characters {characters.length > 0 && `(${characters.length})`}
        </button>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {/* Info Tab */}
        {activeTab === "info" && (
          <div className="space-y-6">
            {/* Story Details Card */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Book className="w-5 h-5 text-sky-600" />
                Story Details
              </h2>
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

            {/* JSON Debug Card */}
            <Card className="p-6 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-600 mb-3">Raw Data</h3>
              <pre className="text-xs overflow-auto max-h-96 text-gray-800">
                {JSON.stringify(story, null, 2)}
              </pre>
            </Card>
          </div>
        )}

        {/* Characters Tab */}
        {activeTab === "characters" && (
          <div className="space-y-4">
            {characters.length > 0 ? (
              characters.map((character) => (
                <Card key={character.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {character.name}
                      </h3>
                      <Badge
                        className={`mt-2 ${getRoleColor(character.role)}`}
                        variant="outline"
                      >
                        {character.role}
                      </Badge>
                      <p className="mt-3 text-gray-700 text-sm leading-relaxed">
                        {character.description}
                      </p>
                      {character.relationships && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-600">Relationships</p>
                          <p className="mt-1 text-sm text-gray-700">
                            {character.relationships}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No characters added yet</p>
                <Link
                  href={`/story/${story.id}/setup`}
                  className="inline-block rounded-md bg-sky-600 px-4 py-2 text-sm text-white hover:bg-sky-700"
                >
                  Add Characters
                </Link>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <Link
          href={`/story/${story.id}/setup`}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-6 py-2 text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit
        </Link>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 rounded-md bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
