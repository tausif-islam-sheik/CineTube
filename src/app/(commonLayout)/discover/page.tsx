"use client";

import { useState } from "react";
import { Search, Play, Star, TrendingUp, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MovieCard } from "@/components/shared/movie-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useMovies } from "@/hooks/use-movies";
import Link from "next/link";

const GENRES = [
  "All",
  "Action",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Romance",
  "Animation",
  "Documentary",
];

export default function DiscoverPage() {
  const [activeGenre, setActiveGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenreSticky, setIsGenreSticky] = useState(false);

  const { data: moviesData, isLoading } = useMovies({
    sortBy: "createdAt",
    order: "desc",
  });

  const allMovies = moviesData?.pages?.flatMap((page) => page.data) || [];

  const filteredMovies =
    activeGenre === "All"
      ? allMovies
      : allMovies.filter((movie) =>
          movie.genre.some((g) => g.toLowerCase() === activeGenre.toLowerCase())
        );

  const trendingMovies = allMovies.slice(0, 8);
  const editorPicks = allMovies.filter((m) => m.averageRating && m.averageRating >= 8).slice(0, 8);
  const mostWatched = [...allMovies].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)).slice(0, 5);
  const hiddenGems = allMovies.filter((m) => m.averageRating && m.averageRating >= 7.5 && m.averageRating < 8).slice(0, 8);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        </div>
        
        <div className="relative h-full flex items-center">
          <div className="max-w-8xl mx-auto px-4 md:px-10 w-full">
            <div className="max-w-2xl space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight">
                Discover Your Next{" "}
                <span className="text-primary">Favorite</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70">
                Explore thousands of movies and find the perfect film for your mood.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search movies, genres, actors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/50 text-lg rounded-full"
                />
                <Button
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-6"
                  asChild
                >
                  <Link href={`/discover?q=${encodeURIComponent(searchQuery)}`}>
                    Search
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Genre Filter Tabs - Sticky */}
      <div
        className={cn(
          "sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b border-border transition-shadow",
          isGenreSticky && "shadow-lg"
        )}
      >
        <div className="max-w-8xl mx-auto px-4 md:px-10 py-4">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                  activeGenre === genre
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                )}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 md:px-10 py-10 space-y-16">
        {/* Trending This Week */}
        <section>
          <SectionHeading
            title="Trending This Week"
            subtitle="What's hot right now"
            action={{ label: "View All", href: "/movies" }}
          />
          {isLoading ? (
            <LoadingSkeleton type="row" count={6} />
          ) : (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:-mx-10 md:px-10">
              {trendingMovies.map((movie) => (
                <div key={movie.id} className="flex-shrink-0 w-40 md:w-48">
                  <MovieCard movie={movie} variant="portrait" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Editor's Picks */}
        <section>
          <SectionHeading
            title="Editor's Picks"
            subtitle="Curated by our film experts"
            badge="sparkle"
            action={{ label: "View All", href: "/movies" }}
          />
          {isLoading ? (
            <LoadingSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {editorPicks.map((movie) => (
                <MovieCard key={movie.id} movie={movie} variant="portrait" />
              ))}
            </div>
          )}
        </section>

        {/* Most Watched - Ranked List */}
        <section>
          <SectionHeading
            title="Most Watched"
            subtitle="Top 5 fan favorites"
            action={{ label: "Full Rankings", href: "/movies" }}
          />
          {isLoading ? (
            <LoadingSkeleton count={5} />
          ) : (
            <div className="space-y-4">
              {mostWatched.map((movie, index) => (
                <div
                  key={movie.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                >
                  <div className="text-4xl font-black text-primary/20 w-12 text-center">
                    #{index + 1}
                  </div>
                  <div className="relative w-16 aspect-[2/3] rounded-lg overflow-hidden">
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-xs">
                        {movie.title}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{movie.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {movie.releaseYear} • {movie.genre.slice(0, 3).join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-400/10 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-yellow-400">
                        {movie.averageRating?.toFixed(1)}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      asChild
                    >
                      <Link href={`/movie/${movie.id}`}>
                        <Play className="w-4 h-4 mr-1" />
                        Watch
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Hidden Gems */}
        <section>
          <SectionHeading
            title="Hidden Gems"
            subtitle="Lesser known but highly rated"
            action={{ label: "Explore More", href: "/movies" }}
          />
          {isLoading ? (
            <LoadingSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {hiddenGems.map((movie) => (
                <MovieCard key={movie.id} movie={movie} variant="portrait" />
              ))}
            </div>
          )}
        </section>

        {/* CTA Banner */}
        <section className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200')] bg-cover bg-center opacity-20 mix-blend-overlay" />
          
          <div className="relative px-8 py-12 md:py-16 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Sign Up Free to Unlock Full Access
            </h2>
            <p className="text-white/80 text-lg mb-6 max-w-xl mx-auto">
              Create a free account to save your favorites, write reviews, and get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8" asChild>
                <Link href="/register">Create Free Account</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/pricing">View Plans</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
