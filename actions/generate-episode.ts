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
        stream: false,
        model: "gpt-oss:120b-cloud"
      })
    });

    const responseText = await response.text();
    console.log("[GENERATE_EPISODE] Response status:", response.status);

    if (!response.ok) {
      console.error("[GENERATE_EPISODE] API Error - Status:", response.status);
      console.error("[GENERATE_EPISODE] API Error - Response:", responseText);
      return {
        error: `Failed to generate episode with AI (Status: ${response.status}). Please try again.`,
        content: null
      };
    }

    let apiResult;
    try {
      apiResult = JSON.parse(responseText);
    } catch (e) {
      console.error("[GENERATE_EPISODE] Failed to parse response as JSON:", e);
      return {
        error: "AI API returned invalid response. Please try again.",
        content: null
      };
    }

    const content = apiResult.response || apiResult.output || "";
    console.log("[GENERATE_EPISODE] Generated content length:", content.length);

    if (!content.trim()) {
      return {
        error: "No content generated. Please try again.",
        content: null
      };
    }

    return {
      success: true,
      content
    };
  } catch (error) {
    console.error("[GENERATE_EPISODE]", error);
    return {
      error: "Failed to generate episode. Please try again.",
      content: null
    };
  }
};
