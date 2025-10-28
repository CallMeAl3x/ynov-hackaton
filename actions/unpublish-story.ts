"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export async function unpublishStory(storyId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const story = await db.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      return { success: false, error: "Story not found" };
    }

    if (story.authorId !== user.id) {
      return { success: false, error: "Not authorized" };
    }

    const updatedStory = await db.story.update({
      where: { id: storyId },
      data: { status: "DRAFT" },
    });

    return { success: true, story: updatedStory };
  } catch (error) {
    return { success: false, error: "Failed to unpublish story" };
  }
}
