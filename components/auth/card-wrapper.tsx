"use client";

import { BackButton } from "@/components/auth/back-button";
import Header from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial = false
}: CardWrapperProps) => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="pb-6">
          <Header label={headerLabel} />
        </CardHeader>
        <CardContent className="pb-6">{children}</CardContent>
        {showSocial && (
          <CardFooter className="pb-6 flex flex-col gap-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>
            <Social />
          </CardFooter>
        )}
        <CardFooter className="flex justify-center pt-0">
          <BackButton label={backButtonLabel} href={backButtonHref}></BackButton>
        </CardFooter>
      </Card>
    </div>
  );
};
