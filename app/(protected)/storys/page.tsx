import { getStoryByUserId } from "@/lib/story";
import { currentUser } from "@/lib/auth";
import Link from "next/link";
import { StorysClient } from "./storys-client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Plus } from "lucide-react";

const StorysPage = async () => {
  const user = await currentUser();
  if (!user || !user.id) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Vous devez être connecté</p>
        </div>
      </div>
    );
  }

  const storys = await getStoryByUserId(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white relative">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-sky-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Mes histoires
                </h1>
                <p className="text-sm text-gray-600">
                  Gérez et créez vos web novels
                </p>
              </div>
            </div>
            <Link href="/onboarding/new">
              <Button className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700">
                <Plus className="w-4 h-4" />
                Nouvelle histoire
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {storys.length === 0 ? (
          <Card className="p-16 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Vous n'avez pas encore d'histoires
            </h2>
            <p className="text-gray-600 mb-6">
              Créez votre première histoire et commencez à écrire votre web
              novel!
            </p>
            <Link href="/onboarding/new">
              <Button className="bg-sky-600 hover:bg-sky-700">
                Créer une histoire
              </Button>
            </Link>
          </Card>
        ) : (
          <div>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Vous avez{" "}
                <span className="font-semibold text-gray-900">
                  {storys.length}
                </span>{" "}
                histoir{storys.length > 1 ? "es" : "e"}
              </p>
            </div>

            <StorysClient stories={storys} />
          </div>
        )}
      </main>
    </div>
  );
};

export default StorysPage;
