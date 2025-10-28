"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface EpisodeClientProps {
  content: string;
}

export function EpisodeClient({ content }: EpisodeClientProps) {
  return (
    <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none prose-invert dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mt-6 mb-4 text-gray-900" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-5 mb-3 text-gray-800" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-800" {...props} />,
          p: ({ node, ...props }) => <p className="text-gray-800 leading-relaxed mb-4" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 text-gray-800" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 text-gray-800" {...props} />,
          li: ({ node, ...props }) => <li className="mb-2" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-gray-900" {...props} />,
          em: ({ node, ...props }) => <em className="italic text-gray-700" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-sky-400 pl-4 py-2 my-4 bg-sky-50 italic text-gray-700" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }: any) =>
            inline ? (
              <code className="bg-gray-100 rounded px-2 py-1 text-sm font-mono text-gray-900" {...props}>
                {children}
              </code>
            ) : (
              <code className="block bg-gray-100 rounded p-4 my-4 text-sm font-mono text-gray-900 overflow-x-auto" {...props}>
                {children}
              </code>
            ),
          a: ({ node, ...props }) => <a className="text-sky-600 hover:text-sky-700 underline" {...props} />,
          hr: ({ node, ...props }) => <hr className="my-6 border-gray-300" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
