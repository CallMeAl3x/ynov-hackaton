"use client";

import { logout } from "@/actions/logout";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    logout();
  };

  return (
    <span className="cursor-pointer flex items-center h-full w-full" onClick={onClick}>
      {children}
    </span>
  );
};
