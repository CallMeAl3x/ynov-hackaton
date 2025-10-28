"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Sparkles, BookOpen, Wand2 } from "lucide-react";

export const Hero = () => {
  const user = useCurrentUser();

  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-700">
              Propulsé par l'Intelligence Artificielle
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Créez des histoires
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              extraordinaires
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Webnovel Factory vous aide à écrire des histoires captivantes grâce
            à l'intelligence artificielle. Créez, partagez et découvrez des
            univers narratifs uniques.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {user ? (
              <Link href="/onboarding">
                <Button
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg"
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  Créer votre histoire
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/onboarding">
                  <Button
                    size="lg"
                    className="bg-black hover:bg-gray-800 text-white px-8 py-6 text-lg"
                  >
                    <Wand2 className="w-5 h-5 mr-2" />
                    Commencer gratuitement
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 py-6 text-lg"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Découvrir les histoires
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-gray-900">1000+</div>
              <div className="text-sm text-gray-600">Histoires créées</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Auteurs actifs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600">Lecteurs</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
