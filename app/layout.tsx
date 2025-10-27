import { auth } from "@/auth";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

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
