import type { ReactNode } from "react";

export interface StatItem {
  label: string;
  value: string;
  detail?: string;
}

export interface FeatureCardItem {
  eyebrow: string;
  title: string;
  description: string;
  accent?: string;
}

export interface TimelineStep {
  step: string;
  title: string;
  description: string;
  meta?: string;
}

export interface ReviewQuestion {
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface HeroTerminalLine {
  label: string;
  value: string;
}

export interface HeroTerminalFrame {
  title: string;
  status: string;
  input: string;
  output: string[];
  cursorLabel?: string;
}

export interface ReviewMode {
  id: "text" | "voice" | "video";
  label: string;
}

export interface LogoItem {
  name: string;
  hint?: string;
}

export interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}

export interface LandingShellProps {
  children: ReactNode;
  className?: string;
}
