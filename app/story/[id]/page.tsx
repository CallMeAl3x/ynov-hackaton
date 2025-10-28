import { Metadata } from "next";
import { getStoryById } from "@/lib/story";
import { getCharactersByStoryId } from "@/lib/character";
import { getEpisodesByStoryId } from "@/lib/episode";
import { currentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { StoryViewClient } from "./story-view-client";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await getStoryById(id);

  if (!story) {
    return {
      title: "Story Not Found - Pensaga",
      description: "The story you're looking for doesn't exist.",
    };
  }

  return {
    title: `${story.name} - Pensaga`,
    description: story.description || `Read ${story.name} on Pensaga`,
  };
}

export default async function StoryPage({ params }: Props) {
  const { id } = await params;
  const user = await currentUser();

  const [story, characters, episodes] = await Promise.all([
    getStoryById(id),
    getCharactersByStoryId(id),
    getEpisodesByStoryId(id),
  ]);

  if (!story) {
    notFound();
  }

  const isAuthor = user?.id === story.authorId;

  return <StoryViewClient story={story} characters={characters} episodes={episodes} isAuthor={isAuthor} />;
}
