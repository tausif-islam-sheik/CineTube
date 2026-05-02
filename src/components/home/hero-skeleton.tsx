// Section: Hero Spotlight Skeleton | Location: components/home/hero-skeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function HeroSpotlightSkeleton() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Skeleton Backdrop */}
      <div className="absolute inset-0 w-full h-full">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Dark Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      {/* Skeleton Content */}
      <div className="absolute inset-0 z-10">
        <div className="container mx-auto flex h-full flex-col justify-end px-4 pb-38 md:pb-44 md:px-12 lg:px-12">
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-3xl space-y-6">
              {/* Title Skeleton */}
              <Skeleton className="h-20 md:h-32 w-3/4 bg-white/20" />

              {/* Info Badges Skeleton */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20 bg-white/10" />
                <Skeleton className="h-5 w-3 bg-white/10" />
                <Skeleton className="h-5 w-24 bg-white/10" />
                <Skeleton className="h-5 w-3 bg-white/10" />
                <Skeleton className="h-5 w-10 bg-white/10" />
                <Skeleton className="h-5 w-3 bg-white/10" />
                <Skeleton className="h-5 w-14 bg-white/10" />
              </div>

              {/* Buttons Skeleton */}
              <div className="flex items-center gap-3 pt-2">
                <Skeleton className="h-12 w-32 rounded-lg bg-white/20" />
                <Skeleton className="h-12 w-12 rounded-lg bg-white/10" />
                <Skeleton className="h-12 w-12 rounded-lg bg-white/10" />
              </div>
            </div>

            {/* Thumbnail Strip Skeleton */}
            <div className="hidden lg:flex flex-col items-end gap-3 pb-2">
              <div className="flex items-center gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-28 rounded-md bg-white/10" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
