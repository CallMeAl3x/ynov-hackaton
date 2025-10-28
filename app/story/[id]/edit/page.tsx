import { getStoryById } from "@/lib/story";
import { notFound } from "next/navigation";
import { EditStoryPage } from "./edit-story-page";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function StoryEditPage({ params }: Props) {
  const { id } = await params;

  const story = await getStoryById(id);

  if (!story) {
    notFound();
  }

  return <EditStoryPage story={story} />;
}
