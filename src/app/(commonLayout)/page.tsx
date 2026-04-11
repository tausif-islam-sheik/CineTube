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
import { HomeSearch } from "@/components/home/home-search";
import { PricingSection } from "@/components/home/pricing-section";

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
      <div className="group relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer shrink-0 w-36 md:w-48 bg-muted border border-border/50 hover:border-primary/50 transition-all duration-300">
        {/* Poster */}
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground p-4 text-center text-xs">
            {movie.title}
          </div>
        )}

        {/* Overlays */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
        
        {/* Info */}
        <div className="absolute bottom-0 inset-x-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-[12px] font-bold leading-tight line-clamp-1 mb-1">
            {movie.title}
          </p>
          <div className="flex items-center gap-1.5">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-yellow-400 text-[10px] font-bold">
              {movie.averageRating?.toFixed(1) ?? "N/A"}
            </span>
            <span className="text-white/60 text-[10px] ml-auto">{movie.releaseYear}</span>
          </div>
        </div>

        {/* Pricing badge */}
        {movie.pricing === "PREMIUM" && (
          <div className="absolute top-2 left-2 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase">
            Premium
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
    <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
      {/* Backdrop with parallax-like zoom */}
      <div className="absolute inset-0 w-full h-full">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 to-indigo-950" />
        )}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Dynamic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center container mx-auto px-4 md:px-8">
        <div className="max-w-2xl space-y-6 animate-in slide-in-from-left-8 fade-in duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-black tracking-widest uppercase">
            Featured Spotlight
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white drop-shadow-2xl">
            {movie.title}
          </h1>

          <div className="flex items-center flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-black text-white text-xl">
                {movie.averageRating?.toFixed(1) ?? "N/A"}
              </span>
            </div>
            <div className="flex gap-2">
               {movie.genre.slice(0, 2).map(g => (
                 <span key={g} className="text-white/70 font-medium px-2 py-0.5 bg-white/10 rounded">
                   {g}
                 </span>
               ))}
            </div>
            <span className="text-white/60 font-medium">{movie.releaseYear}</span>
            <span className="text-white/60 font-medium">{movie.duration} min</span>
          </div>

          <p className="text-white/70 text-lg leading-relaxed line-clamp-3 max-w-xl text-balance">
            {movie.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link href={`/movie/${movie.id}`}>
              <Button size="lg" className="rounded-full px-10 h-14 text-lg gap-3 shadow-2xl shadow-primary/40 hover:scale-105 transition-all">
                <Play className="w-6 h-6 fill-current" />
                Watch Now
              </Button>
            </Link>
            <Link href="/discover">
              <Button size="lg" variant="outline" className="rounded-full px-10 h-14 text-lg border-white/20 text-white bg-white/5 backdrop-blur hover:bg-white/10 transition-all">
                View Details
              </Button>
            </Link>
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
      {heroMovie && <HeroSpotlight movie={heroMovie} />}

      {/* ── SEARCH & FILTERS ── */}
      <HomeSearch />

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
          <div className="relative overflow-hidden rounded-[2rem] bg-indigo-600 p-12 md:p-20 text-center">
             <GradientOrb className="bg-white/20 -top-40 -left-40 w-96 h-96" />
             <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">Ready to dive in?</h2>
                <p className="text-indigo-100 text-xl font-medium">Join over 500,000 cinephiles and start your journey today.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/register">
                    <Button size="lg" className="rounded-full px-12 h-16 text-lg bg-white text-indigo-700 hover:bg-white/90 font-bold">
                       Get Started Now
                    </Button>
                  </Link>
                  <Link href="/discover">
                    <Button size="lg" variant="ghost" className="rounded-full px-12 h-16 text-lg text-white hover:bg-white/10">
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
