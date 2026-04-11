import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Movie } from "@/types";

export interface MovieFilters {
  q?: string;
  genre?: string;
  yearMin?: number;
  yearMax?: number;
  ratingMin?: number;
}

interface MoviePage {
  data: Movie[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useMovies(filters: MovieFilters) {
  return useInfiniteQuery<MoviePage, Error>({
    queryKey: ["movies", "infinite", filters],
    queryFn: async ({ pageParam }) => {
      const page = (pageParam as number) ?? 1;
      const params = new URLSearchParams();

      params.append("page", String(page));
      params.append("limit", "12");

      if (filters.q) params.append("search", filters.q);
      if (filters.genre) params.append("genre", filters.genre);
      if (filters.yearMin) params.append("releaseYear", filters.yearMin.toString());
      if (filters.ratingMin) params.append("minRating", filters.ratingMin.toString());

      const { data } = await apiClient.get(`/api/v1/movies?${params.toString()}`);
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}

export function useTrendingMovies() {
  return useQuery<Movie[], Error>({
    queryKey: ["movies", "trending"],
    queryFn: async () => {
      const { data } = await apiClient.get(
        "/api/v1/movies?sortBy=rating&order=desc&limit=10"
      );
      return data?.data ?? [];
    },
  });
}
