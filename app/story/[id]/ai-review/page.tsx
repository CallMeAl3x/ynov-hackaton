import { Metadata } from "next";
import AIStoryReview from "@/components/ai-story-review";
import { getStoryById } from "@/lib/story";
import { getCharactersByStoryId } from "@/lib/character";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await getStoryById(id);

  return {
    title: story ? `Évaluation IA - ${story.name} - Pensaga` : "Évaluation IA - Pensaga",
    description: "Obtenez un retour d'IA sur votre histoire.",
  };
}

export default async function AIReviewPage({ params }: Props) {
  const { id } = await params;
  const user = await currentUser();

  if (!user || !user.id) {
    redirect("/auth/login");
  }

  const story = await getStoryById(id);

  if (!story || story.authorId !== user.id) {
    redirect("/storys");
  }

  const characters = await getCharactersByStoryId(id);

  return (
    <AIStoryReview
      story={{
        id: story.id,
        name: story.name,
        theme: story.theme,
        subject: story.subject,
        description: story.description || undefined,
      }}
      characters={characters}
    />
  );
}
