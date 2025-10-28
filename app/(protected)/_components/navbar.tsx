"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { FaCoins } from "react-icons/fa";
import { useCurrentUser } from "@/hooks/use-current-user";

export const Navbar = () => {
  const pathname = usePathname();
  const [xp, setXp] = useState(50);
  const [coins, setCoins] = useState(120);
  const [showMenu, setShowMenu] = useState(false);
  const user = useCurrentUser();

  return (
    <header className="sticky top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <nav className="flex items-center justify-between py-2 sm:py-3">
          {/* Left: logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <a href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/Pensaga.png"
                alt="Mon logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </a>

            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <a
                href="/community"
                className="text-sm md:text-base text-gray-700 hover:text-blue-700 transition-colors"
              >
                Communauté
              </a>
              <a
                href="/ranking"
                className="text-sm md:text-base text-gray-700 hover:text-blue-700 transition-colors"
              >
                Classement
              </a>
              {user && (
                <a
                  href="/storys"
                  className="text-sm md:text-base text-gray-700 hover:text-blue-700 transition-colors"
                >
                  Mes histoires
                </a>
              )}
            </div>
          </div>

          {/* Right: XP + Coins + Mobile burger */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* XP bar - Hidden on very small screens */}
            <div className="hidden xs:flex flex-col w-12 sm:w-16">
              <div className="relative w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${xp}%` }}
                />
              </div>
            </div>

            {user && (
              <>
                {/* Coins - Responsive */}
                <div className="flex items-center gap-1 text-xs sm:text-sm">
                  <FaCoins className="text-yellow-400 w-4 h-4" />
                  <span className="font-medium hidden xs:inline">{coins}</span>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-2 sm:gap-4">
                  {user && <UserButton />}
                </div>
              </>
            )}

            {/* Burger (mobile) */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 active:text-gray-900 focus:outline-none transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={showMenu}
              onClick={() => setShowMenu((s) => !s)}
            >
              <span className="sr-only">Menu</span>
              {showMenu ? (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {showMenu && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-gray-100 bg-white overflow-y-auto max-h-[calc(100vh-60px)]"
            onClick={() => setShowMenu(false)}
          >
            <ul className="flex flex-col space-y-1 py-2">
              <li>
                <a
                  href="/community"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Communauté
                </a>
              </li>
              <li>
                <a
                  href="/ranking"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Classement
                </a>
              </li>
              <li>
                <a
                  href="/storys"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Mes histoires
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
