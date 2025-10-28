"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MAX = 5000;

export default function Page() {
  const [text, setText] = useState("");
  const [responseText, setResponseText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // options
  const [model, setModel] = useState("gpt-oss:120b"); // tag côté Ollama Cloud
  const [stream, setStream] = useState(true);

  // pour annuler une requête en cours
  const [controller, setController] = useState<AbortController | null>(null);

  const clearText = () => {
    setText("");
    setResponseText(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    setResponseText(null);

    const aborter = new AbortController();
    setController(aborter);

    try {
      if (stream) {
        // --- STREAMING: lit des lignes NDJSON renvoyées par /api/ollama ---
        const res = await fetch("/api/ollama", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, prompt: text, stream: true }),
          signal: aborter.signal,
        });

        if (!res.ok || !res.body) {
          const t = await res.text().catch(() => "");
          throw new Error(`Server error: ${res.status} - ${t}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let accum = "";

        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // découper par lignes (NDJSON)
          let idx: number;
          while ((idx = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, idx).trim();
            buffer = buffer.slice(idx + 1);
            if (!line) continue;
            try {
              const part = JSON.parse(line);
              const token =
                part?.message?.content ?? part?.response ?? part?.content ?? "";
              if (token) {
                accum += token;
                setResponseText(accum); // affichage progressif
              }
            } catch {
              // ligne incomplète → ignore
            }
          }
        }
      } else {
        // --- NON-STREAM: réponse JSON finale ---
        const res = await fetch("/api/ollama", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, prompt: text, stream: false }),
          signal: aborter.signal,
        });

        if (!res.ok) {
          const textErr = await res.text();
          throw new Error(`Server error: ${res.status} - ${textErr}`);
        }

        const data = await res.json();
        const maybeText =
          data?.output ??
          data?.message?.content ??
          data?.text ??
          data?.results?.[0]?.content ??
          JSON.stringify(data);

        setResponseText(maybeText);
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        setError(err?.message ?? String(err));
      }
    } finally {
      setLoading(false);
      setController(null);
    }
  };

  // Option: envoyer avec Ctrl+Enter
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            Notes → Ollama Cloud
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Tape ton prompt ci-dessous, choisis le modèle, et envoie (Ctrl/⌘ +
            Enter pour envoyer).
          </p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
          <label htmlFor="note" className="block text-sm font-medium mb-2">
            Ton prompt
          </label>

          <Textarea
            id="note"
            placeholder="Décris ta demande…"
            className="w-full resize-y rounded-xl border border-gray-300 focus:border-gray-900 focus:ring-0 p-3 outline-none transition"
            aria-describedby="note-help note-counter"
            value={text}
            rows={8}
            onChange={(e) => setText(e.target.value.slice(0, MAX))}
            onKeyDown={onKeyDown}
          />

          <div className="mt-2 flex items-center justify-between">
            <p id="note-help" className="text-xs text-gray-500">
              Astuce : Ctrl/⌘ + Enter pour envoyer.
            </p>
            <span
              id="note-counter"
              className="text-xs tabular-nums text-gray-500"
            >
              {text.length}/{MAX}
            </span>
          </div>

          {/* Options modèle / streaming */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="text-sm">
              Modèle :
              <input
                className="ml-2 border rounded px-2 py-1"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="gpt-oss:120b"
              />
            </label>

            <label className="text-sm flex items-center gap-2">
              <input
                type="checkbox"
                checked={stream}
                onChange={(e) => setStream(e.target.checked)}
              />
              Streaming
            </label>
          </div>

          {/* Boutons */}
          <div className="mt-4 flex gap-3">
            <Button
              onClick={clearText}
              className="px-3 py-2 rounded-xl bg-gray-900 text-white hover:bg-black active:scale-[0.99] transition"
              disabled={loading}
            >
              Effacer
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              className="px-3 py-2 rounded-xl border border-gray-300 transition"
              disabled={loading || !text}
            >
              {loading ? "Envoi..." : "Envoyer"}
            </Button>

            {loading && (
              <Button
                type="button"
                onClick={() => controller?.abort()}
                className="px-3 py-2 rounded-xl bg-red-600 text-white transition"
              >
                Annuler
              </Button>
            )}
          </div>

          {/* Réponse / erreur */}
          <div className="mt-4">
            {error && (
              <div className="mb-3 text-sm text-red-600">Erreur: {error}</div>
            )}

            {responseText && (
              <div className="mt-2">
                <label
                  htmlFor="ai-response"
                  className="block text-sm font-medium mb-2"
                >
                  Réponse de l&apos;IA
                </label>
                <Textarea
                  id="ai-response"
                  value={responseText}
                  readOnly
                  rows={8}
                  className="w-full bg-gray-50"
                />
              </div>
            )}
          </div>
        </section>

        <footer className="mt-8 text-xs text-gray-500">
          Cette page envoie la requête à <code>/api/ollama</code> (backend) qui
          doit pointer vers Ollama Cloud (host <code>https://ollama.com</code>{" "}
          avec header <code>Authorization</code>).
        </footer>
      </div>
    </div>
  );
}
