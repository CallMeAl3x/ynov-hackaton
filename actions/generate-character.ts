"use server";

import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const generateCharacterWithAI = async (
  storyId: string,
  prompt?: string
) => {
  try {
    // Get current user
    const user = await currentUser();

    if (!user || !user.id) {
      return {
        error: "LOGIN_REQUIRED",
        message: "You must be logged in to generate characters",
        character: null
      };
    }

    // Verify that the user owns the story
    const story = await db.story.findFirst({
      where: {
        id: storyId,
        authorId: user.id
      },
      include: {
        characters: true,
        episodes: true
      }
    });

    if (!story) {
      return {
        error: "Story not found or you don't have permission to edit it",
        character: null
      };
    }

    // Build character generation prompt
    const existingCharacters = story.characters
      .map((c) => `- ${c.name} (${c.role}): ${c.description}`)
      .join("\n");

    const characterPrompt = prompt
      ? `Tu es un écrivain créatif. L'utilisateur a fourni une description pour un nouveau personnage de son histoire.

Titre de l'histoire: ${story.name}
Thème: ${story.theme}
Sujet: ${story.subject}

Personnages existants:
${existingCharacters || "Aucun personnage existant"}

Demande de l'utilisateur: ${prompt}

En te basant sur la demande et le contexte de l'histoire, crée UN personnage avec:
- Un nom approprié
- Une description détaillée (2-3 phrases)
- Un rôle dans l'histoire (PROTAGONIST, ANTAGONIST, SECONDARY, ou MINOR)

Réponds UNIQUEMENT avec un objet JSON valide (pas de markdown, pas de texte supplémentaire):
{
  "name": "...",
  "description": "...",
  "role": "PROTAGONIST" | "ANTAGONIST" | "SECONDARY" | "MINOR"
}`
      : `Tu es un écrivain créatif. Génère UN nouveau personnage intéressant pour cette histoire:

Titre: ${story.name}
Thème: ${story.theme}
Sujet: ${story.subject}

Personnages existants:
${existingCharacters || "Aucun personnage existant"}

Crée un personnage original qui complète bien l'histoire existante. Réponds UNIQUEMENT avec un objet JSON valide (pas de markdown, pas de texte supplémentaire):
{
  "name": "...",
  "description": "Une description détaillée du personnage, sa personnalité, et son rôle dans l'histoire",
  "role": "PROTAGONIST" | "ANTAGONIST" | "SECONDARY" | "MINOR"
}`;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const ollUrl = `${baseUrl}/api/ollama`;

    console.log("[GENERATE_CHARACTER] Calling Ollama API at:", ollUrl);

    const response = await fetch(ollUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: characterPrompt,
        stream: false,
        model: "gpt-oss:120b-cloud"
      })
    });

    const responseText = await response.text();
    console.log("[GENERATE_CHARACTER] Response status:", response.status);
    console.log("[GENERATE_CHARACTER] Response text (first 500 chars):", responseText.substring(0, 500));

    if (!response.ok) {
      console.error("[GENERATE_CHARACTER] API Error - Status:", response.status);
      console.error("[GENERATE_CHARACTER] API Error - Response:", responseText);
      return {
        error: `Failed to generate character with AI (Status: ${response.status}). Please try again.`,
        character: null
      };
    }

    let apiResult;
    try {
      apiResult = JSON.parse(responseText);
    } catch (e) {
      console.error("[GENERATE_CHARACTER] Failed to parse response as JSON:", e);
      console.error("[GENERATE_CHARACTER] Response was:", responseText.substring(0, 1000));
      return {
        error: "AI API returned invalid response. Please try again.",
        character: null
      };
    }

    const content = apiResult.response || apiResult.output || "";
    console.log("[GENERATE_CHARACTER] Generated content:", content);

    // Parse the JSON response
    let characterData;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      characterData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error("[GENERATE_CHARACTER] Failed to parse AI response:", parseError);
      return {
        error: "Failed to parse AI-generated character. Please try again.",
        character: null
      };
    }

    // Validate the parsed data
    if (!characterData.name || !characterData.description || !characterData.role) {
      return {
        error: "AI generated incomplete character data. Please try again.",
        character: null
      };
    }

    // Validate role
    const validRoles = ["PROTAGONIST", "ANTAGONIST", "SECONDARY", "MINOR"];
    if (!validRoles.includes(characterData.role)) {
      characterData.role = "SECONDARY"; // Default to SECONDARY if invalid
    }

    return {
      success: true,
      character: {
        name: characterData.name,
        description: characterData.description,
        role: characterData.role
      }
    };
  } catch (error) {
    console.error("[GENERATE_CHARACTER]", error);
    return {
      error: "Failed to generate character. Please try again.",
      character: null
    };
  }
};
