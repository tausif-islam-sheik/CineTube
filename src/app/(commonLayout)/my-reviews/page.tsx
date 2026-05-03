"use client";

import { useState } from "react";
import { Star, Edit2, Trash2, Film, ThumbsUp, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/section-heading";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { useMyReviews } from "@/hooks/use-reviews";
import { useMovies } from "@/hooks/use-movies";
import { Review } from "@/types";
import Link from "next/link";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-4 h-4",
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  movie,
  isEditing,
  onEdit,
  onSave,
  onDelete,
  editContent,
  setEditContent,
}: {
  review: Review;
  movie: any;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  editContent: string;
  setEditContent: (content: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="p-6 rounded-xl bg-muted/30 border border-border hover:border-primary/30 transition-colors">
      <div className="flex gap-4">
        {/* Movie Poster */}
        <Link href={`/movie/${movie?.id}`} className="flex-shrink-0">
          <div className="w-20 aspect-[2/3] rounded-lg overflow-hidden bg-muted">
            {movie?.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Film className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
          </div>
        </Link>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/movie/${movie?.id}`}
                className="font-bold text-lg hover:text-primary transition-colors"
              >
                {movie?.title || "Unknown Movie"}
              </Link>
              <p className="text-sm text-muted-foreground">
                {movie?.releaseYear} • {movie?.genre?.[0]}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StarRating rating={review.rating} />
              <span className="font-bold text-yellow-400">
                {review.rating.toFixed(1)}
              </span>
            </div>
          </div>

          {isEditing ? (
            <div className="mt-3 space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px]"
                placeholder="Write your review..."
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={onSave}>
                  Save Changes
                </Button>
                <Button size="sm" variant="outline" onClick={onEdit}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p
                className={cn(
                  "mt-3 text-sm",
                  !isExpanded && "line-clamp-3"
                )}
              >
                {review.comment}
              </p>
              {review.comment && review.comment.length > 150 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-sm text-primary hover:underline mt-1"
                >
                  {isExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </>
          )}

          {/* Review Meta */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              {review.likesCount && (
                <span className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  {review.likesCount} likes
                </span>
              )}
            </div>

            {!isEditing && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={onDelete}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyReviewsPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: reviewsData, isLoading: isLoadingReviews } = useMyReviews(page, limit);
  const { data: moviesData } = useMovies({});

  const allMovies = moviesData?.pages?.flatMap((page) => page.data) || [];
  const movieMap = new Map(allMovies.map((m) => [m.id, m]));

  // Use real reviews data from API
  const reviews = reviewsData?.data || [];
  const pagination = reviewsData?.meta;

  // Calculate stats from real data
  const totalReviews = pagination?.total ?? reviews.length;
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (totalReviews || 1);

  // Calculate favorite genre from reviewed movies
  const genreCount: Record<string, number> = {};
  reviews.forEach((review) => {
    const movie = movieMap.get(review.movieId) || review.movie;
    if (movie?.genre) {
      movie.genre.forEach((g) => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      });
    }
  });
  const favoriteGenre =
    Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const handleEdit = (review: Review) => {
    if (editingId === review.id) {
      setEditingId(null);
      setEditContent("");
    } else {
      setEditingId(review.id);
      setEditContent(review.comment);
    }
  };

  const handleSave = () => {
    // Would save to API
    setEditingId(null);
    setEditContent("");
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = () => {
    // Would delete from API
    setDeleteConfirmId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-8xl mx-auto px-4 md:px-10 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-black">My Reviews</h1>
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                {totalReviews} reviews
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-background border border-border">
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              <p className="text-2xl font-black">{totalReviews}</p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border">
              <p className="text-sm text-muted-foreground">Average Rating</p>
              <p className="text-2xl font-black text-yellow-400 flex items-center gap-2">
                <Star className="w-6 h-6 fill-current" />
                {averageRating.toFixed(1)}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border">
              <p className="text-sm text-muted-foreground">Favorite Genre</p>
              <p className="text-2xl font-black">{favoriteGenre}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="max-w-8xl mx-auto px-4 md:px-10 py-8">
        {isLoadingReviews ? (
          <LoadingSkeleton type="review" count={3} />
        ) : reviews.length === 0 ? (
          <EmptyState
            type="reviews"
            action={{
              label: "Browse Movies",
              href: "/movies",
            }}
          />
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                movie={movieMap.get(review.movieId) || review.movie}
                isEditing={editingId === review.id}
                onEdit={() => handleEdit(review)}
                onSave={handleSave}
                onDelete={() => handleDelete(review.id)}
                editContent={editContent}
                setEditContent={setEditContent}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoadingReviews}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  disabled={isLoadingReviews}
                  className={cn(
                    "w-8 h-8 rounded-md text-sm font-medium transition-colors",
                    page === p
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted disabled:opacity-50"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages || isLoadingReviews}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={confirmDelete}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDanger
      />
    </div>
  );
}
