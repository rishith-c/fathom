import { cn } from "@/components/ui/cn";
import type { SectionHeaderProps } from "./types";

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: SectionHeaderProps) {
  return (
    <header className={cn("max-w-3xl space-y-4", className)}>
      <p className="text-sm font-medium uppercase tracking-[0.28em] text-white/55">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
        {description}
      </p>
    </header>
  );
}
