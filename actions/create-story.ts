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

    // Verify user exists in database
    const existingUser = await db.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, name: true }
    });

    if (!existingUser) {
      return {
        error: "USER_NOT_FOUND",
        message: "Your user account could not be found in the database",
        storyId: null
      };
    }

    console.log("[GENERATE_STORY_WITH_AI] Subject:", subject);

    // Call Ollama API to generate story details
    const prompt = `Tu es un écrivain créatif. En te basant sur le concept d'histoire suivant, génère une histoire captivante avec:
1. Un titre attrayant (court et accrocheur)
2. Un genre/thème (parmi: fantasy, sci-fi, romance, mystère, horreur, aventure, drame, autre)
3. Un résumé détaillé de l'intrigue (2-3 paragraphes)
4. Une brève description pour les lecteurs (1 paragraphe)

Concept d'histoire: ${subject}

Réponds UNIQUEMENT avec un objet JSON valide (pas de markdown, pas de texte supplémentaire) avec ces clés exactes:
{
  "title": "...",
  "theme": "...",
  "subject": "...",
  "description": "..."
}`;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const ollUrl = `${baseUrl}/api/ollama`;

    console.log("[GENERATE_STORY_WITH_AI] Calling Ollama API at:", ollUrl);

    const response = await fetch(ollUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        stream: false,
        model: "gpt-oss:120b-cloud"
      })
    });

    const responseText = await response.text();
    console.log("[GENERATE_STORY_WITH_AI] Response status:", response.status);
    console.log("[GENERATE_STORY_WITH_AI] Response text (first 500 chars):", responseText.substring(0, 500));

    if (!response.ok) {
      console.error("[GENERATE_STORY_WITH_AI] API Error - Status:", response.status);
      console.error("[GENERATE_STORY_WITH_AI] API Error - Response:", responseText);
      return {
        error: `Failed to generate story with AI (Status: ${response.status}). Please try again.`,
        storyId: null
      };
    }

    let apiResult;
    try {
      apiResult = JSON.parse(responseText);
    } catch (e) {
      console.error("[GENERATE_STORY_WITH_AI] Failed to parse response as JSON:", e);
      console.error("[GENERATE_STORY_WITH_AI] Response was:", responseText.substring(0, 1000));
      return {
        error: "AI API returned invalid response. Please try again.",
        storyId: null
      };
    }

    const content = apiResult.response || apiResult.output || "";
    console.log("[GENERATE_STORY_WITH_AI] Generated content:", content);

    // Parse the JSON response
    let storyData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      storyData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("[GENERATE_STORY_WITH_AI] Failed to parse AI response:", parseError);
      return {
        error: "Failed to parse AI-generated content. Please try again.",
        storyId: null
      };
    }

    // Validate the parsed data
    if (!storyData.title || !storyData.theme || !storyData.subject) {
      return {
        error: "AI generated incomplete story data. Please try again.",
        storyId: null
      };
    }

    // Create the story in database
    const story = await db.story.create({
      data: {
        name: storyData.title,
        theme: storyData.theme.toLowerCase(),
        subject: storyData.subject,
        description: storyData.description || "",
        authorId: user.id,
        status: "DRAFT"
      }
    });

    console.log("[GENERATE_STORY_WITH_AI] Story created:", story.id);

    // Generate characters with AI
    console.log("[GENERATE_STORY_WITH_AI] Generating characters...");

    const charactersPrompt = `Tu es un écrivain créatif. En te basant sur cette histoire:
Titre: ${storyData.title}
Thème: ${storyData.theme}
Résumé: ${storyData.subject}

Génère 3-4 personnages principaux pour cette histoire. Inclus:
- 1 protagoniste (héros principal)
- 1 antagoniste (villain principal ou obstacle)
- 1-2 personnages secondaires importants pour l'intrigue

Réponds UNIQUEMENT avec un tableau JSON valide (pas de markdown, pas de texte supplémentaire) avec cette structure exacte:
[
  {
    "name": "Nom du personnage",
    "description": "Une description détaillée du personnage, sa personnalité, son rôle dans l'histoire, et ses relations avec les autres personnages",
    "role": "PROTAGONIST" | "ANTAGONIST" | "SECONDARY" | "MINOR"
  }
]

Assure-toi que les valeurs de role sont exactement l'une de: PROTAGONIST, ANTAGONIST, SECONDARY, MINOR`;

    const characterResponse = await fetch(`${baseUrl}/api/ollama`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: charactersPrompt,
        stream: false,
        model: "gpt-oss:120b-cloud"
      })
    });

    let createdCharacters = [];

    if (characterResponse.ok) {
      try {
        const charResponseText = await characterResponse.text();
        console.log("[GENERATE_STORY_WITH_AI] Character response:", charResponseText.substring(0, 500));

        const charApiResult = JSON.parse(charResponseText);
        const charContent = charApiResult.response || charApiResult.output || "";

        // Extract JSON array from the response
        const jsonMatch = charContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const characters = JSON.parse(jsonMatch[0]);

          // Create characters in database
          for (const char of characters) {
            if (char.name && char.description && char.role) {
              try {
                const character = await db.character.create({
                  data: {
                    name: char.name,
                    description: char.description,
                    role: char.role,
                    storyId: story.id
                  }
                });
                createdCharacters.push(character);
              } catch (charError) {
                console.error("[GENERATE_STORY_WITH_AI] Error creating character:", charError);
                // Continue creating other characters even if one fails
              }
            }
          }
          console.log("[GENERATE_STORY_WITH_AI] Created characters:", createdCharacters.length);
        }
      } catch (charParseError) {
        console.error("[GENERATE_STORY_WITH_AI] Failed to parse characters:", charParseError);
        // Continue without characters if parsing fails
      }
    } else {
      console.warn("[GENERATE_STORY_WITH_AI] Failed to generate characters, continuing without them");
    }

    return {
      success: true,
      storyId: story.id,
      story,
      characters: createdCharacters
    };

  } catch (error) {
    console.error("[GENERATE_STORY_WITH_AI]", error);
    if (error instanceof Error) {
      console.error("[GENERATE_STORY_WITH_AI] Error message:", error.message);
      if (error.message.includes("Foreign key constraint failed")) {
        return {
          error: "USER_NOT_FOUND",
          message: "Your user account could not be found. Please log out and log back in.",
          storyId: null
        };
      }
    }
    return {
      error: "Failed to generate story. Please try again.",
      storyId: null
    };
  }
};
