"use client";

import { useState } from "react";
import { Play, Volume2, VolumeX, Clock, Calendar, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useMovies } from "@/hooks/use-movies";
import Link from "next/link";

const FILTER_TABS = ["All", "Movies", "TV Series", "Coming Soon"];

interface TrailerCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  duration: string;
  releaseDate: string;
  views?: string;
  isComingSoon?: boolean;
}

function TrailerCard({
  id,
  title,
  thumbnailUrl,
  duration,
  releaseDate,
  views,
  isComingSoon,
}: TrailerCardProps) {
  return (
    <div className="group">
      <Link href={`/trailer/${id}`} className="block">
        <div className="relative aspect-video rounded-xl overflow-hidden bg-muted/20 border border-white/5 hover:border-primary/50 transition-all duration-300">
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
          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-white text-xs font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration}
          </div>

          {/* Coming Soon Badge */}
          {isComingSoon && (
            <div className="absolute top-2 left-2 bg-primary px-2 py-1 rounded text-white text-xs font-bold uppercase">
              Coming Soon
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="mt-3">
        <h3 className="text-foreground font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-muted-foreground text-xs">
          <Calendar className="w-3 h-3" />
          <span>{releaseDate}</span>
          {views && (
            <>
              <span>•</span>
              <span>{views} views</span>
            </>
          )}
        </div>
        {isComingSoon && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-xs w-full"
            asChild
          >
            <Link href="/register">
              <Bell className="w-3 h-3 mr-1" />
              Notify Me
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

// Countdown Timer Component
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // This would be a real countdown in production with useEffect
  const mockTime = {
    days: Math.floor(Math.random() * 30) + 1,
    hours: Math.floor(Math.random() * 24),
    minutes: Math.floor(Math.random() * 60),
    seconds: Math.floor(Math.random() * 60),
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="bg-black/50 px-2 py-1 rounded text-white font-mono">
        {String(mockTime.days).padStart(2, "0")}d
      </div>
      <div className="bg-black/50 px-2 py-1 rounded text-white font-mono">
        {String(mockTime.hours).padStart(2, "0")}h
      </div>
      <div className="bg-black/50 px-2 py-1 rounded text-white font-mono">
        {String(mockTime.minutes).padStart(2, "0")}m
      </div>
      <div className="bg-black/50 px-2 py-1 rounded text-white font-mono">
        {String(mockTime.seconds).padStart(2, "0")}s
      </div>
    </div>
  );
}

export default function TrailersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [isMuted, setIsMuted] = useState(true);

  const { data: moviesData, isLoading } = useMovies({
    sortBy: "createdAt",
    order: "desc",
  });

  const allMovies = moviesData?.pages?.flatMap((page) => page.data) || [];

  const featuredTrailer = allMovies[0];
  const latestTrailers = allMovies.slice(1, 10);
  const mostWatched = allMovies.slice(0, 8);
  const comingSoon = allMovies.slice(5, 12);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero - Featured Trailer */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {featuredTrailer?.backdropUrl ? (
          <>
            <img
              src={featuredTrailer.backdropUrl}
              alt={featuredTrailer.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black" />
        )}

        <div className="relative h-full flex items-end">
          <div className="max-w-8xl mx-auto px-4 md:px-10 w-full pb-16">
            {isLoading ? (
              <LoadingSkeleton type="hero" />
            ) : featuredTrailer ? (
              <div className="max-w-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <span className="bg-primary px-3 py-1 rounded-full text-white text-xs font-bold uppercase">
                    Featured Trailer
                  </span>
                  <span className="text-white/70 text-sm">
                    {featuredTrailer.genre[0]}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
                  {featuredTrailer.title}
                </h1>
                <p className="text-white/80 text-lg line-clamp-2">
                  {featuredTrailer.description}
                </p>
                <div className="flex items-center gap-4 text-white/70 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Coming {featuredTrailer.releaseYear}
                  </span>
                  {featuredTrailer.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredTrailer.duration} min
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <Button size="lg" className="px-8">
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Watch Full Trailer
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5 mr-2" />
                    ) : (
                      <Volume2 className="w-5 h-5 mr-2" />
                    )}
                    {isMuted ? "Unmute" : "Mute"}
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-8xl mx-auto px-4 md:px-10 py-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 md:px-10 py-10 space-y-16">
        {/* Latest Trailers */}
        <section>
          <SectionHeading
            title="Latest Trailers"
            subtitle="Fresh drops from your favorite studios"
            action={{ label: "View All", href: "/trailers" }}
          />
          {isLoading ? (
            <LoadingSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestTrailers.map((movie) => (
                <TrailerCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  thumbnailUrl={movie.backdropUrl || movie.posterUrl || ""}
                  duration="2:34"
                  releaseDate={`${movie.releaseYear}`}
                  views={(Math.floor(Math.random() * 500) + 50).toString() + "K"}
                />
              ))}
            </div>
          )}
        </section>

        {/* Most Watched Trailers */}
        <section>
          <SectionHeading
            title="Most Watched Trailers"
            subtitle="Trending with our community"
            action={{ label: "View All", href: "/trailers" }}
          />
          {isLoading ? (
            <LoadingSkeleton type="row" count={6} />
          ) : (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:-mx-10 md:px-10">
              {mostWatched.map((movie) => (
                <div key={movie.id} className="flex-shrink-0 w-72">
                  <TrailerCard
                    id={movie.id}
                    title={movie.title}
                    thumbnailUrl={movie.backdropUrl || movie.posterUrl || ""}
                    duration="2:34"
                    releaseDate={`${movie.releaseYear}`}
                    views={(Math.floor(Math.random() * 1000) + 100).toString() + "K"}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Coming Soon with Countdown */}
        <section>
          <SectionHeading
            title="Coming Soon"
            subtitle="Mark your calendar for these releases"
            action={{ label: "View All", href: "/trailers" }}
          />
          {isLoading ? (
            <LoadingSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {comingSoon.map((movie) => (
                <div key={movie.id} className="group">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-muted/20 border border-white/5">
                    <img
                      src={movie.posterUrl || movie.backdropUrl || ""}
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Countdown */}
                    <div className="absolute top-4 left-4">
                      <CountdownTimer
                        targetDate={new Date(movie.releaseYear, 0, 1)}
                      />
                    </div>

                    {/* Coming Soon Badge */}
                    <div className="absolute top-4 right-4 bg-primary px-2 py-1 rounded text-white text-xs font-bold uppercase">
                      Coming Soon
                    </div>

                    {/* Title */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg">
                        {movie.title}
                      </h3>
                      <p className="text-white/70 text-sm">
                        {movie.releaseYear}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 w-full"
                    asChild
                  >
                    <Link href="/register">
                      <Bell className="w-4 h-4 mr-2" />
                      Notify Me
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Banner */}
        <section className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

          <div className="relative px-8 py-12 md:py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Be the First to Watch
            </h2>
            <p className="text-white/70 text-lg mb-6 max-w-xl mx-auto">
              Create a free account to get notified when new trailers drop and
              exclusive premieres go live.
            </p>
            <Button size="lg" className="px-8" asChild>
              <Link href="/register">Create Free Account</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
