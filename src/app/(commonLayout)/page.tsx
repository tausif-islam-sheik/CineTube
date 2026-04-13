"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Movie } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Play,
  Info,
  Star,
  ChevronRight,
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
function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer shrink-0 w-40 md:w-56 bg-muted/20 border border-white/5 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(var(--primary),0.2)]">
        {/* Poster */}
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.85] group-hover:brightness-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground p-6 text-center text-sm bg-gradient-to-br from-slate-900 to-slate-800">
            {movie.title}
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
            </div>
        </div>

        {/* Info Area */}
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
          <div className="absolute top-3 left-3 bg-primary px-2 py-1 rounded-lg shadow-xl">
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

/* ─────────────────────────────────────────────
   Movie Row
 ───────────────────────────────────────────── */
function MovieRow({
  title,
  icon,
  movies,
  subtitle,
}: {
  title: string;
  icon: React.ReactNode;
  movies: Movie[];
  subtitle?: string;
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between px-4 md:px-8">
        <div className="space-y-1">
          <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight">
            {icon}
            {title}
          </h2>
          {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
        </div>
        <Link
          href="/discover"
          className="group flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
        >
          Explore All
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
      
      <div className="relative group">
        <div className="flex gap-4 md:gap-6 overflow-x-auto px-4 md:px-8 pb-4 scrollbar-hide snap-x">
          {movies.map((m) => (
            <div key={m.id} className="snap-start">
              <MovieCard movie={m} />
            </div>
          ))}
        </div>
        {/* Shadow fades for scroll indication */}
        <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Hero Spotlight
 ───────────────────────────────────────────── */
function HeroSpotlight({ movie, spotlightMovies }: { movie: Movie; spotlightMovies: Movie[] }) {
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
    <div className="relative w-full h-[85vh] md:h-[90vh] min-h-[600px] overflow-hidden bg-black">
      {/* Cinematic Backdrop */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover animate-slow-zoom opacity-70 contrast-[1.1] brightness-[0.8]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-950 via-primary/10 to-slate-950" />
        )}
      </div>

      {/* Sophisticated Lighting Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent lg:opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Content Container */}
      <div className="absolute inset-0 z-10">
        <div className="container mx-auto flex h-full flex-col justify-end px-4 pb-8 md:px-12 lg:px-20 md:pb-10">
          <div className="flex items-end justify-between gap-6">
            <div className="max-w-2xl space-y-8 animate-in slide-in-from-left-10 fade-in duration-700">
              <p className="text-[14px] font-semibold tracking-[0.22em] text-white/85 uppercase">
                CineTube Spotlight
              </p>
              <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-[0.95]">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-xs
              md:text-lg text-white/85">
                <span className="rounded-full bg-white/10 px-2.5 py-1">{movie.genre?.[0] || "Drama"}</span>
                <span className="rounded-full bg-white/10 px-2.5 py-1">{movie.releaseYear}</span>
                <span className="rounded-full bg-white/10 px-2.5 py-1">{movie.duration ? `${movie.duration}m` : "N/A"}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {movie.averageRating?.toFixed(1) ?? "N/A"}
                </span>
              </div>
              <p className="max-w-xl text-md md:text-lg leading-relaxed text-white/75 line-clamp-2">
                {movie.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Button asChild className="h-14 rounded-xl bg-primary px-8 font-bold uppercase tracking-wide">
                  <Link href={`/movie/${movie.id}`}>
                    <Play className="mr-1 h-4 w-4 fill-current" />
                    Play
                  </Link>
                </Button>
                <button
                  onClick={() => toggleWatchlistMutation.mutate()}
                  disabled={toggleWatchlistMutation.isPending}
                  aria-label="Toggle watchlist"
                  className={cn(
                    "inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/30",
                    isWatchlisted && "bg-primary/80 hover:bg-primary"
                  )}
                >
                  <span className="text-3xl leading-none">+</span>
                </button>
                <Link
                  href={`/movie/${movie.id}`}
                  className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 text-sm text-white backdrop-blur hover:bg-white/30 transition-colors"
                >
                  <Info className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-end gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-black/35 p-2 backdrop-blur">
                {spotlightMovies.slice(0, 6).map((spot) => (
                  <Link
                    key={spot.id}
                    href={`/movie/${spot.id}`}
                    className={cn(
                      "relative h-12 w-20 overflow-hidden rounded-md border border-transparent transition-all",
                      spot.id === movie.id && "border-white shadow-[0_0_0_1px_rgba(255,255,255,0.7)]"
                    )}
                  >
                    {spot.posterUrl ? (
                      <img src={spot.posterUrl} alt={spot.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-[10px] text-zinc-300">
                        {spot.title}
                      </div>
                    )}
                  </Link>
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
  const { data: newlyAddedResp } = useQuery<{ data: Movie[] }>({
    queryKey: ["homepage", "newly-added"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/movies?limit=15&sortBy=createdAt&order=desc");
      return data;
    },
  });

  // Fetch Top Rated
  const { data: topRatedResp } = useQuery<{ data: Movie[] }>({
    queryKey: ["homepage", "top-rated"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/movies?limit=15&sortBy=rating&order=desc");
      return data;
    },
  });

  // Fetch Editor's Picks (High Rated in specific genres or just high rated)
  const { data: editorPicksResp } = useQuery<{ data: Movie[] }>({
    queryKey: ["homepage", "editor-picks"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/movies?limit=12&minRating=8&sortBy=rating&order=desc");
      return data;
    },
  });

  const newlyAdded = newlyAddedResp?.data ?? [];
  const topRated = topRatedResp?.data ?? [];
  const editorPicks = editorPicksResp?.data ?? [];
  const heroMovie = topRated[0] || newlyAdded[0];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground pb-20">
      {/* ── HERO ── */}
      {heroMovie && (
        <HeroSpotlight
          movie={heroMovie}
          spotlightMovies={[heroMovie, ...topRated, ...newlyAdded]}
        />
      )}



      {/* ── CONTENT SECTIONS ── */}
      <div className="py-20 space-y-28">
        {/* NEWLY ADDED */}
        {newlyAdded.length > 0 && (
          <MovieRow
            title="Newly Added"
            subtitle="Fresh arrivals for your watchlist"
            icon={<Sparkles className="w-6 h-6 text-primary" />}
            movies={newlyAdded}
          />
        )}

        {/* TOP RATED */}
        {topRated.length > 0 && (
          <MovieRow
            title="Top Rated This Week"
            subtitle="The highest-rated cinematic masterpieces"
            icon={<Award className="w-6 h-6 text-yellow-500" />}
            movies={topRated}
          />
        )}

        {/* EDITOR'S PICKS */}
        {editorPicks.length > 0 && (
          <MovieRow
            title="Editor’s Picks"
            subtitle="Hand-picked recommendations from our team"
            icon={<Flame className="w-6 h-6 text-orange-500" />}
            movies={editorPicks}
          />
        )}

        {/* WHY CINETUBE */}
        <section className="container mx-auto px-4 md:px-8">
          <div className="rounded-[2rem] border border-border bg-card/40 p-6 md:p-10">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Why CineTube</p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">A complete hub for movie lovers</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Discover trending titles, follow trusted reviews, and keep your watchlist in sync across devices.
                </p>
              </div>
              <Link href="/discover" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
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
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Ready to dive in?</h2>
                <p className="text-white/80 text-xl font-medium">Join over 500,000 cinephiles and start your journey today.</p>
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
