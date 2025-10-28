"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  const user = useCurrentUser();

  return (
    <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Prêt à créer votre chef-d'œuvre ?
        </h2>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Rejoignez des centaines d'auteurs qui utilisent déjà Webnovel Factory
          pour donner vie à leurs histoires
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {user ? (
            <Link href="/onboarding">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg"
                >
                  Créer un compte gratuit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2  hover:bg-white/10 px-8 py-6 text-lg"
                >
                  Se connecter
                </Button>
              </Link>
            </>
          )}
        </div>

        {!user && (
          <p className="text-purple-100 text-sm mt-6">
            Aucune carte bancaire requise • Gratuit pour toujours
          </p>
        )}
      </div>
    </section>
  );
};
