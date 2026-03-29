"use client";

import {
  type ReactNode,
  useState,
  useCallback,
  isValidElement,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalBlockProps {
  title?: string;
  children: ReactNode;
  typing?: boolean;
  showLineNumbers?: boolean;
  className?: string;
}

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    const props = node.props as Record<string, unknown>;
    return extractText(props.children as ReactNode);
  }
  return "";
}

function TypingText({ text }: Readonly<{ text: string }>) {
  const characters = text.split("");

  return (
    <>
      {characters.map((char, i) => (
        <motion.span
          key={`${i}-${char}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.025, duration: 0.05 }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        className="inline-block h-4 w-2 translate-y-0.5 bg-[#fa5d19]"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        aria-hidden="true"
      />
    </>
  );
}

function LineNumbers({
  count,
}: Readonly<{ count: number }>) {
  return (
    <div
      className="select-none pr-4 text-right text-white/20"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <div key={i + 1}>{i + 1}</div>
      ))}
    </div>
  );
}

export function TerminalBlock({
  title,
  children,
  typing = false,
  showLineNumbers = false,
  className,
}: TerminalBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const text = extractText(children);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [children]);

  const rawText = extractText(children);
  const lines = rawText.split("\n");
  const lineCount = lines.length;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-[#111]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          {title && (
            <span className="text-xs font-medium text-white/50">{title}</span>
          )}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/40 transition-colors hover:bg-white/5 hover:text-white/70"
          aria-label={copied ? "Copied to clipboard" : "Copy code"}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1 text-emerald-400"
              >
                <Check className="h-3.5 w-3.5" />
                Copied
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      <div className="overflow-x-auto p-4 font-mono text-sm leading-6">
        <div className="flex">
          {showLineNumbers && <LineNumbers count={lineCount} />}
          <pre className="flex-1 whitespace-pre-wrap">
            {typing ? (
              <code>
                <TypingText text={rawText} />
              </code>
            ) : (
              <code>{children}</code>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}

export type { TerminalBlockProps };
