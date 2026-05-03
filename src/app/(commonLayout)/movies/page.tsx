"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/shared/movie-card";
import { FilterBar } from "@/components/shared/filter-bar";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { useMovies } from "@/hooks/use-movies";
import { useWatchlist } from "@/hooks/use-watchlist";

const GENRES = [
  { value: "action", label: "Action" },
  { value: "drama", label: "Drama" },
  { value: "horror", label: "Horror" },
  { value: "scifi", label: "Sci-Fi" },
  { value: "romance", label: "Romance" },
  { value: "thriller", label: "Thriller" },
];

const YEARS = [
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2021", label: "2021" },
  { value: "2020", label: "2020" },
  { value: "2010s", label: "2010s" },
  { value: "older", label: "Older" },
];

export default function MoviesPage() {
  const [filters, setFilters] = useState({
    genre: undefined as string | undefined,
    sort: "latest",
    year: undefined as string | undefined,
    accessType: undefined as string | undefined,
    search: "",
  });

  const {
    data: moviesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMovies({
    sortBy: filters.sort === "rating" ? "rating" : "createdAt",
    order: filters.sort === "az" ? "asc" : "desc",
    pricing: filters.accessType === "free" ? "FREE" : filters.accessType === "premium" ? "PREMIUM" : undefined,
  });

  const totalMovies = moviesData?.pages[0]?.meta?.total || 0;

  const { data: watchlistData } = useWatchlist();
  const watchlistIds = new Set(watchlistData?.map((w) => w.movieId) || []);

  const allMovies = moviesData?.pages?.flatMap((page) => page.data) || [];

  // Apply filters
  let filteredMovies = allMovies;
  if (filters.genre) {
    filteredMovies = filteredMovies.filter((m) =>
      m.genre.some((g) => g.toLowerCase().includes(filters.genre!.toLowerCase()))
    );
  }
  if (filters.year) {
    filteredMovies = filteredMovies.filter((m) => {
      if (filters.year === "2010s") return m.releaseYear >= 2010 && m.releaseYear < 2020;
      if (filters.year === "older") return m.releaseYear < 2010;
      return m.releaseYear === parseInt(filters.year!);
    });
  }
  if (filters.search) {
    filteredMovies = filteredMovies.filter((m) =>
      m.title.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  // Sort
  if (filters.sort === "rating") {
    filteredMovies = [...filteredMovies].sort(
      (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
    );
  } else if (filters.sort === "az") {
    filteredMovies = [...filteredMovies].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Filter Bar */}
      <FilterBar
        title="Movies"
        genres={GENRES}
        years={YEARS}
        activeFilters={filters}
        onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
        showGenre
        showSort={false}
        showAccessType
        showYear
        showSearch
        resultsCount={filteredMovies.length}
      />

      {/* Movie Grid */}
      <div className="max-w-8xl mx-auto px-4 md:px-10 py-8">
        {isLoading ? (
          <LoadingSkeleton count={12} />
        ) : filteredMovies.length === 0 ? (
          <EmptyState
            type="movies"
            action={{
              label: "Clear Filters",
              onClick: () =>
                setFilters({
                  genre: undefined,
                  sort: "latest",
                  year: undefined,
                  accessType: undefined,
                  search: "",
                }),
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  variant="portrait"
                  showWatchlist
                  showInfo
                  isInWatchlist={watchlistIds.has(movie.id)}
                />
              ))}
            </div>

            {/* Pagination / Load More */}
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredMovies.length} of {totalMovies} movies
              </p>
              {hasNextPage && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="min-w-[200px] transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  {isFetchingNextPage ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Movies"
                  )}
                </Button>
              )}
              {!hasNextPage && filteredMovies.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  You&apos;ve reached the end
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
