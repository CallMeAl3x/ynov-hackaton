import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Image
                  src="/Pensaga.png"
                  alt="Mon logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>
              <span className="font-bold text-xl text-white">
                Webnovel Factory
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              Créez des histoires extraordinaires avec l'aide de l'intelligence
              artificielle. Rejoignez notre communauté de créateurs passionnés.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Produit</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="hover:text-white transition">
                  Fonctionnalités
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="hover:text-white transition"
                >
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link href="#community" className="hover:text-white transition">
                  Communauté
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-white mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© 2025 Webnovel Factory. Tous droits réservés.</p>
          <p className="mt-2">Projet développé lors du hackathon Ynov 2025</p>
        </div>
      </div>
    </footer>
  );
};
