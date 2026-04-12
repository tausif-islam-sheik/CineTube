/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import apiClient from "@/lib/axios";
import { Movie } from "@/types";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlayCircle, Star, Heart, Clock, Calendar } from "lucide-react";
import { CreateReview } from "@/components/reviews/create-review";
import { ReviewList } from "@/components/reviews/review-list";
import { useSession } from "@/lib/auth-client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner"; 

export default function MovieDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isMoviePlayerOpen, setIsMoviePlayerOpen] = useState(false);

  // Helper to extract YouTube ID and return embed URL
  const getYouTubeEmbedUrl = (url?: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : null;
  };

  const { data: movie, isLoading, error } = useQuery<Movie>({
    queryKey: ["movie", id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/movies/${id}`);
      return data.data;
    },
  });

  const { data: watchlists } = useQuery({
      queryKey: ["watchlist", session?.user?.id],
      queryFn: async () => {
          if (!session?.user?.id) return [];
          const { data } = await apiClient.get(`/api/v1/watchlist/user/watchlist`);
          return data.data;
      },
      enabled: !!session?.user?.id
  });

  const { data: userSubscription } = useQuery({
      queryKey: ["user-subscription", session?.user?.id],
      queryFn: async () => {
          if (!session?.user?.id) return null;
          const { data } = await apiClient.get(`/api/v1/user/subscription`);
          return data.data;
      },
      enabled: !!session?.user?.id,
      staleTime: 0,
      refetchOnWindowFocus: true,
  });

  const isFree = movie?.pricing === 'FREE';
  const subscriptionActive =
    !!userSubscription &&
    String(userSubscription.status).toUpperCase() === "ACTIVE";
  const hasPremiumAccess =
    subscriptionActive || session?.user?.role === "ADMIN";
  const canWatch = isFree || hasPremiumAccess;

  const isWatchlisted = Array.isArray(watchlists) && watchlists.some((w: any) => w.movieId === id);

  const toggleWatchlistMutation = useMutation({
    mutationFn: async () => {
      if (isWatchlisted) {
          const watchlistEntry = watchlists?.find((w: any) => w.movieId === id);
          if (watchlistEntry) {
            await apiClient.delete(`/api/v1/watchlist/${watchlistEntry.id}`);
          }
      } else {
          await apiClient.post(`/api/v1/watchlist`, { movieId: id });
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
      <div className="container mx-auto px-4 py-12 md:py-24 space-y-12 animate-in fade-in">
         <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-start">
            <Skeleton className="w-full md:w-64 lg:w-80 aspect-[2/3] rounded-2xl shadow-2xl" />
            <div className="flex-1 space-y-6 pt-4">
               <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
               </div>
               <Skeleton className="h-16 w-3/4" />
               <div className="flex gap-6">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
               </div>
               <div className="flex gap-4 pt-4">
                  <Skeleton className="h-12 w-40 rounded-full" />
                  <Skeleton className="h-12 w-40 rounded-full" />
               </div>
            </div>
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
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-zinc-950 via-zinc-950 to-primary/10 border-b border-white/5">
         <div className="container mx-auto px-4 py-12 md:py-24">
            <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start lg:items-center">
               {/* Left: Poster */}
               <div className="w-full md:w-64 lg:w-80 shrink-0 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-t from-primary/50 to-transparent rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-[2/3] bg-zinc-900">
                     {movie.posterUrl ? (
                        <img 
                           src={movie.posterUrl} 
                           alt="Poster" 
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold p-12 text-center select-none italic">
                           No Poster Available
                        </div>
                     )}
                  </div>
               </div>

               {/* Right: Info */}
               <div className="flex-1 space-y-8">
                  <div className="space-y-4">
                     <div className="flex flex-wrap items-center gap-2">
                       {movie.genre.map((g) => (
                          <span key={g} className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] shadow-sm">
                             {g}
                          </span>
                       ))}
                       <span className="px-3 py-1 bg-zinc-800 text-zinc-400 border border-white/5 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]">
                          {movie.platform}
                       </span>
                     </div>
                     
                     <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                       {movie.title}
                     </h1>
                     
                     <div className="flex flex-wrap items-center gap-8 pt-2">
                        <div className="flex items-center gap-2 group">
                           <div className="p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400/20 transition-colors">
                              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow" />
                           </div>
                           <div className="flex flex-col">
                              <span className="font-bold text-white text-lg leading-none">{movie.averageRating?.toFixed(1) || "N/A"}</span>
                              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Rating</span>
                           </div>
                        </div>

                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-zinc-800 rounded-lg">
                              <Calendar className="w-4 h-4 text-zinc-400" />
                           </div>
                           <div className="flex flex-col">
                              <span className="font-bold text-zinc-200 text-lg leading-none">{movie.releaseYear}</span>
                              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Release</span>
                           </div>
                        </div>

                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-zinc-800 rounded-lg">
                              <Clock className="w-4 h-4 text-zinc-400" />
                           </div>
                           <div className="flex flex-col">
                              <span className="font-bold text-zinc-200 text-lg leading-none">{movie.duration ? `${movie.duration} min` : "N/A"}</span>
                              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Duration</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                     <Button 
                       size="xl" 
                       className="rounded-full shadow-2xl gap-3 px-10 h-16 text-lg font-bold transition-all hover:scale-105 active:scale-95 glow-primary"
                       onClick={() => {
                           if (!session) {
                               toast.error("Please login to watch");
                               router.push("/login");
                               return;
                           }
                           if (canWatch) {
                               setIsMoviePlayerOpen(true);
                           } else {
                               toast.info("Discover our premium plans!");
                               router.push("/pricing");
                           }
                       }}
                     >
                        <PlayCircle className="w-6 h-6 fill-current" />
                        {canWatch ? "Watch Now" : "Unlock with Premium"}
                     </Button>

                     <Button 
                       size="xl" 
                       variant="outline"
                       className="rounded-full shadow-xl gap-2 px-8 h-16 border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all font-bold"
                       onClick={() => setIsTrailerOpen(true)}
                       disabled={!movie.trailerUrl && !movie.youtubeLink}
                     >
                        Watch Trailer
                     </Button>

                     {session && (
                       <Button 
                         size="icon" 
                         variant={isWatchlisted ? "secondary" : "outline"}
                         className={`w-16 h-16 rounded-full transition-all hover:scale-105 border-white/10 ${isWatchlisted ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-white/5 backdrop-blur-md"}`}
                         onClick={() => toggleWatchlistMutation.mutate()}
                         disabled={toggleWatchlistMutation.isPending}
                       >
                          <Heart className={`w-6 h-6 ${isWatchlisted ? "fill-current" : ""}`} />
                       </Button>
                     )}
                  </div>
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

      <Dialog open={isTrailerOpen} onOpenChange={setIsTrailerOpen}>
        <DialogContent className="sm:max-w-4xl p-0 bg-black border-zinc-800 overflow-hidden aspect-video">
          <DialogHeader className="sr-only">
             <DialogTitle>{movie.title} - Trailer</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full">
            {isTrailerOpen && (
              <iframe
                src={getYouTubeEmbedUrl(movie.trailerUrl || movie.youtubeLink) || ""}
                title={`${movie.title} Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isMoviePlayerOpen} onOpenChange={setIsMoviePlayerOpen}>
        <DialogContent className="sm:max-w-7xl p-0 bg-black border-zinc-900 overflow-hidden aspect-video shadow-2xl">
          <DialogHeader className="sr-only">
             <DialogTitle>Watching: {movie.title}</DialogTitle>
          </DialogHeader>
          <div className="w-full h-full group relative">
            {isMoviePlayerOpen && (
              <iframe
                src={getYouTubeEmbedUrl(movie.youtubeLink) || ""}
                title={movie.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            
            <div className="absolute top-4 left-4 p-4 bg-black/60 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
               <h4 className="text-white font-bold">{movie.title}</h4>
               <p className="text-zinc-400 text-xs">{movie.releaseYear} • {movie.genre.join(', ')}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
