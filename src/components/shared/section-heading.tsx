"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles, Flame } from "lucide-react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: "new" | "sparkle" | "fire" | null;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  badge,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">
            {title}
          </h2>
          {badge === "new" && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          )}
          {badge === "sparkle" && (
            <Sparkles className="w-4 h-4 text-yellow-400" />
          )}
          {badge === "fire" && (
            <Flame className="w-4 h-4 text-orange-500" />
          )}
        </div>
        {subtitle && (
          <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
        )}
      </div>
      {action && (
        <Button
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary/80 font-semibold"
          onClick={action.onClick}
          asChild={!!action.href}
        >
          {action.href ? (
            <a href={action.href} className="flex items-center gap-1">
              {action.label}
              <ChevronRight className="w-4 h-4" />
            </a>
          ) : (
            <>
              {action.label}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
