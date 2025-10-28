import { getCharacterById } from "@/lib/character";
import { getStoryById } from "@/lib/story";
import { currentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { CharacterDetailClient } from "./character-detail-client";

type Props = {
  params: Promise<{ id: string; characterId: string }>;
};

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
