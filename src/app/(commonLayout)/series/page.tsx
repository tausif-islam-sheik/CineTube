"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SeriesCard } from "@/components/shared/movie-card";
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
  { value: "comedy", label: "Comedy" },
];

const STATUSES = [
  { value: "ONGOING", label: "Ongoing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "UPCOMING", label: "Upcoming" },
];

// Mock series data based on movies
function generateMockSeries(movies: any[]) {
  return movies.map((movie, i) => ({
    id: `series-${movie.id}`,
    title: movie.title,
    posterUrl: movie.posterUrl,
    backdropUrl: movie.backdropUrl,
    seasonCount: Math.floor(Math.random() * 5) + 1,
    episodeCount: Math.floor(Math.random() * 20) + 5,
    status: ["ONGOING", "COMPLETED", "UPCOMING"][i % 3] as "ONGOING" | "COMPLETED" | "UPCOMING",
    averageRating: movie.averageRating,
    releaseYear: movie.releaseYear,
  }));
}

export default function SeriesPage() {
  const [filters, setFilters] = useState({
    genre: undefined as string | undefined,
    sort: "latest",
    status: undefined as string | undefined,
    search: "",
  });

  const {
    data: moviesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMovies({
    sortBy: "createdAt",
    order: "desc",
  });

  const totalSeries = moviesData?.pages[0]?.meta?.total || 0;

  const { data: watchlistData } = useWatchlist();
  const watchlistIds = new Set(watchlistData?.map((w) => w.movieId) || []);

  const allMovies = moviesData?.pages?.flatMap((page) => page.data) || [];
  const seriesList = generateMockSeries(allMovies);

  // Apply filters
  let filteredSeries = seriesList;
  if (filters.genre) {
    // Would filter by genre in real implementation
  }
  if (filters.status) {
    filteredSeries = filteredSeries.filter((s) => s.status === filters.status);
  }
  if (filters.search) {
    filteredSeries = filteredSeries.filter((s) =>
      s.title.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  const activeFilterCount = [filters.genre, filters.status, filters.search].filter(
    Boolean
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Filter Bar */}
      <FilterBar
        title="Series"
        genres={GENRES}
        statuses={STATUSES}
        activeFilters={filters}
        onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
        showGenre
        showSort={false}
        showStatus
        showSearch
        resultsCount={filteredSeries.length}
      />

      {/* Series Grid */}
      <div className="max-w-8xl mx-auto px-4 md:px-10 py-8">
        {isLoading ? (
          <LoadingSkeleton count={12} />
        ) : filteredSeries.length === 0 ? (
          <EmptyState
            type="series"
            action={{
              label: "Clear Filters",
              onClick: () =>
                setFilters({
                  genre: undefined,
                  sort: "latest",
                  status: undefined,
                  search: "",
                }),
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {filteredSeries.map((series) => (
                <SeriesCard
                  key={series.id}
                  id={series.id}
                  title={series.title}
                  posterUrl={series.posterUrl}
                  backdropUrl={series.backdropUrl}
                  seasonCount={series.seasonCount}
                  episodeCount={series.episodeCount}
                  status={series.status}
                  averageRating={series.averageRating || undefined}
                  releaseYear={series.releaseYear}
                  showWatchlist
                  isInWatchlist={watchlistIds.has(series.id.replace("series-", ""))}
                />
              ))}
            </div>

            {/* Pagination / Load More */}
            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {filteredSeries.length} of {totalSeries} series
              </p>
              {hasNextPage && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="min-w-50 transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  {isFetchingNextPage ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Series"
                  )}
                </Button>
              )}
              {!hasNextPage && filteredSeries.length > 0 && (
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
