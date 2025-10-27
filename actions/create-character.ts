"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { CharacterCreateSchema } from "@/schemas";
import * as z from "zod";

export const createCharacter = async (
  storyId: string,
  values: z.infer<typeof CharacterCreateSchema>
) => {
  try {
    // Validate input
    const validatedFields = CharacterCreateSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        error: "Invalid character data",
        characterId: null
      };
    }

    // Get current user
    const user = await currentUser();

    if (!user || !user.id) {
      return {
        error: "LOGIN_REQUIRED",
        message: "You must be logged in to create characters",
        characterId: null
      };
    }

    // Verify that the user owns the story
    const story = await db.story.findFirst({
      where: {
        id: storyId,
        authorId: user.id
      }
    });

    if (!story) {
      return {
        error: "Story not found or you don't have permission to edit it",
        characterId: null
      };
    }

    const { name, description, role } = validatedFields.data;

    // Create the character
    const character = await db.character.create({
      data: {
        name,
        description,
        role,
        storyId: storyId
      }
    });

    return {
      success: true,
      characterId: character.id,
      character
    };
  } catch (error) {
    console.error("[CREATE_CHARACTER]", error);
    return {
      error: "Failed to create character. Please try again.",
      characterId: null
    };
  }
};
