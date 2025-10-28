"use client";

import { UserButton } from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { FaCoins } from "react-icons/fa";

export const Navbar = () => {
  const pathname = usePathname();
  const [xp, setXp] = useState(50);
  const [coins, setCoins] = useState(120);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4">
        <nav className="flex items-center justify-between py-2">
          {/* Left: logo */}
          <div className="flex items-center space-x-3">
            <a href="/" className="flex items-center">
              <Image
                src="/Pensaga.png"
                alt="Mon logo"
                width={100}
                height={100}
                className="rounded-full"
              />
            </a>

            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-6">
              <a
                href="/community"
                className="text-gray-700 hover:text-blue-700"
              >
                Communauté
              </a>
              <a href="/storys" className="text-gray-700 hover:text-blue-700">
                Mes histoires
              </a>
            </div>
          </div>

          {/* Right: XP + Coins + Mobile burger */}
          <div className="flex items-center space-x-4">
            {/* XP bar compacte */}
            <div className="flex flex-col w-16">
              <div className="relative w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${xp}%` }}
                />
              </div>
            </div>

            {/* Coins */}
            <div className="flex items-center space-x-1">
              <FaCoins className="text-yellow-400 w-4 h-4" />
              <span className="text-sm font-medium">{coins}</span>
            </div>

            {/* Profile */}
            <div className="flex items-center space-x-4">
              <Link href="/onboarding"></Link>
              <UserButton />
            </div>

            {/* Burger (mobile) */}
            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
              aria-controls="mobile-menu"
              aria-expanded={showMenu}
              onClick={() => setShowMenu((s) => !s)}
            >
              <span className="sr-only">Open main menu</span>
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
                  ></path>
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
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu: uniquement les liens */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-max-h duration-200 ${
            showMenu ? "max-h-96" : "max-h-0"
          }`}
          aria-hidden={!showMenu}
        >
          <ul className="flex flex-col space-y-2 pb-4">
            <li>
              <a
                href="/community"
                className="block px-2 py-2 rounded hover:bg-gray-100"
              >
                Communauté
              </a>
            </li>
            <li>
              <a
                href="/storys"
                className="block px-2 py-2 rounded hover:bg-gray-100"
              >
                Mes histoires
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
