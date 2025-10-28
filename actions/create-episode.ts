"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const createEpisode = async (
  storyId: string,
  data: {
    name: string;
    content: string;
    order: number;
  }
) => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "LOGIN_REQUIRED" };
    }

    const story = await db.story.findUnique({ where: { id: storyId } });

    if (!story) {
      return { error: "NOT_FOUND" };
    }

    if (story.authorId !== user.id) {
      return { error: "NOT_AUTHORIZED" };
    }

    const episode = await db.episode.create({
      data: {
        name: data.name,
        content: data.content,
        order: data.order,
        published: false,
        storyId,
      },
    });

    return { success: true, episode };
  } catch (error) {
    console.error("[CREATE_EPISODE]", error);
    return { error: "Failed to create episode" };
  }
};
