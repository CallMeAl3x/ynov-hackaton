import { currentUser } from "@/lib/auth";
import { getStoryByUserId } from "@/lib/story";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, ArrowRight, User } from "lucide-react";
import Navbar from "@/app/(protected)/_components/navbar";

export async function Dashboard() {
  const user = await currentUser();
  const stories = user && user.id ? await getStoryByUserId(user.id) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Vos histoires
          </h2>
          <p className="text-gray-600">
            Gérez et créez vos histoires incroyables
          </p>
        </div>

        {/* Create Button */}
        <div className="mb-8 flex gap-3 flex-col sm:flex-row">
          <Link href="/onboarding/new">
            <Button className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700">
              <Plus className="w-5 h-5" />
              Créer une nouvelle histoire
            </Button>
          </Link>
          <Link href="/storys">
            <Button
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              Voir toutes les histoires
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Stories Grid */}
        {stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.slice(0, 6).map((story: any) => (
              <Link key={story.id} href={`/story/${story.id}`}>
                <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
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
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-sky-600 transition-colors line-clamp-2">
                    {story.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {story.description || story.subject}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      {story.theme && (
                        <span>
                          Thème:{" "}
                          <span className="font-medium capitalize">
                            {story.theme}
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Pas encore d'histoires
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez à créer votre première histoire dès maintenant!
            </p>
            <Link href="/onboarding/new">
              <Button className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700">
                <Plus className="w-5 h-5" />
                Créer une histoire
              </Button>
            </Link>
          </Card>
        )}

        {/* View All Link */}
        {stories.length > 6 && (
          <div className="mt-8 text-center">
            <Link href="/storys">
              <Button variant="outline">
                Voir les {stories.length} histoires
              </Button>
            </Link>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <p className="text-sm font-medium text-blue-600 mb-2">
              Total d'histoires
            </p>
            <p className="text-3xl font-bold text-blue-900">{stories.length}</p>
          </Card>
          <Card className="p-6 bg-green-50 border-green-200">
            <p className="text-sm font-medium text-green-600 mb-2">
              Histoires publiées
            </p>
            <p className="text-3xl font-bold text-green-900">
              {stories.filter((s: any) => s.status === "PUBLISHED").length}
            </p>
          </Card>
          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <p className="text-sm font-medium text-yellow-600 mb-2">
              En brouillon
            </p>
            <p className="text-3xl font-bold text-yellow-900">
              {stories.filter((s: any) => s.status === "DRAFT").length}
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
