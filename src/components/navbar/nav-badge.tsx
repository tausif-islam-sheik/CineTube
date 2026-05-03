"use client";

import { cn } from "@/lib/utils";
import { Sparkles, Flame } from "lucide-react";

interface NavBadgeProps {
  type: "dot" | "sparkle" | "fire";
  className?: string;
}

export function NavBadge({ type, className }: NavBadgeProps) {
  if (type === "dot") {
    return (
      <span
        className={cn(
          "absolute -top-0.5 -right-1.5 w-2 h-2 rounded-full bg-red-500",
          "animate-pulse",
          className
        )}
      />
    );
  }

  if (type === "sparkle") {
    return (
      <Sparkles
        className={cn(
          "w-3 h-3 text-yellow-400 animate-pulse",
          className
        )}
      />
    );
  }

  if (type === "fire") {
    return (
      <Flame
        className={cn(
          "w-3 h-3 text-orange-500",
          className
        )}
      />
    );
  }

  return null;
}
