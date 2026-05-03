"use client";

import { useState } from "react";
import { Sparkles, RefreshCw, Smile, Frown, Rocket, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { MovieCard } from "@/components/shared/movie-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useMovies } from "@/hooks/use-movies";
import { useSession } from "@/lib/auth-client";

const MOODS = [
  { emoji: "😂", label: "Comedy", value: "comedy" },
  { emoji: "😱", label: "Thriller", value: "thriller" },
  { emoji: "😢", label: "Drama", value: "drama" },
  { emoji: "🚀", label: "Sci-Fi", value: "scifi" },
  { emoji: "❤️", label: "Romance", value: "romance" },
  { emoji: "😰", label: "Horror", value: "horror" },
];

const TASTE_PROFILE = {
  topGenres: [
    { name: "Drama", percentage: 85 },
    { name: "Sci-Fi", percentage: 72 },
    { name: "Action", percentage: 65 },
    { name: "Thriller", percentage: 58 },
  ],
  favoriteDirectors: ["Christopher Nolan", "Denis Villeneuve", "Bong Joon-ho"],
  favoriteActors: ["Timothée Chalamet", "Florence Pugh", "Oscar Isaac"],
  averageRating: 4.2,
};

export default function RecommendedPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: session } = useSession();
  const userName = session?.user?.name?.split(" ")[0] || "there";

  const { data: moviesData, isLoading } = useMovies({
    sortBy: "rating",
    order: "desc",
  });

  const allMovies = moviesData?.pages?.flatMap((page) => page.data) || [];

  // Filter by mood if selected
  let recommendations = allMovies;
  if (selectedMood) {
    recommendations = allMovies.filter((m) =>
      m.genre.some((g) => g.toLowerCase().includes(selectedMood.toLowerCase()))
    );
  }

  const becauseYouWatched = allMovies.slice(0, 6);
  const topGenrePicks = allMovies.slice(6, 12);
  const recommendedMovies = recommendations.slice(0, 8);
  const recommendedSeries = allMovies.slice(12, 20);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Personalized Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />

        <div className="relative max-w-8xl mx-auto px-4 md:px-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Personalized For You
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Here&apos;s what we picked for you based on your watch history and ratings.
          </p>
        </div>
      </section>

      <div className="max-w-8xl mx-auto px-4 md:px-10 pb-16 space-y-16">
        {/* Mood Picker */}
        <section className="p-6 rounded-2xl bg-muted/30 border border-border">
          <h3 className="text-lg font-bold mb-4">What do you feel like watching?</h3>
          <div className="flex flex-wrap gap-3">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                onClick={() =>
                  setSelectedMood(selectedMood === mood.value ? null : mood.value)
                }
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all",
                  selectedMood === mood.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border hover:border-primary/50"
                )}
              >
                <span className="text-lg">{mood.emoji}</span>
                {mood.label}
              </button>
            ))}
          </div>
          {selectedMood && (
            <p className="mt-4 text-sm text-muted-foreground">
              Showing recommendations for{" "}
              <span className="font-medium text-foreground">
                {MOODS.find((m) => m.value === selectedMood)?.label}
              </span>
            </p>
          )}
        </section>

        {/* Because You Watched */}
        <section>
          <SectionHeading
            title="Because You Watched"
            subtitle="Similar titles you might enjoy"
            action={{ label: "View All", href: "/movies" }}
          />
          {isLoading ? (
            <LoadingSkeleton type="row" count={6} />
          ) : (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:-mx-10 md:px-10">
              {becauseYouWatched.map((movie) => (
                <div key={movie.id} className="flex-shrink-0 w-40 md:w-48">
                  <MovieCard movie={movie} variant="portrait" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Based on Your Top Genre */}
        <section>
          <SectionHeading
            title={`Based on Your Top Genre (${TASTE_PROFILE.topGenres[0].name})`}
            subtitle="Curated from your favorites"
            action={{ label: "View All", href: "/movies" }}
          />
          {isLoading ? (
            <LoadingSkeleton type="row" count={6} />
          ) : (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:-mx-10 md:px-10">
              {topGenrePicks.map((movie) => (
                <div key={movie.id} className="flex-shrink-0 w-40 md:w-48">
                  <MovieCard movie={movie} variant="portrait" />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Taste Profile Card */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-muted/30 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Your Taste Profile</h3>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>

            {/* Top Genres */}
            <div className="space-y-4 mb-6">
              <h4 className="text-sm font-medium text-muted-foreground">
                Top Genres
              </h4>
              {TASTE_PROFILE.topGenres.map((genre) => (
                <div key={genre.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{genre.name}</span>
                    <span className="text-muted-foreground">
                      {genre.percentage}%
                    </span>
                  </div>
                  <Progress value={genre.percentage} className="h-2" />
                </div>
              ))}
            </div>

            {/* Favorite Directors */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Favorite Directors
              </h4>
              <div className="flex flex-wrap gap-2">
                {TASTE_PROFILE.favoriteDirectors.map((director) => (
                  <span
                    key={director}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {director}
                  </span>
                ))}
              </div>
            </div>

            {/* Favorite Actors */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                Favorite Actors
              </h4>
              <div className="flex flex-wrap gap-2">
                {TASTE_PROFILE.favoriteActors.map((actor) => (
                  <span
                    key={actor}
                    className="px-3 py-1 rounded-full bg-secondary text-sm"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            {/* Average Rating */}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              <div className="text-3xl font-black text-yellow-400">
                {TASTE_PROFILE.averageRating.toFixed(1)}
              </div>
              <div>
                <p className="text-sm font-medium">Your Average Rating</p>
                <p className="text-xs text-muted-foreground">
                  You rate movies higher than 78% of users
                </p>
              </div>
            </div>
          </div>

          {/* Recommended Movies Grid */}
          <div>
            <SectionHeading
              title="Recommended Movies"
              subtitle="Picked just for you"
              action={{ label: "View All", href: "/movies" }}
            />
            {isLoading ? (
              <LoadingSkeleton count={4} />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {recommendedMovies.slice(0, 4).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} variant="portrait" />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Recommended Series */}
        <section>
          <SectionHeading
            title="Recommended Series"
            subtitle="TV shows that match your taste"
            action={{ label: "View All", href: "/series" }}
          />
          {isLoading ? (
            <LoadingSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {recommendedSeries.map((movie) => (
                <MovieCard key={movie.id} movie={movie} variant="portrait" />
              ))}
            </div>
          )}
        </section>

        {/* Refresh Button */}
        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-8"
          >
            <RefreshCw
              className={cn("w-5 h-5 mr-2", isRefreshing && "animate-spin")}
            />
            {isRefreshing ? "Refreshing..." : "Refresh Recommendations"}
          </Button>
        </div>
      </div>
    </div>
  );
}
