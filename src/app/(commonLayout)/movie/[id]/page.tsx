"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Movie, Review } from "@/types";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlayCircle, Star, Heart, Clock, Calendar } from "lucide-react";
import { CreateReview } from "@/components/reviews/create-review";
import { ReviewList } from "@/components/reviews/review-list";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner"; 

export default function MovieDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const { data: movie, isLoading, error } = useQuery<Movie>({
    queryKey: ["movie", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/movies/${id}`);
      return data;
    },
  });

  const { data: watchlists } = useQuery({
      queryKey: ["watchlist", session?.user?.id],
      queryFn: async () => {
          if (!session?.user?.id) return [];
          const { data } = await apiClient.get(`/api/watchlists`);
          return data;
      },
      enabled: !!session?.user?.id
  });

  const isWatchlisted = watchlists?.some((w: any) => w.movieId === id);

  const toggleWatchlistMutation = useMutation({
    mutationFn: async () => {
      if (isWatchlisted) {
          await apiClient.delete(`/api/watchlists/${id}`);
      } else {
          await apiClient.post(`/api/watchlists`, { movieId: id });
      }
    },
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["watchlist", session?.user?.id] });
      const previous = queryClient.getQueryData(["watchlist", session?.user?.id]);
      
      queryClient.setQueryData(["watchlist", session?.user?.id], (old: any) => {
         if (!old) return old;
         if (isWatchlisted) {
            return old.filter((w: any) => w.movieId !== id);
         } else {
            return [...old, { id: "temp", movieId: id, userId: session?.user?.id }];
         }
      });

      return { previous };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["watchlist", session?.user?.id], context?.previous);
      toast.error("Failed to update watchlist");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist", session?.user?.id] });
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in">
         <Skeleton className="w-full aspect-video md:aspect-[21/9] rounded-xl" />
         <div className="grid md:grid-cols-3 gap-8 mt-8">
             <div className="md:col-span-2 space-y-4">
                 <Skeleton className="h-10 w-3/4" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-2/3" />
             </div>
             <Skeleton className="h-96 w-full rounded-xl" />
         </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
         <h1 className="text-2xl font-bold text-destructive">Movie not found</h1>
         <p className="text-muted-foreground mt-2">The requested movie could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Cinematic Header Overlay */}
      <div className="relative w-full aspect-[4/3] md:aspect-[21/9] bg-muted overflow-hidden">
         {movie.posterUrl ? (
            <img 
               src={movie.posterUrl} 
               alt={movie.title}
               className="w-full h-full object-cover opacity-30"
            />
         ) : null}
         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
         
         <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 container mx-auto flex flex-col md:flex-row gap-8 items-end">
            <div className="hidden md:block w-48 lg:w-64 shrink-0 rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10 relative z-10 translate-y-12">
               {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt="Poster" className="w-full h-auto object-cover" />
               ) : (
                  <div className="w-full aspect-[2/3] bg-secondary flex items-center justify-center">No Poster</div>
               )}
            </div>

            <div className="flex-1 space-y-4 z-10">
               <div className="flex flex-wrap items-center gap-2 mb-2">
                 {movie.genre.map((g) => (
                    <span key={g} className="px-2.5 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-medium uppercase tracking-wider">
                       {g}
                    </span>
                 ))}
               </div>
               <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-md">
                 {movie.title}
               </h1>
               
               <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                     <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow" />
                     <span className="font-bold text-white text-base">{movie.averageRating?.toFixed(1) || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                     <Calendar className="w-4 h-4" />
                     {movie.releaseYear}
                  </div>
                  <div className="flex items-center gap-1">
                     <Clock className="w-4 h-4" />
                     {movie.duration ? `${movie.duration} min` : "N/A"}
                  </div>
               </div>

               <div className="flex flex-wrap gap-4 pt-4">
                  <Button size="lg" className="rounded-full shadow-lg gap-2 px-8">
                     <PlayCircle className="w-5 h-5" />
                     Watch Trailer
                  </Button>
                  {session && (
                    <Button 
                      size="lg" 
                      variant={isWatchlisted ? "secondary" : "outline"}
                      className="rounded-full gap-2 transition-all hover:scale-105"
                      onClick={() => toggleWatchlistMutation.mutate()}
                      disabled={toggleWatchlistMutation.isPending}
                    >
                       <Heart className={`w-5 h-5 ${isWatchlisted ? "fill-current text-red-500" : ""}`} />
                       {isWatchlisted ? "In Watchlist" : "Add to Watchlist"}
                    </Button>
                  )}
               </div>
            </div>
         </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:pt-20 pb-24 grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
           <section>
              <h3 className="text-2xl font-semibold mb-4 text-primary">Synopsis</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                 {movie.description}
              </p>
           </section>

           <section className="space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                 <h3 className="text-2xl font-semibold">User Reviews</h3>
                 <span className="bg-muted px-3 py-1 rounded-full text-xs font-semibold">
                    Sorting by: Recent
                 </span>
              </div>
              
              {session ? (
                 <CreateReview movieId={movie.id as string} />
              ) : (
                 <div className="p-6 bg-muted/50 rounded-xl text-center border border-dashed text-muted-foreground">
                    Please <a href="/login" className="text-primary hover:underline font-semibold">sign in</a> to drop a review.
                 </div>
              )}

              <ReviewList movieId={movie.id as string} />
           </section>
        </div>

        <div className="space-y-6">
           <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h4 className="font-semibold text-lg border-b pb-2 mb-4">Cast & Crew</h4>
              <div className="space-y-4 text-sm">
                 <div>
                    <span className="text-muted-foreground block mb-1">Director</span>
                    <span className="font-medium text-foreground">{movie.director}</span>
                 </div>
                 <div>
                    <span className="text-muted-foreground block mb-1">Starring</span>
                    <div className="flex flex-col gap-1.5">
                       {movie.cast.map(c => (
                           <span key={c} className="font-medium inline-block">{c}</span>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
