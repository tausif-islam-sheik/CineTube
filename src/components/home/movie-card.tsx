// Section: Movie Card | Location: components/home/movie-card.tsx
"use client";

import Link from "next/link";
import { Play, Star, Zap } from "lucide-react";
import { Movie } from "@/types";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  movie: Movie;
  isNew?: boolean;
  variant?: "portrait" | "landscape";
}

export function MovieCard({
  movie,
  isNew,
  variant = "portrait",
}: MovieCardProps) {
  const isLandscape = variant === "landscape";

  return (
    <Link href={`/movie/${movie.id}`} className="block">
      <div
        className={cn(
          "group relative rounded-2xl overflow-hidden cursor-pointer shrink-0 bg-muted/20 border border-white/5 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:z-10 hover:shadow-[0_0_30px_rgba(var(--primary),0.2)]",
          isLandscape
            ? "aspect-[16/9] w-48 sm:w-56 md:w-72"
            : "aspect-[2/3] w-32 sm:w-40 md:w-48"
        )}
      >
        {/* Image */}
        {isLandscape
          ? movie.backdropUrl || movie.posterUrl ? (
            <img
              src={movie.backdropUrl || movie.posterUrl || undefined}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.85] group-hover:brightness-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground p-4 text-center text-sm bg-gradient-to-br from-slate-900 to-slate-800">
              {movie.title}
            </div>
          )
          : movie.posterUrl ? (
            <img
              src={movie.posterUrl || undefined}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.85] group-hover:brightness-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground p-4 text-center text-sm bg-gradient-to-br from-slate-900 to-slate-800">
              {movie.title}
            </div>
          )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

        {/* New Release Badge - Only on first card */}
        {isNew && (
          <div className="absolute top-2 left-2 bg-[#E60012] px-2 py-1 rounded text-white text-[10px] font-bold uppercase tracking-wide z-10">
            New Release
          </div>
        )}

        {/* Play Button - Center on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
            <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
          </div>
        </div>

        {/* Hover Info - Bottom */}
        <div className="absolute bottom-0 inset-x-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <p className="text-white text-sm md:text-base font-black leading-tight line-clamp-1 mb-2 tracking-tight">
            {movie.title}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-400/10 rounded-md">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-yellow-400 text-[10px] md:text-xs font-black">
                {movie.averageRating?.toFixed(1) ?? "N/A"}
              </span>
            </div>
            <span className="text-white/60 text-[10px] md:text-xs font-bold ml-auto">{movie.releaseYear}</span>
          </div>
        </div>

        {/* Premium Badge */}
        {movie.pricing === "PREMIUM" && (
          <div className="absolute top-3 left-3 bg-primary px-2 py-1 rounded-lg shadow-xl z-10">
            <span className="text-white text-[9px] font-black tracking-wider uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              Premium
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
