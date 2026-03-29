"use client";

import { type ReactNode, type ElementType } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowTextProps {
  children: ReactNode;
  className?: string;
  gradient?: boolean;
  pulse?: boolean;
  as?: ElementType;
}

const pulseAnimation = {
  textShadow: [
    "0 0 8px rgba(250, 93, 25, 0.4), 0 0 20px rgba(250, 93, 25, 0.15)",
    "0 0 16px rgba(250, 93, 25, 0.6), 0 0 40px rgba(250, 93, 25, 0.25)",
    "0 0 8px rgba(250, 93, 25, 0.4), 0 0 20px rgba(250, 93, 25, 0.15)",
  ],
};

const pulseTransition = {
  duration: 2.5,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

const STATIC_GLOW =
  "0 0 10px rgba(250, 93, 25, 0.5), 0 0 24px rgba(250, 93, 25, 0.2)";

const MotionSpan = motion.create("span");

export function GlowText({
  children,
  className,
  gradient = false,
  pulse = true,
  as: Tag = "span",
}: GlowTextProps) {
  const gradientClasses = gradient
    ? "bg-gradient-to-r from-[#fa5d19] via-amber-400 to-[#fa5d19] bg-clip-text text-transparent"
    : "text-[#fa5d19]";

  /* Pulse without gradient -- animated glow on the text shadow */
  if (pulse && !gradient) {
    return (
      <Tag className={cn("inline-block", className)}>
        <MotionSpan
          className={gradientClasses}
          animate={pulseAnimation}
          transition={pulseTransition}
        >
          {children}
        </MotionSpan>
      </Tag>
    );
  }

  /* Gradient with pulse -- overlay shimmer */
  if (gradient && pulse) {
    return (
      <Tag className={cn("relative inline-block", className)}>
        <span className={gradientClasses}>{children}</span>
        <MotionSpan
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#fa5d19] via-amber-400 to-[#fa5d19] bg-clip-text text-transparent opacity-0"
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" as const }}
          aria-hidden="true"
        >
          {children}
        </MotionSpan>
      </Tag>
    );
  }

  /* Gradient without pulse -- static gradient text */
  if (gradient) {
    return (
      <Tag className={cn(gradientClasses, className)}>
        {children}
      </Tag>
    );
  }

  /* No gradient, no pulse -- static glow */
  return (
    <Tag className={cn("inline-block", className)}>
      <MotionSpan
        className={gradientClasses}
        style={{ textShadow: STATIC_GLOW }}
      >
        {children}
      </MotionSpan>
    </Tag>
  );
}

export type { GlowTextProps };
