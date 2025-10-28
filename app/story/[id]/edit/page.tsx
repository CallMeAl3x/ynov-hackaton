import { Metadata } from "next";
import { getStoryById } from "@/lib/story";
import { notFound } from "next/navigation";
import { EditStoryPage } from "./edit-story-page";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await getStoryById(id);

  return {
    title: story ? `Edit ${story.name} - Pensaga` : "Edit Story - Pensaga",
    description: "Edit your story details and information.",
  };
}

export default async function StoryEditPage({ params }: Props) {
  const { id } = await params;

  const story = await getStoryById(id);

  if (!story) {
    notFound();
  }

  return <EditStoryPage story={story} />;
}
