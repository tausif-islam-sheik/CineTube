"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Movie } from "@/types";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

interface WatchlistButtonProps {
  movie: Movie;
  className?: string;
}

export function WatchlistButton({ movie, className }: WatchlistButtonProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Fetch user's watchlist
  const { data: watchlistResp } = useQuery({
    queryKey: ["watchlist", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data } = await apiClient.get(`/api/v1/watchlist/user/watchlist`);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const watchlists = watchlistResp?.data || [];
  const watchlistEntry = watchlists.find((w: any) => w.movieId === movie.id);
  const isWatchlisted = !!watchlistEntry;

  const toggleMutation = useMutation({
    mutationFn: async () => {
      if (isWatchlisted) {
        await apiClient.delete(`/api/v1/watchlist/${watchlistEntry.id}`);
      } else {
        await apiClient.post(`/api/v1/watchlist`, { movieId: movie.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", session?.user?.id] });
      toast.success(isWatchlisted ? "Removed from watchlist" : "Added to watchlist");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update watchlist");
    },
  });

  if (!session) return null;

  return (
    <Button
      variant="outline"
      size="xl"
      className={cn(
        "rounded-full px-10 h-18 text-xl font-bold gap-4 transition-all active:scale-95 group",
        "bg-white/5 backdrop-blur-xl border-white/10 text-white hover:bg-white/10 hover:border-white/20 hover:scale-105",
        isWatchlisted && "bg-white/10 border-white/30",
        className
      )}
      onClick={() => toggleMutation.mutate()}
      disabled={toggleMutation.isPending}
    >
      <Heart className={cn(
        "w-7 h-7 transition-all duration-500",
        isWatchlisted ? "fill-red-500 text-red-500 scale-110" : "group-hover:text-red-400 group-hover:scale-110"
      )} />
      <span className="tracking-tight">
        {isWatchlisted ? "In Watchlist" : "Add to Watchlist"}
      </span>
    </Button>
  );
}
