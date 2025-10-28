export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { Ollama } from "ollama";

const ollama = new Ollama({
  host: "https://ollama.com",
  headers: { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      model = "gpt-oss:120b-cloud",
      prompt,
      stream = true,
      maxWords = 2500,
    } = body;

    if (!prompt || typeof prompt !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid prompt" }),
        { status: 400 }
      );
    }

    // Streaming mode
    if (stream) {
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            const response = await ollama.chat({
              model,
              messages: [{ role: "user", content: prompt }],
              stream: true,
            });

            for await (const part of response) {
              const chunk = JSON.stringify(part) + "\n";
              controller.enqueue(encoder.encode(chunk));
            }
            controller.close();
          } catch (e: any) {
            controller.error(e);
          }
        },
      });

      return new Response(readable, {
        headers: { "Content-Type": "application/x-ndjson" },
      });
    }

    // Non-streaming mode
    const res = await ollama.chat({
      model,
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });

    const content = res.message?.content ?? "";

    return Response.json({
      response: content,
      output: content,
    });
  } catch (error: any) {
    return Response.json(
      {
        error: error.message || "Failed to generate content",
      },
      { status: 500 }
    );
  }
}
