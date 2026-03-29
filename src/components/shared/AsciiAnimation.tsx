"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AsciiAnimationProps {
  speed?: number;
  className?: string;
  autoplay?: boolean;
}

const FRAMES: readonly string[] = [
  `
     ___________
    /           \\
   /  .-------.  \\
  |  /  o   o  \\  |
  | |     ^     | |
  |  \\  '---'  /  |
   \\  '-------'  /
    \\___________/
        |   |
   _____|   |_____
  /               \\
 /   ? ? ? ? ? ?   \\
|   ? ? ? ? ? ? ?   |
 \\   ? ? ? ? ? ?   /
  \\_______________ /
`,
  `
     ___________
    /           \\
   /  .-------.  \\
  |  /  *   *  \\  |
  | |     ^     | |
  |  \\  '---'  /  |
   \\  '-------'  /
    \\___________/
        |   |
   _____|   |_____
  /    ~~~~~~~    \\
 /  ~ ~ ~ ~ ~ ~ ~  \\
|  ~ * ~ * ~ * ~ *  |
 \\  ~ ~ ~ ~ ~ ~ ~  /
  \\_______________/
`,
  `
     ___________
    /    ****   \\
   / ***    *** \\
  |**  .----.  **|
  |*  / o  o \\  *|
  |*  |  ^^  |  *|
  |*  \\ '--' /  *|
   \\ **'----'** /
    \\___________/
        |   |
   _____|   |_____
  /   =========   \\
 /  // IDEAS  //   \\
|  // FLOWING //    |
 \\  =========     /
  \\_______________/
`,
  `
         *
        /|\\
       / | \\
      /  |  \\
     / . | . \\
    /  ..|..  \\
   /_____|_____\\
        |
     ___|___
    /       \\
   / FATHOM  \\
  /  LOADING  \\
 /  KNOWLEDGE  \\
/_______________\\
   ||       ||
   ||       ||
`,
  `
      .--~~--.
     /  ****  \\
    | *      * |
    |*  IDEA  *|
    |*   !!   *|
    | *      * |
     \\  ****  /
      '--~~--'
     /  |  |  \\
    / __|  |__ \\
   /  /      \\  \\
  /__/  KNOW  \\__\\
     | LEDGE  |
     |________|
     ||      ||
     ==      ==
`,
] as const;

export function AsciiAnimation({
  speed = 2000,
  className,
  autoplay = true,
}: AsciiAnimationProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAnimation = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % FRAMES.length);
    }, speed);
  }, [speed]);

  const stopAnimation = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (autoplay) {
      startAnimation();
    }
    return stopAnimation;
  }, [autoplay, startAnimation, stopAnimation]);

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl", className)}
      role="img"
      aria-label="Animated ASCII art showing knowledge transformation"
    >
      {/* Scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        aria-hidden="true"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
        }}
      />

      {/* Glow backdrop */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(250,93,25,0.12),_transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.pre
            key={frameIndex}
            initial={{ opacity: 0, scale: 0.97, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.03, filter: "blur(4px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={cn(
              "whitespace-pre font-mono text-xs leading-[1.35] sm:text-sm sm:leading-[1.4]",
              "text-[#fa5d19] [text-shadow:0_0_10px_rgba(250,93,25,0.5),0_0_30px_rgba(250,93,25,0.2)]",
              "select-none",
            )}
          >
            {FRAMES[frameIndex]}
          </motion.pre>
        </AnimatePresence>
      </div>

      {/* Frame indicator dots */}
      <div
        className="flex items-center justify-center gap-1.5 pb-4"
        aria-hidden="true"
      >
        {FRAMES.map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              i === frameIndex
                ? "w-4 bg-[#fa5d19]"
                : "w-1 bg-white/20",
            )}
          />
        ))}
      </div>
    </div>
  );
}

export type { AsciiAnimationProps };
