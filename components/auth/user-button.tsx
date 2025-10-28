"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import { LogoutButton } from "@/components/auth/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogOut, User } from "lucide-react";
import { FaUser } from "react-icons/fa";
import Link from "next/link";

export const UserButton = () => {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 rounded-lg hover:bg-gray-100 px-2 py-1 transition-colors cursor-pointer">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.image || ""} alt="avatar" />
            <AvatarFallback className="bg-sky-500">
              <FaUser className="text-white text-sm" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-gray-900 hidden sm:block max-w-[120px] truncate">
            {user?.name || "Utilisateur"}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel className="font-semibold">
          {user?.name || "Mon compte"}
        </DropdownMenuLabel>
        <div className="px-2 py-1.5 text-sm text-gray-600">
          {user?.email}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            Mon profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogoutButton>
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
