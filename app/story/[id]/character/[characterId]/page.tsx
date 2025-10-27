import { getCharacterById } from "@/lib/character";
import { getStoryById } from "@/lib/story";
import { notFound } from "next/navigation";
import { CharacterDetailClient } from "./character-detail-client";

type Props = {
  params: Promise<{ id: string; characterId: string }>;
};

export default async function CharacterPage({ params }: Props) {
  const { id, characterId } = await params;

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

  return <CharacterDetailClient character={character} story={story} />;
}
