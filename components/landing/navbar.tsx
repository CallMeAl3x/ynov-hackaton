"use client";

import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";

export const LandingNavbar = () => {
  const user = useCurrentUser();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">WF</span>
            </div>
            <span className="font-bold text-xl text-gray-900">
              Webnovel Factory
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Comment ça marche
            </Link>
            <Link
              href="/community"
              className="text-gray-600 hover:text-gray-900 transition"
            >
              Communauté
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/onboarding">
                  <Button size="sm" className="bg-black hover:bg-gray-800">
                    Créer une histoire
                  </Button>
                </Link>
                <UserButton />
              </div>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link href="/onboarding">
                  <Button size="sm" className="bg-black hover:bg-gray-800">
                    Commencer
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
