"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FilterSidebar } from "@/components/movies/filter-sidebar";
import { useMovies } from "@/hooks/use-movies";
import { MovieGridSkeleton } from "@/components/movies/movie-card-skeleton";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Star, Clock } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";

export default function DiscoverPage() {
  const searchParams = useSearchParams();
  const { ref, inView } = useInView();

  const filters = {
    q: searchParams.get("q") || undefined,
    genre: searchParams.get("genre") || undefined,
    yearMin: searchParams.get("yearMin") ? parseInt(searchParams.get("yearMin") as string) : undefined,
    yearMax: searchParams.get("yearMax") ? parseInt(searchParams.get("yearMax") as string) : undefined,
    ratingMin: searchParams.get("ratingMin") ? parseFloat(searchParams.get("ratingMin") as string) : undefined,
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status
  } = useMovies(filters);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      <FilterSidebar />
      
      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Discover Movies</h1>
          <p className="text-muted-foreground">Find your next cinematic journey.</p>
        </div>

        {status === "pending" ? (
          <MovieGridSkeleton />
        ) : status === "error" ? (
          <div className="p-8 text-center bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
            <p>Error loading movies: {error.message}</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 animate-in fade-in duration-500">
              {data.pages.map((page, i) => (
                page.data.map((movie) => (
                  <Link href={`/movie/${movie.id}`} key={movie.id}>
                    <Card className="overflow-hidden group h-full flex flex-col transition-all hover:ring-2 hover:ring-primary hover:shadow-lg dark:hover:shadow-primary/20">
                      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
                        {/* Fallback poster UI if no next/image available natively without domain config */}
                        {movie.posterUrl ? (
                          <img 
                            src={movie.posterUrl} 
                            alt={movie.title} 
                            loading="lazy"
                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground font-semibold p-4 text-center">
                            {movie.title}
                          </div>
                        )}
                        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {movie.averageRating?.toFixed(1) || "N/A"}
                        </div>
                      </div>
                      <CardContent className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-sm line-clamp-1 mb-1">{movie.title}</h3>
                        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                          <span>{movie.releaseYear}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {movie.duration ? `${movie.duration}m` : "--"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                           {movie.genre.slice(0, 2).map((g) => (
                              <span key={g} className="text-[10px] px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded-sm">
                                {g}
                              </span>
                           ))}
                           {movie.genre.length > 2 && (
                               <span className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground rounded-sm">
                                  +{movie.genre.length - 2}
                               </span>
                           )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))
              ))}
            </div>
            
            <div ref={ref} className="w-full py-8 text-center flex items-center justify-center">
              {isFetchingNextPage ? (
                <div className="inline-flex items-center space-x-2">
                   <div className="h-4 w-4 rounded-full bg-primary animate-bounce" />
                   <div className="h-4 w-4 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                   <div className="h-4 w-4 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                </div>
              ) : hasNextPage ? (
                <p className="text-sm text-muted-foreground">Scroll down to load more</p>
              ) : data.pages[0].meta.total === 0 ? (
                <p className="text-lg font-medium text-muted-foreground py-10">No movies found matching your filters.</p>
              ) : (
                <p className="text-sm text-muted-foreground">You&apos;ve reached the end of the lineup.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
