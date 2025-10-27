"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const deleteCharacter = async (id: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.id) return { error: "LOGIN_REQUIRED" };

    const character = await db.character.findUnique({ where: { id } });
    if (!character) return { error: "NOT_FOUND" };

    // Verify ownership via story
    const story = await db.story.findUnique({
      where: { id: character.storyId },
    });
    if (!story) return { error: "NOT_FOUND" };
    if (story.authorId !== user.id) return { error: "NOT_AUTHORIZED" };

    await db.character.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    console.error("[DELETE_CHARACTER]", err);
    return { error: "Failed to delete character" };
  }
};
