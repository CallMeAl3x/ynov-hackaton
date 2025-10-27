"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { StoryBasicSchema } from "@/schemas";

export const updateStory = async (id: string, data: unknown) => {
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

    // Validate data
    const validatedData = StoryBasicSchema.partial().parse(data);

    const updatedStory = await db.story.update({
      where: { id },
      data: validatedData,
    });

    return { success: true, story: updatedStory };
  } catch (error) {
    console.error("[UPDATE_STORY]", error);
    return { error: "Failed to update story" };
  }
};
