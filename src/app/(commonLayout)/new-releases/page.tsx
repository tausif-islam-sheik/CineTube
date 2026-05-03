"use client";

import { useState } from "react";
import { Bell, Clock, Calendar, Film, Tv, Clapperboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MovieCard } from "@/components/shared/movie-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useMovies } from "@/hooks/use-movies";
import Link from "next/link";

const TABS = [
  { value: "all", label: "All", icon: Clapperboard },
  { value: "movies", label: "Movies", icon: Film },
  { value: "series", label: "Series", icon: Tv },
];

export default function NewReleasesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<Set<string>>(new Set());

  const { data: moviesData, isLoading } = useMovies({
    sortBy: "createdAt",
    order: "desc",
  });

  const allMovies = moviesData?.pages?.flatMap((page) => page.data) || [];

  // Sort by newest
  const newReleases = [...allMovies].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const featuredRelease = newReleases[0];
  const thisWeek = newReleases.slice(1, 7);
  const thisMonth = newReleases.slice(7, 15);
  const recentlyAdded = newReleases.slice(15, 23);
  const comingNextWeek = newReleases.slice(10, 16); // Mock coming soon

  const toggleNotification = (id: string) => {
    setNotifications((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero - Featured Release */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {(featuredRelease?.backdropUrl || featuredRelease?.posterUrl) ? (
          <>
            <img
              src={featuredRelease.backdropUrl || featuredRelease.posterUrl || ""}
              alt={featuredRelease.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/100 via-transparent to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        )}

        <div className="absolute top-6 left-6 md:left-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Fresh Drops
            </span>
          </div>
        </div>

        <div className="relative h-full flex items-end">
          <div className="max-w-8xl mx-auto px-4 md:px-10 w-full pb-16">
            {isLoading ? (
              <LoadingSkeleton type="hero" />
            ) : featuredRelease ? (
              <div className="max-w-2xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  New This Week
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
                  {featuredRelease.title}
                </h1>
                <p className="text-white/80 text-lg line-clamp-2">
                  {featuredRelease.description}
                </p>
                <div className="flex items-center gap-4 text-white/70 text-sm">
                  <span>{featuredRelease.releaseYear}</span>
                  <span>•</span>
                  <span>{featuredRelease.genre[0]}</span>
                  {featuredRelease.duration && (
                    <>
                      <span>•</span>
                      <span>{featuredRelease.duration} min</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <Link href={`/movie/${featuredRelease.id}`}>
                    <Button size="lg" className="px-8">
                      Watch Now
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Bell className="w-5 h-5 mr-2" />
                    Notify Me
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border">
        <div className="max-w-8xl mx-auto px-4 md:px-10 py-4">
          <div className="flex items-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                  activeTab === tab.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 md:px-10 py-10 space-y-16">
        {/* This Week */}
        <section>
          <SectionHeading
            title="This Week"
            subtitle="Brand new releases"
            badge="new"
            action={{ label: "View All", href: "/movies" }}
          />
          {isLoading ? (
            <LoadingSkeleton type="row" count={6} />
          ) : (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:-mx-10 md:px-10">
              {thisWeek.map((movie) => (
                <div key={movie.id} className="flex-shrink-0 w-40 md:w-48 relative">
                  <MovieCard movie={movie} isNew variant="portrait" />
                  <div className="absolute top-2 left-2 z-10 bg-primary px-2 py-1 rounded text-white text-[10px] font-bold uppercase">
                    NEW
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* This Month */}
        <section>
          <SectionHeading
            title="This Month"
            subtitle="Recently added to the platform"
            action={{ label: "View All", href: "/movies" }}
          />
          {isLoading ? (
            <LoadingSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {thisMonth.map((movie) => (
                <div key={movie.id} className="relative">
                  <MovieCard movie={movie} variant="portrait" />
                  <div className="absolute top-2 left-2 z-10 bg-primary/80 px-2 py-1 rounded text-white text-[10px] font-bold uppercase">
                    NEW
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recently Added Chronological */}
        <section className="p-6 rounded-2xl bg-muted/30 border border-border">
          <SectionHeading
            title="Recently Added to Platform"
            subtitle="Chronological list of new content"
          />
          {isLoading ? (
            <LoadingSkeleton count={5} />
          ) : (
            <div className="space-y-4">
              {recentlyAdded.map((movie, i) => (
                <div
                  key={movie.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-background hover:bg-background/80 transition-colors group"
                >
                  <div className="relative w-16 aspect-[2/3] rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={movie.posterUrl || ""}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate">{movie.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {movie.releaseYear} • {movie.genre[0]}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Added {i + 1} day{i !== 0 ? "s" : ""} ago
                    </p>
                  </div>
                  <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Watch
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Coming Next Week */}
        <section>
          <SectionHeading
            title="Coming Next Week"
            subtitle="Mark your calendar"
            action={{ label: "View All", href: "/trailers" }}
          />
          {isLoading ? (
            <LoadingSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {comingNextWeek.map((movie) => (
                <div key={movie.id} className="group">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted/20">
                    <img
                      src={movie.posterUrl || ""}
                      alt={movie.title}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {/* Lock/Coming Soon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Clock className="w-8 h-8 text-white/70 mx-auto mb-2" />
                        <p className="text-white text-xs font-bold uppercase">
                          Coming Soon
                        </p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white font-bold text-sm truncate">
                        {movie.title}
                      </p>
                      <p className="text-white/70 text-xs">
                        Releases {new Date().getDate() + Math.floor(Math.random() * 7)}th
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={notifications.has(movie.id) ? "default" : "outline"}
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => toggleNotification(movie.id)}
                  >
                    <Bell
                      className={cn(
                        "w-4 h-4 mr-2",
                        notifications.has(movie.id) && "fill-current"
                      )}
                    />
                    {notifications.has(movie.id) ? "Notified" : "Notify Me"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
