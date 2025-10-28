"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";
import { StoryBasicSchema, AIStoryGenerationSchema } from "@/schemas";
import * as z from "zod";

export const createStory = async (
  values: z.infer<typeof StoryBasicSchema>
) => {
  try {
    // Validate input
    const validatedFields = StoryBasicSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        error: "Invalid story data",
        storyId: null
      };
    }

    // Get current user
    const user = await currentUser();

    console.log("[CREATE_STORY] User from session:", JSON.stringify(user, null, 2));

    if (!user || !user.id) {
      console.log("[CREATE_STORY] User not found or no ID:", user);
      return {
        error: "LOGIN_REQUIRED",
        message: "You must be logged in to save your story",
        storyId: null
      };
    }

    // Verify user exists in database
    const existingUser = await db.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true }
    });

    console.log("[CREATE_STORY] User lookup result:", existingUser);

    if (!existingUser) {
      console.log("[CREATE_STORY] User ID does not exist in database:", user.id);
      return {
        error: "USER_NOT_FOUND",
        message: "Your user account could not be found in the database",
        storyId: null
      };
    }

    const { name, theme, subject, description } = validatedFields.data;

    // Create the story
    const story = await db.story.create({
      data: {
        name,
        theme,
        subject,
        description,
        authorId: user.id,
        status: "DRAFT"
      }
    });

    return {
      success: true,
      storyId: story.id,
      story
    };
  } catch (error) {
    console.error("[CREATE_STORY] Error:", error);
    if (error instanceof Error) {
      console.error("[CREATE_STORY] Error message:", error.message);
      if (error.message.includes("Foreign key constraint failed")) {
        return {
          error: "USER_NOT_FOUND",
          message: "Your user account could not be found. Please log out and log back in.",
          storyId: null
        };
      }
    }
    return {
      error: "Failed to create story. Please try again.",
      storyId: null
    };
  }
};

export const generateStoryWithAI = async (
  subject: string
) => {
  try {
    // Validate input
    const validatedFields = AIStoryGenerationSchema.safeParse({ subject });

    if (!validatedFields.success) {
      return {
        error: "Invalid story subject",
        storyId: null
      };
    }

    // Get current user
    const user = await currentUser();

    if (!user || !user.id) {
      return {
        error: "LOGIN_REQUIRED",
        message: "You must be logged in to save your story",
        storyId: null
      };
    }

    // TODO: Integrate with AI service (OpenAI, Anthropic, etc.)
    // This is a placeholder for the AI story generation logic
    // The flow would be:
    // 1. Call AI API with the subject
    // 2. Get generated story details (title, theme, plot, characters)
    // 3. Create story in database
    // 4. Create conversation record for tracking
    // 5. Return the created story with generated content

    console.log("[GENERATE_STORY_WITH_AI] Subject:", subject);

    // Placeholder response
    return {
      success: false,
      error: "AI story generation not yet configured. Please set up your AI service provider.",
      storyId: null
    };

  } catch (error) {
    console.error("[GENERATE_STORY_WITH_AI]", error);
    return {
      error: "Failed to generate story. Please try again.",
      storyId: null
    };
  }
};
