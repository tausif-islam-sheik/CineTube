"use client";

import { useState } from "react";
import { Flame, Play, Users, Clock, Tv, Trophy, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { MovieCard } from "@/components/shared/movie-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useMovies } from "@/hooks/use-movies";
import { useSession } from "@/lib/auth-client";

const BINGE_PLAYLISTS = [
  {
    id: 1,
    title: "Marvel Cinematic Order",
    emoji: "🦸",
    movies: 23,
    hours: 50,
    color: "from-red-600 to-blue-600",
  },
  {
    id: 2,
    title: "Best Crime Series Ever",
    emoji: "🔪",
    movies: 12,
    hours: 36,
    color: "from-slate-700 to-slate-900",
  },
  {
    id: 3,
    title: "Sci-Fi Mind Benders",
    emoji: "🚀",
    movies: 8,
    hours: 18,
    color: "from-purple-600 to-pink-600",
  },
  {
    id: 4,
    title: "Comedy Marathons",
    emoji: "😂",
    movies: 15,
    hours: 28,
    color: "from-yellow-500 to-orange-500",
  },
];

export default function BingeZonePage() {
  const [liveCount, setLiveCount] = useState(4200);
  const { data: session } = useSession();

  const { data: moviesData, isLoading } = useMovies({
    sortBy: "rating",
    order: "desc",
  });

  const allMovies = moviesData?.pages?.flatMap((page) => page.data) || [];

  // Featured binge series (highest rated with good runtime)
  const featuredSeries = allMovies[0];
  const bingeReadySeries = allMovies.slice(1, 9).map((m) => ({
    ...m,
    seasons: Math.floor(Math.random() * 5) + 1,
    episodes: Math.floor(Math.random() * 15) + 5,
    totalHours: Math.floor(Math.random() * 30) + 10,
  }));

  // Binge streak (mock data)
  const bingeStreak = 5;
  const lastSession = {
    title: "Stranger Things",
    episode: "S3 E5",
    progress: 65,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero - Enter the Binge Zone */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {featuredSeries?.backdropUrl ? (
          <>
            <img
              src={featuredSeries.backdropUrl}
              alt={featuredSeries.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-slate-900 to-black" />
        )}

        {/* Fire particles effect overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent" />

        <div className="relative h-full flex items-end">
          <div className="max-w-8xl mx-auto px-4 md:px-10 w-full pb-16">
            {isLoading ? (
              <LoadingSkeleton type="hero" />
            ) : featuredSeries ? (
              <div className="max-w-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-500" />
                  <span className="text-xl font-black uppercase tracking-wider text-orange-400">
                    Binge Zone
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
                  Enter the Binge Zone 🔥
                </h1>
                <p className="text-white/80 text-lg">
                  {featuredSeries.title} — The ultimate binge-worthy experience
                </p>
                <div className="flex items-center gap-4 text-white/70 text-sm">
                  <span className="flex items-center gap-1">
                    <Tv className="w-4 h-4" />
                    5 Seasons
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    ~42 hours total
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span className="text-orange-400 font-bold animate-pulse">
                      {liveCount.toLocaleString()}
                    </span>{" "}
                    binging now
                  </span>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <Button size="lg" className="px-8 bg-orange-500 hover:bg-orange-600">
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Start Binging
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Add to My List
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="max-w-8xl mx-auto px-4 md:px-10 py-10 space-y-16">
        {/* Binge Streak Tracker */}
        <section className="p-6 rounded-2xl bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent border border-orange-500/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black">
                  You&apos;ve watched {bingeStreak} days in a row 🔥
                </h3>
                <p className="text-muted-foreground">
                  Keep the streak alive! Watch something today.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <div
                  key={day}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                    day <= bingeStreak
                      ? "bg-orange-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {day <= bingeStreak ? "🔥" : day}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Continue Your Binge */}
        <section className="p-6 rounded-2xl bg-muted/30 border border-border">
          <SectionHeading
            title="Continue Your Binge"
            subtitle="Resume where you left off"
          />
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-full md:w-64 aspect-video rounded-xl overflow-hidden">
              <img
                src={allMovies[0]?.backdropUrl || ""}
                alt={lastSession.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${lastSession.progress}%` }}
                />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold">{lastSession.title}</h3>
              <p className="text-muted-foreground mb-4">
                {lastSession.episode} • {lastSession.progress}% watched
              </p>
              <Button>
                <Play className="w-4 h-4 mr-2 fill-current" />
                Resume Watching
              </Button>
            </div>
          </div>
        </section>

        {/* Binge-Ready Series */}
        <section>
          <SectionHeading
            title="Binge-Ready Series"
            subtitle="All seasons available now"
            badge="fire"
            action={{ label: "View All", href: "/series" }}
          />
          {isLoading ? (
            <LoadingSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bingeReadySeries.map((series) => (
                <div
                  key={series.id}
                  className="group relative p-4 rounded-xl bg-muted/30 border border-border hover:border-orange-500/30 transition-all"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                    <img
                      src={series.backdropUrl || series.posterUrl || ""}
                      alt={series.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold truncate">
                        {series.title}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Tv className="w-4 h-4" />
                        {series.seasons} Seasons
                      </span>
                      <span className="font-medium">
                        {series.episodes} Episodes
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Total Time
                      </span>
                      <span className="font-bold text-orange-500">
                        ~{series.totalHours} hours
                      </span>
                    </div>
                  </div>

                  <Button className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity bg-orange-500 hover:bg-orange-600">
                    Start Binging
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Curated Binge Playlists */}
        <section>
          <SectionHeading
            title="Curated Binge Playlists"
            subtitle="Themed collections for marathon viewing"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {BINGE_PLAYLISTS.map((playlist) => (
              <div
                key={playlist.id}
                className={cn(
                  "group relative p-6 rounded-xl bg-gradient-to-br",
                  playlist.color,
                  "hover:scale-105 transition-transform cursor-pointer"
                )}
              >
                <div className="relative z-10">
                  <span className="text-4xl mb-4 block">{playlist.emoji}</span>
                  <h3 className="text-white font-bold text-lg mb-2">
                    {playlist.title}
                  </h3>
                  <div className="text-white/80 text-sm space-y-1">
                    <p>{playlist.movies} movies/series</p>
                    <p className="font-bold">{playlist.hours} hours total</p>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-current" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Binging Now */}
        <section className="p-6 rounded-2xl bg-muted/30 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5" />
                Community Binging Now
              </h3>
              <p className="text-muted-foreground text-sm">
                See what others are watching right now
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-orange-500 animate-pulse">
                🔥 {liveCount.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">people binging</p>
            </div>
          </div>

          <div className="space-y-3">
            {allMovies.slice(0, 5).map((movie, i) => (
              <div
                key={movie.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-background hover:bg-background/80 transition-colors"
              >
                <div className="text-lg font-bold text-muted-foreground w-6">
                  {i + 1}
                </div>
                <div className="relative w-12 aspect-video rounded overflow-hidden">
                  <img
                    src={movie.backdropUrl || movie.posterUrl || ""}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold truncate">{movie.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {movie.genre[0]} • {movie.releaseYear}
                  </p>
                </div>
                <div className="text-sm text-orange-500 font-medium">
                  <Zap className="w-4 h-4 inline mr-1" />
                  {Math.floor(Math.random() * 500 + 100)} watching
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
