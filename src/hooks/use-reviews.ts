import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Review } from "@/types";

export function useReviews() {
  return useQuery<Review[], Error>({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/reviews");
      return data?.data ?? [];
    },
  });
}

interface PaginatedReviews {
  data: Review[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useMyReviews(page: number = 1, limit: number = 10) {
  return useQuery<PaginatedReviews, Error>({
    queryKey: ["reviews", "my", page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/reviews/my", {
        params: { page, limit },
      });
      return data;
    },
  });
}

export function useMovieReviews(movieId: string) {
  return useQuery<Review[], Error>({
    queryKey: ["reviews", "movie", movieId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/movies/${movieId}/reviews`);
      return data?.data ?? [];
    },
    enabled: !!movieId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (review: {
      movieId: string;
      rating: number;
      title: string;
      comment: string;
      containsSpoiler?: boolean;
    }) => {
      const { data } = await apiClient.post("/api/v1/reviews", review);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "my"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "movie", variables.movieId] });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reviewId,
      ...review
    }: {
      reviewId: string;
      rating?: number;
      title?: string;
      comment?: string;
      containsSpoiler?: boolean;
    }) => {
      const { data } = await apiClient.patch(`/api/v1/reviews/${reviewId}`, review);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "my"] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { data } = await apiClient.delete(`/api/v1/reviews/${reviewId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", "my"] });
    },
  });
}
