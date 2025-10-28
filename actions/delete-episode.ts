"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function deleteEpisode(episodeId: string) {
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

    await db.episode.delete({
      where: { id: episodeId },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete episode" };
  }
}
