// Section: Gradient Orb (Animated Background) | Location: components/home/gradient-orb.tsx
"use client";

import { cn } from "@/lib/utils";

interface GradientOrbProps {
  className?: string;
}

export function GradientOrb({ className }: GradientOrbProps) {
  return (
    <div
      className={cn(
        "absolute rounded-full blur-[120px] opacity-20 pointer-events-none animate-pulse",
        className
      )}
    />
  );
}
