import StorySetupClient from "@/components/story-setup-client";
import { getCharactersByStoryId } from "@/lib/character";

type Props = { params: { id: string } };

export default async function StorySetupPage({ params }: Props) {
  const storyId = params.id;

  const characters = await getCharactersByStoryId(storyId);

  return <StorySetupClient storyId={storyId} initialCharacters={characters} />;
}
