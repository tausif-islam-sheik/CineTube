"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Movie } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Play,
  Star,
  ChevronRight,
  Flame,
  Sparkles,
  Clock,
  Shield,
  Zap,
  MonitorPlay,
  Users,
  TrendingUp,
  Award,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { PricingSection } from "@/components/home/pricing-section";
import { WatchlistButton } from "@/components/movies/watchlist-button";

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
function HeroSpotlight({ movie }: { movie: Movie }) {
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
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-12 lg:px-20">
          <div className="max-w-4xl flex flex-col items-start gap-y-6 md:gap-y-10 animate-in slide-in-from-left-12 fade-in duration-1000 ease-out">
            
            {/* Elegant Badge */}
            <div className="flex items-center gap-3 md:gap-4 group">
              <div className="h-[2px] w-8 md:w-16 bg-primary/60 transition-all group-hover:w-24 group-hover:bg-primary duration-700" />
              <span className="text-[10px] md:text-[12px] font-black tracking-[0.5em] text-primary/80 group-hover:text-primary transition-colors uppercase">
                CineTube Spotlight
              </span>
            </div>

            {/* Fluid Responsive Title */}
            <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-black tracking-tighter text-white leading-[0.85] text-shadow-premium">
              {movie.title}
            </h1>

            {/* Premium Metadata Bar */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
               {/* Rating Panel */}
               <div className="glass-panel flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-2xl md:rounded-3xl shadow-2xl">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse" />
                  <span className="font-black text-white text-lg md:text-2xl">
                    {movie.averageRating?.toFixed(1) ?? "N/A"}
                  </span>
               </div>
               
               {/* Metadata List */}
               <div className="glass-panel flex items-center gap-4 md:gap-8 px-6 md:px-10 py-2 md:py-3 rounded-2xl md:rounded-3xl">
                  <div className="flex gap-3 mb-0.5">
                    {movie.genre.slice(0, 2).map((g) => (
                      <span key={g} className="text-white/90 font-bold tracking-widest uppercase text-[9px] md:text-[11px]">
                        {g}
                      </span>
                    ))}
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 hidden sm:block" />
                  <span className="text-white/80 font-black text-xs md:text-sm hidden sm:block">{movie.releaseYear}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 hidden sm:block" />
                  <div className="items-center gap-2 text-white/80 hidden sm:flex">
                    <Clock className="w-4 h-4" />
                    <span className="font-black text-xs md:text-sm tracking-tighter uppercase">{movie.duration} min</span>
                  </div>
               </div>
            </div>

            {/* Mobile-only collapsed Metadata */}
            <div className="flex sm:hidden items-center gap-4 text-white/60 font-bold text-xs px-2">
                 <span>{movie.releaseYear}</span>
                 <div className="w-1 h-1 rounded-full bg-white/20" />
                 <span>{movie.duration} MIN</span>
            </div>

            {/* Description */}
            <p className="text-white/60 text-lg md:text-2xl leading-relaxed line-clamp-3 max-w-3xl text-balance font-medium tracking-tight mt-2">
              {movie.description}
            </p>

            {/* Action Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 md:gap-8 pt-6 w-full sm:w-auto">
              <Link href={`/movie/${movie.id}`}>
                <Button 
                  size="xl" 
                  className={cn(
                    "rounded-full px-10 md:px-16 h-16 md:h-20 text-lg md:text-2xl cursor-pointer font-black gap-4",
                    "bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all text-shadow-none",
                    "shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
                  )}
                >
                  <Play className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                  WATCH NOW
                </Button>
              </Link>
              <WatchlistButton movie={movie} className="h-16 md:h-20 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Cinematic Fade */}
      <div className="absolute bottom-0 inset-x-0 h-40 md:h-64 bg-gradient-to-t from-background via-background/40 to-transparent" />
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
      {heroMovie && <HeroSpotlight movie={heroMovie} />}



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

        {/* PRICING */}
        <PricingSection />

        {/* FEATURES (Simplified for Home) */}
        <section className="container mx-auto px-4 md:px-8 py-10">
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <MonitorPlay className="w-8 h-8 text-primary" />, title: "Watch Anywhere", desc: "Available on Smart TVs, Playstation, Xbox, Apple TV, PC, and mobile." },
              { icon: <Users className="w-8 h-8 text-indigo-400" />, title: "Personal Profiles", desc: "Create up to 5 profiles for family members with their own watchlists." },
              { icon: <Zap className="w-8 h-8 text-emerald-400" />, title: "Instant Streaming", desc: "Adaptive bitrate ensures the best quality even on slower connections." },
            ].map((f) => (
              <div key={f.title} className="space-y-4 p-8 rounded-2xl bg-card border border-border group hover:border-primary/20 transition-colors">
                <div className="p-3 bg-primary/10 w-fit rounded-xl group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
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
