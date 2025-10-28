import { getEpisodeWithStory } from "@/lib/episode";
import { EpisodePageClient } from "./episode-page-client";
import { currentUser } from "@/lib/auth";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const episode = await getEpisodeWithStory(id);

  if (!episode) {
    return {
      title: "Épisode non trouvé",
    };
  }

  return {
    title: `${episode.name} - ${episode.story.name}`,
    description: `Épisode ${episode.order} de ${episode.story.name}`,
  };
}

export default async function EpisodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const episode = await getEpisodeWithStory(id);
  const user = await currentUser();

  if (!episode) {
    notFound();
  }

  const isAuthor = user?.id === episode.story.authorId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <EpisodePageClient
        episodeId={episode.id}
        storyId={episode.story.id}
        storyName={episode.story.name}
        episodeNumber={episode.order}
        episodeTitle={episode.name}
        episodeContent={episode.content}
        createdAt={episode.createdAt instanceof Date ? episode.createdAt.toISOString() : episode.createdAt}
        isAuthor={isAuthor}
      />
    </div>
  );
}
