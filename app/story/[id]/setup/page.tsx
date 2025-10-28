import { Metadata } from "next";
import StorySetupClient from "@/components/story-setup-client";
import { getCharactersByStoryId } from "@/lib/character";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Story Setup - Pensaga",
  description: "Set up and configure your story on Pensaga.",
};

export default async function StorySetupPage({ params }: Props) {
  const { id } = await params;

  const characters = await getCharactersByStoryId(id);

  return <StorySetupClient storyId={id} initialCharacters={characters} />;
}
