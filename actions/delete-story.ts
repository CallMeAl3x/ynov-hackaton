"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const deleteStory = async (id: string) => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "LOGIN_REQUIRED" };
    }

    const story = await db.story.findUnique({ where: { id } });

    if (!story) {
      return { error: "NOT_FOUND" };
    }

    if (story.authorId !== user.id) {
      return { error: "NOT_AUTHORIZED" };
    }

    await db.story.delete({ where: { id } });

    return { success: true };
  } catch (error) {
    console.error("[DELETE_STORY]", error);
    return { error: "Failed to delete story" };
  }
};
