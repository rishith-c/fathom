"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const glassCardVariants = cva(
  [
    "relative overflow-hidden rounded-2xl transition-colors duration-300",
  ],
  {
    variants: {
      variant: {
        default: [
          "border border-white/10 bg-white/5 backdrop-blur-xl",
        ],
        highlighted: [
          "border border-[#fa5d19]/30 bg-white/5 backdrop-blur-xl",
          "shadow-[0_0_30px_rgba(250,93,25,0.1)]",
        ],
        terminal: [
          "border border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl font-mono",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type GlassCardVariantProps = VariantProps<typeof glassCardVariants>;

interface GlassCardProps extends GlassCardVariantProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

const hoverStyles: Record<NonNullable<GlassCardVariantProps["variant"]>, string> = {
  default: "hover:border-white/20 hover:bg-white/[0.07]",
  highlighted:
    "hover:border-[#fa5d19]/50 hover:shadow-[0_0_40px_rgba(250,93,25,0.18)]",
  terminal: "hover:border-white/20 hover:bg-[#0f0f0f]/90",
};

const MotionDiv = motion.create("div");

export function GlassCard({
  children,
  variant = "default",
  className,
  hoverable = true,
}: GlassCardProps) {
  const resolvedVariant = variant ?? "default";

  if (!hoverable) {
    return (
      <div className={cn(glassCardVariants({ variant }), className)}>
        {children}
      </div>
    );
  }

  return (
    <MotionDiv
      className={cn(
        glassCardVariants({ variant }),
        hoverStyles[resolvedVariant],
        className,
      )}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </MotionDiv>
  );
}

export { glassCardVariants };
export type { GlassCardProps };
