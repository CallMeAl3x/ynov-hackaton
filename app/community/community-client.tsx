"use client";

import Link from "next/link";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { Users, BookOpen, FileText, Search, ArrowRight, FileDown } from "lucide-react";

const handleDownloadPDF = (storyId: string, storyName: string) => {
  const downloadUrl = `/api/download-story-pdfs?storyId=${storyId}`;
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `${storyName}-episodes.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

type Story = {
  id: string;
  name: string;
  description: string | null;
  theme: string;
  status: string;
  createdAt: Date;
  _count: {
    characters: number;
    episodes: number;
  };
};

type User = {
  id: string;
  name: string | null;
  email: string | null;
  stories: Story[];
  _count: {
    stories: number;
  };
};

interface CommunityClientProps {
  users: User[];
}

export function CommunityClient({ users: initialUsers }: CommunityClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const filteredUsers = initialUsers.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <PageHeader
        icon={<Users className="w-8 h-8 text-sky-600" />}
        title="Communauté"
        description={`Découvrez les histoires des ${
          filteredUsers.length
        } auteur${filteredUsers.length > 1 ? "s" : ""} de la communauté`}
      />

      {/* Search */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un auteur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-2"
          />
        </div>

        {/* Users List */}
        {filteredUsers.length > 0 ? (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id}>
                <Card
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() =>
                    setExpandedUser(expandedUser === user.id ? null : user.id)
                  }
                >
                  <div className="flex items-start justify-between mb-4 flex-col gap-3 sm:flex-row">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {user.name || "Utilisateur anonyme"}
                      </h2>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <Badge className="bg-sky-100 text-sky-800">
                      {user.stories.length}{" "}
                      {user.stories.length > 1 ? "histoires" : "histoire"}
                    </Badge>
                  </div>

                  {/* Stories Count Summary */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {user.stories.length} publiée
                      {user.stories.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Toggle Arrow */}
                  <div className="mt-4 flex items-center gap-2 text-sky-600 font-medium text-sm">
                    {expandedUser === user.id
                      ? "Voir moins"
                      : "Voir les histoires"}
                    <ArrowRight
                      className={`w-4 h-4 transition-transform ${
                        expandedUser === user.id ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </Card>

                {/* Expanded Stories */}
                {expandedUser === user.id && (
                  <div className="mt-3 ml-4 space-y-3 border-l-2 border-sky-200 pl-4 flex flex-col gap-2">
                    {user.stories.length > 0 ? (
                      user.stories.map((story) => (
                        <div key={story.id}>
                          <Card className="p-4 hover:shadow-md transition-shadow group">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-base font-medium text-gray-900 group-hover:text-sky-600 transition-colors line-clamp-1">
                                {story.name}
                              </h3>
                              <Badge variant="outline" className="capitalize">
                                {story.theme}
                              </Badge>
                            </div>
                            {story.description && (
                              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                {story.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {story._count.episodes}{" "}
                                {story._count.episodes > 1
                                  ? "épisodes"
                                  : "épisode"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {story._count.characters}{" "}
                                {story._count.characters > 1
                                  ? "personnages"
                                  : "personnage"}
                              </span>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <a
                                href={`/story/${story.id}`}
                                className="flex-1 flex items-center justify-center gap-1 rounded-md border border-sky-200 px-2 py-1.5 text-xs text-sky-600 hover:bg-sky-50 transition-colors"
                              >
                                <ArrowRight className="w-3 h-3" />
                                <span>Voir</span>
                              </a>
                              {story._count?.episodes > 0 && (
                                <button
                                  onClick={() => handleDownloadPDF(story.id, story.name)}
                                  className="flex-1 flex items-center justify-center gap-1 rounded-md border border-purple-200 px-2 py-1.5 text-xs text-purple-600 hover:bg-purple-50 transition-colors"
                                  title={`${story._count?.episodes || 0} épisode${(story._count?.episodes || 0) > 1 ? 's' : ''}`}
                                >
                                  <FileDown className="w-3 h-3" />
                                  <span>PDF</span>
                                </button>
                              )}
                            </div>
                          </Card>
                        </div>
                      ))

                    ) : (
                      <p className="text-sm text-gray-600">
                        Aucune histoire publiée
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun auteur trouvé
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Essayez une autre recherche"
                : "Soyez le premier à publier une histoire!"}
            </p>
          </Card>
        )}
      </div>

      {/* Stats Footer */}
      {filteredUsers.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 py-6 border-t border-gray-200 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-blue-50 border-blue-200">
              <p className="text-sm font-medium text-blue-600 mb-2">
                Auteurs dans la communauté
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {filteredUsers.length}
              </p>
            </Card>
            <Card className="p-6 bg-green-50 border-green-200">
              <p className="text-sm font-medium text-green-600 mb-2">
                Histoires publiées
              </p>
              <p className="text-3xl font-bold text-green-900">
                {filteredUsers.reduce(
                  (sum, user) => sum + user.stories.length,
                  0
                )}
              </p>
            </Card>
            <Card className="p-6 bg-purple-50 border-purple-200">
              <p className="text-sm font-medium text-purple-600 mb-2">
                Personnages totaux
              </p>
              <p className="text-3xl font-bold text-purple-900">
                {filteredUsers.reduce(
                  (sum, user) =>
                    sum +
                    user.stories.reduce(
                      (s, story) => s + story._count.characters,
                      0
                    ),
                  0
                )}
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
