"use client";

import { Movie } from "@/types";
import Link from "next/link";
import { Star, Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface WatchlistCardProps {
  watchlistId: string;
  movie: Movie;
}

export function WatchlistCard({ watchlistId, movie }: WatchlistCardProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const removeMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/v1/watchlist/${watchlistId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", session?.user?.id] });
      toast.success("Removed from watchlist");
    },
    onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to remove item");
    }
  });

  return (
    <div className="group relative flex flex-col gap-3">
      <Link href={`/movie/${movie.id}`}>
        <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-white/5 transition-all group-hover:border-white/20">
             {movie.posterUrl ? (
                <img 
                    src={movie.posterUrl} 
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
             ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-500 font-bold p-6 text-center text-xs">
                    {movie.title}
                </div>
             )}
             
             {/* Progress bar mock */}
             <div className="absolute bottom-0 left-0 h-1 bg-primary/40 w-0 group-hover:w-full transition-all duration-700" />
             
             {/* Play Overlay */}
             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-8 h-8 text-white fill-current" />
             </div>

             {/* Top right actions */}
             <div className="absolute top-2 right-2 flex flex-col gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                <Button 
                    size="icon" 
                    variant="secondary" 
                    className="w-8 h-8 rounded-md bg-black/60 hover:bg-red-600 text-white border-none shadow-xl transition-all"
                    onClick={(e) => {
                        e.preventDefault();
                        removeMutation.mutate();
                    }}
                    disabled={removeMutation.isPending}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
             </div>
        </div>
      </Link>

      <div className="flex gap-3">
        <div className="flex-1 space-y-1">
            <h3 className="font-bold text-sm md:text-base text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                {movie.title}
            </h3>
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-medium">
                <span>{movie.director || "CineTube Original"}</span>
                <span>•</span>
                <span>{movie.releaseYear}</span>
            </div>
            <div className="flex items-center gap-1.5 pt-1">
                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                <span className="text-zinc-400 text-[10px] font-bold">
                    {movie.averageRating?.toFixed(1) || "N/A"}
                </span>
            </div>
        </div>
      </div>
    </div>
  );
}
