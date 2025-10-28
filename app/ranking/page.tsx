import { Metadata } from "next";
import { PrismaClient } from "@prisma/client";
import { RankingClient } from "./ranking-client";

export const metadata: Metadata = {
  title: "Rankings - Pensaga",
  description: "View Pensaga creator rankings and statistics.",
};

const prisma = new PrismaClient();

interface RankingUser {
  id: string;
  name: string;
  points: number;
  rank: number;
  image?: string;
  storiesCount: number;
  email: string;
}

async function getRankingUsers(): Promise<RankingUser[]> {
  try {
    // Récupère tous les utilisateurs avec le nombre d'histoires
    const users = await prisma.user.findMany({
      include: {
        stories: {
          where: {
            status: "PUBLISHED",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Calcule les points de chaque utilisateur basé sur les histoires publiées
    const rankingUsers: RankingUser[] = users
      .map((user, index) => ({
        id: user.id,
        name: user.name || "Utilisateur",
        email: user.email || "",
        points: user.stories.length * 100 + Math.floor(Math.random() * 500), // Fake points calculation
        rank: index + 1,
        storiesCount: user.stories.length,
        image: user.image || undefined,
      }))
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

    return rankingUsers;
  } catch (error) {
    console.error("Error fetching ranking users:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

export default async function RankingPage() {
  const users = await getRankingUsers();

  return <RankingClient users={users} />;
}
