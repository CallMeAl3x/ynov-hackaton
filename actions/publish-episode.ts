"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function publishEpisode(episodeId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const episode = await db.episode.findUnique({
      where: { id: episodeId },
      include: { story: true },
    });

    if (!episode) {
      return { success: false, error: "Episode not found" };
    }

    if (episode.story.authorId !== user.id) {
      return { success: false, error: "Not authorized" };
    }

    const updatedEpisode = await db.episode.update({
      where: { id: episodeId },
      data: { published: true },
    });

    return { success: true, episode: updatedEpisode };
  } catch (error) {
    return { success: false, error: "Failed to publish episode" };
  }
}
