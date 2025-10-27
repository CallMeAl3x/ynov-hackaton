import React from "react";
import Link from "next/link";

interface HeaderProps {
  label: string;
}

const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <Link href="/" className="flex items-center space-x-2 mb-2 hover:opacity-80 transition">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">WF</span>
        </div>
        <span className="font-bold text-lg text-gray-900">
          Webnovel Factory
        </span>
      </Link>
      <h2 className="text-2xl font-bold text-gray-900">{label}</h2>
      <p className="text-gray-600 text-sm">Rejoignez notre communauté de créateurs</p>
    </div>
  );
};

export default Header;
