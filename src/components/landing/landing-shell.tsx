import type { LandingShellProps } from "./types";
import { cn } from "@/components/ui/cn";

export function LandingShell({ children, className }: LandingShellProps) {
  return (
    <div
      className={cn(
        "min-h-screen overflow-hidden bg-[#06070a] text-white",
        className,
      )}
    >
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_36%),radial-gradient(circle_at_80%_20%,_rgba(244,114,182,0.12),_transparent_28%),linear-gradient(to_bottom,_rgba(255,255,255,0.04),_transparent_15%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.08]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
