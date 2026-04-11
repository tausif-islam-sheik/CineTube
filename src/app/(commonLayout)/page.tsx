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
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   Animated gradient background component
───────────────────────────────────────────── */
function GradientOrb({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    />
  );
}

/* ─────────────────────────────────────────────
   Movie poster card
───────────────────────────────────────────── */
function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer shrink-0 w-40 md:w-44">
        {/* Poster */}
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <MonitorPlay className="w-10 h-10 text-slate-600" />
          </div>
        )}

        {/* Bottom gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover content */}
        <div className="absolute bottom-0 inset-x-0 p-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white text-xs font-bold leading-tight line-clamp-2">
            {movie.title}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-yellow-400 text-xs font-semibold">
              {movie.averageRating?.toFixed(1) ?? "N/A"}
            </span>
            <span className="text-white/50 text-xs ml-auto">{movie.releaseYear}</span>
          </div>
        </div>

        {/* Pricing badge */}
        {movie.pricing === "PREMIUM" && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            PRO
          </div>
        )}
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Auto-scrolling movie row
───────────────────────────────────────────── */
function MovieRow({
  title,
  icon,
  movies,
}: {
  title: string;
  icon: React.ReactNode;
  movies: Movie[];
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-4 md:px-8">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          {icon}
          {title}
        </h2>
        <Link
          href="/discover"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          See all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto px-4 md:px-8 pb-2 scrollbar-hide snap-x">
        {movies.map((m) => (
          <div key={m.id} className="snap-start">
            <MovieCard movie={m} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Hero Feature Film spotlight
───────────────────────────────────────────── */
function HeroSpotlight({ movie }: { movie: Movie }) {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden rounded-none">
      {/* Backdrop */}
      {movie.posterUrl ? (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover scale-105"
          style={{ filter: "blur(2px)" }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-indigo-950" />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-16 container mx-auto px-4 md:px-8">
        <div className="max-w-2xl space-y-5 animate-in slide-in-from-bottom-8 fade-in duration-700">
          {/* Genre tags */}
          <div className="flex flex-wrap gap-2">
            {movie.genre.slice(0, 3).map((g) => (
              <span
                key={g}
                className="px-2.5 py-0.5 bg-white/10 border border-white/20 text-white/80 text-xs font-medium rounded-full backdrop-blur-sm"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none">
            {movie.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center flex-wrap gap-5 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-white text-base">
                {movie.averageRating?.toFixed(1) ?? "N/A"}
              </span>
            </span>
            <span>{movie.releaseYear}</span>
            {movie.duration && <span>{movie.duration} min</span>}
            <span className="px-2.5 py-0.5 bg-primary/30 text-primary border border-primary/40 rounded-full text-xs font-bold">
              {movie.pricing}
            </span>
          </div>

          {/* Description */}
          <p className="text-white/70 text-base leading-relaxed line-clamp-3 max-w-lg">
            {movie.description}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href={`/movie/${movie.id}`}>
              <Button
                size="lg"
                className="rounded-full px-8 gap-2 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
              >
                <Play className="w-5 h-5 fill-current" />
                Watch Now
              </Button>
            </Link>
            <Link href="/discover">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-white/30 text-white bg-white/10 backdrop-blur hover:bg-white/20"
              >
                Browse All
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stats bar
───────────────────────────────────────────── */
const STATS = [
  { icon: <MonitorPlay className="w-5 h-5 text-primary" />, value: "10,000+", label: "Titles" },
  { icon: <Users className="w-5 h-5 text-primary" />, value: "500K+", label: "Members" },
  { icon: <TrendingUp className="w-5 h-5 text-primary" />, value: "4K", label: "Ultra HD" },
  { icon: <Zap className="w-5 h-5 text-primary" />, value: "99.9%", label: "Uptime" },
];

/* ─────────────────────────────────────────────
   Feature cards
───────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <Zap className="w-6 h-6 text-indigo-400" />,
    title: "Lightning Fast",
    desc: "CDN-powered global delivery ensures zero buffering, anywhere on earth.",
    grad: "from-indigo-500/10 to-purple-500/10",
    border: "border-indigo-500/20",
  },
  {
    icon: <Shield className="w-6 h-6 text-emerald-400" />,
    title: "Secure & Private",
    desc: "End-to-end encrypted sessions. Your watch history stays yours.",
    grad: "from-emerald-500/10 to-teal-500/10",
    border: "border-emerald-500/20",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-yellow-400" />,
    title: "Smart Recommendations",
    desc: "AI-curated picks based on your taste — not just popularity.",
    grad: "from-yellow-500/10 to-orange-500/10",
    border: "border-yellow-500/20",
  },
  {
    icon: <Clock className="w-6 h-6 text-pink-400" />,
    title: "Watch Anywhere",
    desc: "Continue seamlessly across all your devices with sync.",
    grad: "from-pink-500/10 to-rose-500/10",
    border: "border-pink-500/20",
  },
];

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
export default function HomePage() {
  const { data: session } = useSession();

  const { data: moviesResp } = useQuery<{ data: Movie[] }>({
    queryKey: ["homepage", "movies"],
    queryFn: async () => {
      const { data } = await apiClient.get(
        "/api/v1/movies?limit=20&sortBy=createdAt&order=desc"
      );
      return data;
    },
  });

  const { data: topRatedResp } = useQuery<{ data: Movie[] }>({
    queryKey: ["homepage", "top-rated"],
    queryFn: async () => {
      const { data } = await apiClient.get(
        "/api/v1/movies?limit=12&sortBy=rating&order=desc"
      );
      return data;
    },
  });

  const movies = moviesResp?.data ?? [];
  const topRated = topRatedResp?.data ?? [];
  const heroMovie = movies[0] ?? null;
  const newArrivals = movies.slice(1, 13);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ── HERO ── */}
      {heroMovie ? (
        <HeroSpotlight movie={heroMovie} />
      ) : (
        /* Fallback hero for unauthenticated / no movies state */
        <section className="relative min-h-[80vh] flex items-center overflow-hidden">
          {/* Orb background */}
          <GradientOrb className="w-[600px] h-[600px] bg-indigo-500 -top-48 -left-48" />
          <GradientOrb className="w-[500px] h-[500px] bg-violet-600 top-1/4 right-0 translate-x-1/2" />
          <GradientOrb className="w-[400px] h-[400px] bg-cyan-500 bottom-0 left-1/3" />

          {/* Grid mesh */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          <div className="relative container mx-auto px-4 md:px-8 py-24 text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Next-Gen Streaming Platform
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
              Cinema{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover, rate, and stream thousands of films in stunning 4K.{" "}
              <span className="text-foreground font-semibold">
                Your cinematic universe starts here.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {session ? (
                <Link href="/discover">
                  <Button
                    size="lg"
                    className="rounded-full px-10 text-lg gap-2 h-14 shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Start Watching
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="rounded-full px-10 text-lg gap-2 h-14 shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
                    >
                      <Sparkles className="w-5 h-5" />
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/discover">
                    <Button
                      size="lg"
                      variant="outline"
                      className="rounded-full px-10 text-lg h-14 hover:scale-105 transition-all"
                    >
                      Browse Catalog
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Floating poster strip */}
            <div className="relative mt-8 flex justify-center gap-3 opacity-60 pointer-events-none select-none">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-24 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-white/10"
                  style={{ transform: `rotate(${(i - 2) * 5}deg) translateY(${Math.abs(i - 2) * 8}px)` }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── STATS BAR ── */}
      <section className="border-y border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/50">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center gap-1 py-6 text-center"
              >
                <div className="flex items-center gap-2">
                  {s.icon}
                  <span className="text-2xl font-black text-foreground">{s.value}</span>
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-12 space-y-14">
        {/* ── NEW ARRIVALS ── */}
        {newArrivals.length > 0 && (
          <MovieRow
            title="New Arrivals"
            icon={<Sparkles className="w-5 h-5 text-primary" />}
            movies={newArrivals}
          />
        )}

        {/* ── TOP RATED ── */}
        {topRated.length > 0 && (
          <MovieRow
            title="Top Rated"
            icon={<Flame className="w-5 h-5 text-orange-500" />}
            movies={topRated}
          />
        )}

        {/* ── PREMIUM PICKS ── */}
        {movies.filter((m) => m.pricing === "PREMIUM").length > 0 && (
          <MovieRow
            title="Premium Exclusives"
            icon={<Star className="w-5 h-5 text-yellow-500" />}
            movies={movies.filter((m) => m.pricing === "PREMIUM").slice(0, 12)}
          />
        )}
      </div>

      {/* ── FEATURES SECTION ── */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Zap className="w-3.5 h-3.5" />
            Why CineTube
          </div>
          <h2 className="text-4xl font-black tracking-tight">
            Built for real cinephiles
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            We obsess over every pixel, every frame, every millisecond — so you can just enjoy the show.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`relative p-6 rounded-2xl border ${f.border} bg-gradient-to-br ${f.grad} backdrop-blur-sm group hover:scale-105 transition-transform duration-300`}
            >
              <div className="p-2.5 rounded-xl bg-card/80 w-fit mb-4 shadow-sm">
                {f.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      {!session && (
        <section className="container mx-auto px-4 md:px-8 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-12 md:p-16 text-center">
            {/* Orbs inside banner */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Your first month is on us.
              </h2>
              <p className="text-white/80 text-lg">
                Join 500,000+ cinephiles. Cancel anytime — no questions asked.
              </p>
              <Link href="/pricing">
                <Button
                  size="lg"
                  className="rounded-full px-12 h-14 text-lg bg-white text-indigo-700 hover:bg-white/90 font-bold shadow-2xl hover:scale-105 transition-all"
                >
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
