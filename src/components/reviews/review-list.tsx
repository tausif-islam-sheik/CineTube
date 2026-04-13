"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Review } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, EyeOff, Eye, Heart } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function ReviewCard({
  review,
  movieId,
  isLiked,
}: {
  review: Review;
  movieId: string;
  isLiked: boolean;
}) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const hasSpoiler = review.containsSpoiler ?? review.spoiler ?? false;
  const isOwner = (session?.user as any)?.id === review.userId;
  const isUnpublished = review.status === "PENDING" || review.status === "REJECTED";
  const [showSpoiler, setShowSpoiler] = useState(!hasSpoiler);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(review.title);
  const [editComment, setEditComment] = useState(review.comment ?? review.content ?? "");
  const [editSpoiler, setEditSpoiler] = useState(hasSpoiler);
  const [editTags, setEditTags] = useState((review.tags ?? []).join(", "));
  const commentText = review.comment ?? review.content ?? "";
  const likesCount = review.likesCount ?? review._count?.likes ?? 0;

  const toggleLikeMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post("/api/v1/likes", { reviewId: review.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
      queryClient.invalidateQueries({ queryKey: ["user-liked-reviews"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update like");
    },
  });

  const handleToggleLike = () => {
    if (!session) {
      toast.error("Please login to like reviews");
      return;
    }
    toggleLikeMutation.mutate();
  };

  const updateReviewMutation = useMutation({
    mutationFn: async () => {
      const tags = editTags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 8);

      await apiClient.patch(`/api/v1/reviews/${review.id}`, {
        title: editTitle,
        comment: editComment,
        containsSpoiler: editSpoiler,
        tags,
      });
    },
    onSuccess: () => {
      toast.success("Review updated");
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update review");
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/api/v1/reviews/${review.id}`);
    },
    onSuccess: () => {
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete review");
    },
  });

  const handleSaveEdit = () => {
    if (editTitle.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }
    if (editComment.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }
    updateReviewMutation.mutate();
  };

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
          
          <div className="mb-2 flex items-center justify-between gap-2">
            <h5 className="font-medium text-sm">{review.title}</h5>
            {isOwner && (
              <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {review.status}
              </span>
            )}
          </div>
          {!!review.tags?.length && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {review.tags.map((tag) => (
                <span
                  key={`${review.id}-${tag}`}
                  className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {isEditing ? (
            <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Review title"
              />
              <Textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                className="min-h-[100px]"
                placeholder="Update your review"
              />
              <Input
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="Tags (comma separated)"
              />
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Checkbox checked={editSpoiler} onCheckedChange={(value) => setEditSpoiler(!!value)} />
                Contains spoilers
              </label>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleSaveEdit} disabled={updateReviewMutation.isPending}>
                  {updateReviewMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditTitle(review.title);
                    setEditComment(commentText);
                    setEditSpoiler(hasSpoiler);
                    setEditTags((review.tags ?? []).join(", "));
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : hasSpoiler && !showSpoiler ? (
             <div className="relative group cursor-pointer w-full mt-2" onClick={() => setShowSpoiler(true)}>
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm border border-dashed rounded-md z-10 transition-opacity group-hover:bg-background/90">
                   <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                      <EyeOff className="w-4 h-4" />
                      Contains Spoilers. Click to view.
                   </div>
                </div>
                <p className="text-sm text-foreground/20 italic select-none line-clamp-2 blur-sm">
                   {commentText}
                </p>
             </div>
          ) : (
             <div className="relative">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                   {commentText}
                </p>
                {hasSpoiler && showSpoiler && (
                   <Button 
                      variant="ghost" 
                      size="sm" 
                      className="absolute -top-10 right-0 h-6 px-2 text-[10px] text-muted-foreground hover:text-foreground"
                      onClick={() => setShowSpoiler(false)}
                   >
                     <Eye className="w-3 h-3 mr-1" /> Hide Spoilers
                   </Button>
                )}
             </div>
          )}

          <div className="mt-3 flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-2 text-xs",
                isLiked && "text-red-500 hover:text-red-500"
              )}
              onClick={handleToggleLike}
              disabled={toggleLikeMutation.isPending}
            >
              <Heart className={cn("mr-1 h-4 w-4", isLiked && "fill-current")} />
              {isLiked ? "Liked" : "Like"} ({likesCount})
            </Button>
            {isOwner && isUnpublished && !isEditing && (
              <>
                <Button variant="ghost" size="sm" className="ml-2 h-8 px-2 text-xs" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs text-red-500 hover:text-red-500"
                  onClick={() => deleteReviewMutation.mutate()}
                  disabled={deleteReviewMutation.isPending}
                >
                  {deleteReviewMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReviewList({ movieId }: { movieId: string }) {
  const { data: session } = useSession();
  const [sortBy, setSortBy] = useState<"createdAt" | "rating" | "likes">("createdAt");
  const [spoilerFilter, setSpoilerFilter] = useState<"all" | "with" | "without">("all");
  const [selectedTag, setSelectedTag] = useState<string>("all");

  const { data: reviews, isLoading, error } = useQuery<Review[]>({
    queryKey: ["reviews", movieId, sortBy, spoilerFilter, selectedTag],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("movieId", movieId);
      params.set("sortBy", sortBy);
      params.set("order", "desc");
      if (spoilerFilter === "with") params.set("spoiler", "true");
      if (spoilerFilter === "without") params.set("spoiler", "false");
      if (selectedTag !== "all") params.set("tag", selectedTag);

      const { data } = await apiClient.get(`/api/v1/reviews?${params.toString()}`);
      return data.data;
    },
  });

  const { data: userLikedReviewIds } = useQuery<string[]>({
    queryKey: ["user-liked-reviews"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/user/likes?limit=200");
      const likes = data?.data ?? [];
      return likes.map((like: any) => like.reviewId);
    },
    enabled: !!session,
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

  const availableTags = Array.from(
    new Set(reviews.flatMap((review) => review.tags ?? []))
  ).sort();

  return (
    <div className="mt-8 flex flex-col">
      <div className="mb-4 flex flex-col gap-2 rounded-lg border border-border bg-card/50 p-3 md:flex-row md:items-center">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "createdAt" | "rating" | "likes")}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="createdAt">Sort: Recent</option>
          <option value="rating">Sort: Top Rated</option>
          <option value="likes">Sort: Most Liked</option>
        </select>

        <select
          value={spoilerFilter}
          onChange={(e) => setSpoilerFilter(e.target.value as "all" | "with" | "without")}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="all">Spoilers: All</option>
          <option value="without">Spoilers: Hidden</option>
          <option value="with">Spoilers: Only</option>
        </select>

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm md:min-w-[180px]"
        >
          <option value="all">Tags: All</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {reviews.map((review) => (
         <ReviewCard
           key={review.id}
           review={review}
           movieId={movieId}
           isLiked={!!userLikedReviewIds?.includes(review.id)}
         />
      ))}
    </div>
  );
}
