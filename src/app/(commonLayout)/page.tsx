"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";
import apiClient from "@/lib/axios";
import { Movie } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Play,
  Info,
  Star,
  ChevronRight,
  ChevronLeft,
  Flame,
  Sparkles,
  Shield,
  Zap,
  MonitorPlay,
  TrendingUp,
  Award,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { PricingSection } from "@/components/home/pricing-section";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

/* ─────────────────────────────────────────────
   Animated gradient background component
 ───────────────────────────────────────────── */
function GradientOrb({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute rounded-full blur-[120px] opacity-20 pointer-events-none animate-pulse",
        className
      )}
    />
  );
}

/* ─────────────────────────────────────────────
   Movie poster card
   ───────────────────────────────────────────── */
function MovieCard({ 
  movie, 
  isNew, 
  variant = "portrait" 
}: { 
  movie: Movie; 
  isNew?: boolean;
  variant?: "portrait" | "landscape";
}) {
  const isLandscape = variant === "landscape";
  
  return (
    <Link href={`/movie/${movie.id}`} className="block">
      <div 
        className={cn(
          "group relative rounded-lg overflow-hidden cursor-pointer shrink-0 bg-muted/20 transition-all duration-300 hover:scale-105 hover:z-10",
          isLandscape 
            ? "aspect-[16/9] w-48 sm:w-56 md:w-72" 
            : "aspect-[2/3] w-32 sm:w-40 md:w-48"
        )}
      >
        {/* Image */}
        {isLandscape 
          ? (movie.backdropUrl || movie.posterUrl) ? (
            <img
              src={movie.backdropUrl || movie.posterUrl || undefined}
              alt={movie.title}
              className="w-full h-full object-cover"
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
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground p-4 text-center text-sm bg-gradient-to-br from-slate-900 to-slate-800">
              {movie.title}
            </div>
          )
        }

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* New Release Badge - Only on first card */}
        {isNew && (
          <div className="absolute top-2 left-2 bg-[#e50914] px-2 py-1 rounded text-white text-[10px] font-bold uppercase tracking-wide">
            New Release
          </div>
        )}

        {/* Hover Info */}
        <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-sm font-bold leading-tight line-clamp-1">
            {movie.title}
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Movie Row - Netflix Style with Navigation
   ───────────────────────────────────────────── */
function MovieRow({
  title,
  icon,
  movies,
  subtitle,
  isFirstNew = false,
  variant = "portrait",
}: {
  title: string;
  icon?: React.ReactNode;
  movies: Movie[];
  subtitle?: string;
  isFirstNew?: boolean;
  variant?: "portrait" | "landscape";
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = variant === "landscape" ? 400 : 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="space-y-4">
      <div className="px-4 md:px-12">
        <div className="flex items-center gap-3">
          {icon && <span className="text-foreground/80">{icon}</span>}
          <h2 className="text-lg md:text-2xl font-bold tracking-wide text-foreground">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
        )}
      </div>
      
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300",
            canScrollLeft 
              ? "opacity-100 pointer-events-auto" 
              : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300",
            canScrollRight 
              ? "opacity-100 pointer-events-auto" 
              : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto px-4 md:px-12 pb-2 scrollbar-hide scroll-smooth"
        >
          {movies.map((m, idx) => (
            <div key={m.id} className="flex-shrink-0">
              <MovieCard 
                movie={m} 
                isNew={isFirstNew && idx === 0}
                variant={variant}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Hero Spotlight Skeleton Loader
   ───────────────────────────────────────────── */
function HeroSpotlightSkeleton() {
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
        <div className="container mx-auto flex h-full flex-col justify-end px-4 pb-24 md:pb-32 md:px-12 lg:px-16">
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

/* ─────────────────────────────────────────────
   Hero Spotlight
   ───────────────────────────────────────────── */
function HeroSpotlight({ movie, spotlightMovies, onMovieSelect }: { movie: Movie; spotlightMovies: Movie[]; onMovieSelect?: (movie: Movie) => void }) {
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
            src={movie.backdropUrl || movie.posterUrl}
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
                  textShadow: "0 4px 30px rgba(0,0,0,0.5)"
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
                  className="h-12 md:h-12 rounded-lg bg-[#e50914] hover:bg-[#f40612] px-8 font-semibold text-base uppercase tracking-wide border-0"
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
                        src={spot.backdropUrl || spot.posterUrl} 
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

/* ─────────────────────────────────────────────
   Main HomePage
 ───────────────────────────────────────────── */
export default function HomePage() {
  const { data: session } = useSession();

  // Fetch Newly Added
  const { data: newlyAddedResp, isLoading: isLoadingNewlyAdded } = useQuery<{ data: Movie[] }>({
    queryKey: ["homepage", "newly-added"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/movies?limit=15&sortBy=createdAt&order=desc");
      return data;
    },
  });

  // Fetch Top Rated
  const { data: topRatedResp, isLoading: isLoadingTopRated } = useQuery<{ data: Movie[] }>({
    queryKey: ["homepage", "top-rated"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/movies?limit=15&sortBy=rating&order=desc");
      return data;
    },
  });

  // Fetch Editor's Picks (High Rated in specific genres or just high rated)
  const { data: editorPicksResp, isLoading: isLoadingEditorPicks } = useQuery<{ data: Movie[] }>({
    queryKey: ["homepage", "editor-picks"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/movies?limit=12&minRating=8&sortBy=rating&order=desc");
      return data;
    },
  });

  const isLoadingHero = isLoadingTopRated || isLoadingNewlyAdded;
  const newlyAdded = newlyAddedResp?.data ?? [];
  const topRated = topRatedResp?.data ?? [];
  const editorPicks = editorPicksResp?.data ?? [];
  const heroMovie = topRated[0] || newlyAdded[0];
  
  // State for selected hero movie (for thumbnail click feature)
  const [selectedHeroMovie, setSelectedHeroMovie] = useState<Movie | null>(heroMovie || null);
  
  // Update selected movie when data loads
  useEffect(() => {
    if (heroMovie && !selectedHeroMovie) {
      setSelectedHeroMovie(heroMovie);
    }
  }, [heroMovie, selectedHeroMovie]);

  // Deduplicate spotlight movies (prevent hero movie appearing twice)
  const allSpotlightMovies = [heroMovie, ...topRated, ...newlyAdded].filter(Boolean);
  const uniqueSpotlightMovies = allSpotlightMovies.filter(
    (movie, index, self) => self.findIndex((m) => m.id === movie.id) === index
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground pb-20">
      {/* ── HERO ── */}
      {isLoadingHero ? (
        <HeroSpotlightSkeleton />
      ) : selectedHeroMovie ? (
        <HeroSpotlight
          movie={selectedHeroMovie}
          spotlightMovies={uniqueSpotlightMovies}
          onMovieSelect={setSelectedHeroMovie}
        />
      ) : null}



      {/* ── CONTENT SECTIONS ── */}
      <div className="space-y-10">
        {/* Newly Added - Overlaps banner */}
        {newlyAdded.length > 0 && (
          <div className="relative z-20 -mt-32">
            <MovieRow
              title="Newly Added"
              icon={<Sparkles className="w-5 h-5 text-primary" />}
              subtitle="Fresh arrivals for your watchlist"
              movies={newlyAdded}
              isFirstNew={true}
            />
          </div>
        )}

        {/* Top Rated This Week */}
        {topRated.length > 0 && (
          <MovieRow
            title="Top Rated This Week"
            icon={<Award className="w-5 h-5 text-yellow-500" />}
            subtitle="The highest-rated cinematic masterpieces"
            movies={topRated}
            variant="landscape"
          />
        )}

        {/* WHY CINETUBE */}
        <section className="container mx-auto px-4 md:px-8 pt-10">
          <div className="rounded-[2rem] border border-border bg-card/40 p-6 md:p-10">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Why CineTube</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">A complete hub for movie lovers</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Discover trending titles, follow trusted reviews, and keep your watchlist in sync across devices.
                </p>
              </div>
              <Link href="/discover" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors pb-18">
                Explore catalog →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "25K+", label: "Titles Indexed", icon: <MonitorPlay className="w-4 h-4 text-primary" /> },
                { value: "500K+", label: "Community Ratings", icon: <Star className="w-4 h-4 text-yellow-500 fill-yellow-500/20" /> },
                { value: "99.9%", label: "Streaming Uptime", icon: <Shield className="w-4 h-4 text-emerald-400" /> },
                { value: "24/7", label: "Trend Tracking", icon: <TrendingUp className="w-4 h-4 text-indigo-400" /> },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-background/60 p-4">
                  <div className="mb-3 inline-flex rounded-md bg-muted p-2">{item.icon}</div>
                  <p className="text-2xl font-black tracking-tight">{item.value}</p>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <PricingSection />
      </div>

      {/* ── CTA BANNER ── */}
      {!session && (
        <section className="container mx-auto px-4 md:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-primary p-12 md:p-20 text-center shadow-[0_20px_50px_rgba(var(--primary),0.3)]">
             <GradientOrb className="bg-white/20 -top-40 -left-40 w-96 h-96" />
             <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter">Ready to dive in?</h2>
                <p className="text-white/80 md:text-xl font-medium">Join over 500,000 cinephiles and start your journey today.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/register">
                    <Button size="lg" className="rounded-full px-12 h-16 text-lg bg-white text-primary hover:bg-zinc-100 font-black shadow-2xl">
                       Get Started Now
                    </Button>
                  </Link>
                  <Link href="/discover">
                    <Button size="lg" variant="ghost" className="rounded-full px-12 h-16 text-lg text-white hover:bg-white/10 font-bold">
                       Browse Catalog
                    </Button>
                  </Link>
                </div>
             </div>
          </div>
        </section>
      )}
    </div>
  );
}