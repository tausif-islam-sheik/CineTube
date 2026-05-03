"use client";

import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  type?: "card" | "row" | "hero" | "page" | "review";
  count?: number;
  className?: string;
}

export function LoadingSkeleton({
  type = "card",
  count = 4,
  className,
}: LoadingSkeletonProps) {
  if (type === "hero") {
    return (
      <div className={cn("w-full h-[60vh] bg-muted animate-pulse rounded-2xl", className)}>
        <div className="h-full flex items-end p-8">
          <div className="space-y-4 w-full max-w-xl">
            <div className="h-8 w-3/4 bg-muted-foreground/20 rounded" />
            <div className="h-4 w-1/2 bg-muted-foreground/20 rounded" />
            <div className="h-10 w-32 bg-muted-foreground/20 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (type === "row") {
    return (
      <div className={cn("flex gap-4 overflow-hidden", className)}>
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-40 md:w-48 aspect-[2/3] bg-muted animate-pulse rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (type === "page") {
    return (
      <div className={cn("space-y-8", className)}>
        <LoadingSkeleton type="hero" />
        <div className="px-4 md:px-10 space-y-8">
          <LoadingSkeleton type="row" count={4} />
          <LoadingSkeleton type="row" count={4} />
        </div>
      </div>
    );
  }

  if (type === "review") {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-xl bg-muted/30 border border-border animate-pulse"
          >
            <div className="flex gap-4">
              {/* Poster skeleton */}
              <div className="w-20 aspect-2/3 bg-muted rounded-lg flex-shrink-0" />
              {/* Content skeleton */}
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-48 bg-muted rounded" />
                    <div className="h-4 w-32 bg-muted rounded" />
                  </div>
                  <div className="h-6 w-16 bg-muted rounded" />
                </div>
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-muted rounded" />
                    <div className="h-8 w-20 bg-muted rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card grid
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6",
        className
      )}
    >
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="aspect-2/3 bg-muted animate-pulse rounded-xl"
        />
      ))}
    </div>
  );
}
