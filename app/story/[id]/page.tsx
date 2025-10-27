import { getStoryById } from "@/lib/story";
import { getCharactersByStoryId } from "@/lib/character";
import { notFound } from "next/navigation";
import { StoryViewClient } from "./story-view-client";

type Props = { params: Promise<{ id: string }> };

export default async function StoryPage({ params }: Props) {
  const { id } = await params;

  const [story, characters] = await Promise.all([
    getStoryById(id),
    getCharactersByStoryId(id),
  ]);

  if (!story) {
    notFound();
  }

  return <StoryViewClient story={story} characters={characters} />;
}
