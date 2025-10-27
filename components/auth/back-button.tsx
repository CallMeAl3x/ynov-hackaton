"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BackButtonProps {
  href: string;
  label: string;
}

export const BackButton = ({ label, href }: BackButtonProps) => {
  return (
    <Button
      variant="link"
      className="font-normal w-full text-gray-600 hover:text-black text-sm p-0 h-auto"
      asChild
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};
