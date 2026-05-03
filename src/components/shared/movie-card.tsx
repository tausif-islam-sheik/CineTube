"use client";

import Link from "next/link";
import { Play, Star, Heart, Info, Zap, Clock, Tv } from "lucide-react";
import { Movie } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MovieCardProps {
  movie: Movie;
  isNew?: boolean;
  isFree?: boolean;
  variant?: "portrait" | "landscape";
  showWatchlist?: boolean;
  showInfo?: boolean;
  onWatchlistToggle?: (movieId: string) => void;
  isInWatchlist?: boolean;
  className?: string;
}

export function MovieCard({
  movie,
  isNew,
  isFree,
  variant = "portrait",
  showWatchlist = false,
  showInfo = false,
  onWatchlistToggle,
  isInWatchlist = false,
  className,
}: MovieCardProps) {
  const isLandscape = variant === "landscape";

  return (
    <div className={cn("group relative", className)}>
      <Link href={`/movie/${movie.id}`} className="block">
        <div
          className={cn(
            "relative rounded-2xl overflow-hidden cursor-pointer shrink-0 bg-muted/20 border border-white/5 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:z-10 hover:shadow-[0_0_30px_rgba(var(--primary),0.2)]",
            isLandscape
              ? "aspect-[16/9] w-full"
              : "aspect-[2/3] w-full"
          )}
        >
          {/* Image */}
          {isLandscape
            ? movie.backdropUrl || movie.posterUrl ? (
              <img
                src={movie.backdropUrl || movie.posterUrl || undefined}
                alt={movie.title}
                loading="lazy"
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
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.85] group-hover:brightness-100"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground p-4 text-center text-sm bg-gradient-to-br from-slate-900 to-slate-800">
                {movie.title}
              </div>
            )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {isNew && (
              <div className="bg-[#E60012] px-2 py-1 rounded text-white text-[10px] font-bold uppercase tracking-wide">
                New
              </div>
            )}
            {isFree && (
              <div className="bg-green-500 px-2 py-1 rounded text-white text-[10px] font-bold uppercase tracking-wide">
                Free
              </div>
            )}
            {movie.pricing === "PREMIUM" && !isFree && (
              <div className="bg-primary px-2 py-1 rounded-lg shadow-xl">
                <span className="text-white text-[9px] font-black tracking-wider uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" />
                  Premium
                </span>
              </div>
            )}
          </div>

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
        </div>
      </Link>

      {/* Action Buttons - Below Card */}
      {(showWatchlist || showInfo) && (
        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {showWatchlist && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex-1 h-8 text-xs",
                isInWatchlist ? "text-primary" : "text-muted-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onWatchlistToggle?.(movie.id);
              }}
            >
              <Heart className={cn("w-4 h-4 mr-1", isInWatchlist && "fill-current")} />
              {isInWatchlist ? "Saved" : "Watchlist"}
            </Button>
          )}
          {showInfo && (
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-8 text-xs text-muted-foreground"
              asChild
            >
              <Link href={`/movie/${movie.id}`}>
                <Info className="w-4 h-4 mr-1" />
                More Info
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Series Card Variant
interface SeriesCardProps {
  id: string;
  title: string;
  posterUrl: string | null;
  backdropUrl?: string | null;
  seasonCount: number;
  episodeCount: number;
  status: "ONGOING" | "COMPLETED" | "UPCOMING";
  averageRating?: number;
  releaseYear: number;
  isNew?: boolean;
  showWatchlist?: boolean;
  onWatchlistToggle?: (id: string) => void;
  isInWatchlist?: boolean;
}

export function SeriesCard({
  id,
  title,
  posterUrl,
  backdropUrl,
  seasonCount,
  episodeCount,
  status,
  averageRating,
  releaseYear,
  isNew,
  showWatchlist,
  onWatchlistToggle,
  isInWatchlist,
}: SeriesCardProps) {
  return (
    <div className="group relative">
      <Link href={`/series/${id}`} className="block">
        <div className="relative rounded-2xl overflow-hidden cursor-pointer shrink-0 bg-muted/20 border border-white/5 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:z-10 hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] aspect-[2/3] w-full">
          {/* Image */}
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.85] group-hover:brightness-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground p-4 text-center text-sm bg-gradient-to-br from-slate-900 to-slate-800">
              {title}
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Status Badge */}
          <div className="absolute top-2 left-2 z-10">
            <div className={cn(
              "px-2 py-1 rounded text-white text-[10px] font-bold uppercase tracking-wide flex items-center gap-1",
              status === "ONGOING" && "bg-green-500/80",
              status === "COMPLETED" && "bg-gray-500/80",
              status === "UPCOMING" && "bg-blue-500/80"
            )}>
              {status === "ONGOING" && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              {status}
            </div>
          </div>

          {/* Season/Episode Count */}
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-[10px] font-bold flex items-center gap-1">
              <Tv className="w-3 h-3" />
              S{seasonCount} • {episodeCount} EP
            </div>
          </div>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
              <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
            </div>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-0 inset-x-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
            <p className="text-white text-sm md:text-base font-black leading-tight line-clamp-1 mb-2 tracking-tight">
              {title}
            </p>
            <div className="flex items-center gap-2">
              {averageRating && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-400/10 rounded-md">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-400 text-[10px] md:text-xs font-black">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
              )}
              <span className="text-white/60 text-[10px] md:text-xs font-bold ml-auto">{releaseYear}</span>
            </div>
          </div>
        </div>
      </Link>

      {showWatchlist && (
        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex-1 h-8 text-xs",
              isInWatchlist ? "text-primary" : "text-muted-foreground"
            )}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWatchlistToggle?.(id);
            }}
          >
            <Heart className={cn("w-4 h-4 mr-1", isInWatchlist && "fill-current")} />
            {isInWatchlist ? "Saved" : "Watchlist"}
          </Button>
        </div>
      )}
    </div>
  );
}

// Trailer Card
interface TrailerCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  releaseDate: string;
  views?: string;
}

export function TrailerCard({ id, title, thumbnailUrl, duration, releaseDate, views }: TrailerCardProps) {
  return (
    <Link href={`/trailer/${id}`} className="block group">
      <div className="relative rounded-xl overflow-hidden cursor-pointer bg-muted/20 border border-white/5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
        {/* Thumbnail */}
        <div className="aspect-video relative">
          <img
            src={thumbnailUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform shadow-2xl">
              <Play className="w-8 h-8 text-white fill-current translate-x-0.5" />
            </div>
          </div>

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs font-medium">
            {duration}
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <h3 className="text-foreground font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground text-xs">
            <span>{releaseDate}</span>
            {views && (
              <>
                <span>•</span>
                <span>{views} views</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
