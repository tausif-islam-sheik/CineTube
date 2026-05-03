import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Watchlist } from "@/types";

export function useWatchlist() {
  return useQuery<Watchlist[], Error>({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/watchlist");
      return data?.data ?? [];
    },
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movieId: string) => {
      const { data } = await apiClient.post("/api/v1/watchlist", { movieId });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (watchlistId: string) => {
      const { data } = await apiClient.delete(`/api/v1/watchlist/${watchlistId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] });
    },
  });
}
