// Section: Hero Spotlight | Location: components/home/hero-spotlight.tsx
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import { Movie } from "@/types";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/axios";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface HeroSpotlightProps {
  movie: Movie;
  spotlightMovies: Movie[];
  onMovieSelect?: (movie: Movie) => void;
}

export function HeroSpotlight({ movie, spotlightMovies, onMovieSelect }: HeroSpotlightProps) {
  type WatchlistEntry = { id: string; movieId: string };

  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: watchlists } = useQuery<WatchlistEntry[]>({
    queryKey: ["watchlist", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data } = await apiClient.get("/api/v1/watchlist/user/watchlist");
      return data.data;
    },
    enabled: !!session?.user?.id,
  });

  const isWatchlisted = Array.isArray(watchlists) && watchlists.some((w) => w.movieId === movie.id);

  const toggleWatchlistMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error("LOGIN_REQUIRED");
      if (isWatchlisted) {
        const entry = watchlists?.find((w) => w.movieId === movie.id);
        if (entry) await apiClient.delete(`/api/v1/watchlist/${entry.id}`);
      } else {
        await apiClient.post("/api/v1/watchlist", { movieId: movie.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", session?.user?.id] });
      toast.success(isWatchlisted ? "Removed from watchlist" : "Added to watchlist");
    },
    onError: (error: unknown) => {
      if ((error as Error)?.message === "LOGIN_REQUIRED") {
        toast.error("Please login to use watchlist");
        router.push("/login");
        return;
      }
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to update watchlist";
      toast.error(message);
    },
  });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Cinematic Backdrop */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {movie.backdropUrl || movie.posterUrl ? (
          <img
            src={movie.backdropUrl || movie.posterUrl || ""}
            alt={movie.title}
            className="w-full h-full object-cover opacity-90 contrast-[1.05] brightness-[0.75]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-950 via-primary/10 to-slate-950" />
        )}
      </div>

      {/* Dark Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      {/* Content Container */}
      <div className="absolute inset-0 z-10">
        <div className="container mx-auto flex h-full flex-col justify-end px-4 pb-38 md:pb-44 md:px-12 lg:px-12">
          <div className="flex items-end justify-between gap-6">
            {/* Left Content */}
            <div className="max-w-3xl animate-in slide-in-from-left-10 fade-in duration-700">
              {/* Title - Large Grunge Style */}
              <h1
                className="text-5xl md:text-6xl lg:text-[5rem] font-black tracking-tight text-white leading-[0.85] mb-6"
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  letterSpacing: "-0.02em",
                  textShadow: "0 4px 30px rgba(0,0,0,0.5)",
                }}
              >
                {movie.title.toUpperCase()}
              </h1>

              {/* Metadata Row */}
              <div className="flex items-center gap-2 text-sm text-white/80 mb-8">
                <span className="text-white/90">{movie.genre?.[0] || "Drama"}</span>
                <span className="text-white/50">•</span>
                <span className="text-white/90">{movie.genre?.[1] || "Thriller"}</span>
                <span className="text-white/50">•</span>
                <span className="px-1.5 py-0.5 text-xs border border-white/30 rounded">13+</span>
                <span className="text-white/50">•</span>
                <span className="text-white/90">{movie.releaseYear || "2026"}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Button
                  asChild
                  className="h-12 md:h-12 rounded-lg bg-[#E60012] hover:bg-[#ff1a2e] px-8 font-semibold text-base uppercase tracking-wide border-0"
                >
                  <Link href={`/movie/${movie.id}`}>
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    Play
                  </Link>
                </Button>
                <button
                  onClick={() => toggleWatchlistMutation.mutate()}
                  disabled={toggleWatchlistMutation.isPending}
                  aria-label="Toggle watchlist"
                  className={cn(
                    "inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/30",
                    isWatchlisted && "bg-white/40"
                  )}
                >
                  <span className="text-2xl leading-none">+</span>
                </button>
                <Link
                  href={`/movie/${movie.id}`}
                  className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur hover:bg-white/30 transition-colors"
                >
                  <Info className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Right - Thumbnail Strip */}
            <div className="hidden lg:flex flex-col items-end gap-3 pb-2">
              <div className="flex items-center gap-2">
                {spotlightMovies.slice(0, 6).map((spot) => (
                  <button
                    key={spot.id}
                    onClick={() => onMovieSelect?.(spot)}
                    className={cn(
                      "relative h-16 w-28 overflow-hidden rounded-md border-2 transition-all duration-300 hover:scale-105",
                      spot.id === movie.id
                        ? "border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        : "border-white/20 hover:border-white/50"
                    )}
                  >
                    {spot.backdropUrl || spot.posterUrl ? (
                      <img
                        src={(spot.backdropUrl || spot.posterUrl) || undefined}
                        alt={spot.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-[10px] text-zinc-300">
                        {spot.title}
                      </div>
                    )}
                    {spot.id === movie.id && (
                      <div className="absolute inset-0 bg-white/10" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
