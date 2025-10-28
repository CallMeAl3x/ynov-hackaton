export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { Ollama } from "ollama";

const ollama = new Ollama({
  host: "https://ollama.com",
  headers: { Authorization: `Bearer ${process.env.OLLAMA_API_KEY}` },
});

export async function POST(req: NextRequest) {
  const { model = "gpt-oss:120b", prompt, stream = false } = await req.json();

  if (!prompt || typeof prompt !== "string") {
    return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 });
  }

  // 1) STREAMING → renvoyer le flux NDJSON tel quel au client
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

  // 2) NON-STREAMING → retourner la réponse finale simple
  const res = await ollama.chat({
    model,
    messages: [{ role: "user", content: prompt }],
    stream: false,
  });

  return Response.json({ output: res.message?.content ?? "" });
}
