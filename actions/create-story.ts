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

    if (!user || !user.id) {
      return {
        error: "LOGIN_REQUIRED",
        message: "You must be logged in to save your story",
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
    console.error("[CREATE_STORY]", error);
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
