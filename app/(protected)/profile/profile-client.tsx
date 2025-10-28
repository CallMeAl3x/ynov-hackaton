"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, BookOpen, Settings, FileText, Users } from "lucide-react";
import { FaUser } from "react-icons/fa";

type Story = {
  id: string;
  name: string;
  description: string | null;
  theme: string;
  status: string;
  createdAt: Date;
};

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

interface ProfileClientProps {
  user: User;
  stories: Story[];
}

export function ProfileClient({ user, stories }: ProfileClientProps) {
  const router = useRouter();
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const publishedStories = stories.filter((s) => s.status === "PUBLISHED");
  const draftStories = stories.filter((s) => s.status === "DRAFT");

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  };

  return (
    <>
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* User Info Card */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
              <AvatarFallback className="bg-sky-500 text-white text-xl">
                <FaUser className="text-white text-lg" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {user?.name || "Utilisateur"}
              </h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Histoires publiées
                  </p>
                  <p className="text-2xl font-bold text-sky-600">
                    {publishedStories.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Brouillons
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {draftStories.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total d'histoires
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stories.length}
                  </p>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="self-start"
              onClick={() =>
                alert("Fonctionnalité de modification du profil à venir")
              }
            >
              <Settings className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </div>
        </Card>

        {/* Stories Tabs */}
        <div className="space-y-6">
          {/* Published Stories */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-sky-600" />
              <h3 className="text-xl font-semibold text-gray-900">
                Histoires publiées ({publishedStories.length})
              </h3>
            </div>

            {publishedStories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {publishedStories.map((story) => (
                  <Link key={story.id} href={`/story/${story.id}`}>
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 hover:text-sky-600 transition-colors line-clamp-2">
                          {story.name}
                        </h4>
                        <Badge className="bg-green-100 text-green-800 ml-2">
                          Publié
                        </Badge>
                      </div>
                      {story.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {story.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Thème: {story.theme}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Créée le {formatDate(story.createdAt)}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center bg-gray-50">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">Aucune histoire publiée</p>
                <Link href="/storys/new">
                  <Button className="mt-4">Créer une histoire</Button>
                </Link>
              </Card>
            )}
          </div>

          {/* Draft Stories */}
          {draftStories.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-6 h-6 text-yellow-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Brouillons ({draftStories.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {draftStories.map((story) => (
                  <Link key={story.id} href={`/story/${story.id}`}>
                    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer h-full bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900 hover:text-sky-600 transition-colors line-clamp-2">
                          {story.name}
                        </h4>
                        <Badge className="bg-yellow-100 text-yellow-800 ml-2">
                          Brouillon
                        </Badge>
                      </div>
                      {story.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {story.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Thème: {story.theme}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Créée le {formatDate(story.createdAt)}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
