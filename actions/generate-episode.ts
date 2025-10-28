"use server";

import { buildEpisodePrompt } from "@/lib/prompts";

type Character = {
  id: string;
  name: string;
  description: string;
  role: "PROTAGONIST" | "ANTAGONIST" | "SECONDARY" | "MINOR";
  storyId: string;
  relationships: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type Story = {
  id: string;
  name: string;
  description: string | null;
  subject: string;
  theme: string;
  status: string;
  coverImage: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};

type Episode = {
  id: string;
  name: string;
  content: string;
  order: number;
  published: boolean;
  storyId: string;
  createdAt: Date;
  updatedAt: Date;
};

export const generateEpisodeWithAI = async (
  story: Story,
  characters: Character[],
  episodes: Episode[],
  guidancePrompt?: string
) => {
  try {
    let prompt = buildEpisodePrompt(story, characters, episodes);

    // If a guidance prompt is provided, add it to the main prompt
    if (guidancePrompt && guidancePrompt.trim()) {
      prompt += `\n\nGUIDANCE SUPPLÉMENTAIRE DE L'UTILISATEUR:\n${guidancePrompt}\n\nIntègre cette guidance dans la génération de l'épisode.`;
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const ollUrl = `${baseUrl}/api/ollama`;

    console.log("[GENERATE_EPISODE] Calling Ollama API at:", ollUrl);

    const response = await fetch(ollUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        stream: true,
        model: "gpt-oss:120b-cloud",
      }),
    });

    console.log("[GENERATE_EPISODE] Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[GENERATE_EPISODE] API Error - Status:", response.status);
      console.error("[GENERATE_EPISODE] API Error - Response:", errorText);
      return {
        error: `Failed to generate episode with AI (Status: ${response.status}). Please try again.`,
        content: null,
      };
    }

    // Handle streaming NDJSON response
    if (!response.body) {
      return {
        error: "No response body from API. Please try again.",
        content: null,
      };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";
    let buffer = "";

    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Split by newlines and process complete lines (NDJSON format)
        const lines = buffer.split("\n");
        buffer = lines[lines.length - 1]; // Keep incomplete line in buffer

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          try {
            const chunk = JSON.parse(line);
            const token =
              chunk?.message?.content ??
              chunk?.response ??
              chunk?.content ??
              "";
            if (token) {
              fullContent += token;
            }
          } catch (e) {
            // Skip lines that aren't valid JSON
            console.warn("[GENERATE_EPISODE] Skipped invalid JSON line:", line.substring(0, 100));
          }
        }
      }

      // Process any remaining content in buffer
      if (buffer.trim()) {
        try {
          const chunk = JSON.parse(buffer);
          const token =
            chunk?.message?.content ??
            chunk?.response ??
            chunk?.content ??
            "";
          if (token) {
            fullContent += token;
          }
        } catch (e) {
          console.warn("[GENERATE_EPISODE] Skipped final invalid JSON:", buffer.substring(0, 100));
        }
      }
    } finally {
      reader.releaseLock();
    }

    console.log("[GENERATE_EPISODE] Generated content length:", fullContent.length);

    if (!fullContent.trim()) {
      return {
        error: "No content generated. Please try again.",
        content: null,
      };
    }

    return {
      success: true,
      content: fullContent,
    };
  } catch (error) {
    console.error("[GENERATE_EPISODE]", error);
    return {
      error: "Failed to generate episode. Please try again.",
      content: null,
    };
  }
};
