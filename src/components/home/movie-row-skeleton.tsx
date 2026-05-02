// Section: Movie Row Skeleton | Location: components/home/movie-row-skeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MovieRowSkeletonProps {
  title: string;
  variant?: "portrait" | "landscape";
}

export function MovieRowSkeleton({ title, variant = "portrait" }: MovieRowSkeletonProps) {
  const cardCount = 6;
  const cardWidth = variant === "landscape" ? "w-48 sm:w-56 md:w-72" : "w-32 sm:w-40 md:w-48";
  const cardAspect = variant === "landscape" ? "aspect-[16/9]" : "aspect-[2/3]";

  return (
    <section className="space-y-4">
      <div className="px-4 md:px-12">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56 mt-2" />
      </div>

      <div className="flex gap-3 md:gap-4 overflow-x-auto px-4 md:px-12 pb-2 scrollbar-hide">
        {Array.from({ length: cardCount }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "flex-shrink-0 rounded-lg",
              cardWidth,
              cardAspect
            )}
          />
        ))}
      </div>
    </section>
  );
}
