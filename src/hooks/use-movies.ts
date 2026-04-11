import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Movie } from "@/types";

export interface MovieFilters {
  q?: string;
  genre?: string[];
  yearMin?: number;
  yearMax?: number;
  ratingMin?: number;
}

interface MovieResponse {
  movies: Movie[];
  nextCursor?: string;
  total: number;
}

export function useMovies(filters: MovieFilters) {
  return useInfiniteQuery<MovieResponse, Error>({
    queryKey: ["movies", "infinite", filters],
    queryFn: async ({ pageParam }) => {
      const cursor = pageParam as string | undefined;
      const params = new URLSearchParams();
      
      if (cursor) params.append("cursor", cursor);
      if (filters.q) params.append("search", filters.q);
      if (filters.genre && filters.genre.length > 0) {
        filters.genre.forEach((g) => params.append("genre", g));
      }
      if (filters.yearMin) params.append("yearMin", filters.yearMin.toString());
      if (filters.yearMax) params.append("yearMax", filters.yearMax.toString());
      if (filters.ratingMin) params.append("ratingMin", filters.ratingMin.toString());
      
      // Assumes backend REST endpoint is /api/movies
      const { data } = await apiClient.get(`/api/movies?${params.toString()}`);
      return data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}

export function useTrendingMovies() {
    return useQuery<Movie[], Error>({
        queryKey: ["movies", "trending"],
        queryFn: async () => {
            const { data } = await apiClient.get("/api/movies/trending");
            return data;
        }
    })
}
