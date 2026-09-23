"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

const HTML_BLOCK_RE = /^\s*<(p|h[1-6]|div|ul|ol|blockquote|section)[>\s]/;

export default function MarkdownContent({ content }: { content: string }) {
  if (!content) return null;

  if (HTML_BLOCK_RE.test(content)) {
    return (
      <div
        className="markdown-body text-gray-700 leading-relaxed text-lg"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className="markdown-body text-gray-700 leading-relaxed text-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { detect: true }]]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}