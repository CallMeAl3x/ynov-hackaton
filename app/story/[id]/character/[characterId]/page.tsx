import { Metadata } from "next";
import { getCharacterById } from "@/lib/character";
import { getStoryById } from "@/lib/story";
import { currentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { CharacterDetailClient } from "./character-detail-client";

type Props = {
  params: Promise<{ id: string; characterId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { characterId } = await params;
  const character = await getCharacterById(characterId);

  return {
    title: character ? `${character.name} - Pensaga` : "Character - Pensaga",
    description: character?.description || "View character details on Pensaga.",
  };
}

export default async function CharacterPage({ params }: Props) {
  const { id, characterId } = await params;
  const user = await currentUser();

  const [character, story] = await Promise.all([
    getCharacterById(characterId),
    getStoryById(id),
  ]);

  if (!character || !story) {
    notFound();
  }

  // Verify character belongs to story
  if (character.storyId !== id) {
    notFound();
  }

  // Check if current user is the story author
  const isAuthor = user?.id === story.authorId;

  return (
    <CharacterDetailClient
      character={character}
      story={story}
      isAuthor={isAuthor}
    />
  );
}
