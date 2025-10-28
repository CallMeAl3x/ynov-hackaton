import StorySetupClient from "@/components/story-setup-client";
import { getCharactersByStoryId } from "@/lib/character";

type Props = { params: Promise<{ id: string }> };

export default async function StorySetupPage({ params }: Props) {
  const { id } = await params;

  const characters = await getCharactersByStoryId(id);

  return <StorySetupClient storyId={id} initialCharacters={characters} />;
}
