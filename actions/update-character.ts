"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CharacterCreateSchema } from "@/schemas";

export const updateCharacter = async (id: string, data: unknown) => {
  try {
    const user = await currentUser();

    if (!user || !user.id) {
      return { error: "LOGIN_REQUIRED" };
    }

    const character = await db.character.findUnique({ where: { id } });

    if (!character) {
      return { error: "NOT_FOUND" };
    }

    // Verify ownership through story
    const story = await db.story.findUnique({
      where: { id: character.storyId },
    });

    if (!story || story.authorId !== user.id) {
      return { error: "NOT_AUTHORIZED" };
    }

    // Validate data
    const validatedData = CharacterCreateSchema.partial().parse(data);

    const updatedCharacter = await db.character.update({
      where: { id },
      data: validatedData,
    });

    return { success: true, character: updatedCharacter };
  } catch (error) {
    console.error("[UPDATE_CHARACTER]", error);
    return { error: "Failed to update character" };
  }
};
