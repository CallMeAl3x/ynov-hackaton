"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  content: string;
  isGenerating: boolean;
}

export function MarkdownPreview({ content, isGenerating }: MarkdownPreviewProps) {
  if (!content && !isGenerating) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded border border-gray-200">
        <p className="text-gray-500 text-sm">La prévisualisation apparaîtra ici</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded p-6 bg-white min-h-64 max-h-[600px] overflow-y-auto">
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-4 mb-3 text-gray-900" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-3 mb-2 text-gray-800" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-2 mb-1 text-gray-800" {...props} />,
            p: ({ node, ...props }) => <p className="text-gray-800 leading-relaxed mb-3" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-3 text-gray-800" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-3 text-gray-800" {...props} />,
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
            em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-sky-400 pl-4 py-2 my-3 bg-sky-50 italic text-gray-700" {...props} />
            ),
            code: ({ node, inline, className, children, ...props }: any) =>
              inline ? (
                <code className="bg-gray-100 rounded px-2 py-0.5 text-sm font-mono text-gray-900" {...props}>
                  {children}
                </code>
              ) : (
                <code className="block bg-gray-100 rounded p-3 my-3 text-sm font-mono text-gray-900 overflow-x-auto" {...props}>
                  {children}
                </code>
              ),
            a: ({ node, ...props }) => <a className="text-sky-600 hover:text-sky-700 underline" {...props} />,
            hr: ({ node, ...props }) => <hr className="my-4 border-gray-300" {...props} />,
          }}
        >
          {content || (isGenerating ? "⏳ Génération en cours..." : "")}
        </ReactMarkdown>
      </div>
    </div>
  );
}
