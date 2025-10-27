import { auth } from "@/auth";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Webnovel Factory",
  description: "Créez et lisez des histoires assistées par IA",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Webnovel Factory",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Webnovel Factory",
    title: "Webnovel Factory",
    description: "Créez et lisez des histoires assistées par IA",
  },
  twitter: {
    card: "summary",
    title: "Webnovel Factory",
    description: "Créez et lisez des histoires assistées par IA",
  },
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="fr">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
          <meta name="theme-color" content="#000000" />
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        </head>
        <body className="antialiased">{children}</body>
      </html>
    </SessionProvider>
  );
}
