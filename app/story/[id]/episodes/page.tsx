import { Metadata } from "next";
import { getStoryById } from "@/lib/story";
import { getCharactersByStoryId } from "@/lib/character";
import { getEpisodesByStoryId } from "@/lib/episode";
import { notFound } from "next/navigation";
import { EpisodeGeneratorClient } from "./episode-generator-client";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await getStoryById(id);

  return {
    title: story ? `Generate Episode - ${story.name} - Pensaga` : "Generate Episode - Pensaga",
    description: "Create new episodes for your story with AI assistance.",
  };
}

export default async function EpisodeGeneratorPage({ params }: Props) {
  const { id } = await params;

  const [story, characters, episodes] = await Promise.all([
    getStoryById(id),
    getCharactersByStoryId(id),
    getEpisodesByStoryId(id),
  ]);

  if (!story) {
    notFound();
  }

  return (
    <EpisodeGeneratorClient
      story={story}
      characters={characters}
      episodes={episodes}
    />
  );
}
