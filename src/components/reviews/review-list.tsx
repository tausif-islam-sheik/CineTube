"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Review } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function ReviewCard({ review }: { review: Review }) {
  const [showSpoiler, setShowSpoiler] = useState(!review.containsSpoiler);

  return (
    <div className="py-6 border-b last:border-0 relative">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 border border-muted">
          <AvatarImage src={review.user?.image || ""} alt={review.user?.name || "User"} />
          <AvatarFallback>{review.user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
             <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{review.user?.name || "Anonymous"}</span>
                <span className="text-xs text-muted-foreground">
                   {new Date(review.createdAt).toLocaleDateString()}
                </span>
             </div>
             <div className="flex items-center gap-1 bg-secondary/50 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-primary text-primary" />
                <span className="text-xs font-bold">{review.rating}</span>
             </div>
          </div>
          
          <h5 className="font-medium text-sm mb-2">{review.title}</h5>

          {review.containsSpoiler && !showSpoiler ? (
             <div className="relative group cursor-pointer w-full mt-2" onClick={() => setShowSpoiler(true)}>
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm border border-dashed rounded-md z-10 transition-opacity group-hover:bg-background/90">
                   <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      <EyeOff className="w-4 h-4" />
                      Contains Spoilers. Click to view.
                   </div>
                </div>
                <p className="text-sm text-foreground/20 italic select-none line-clamp-2 blur-sm">
                   {review.comment}
                </p>
             </div>
          ) : (
             <div className="relative">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                   {review.comment}
                </p>
                {review.containsSpoiler && showSpoiler && (
                   <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute -top-10 right-0 h-6 px-2 text-[10px] text-muted-foreground hober:text-foreground"
                      onClick={() => setShowSpoiler(false)}
                   >
                     <Eye className="w-3 h-3 mr-1" /> Hide Spoilers
                   </Button>
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ReviewList({ movieId }: { movieId: string }) {
  const { data: reviews, isLoading, error } = useQuery<Review[]>({
    queryKey: ["reviews", movieId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/reviews?movieId=${movieId}`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 mt-8">
         <Skeleton className="h-32 w-full rounded-xl" />
         <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !reviews) {
    return <div className="text-muted-foreground text-sm mt-4">Failed to load reviews.</div>;
  }

  if (reviews.length === 0) {
    return (
       <div className="py-12 text-center text-muted-foreground">
          <p>No reviews yet. Be the first to share your thoughts!</p>
       </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col">
      {reviews.map((review) => (
         <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}
