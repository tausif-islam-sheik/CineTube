"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Review } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  XCircle,
  Clock,
  Star,
  AlertTriangle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type StatusFilter = "PENDING" | "APPROVED" | "REJECTED" | "all";

interface QueueItem {
  id: string;
  type: string;
  status: string;
  contentId: string;
  content?: {
    id: string;
    title?: string;
    comment?: string;
    rating?: number;
    userId?: string;
    movieId?: string;
    containsSpoiler?: boolean;
    user?: { id: string; name: string; email: string };
    movie?: { id: string; title: string };
  };
  createdAt: string;
}

export default function AdminReviewsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("PENDING");
  const [page, setPage] = useState(1);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingItem, setRejectingItem] = useState<QueueItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const queryClient = useQueryClient();
  const LIMIT = 10;

  const { data, isLoading, error: queueError } = useQuery<{
    data: QueueItem[];
    meta: { total: number; totalPages: number; page: number };
  }>({
    queryKey: ["admin", "moderation-queue", statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(LIMIT),
        page: String(page),
        type: "review",
        ...(statusFilter !== "all" && { status: statusFilter }),
      });
      const { data } = await apiClient.get(`/api/v1/moderation/queue?${params}`);
      console.log("[Admin Reviews] Queue response:", data);
      return data;
    },
  });

  // Log errors for debugging
  if (queueError) {
    console.error("[Admin Reviews] Failed to load moderation queue:", queueError);
  }

  // Fallback: Fetch reviews directly when moderation queue fails
  const { data: directReviews, isLoading: directLoading } = useQuery<{
    data: any[];
    meta: { total: number; totalPages: number; page: number };
  }>({
    queryKey: ["admin", "reviews-direct", statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: String(LIMIT),
        page: String(page),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });
      const { data } = await apiClient.get(`/api/v1/reviews?${params}`);
      console.log("[Admin Reviews] Direct reviews response:", data);
      return data;
    },
    enabled: !!queueError, // Only run when moderation queue fails
  });

  // Stats query
  const { data: stats } = useQuery({
    queryKey: ["admin", "moderation-stats"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/moderation/stats");
      return data?.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      try {
        // Try moderation API first
        await apiClient.post(`/api/v1/moderation/reviews/${reviewId}/approve`);
      } catch (err: any) {
        // Fallback: update review status directly
        if (err?.response?.status === 404 || err?.response?.status === 400) {
          await apiClient.patch(`/api/v1/reviews/${reviewId}/status`, { status: "APPROVED" });
        } else {
          throw err;
        }
      }
    },
    onSuccess: () => {
      toast.success("Review approved and published.");
      queryClient.invalidateQueries({ queryKey: ["admin", "moderation-queue"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews-direct"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "moderation-stats"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Approval failed.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ reviewId, reason }: { reviewId: string; reason: string }) => {
      try {
        // Try moderation API first
        await apiClient.post(`/api/v1/moderation/reviews/${reviewId}/reject`, {
          reason,
        });
      } catch (err: any) {
        // Fallback: update review status directly
        if (err?.response?.status === 404 || err?.response?.status === 400) {
          await apiClient.patch(`/api/v1/reviews/${reviewId}/status`, { status: "REJECTED", reason });
        } else {
          throw err;
        }
      }
    },
    onSuccess: () => {
      toast.success("Review rejected.");
      queryClient.invalidateQueries({ queryKey: ["admin", "moderation-queue"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews-direct"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "moderation-stats"] });
      setRejectDialogOpen(false);
      setRejectingItem(null);
      setRejectReason("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Rejection failed.");
    },
  });

  const handleRejectOpen = (item: QueueItem) => {
    setRejectingItem(item);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  // Use moderation queue data if available, otherwise fallback to direct reviews
  const items = (queueError ? directReviews?.data : data?.data) ?? [];
  const totalPages = (queueError ? directReviews?.meta?.totalPages : data?.meta?.totalPages) ?? 1;
  const total = (queueError ? directReviews?.meta?.total : data?.meta?.total) ?? 0;

  const statusTabs: { label: string; value: StatusFilter; icon: React.ReactNode }[] = [
    { label: "Pending", value: "PENDING", icon: <Clock className="w-4 h-4" /> },
    { label: "Approved", value: "APPROVED", icon: <CheckCircle className="w-4 h-4" /> },
    { label: "Rejected", value: "REJECTED", icon: <XCircle className="w-4 h-4" /> },
    { label: "All", value: "all", icon: <Eye className="w-4 h-4" /> },
  ];

  return (
    <div className="p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Review Queue</h2>
        <p className="text-muted-foreground">
          Moderate user-submitted reviews before they appear publicly.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Pending",
            value: stats?.pending ?? "—",
            color: "text-yellow-500",
            bg: "bg-yellow-500/10",
            icon: <Clock className="w-5 h-5 text-yellow-500" />,
          },
          {
            label: "Approved",
            value: stats?.approved ?? "—",
            color: "text-green-500",
            bg: "bg-green-500/10",
            icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          },
          {
            label: "Rejected",
            value: stats?.rejected ?? "—",
            color: "text-red-500",
            bg: "bg-red-500/10",
            icon: <XCircle className="w-5 h-5 text-red-500" />,
          },
          {
            label: "Flagged",
            value: stats?.flagged ?? "—",
            color: "text-orange-500",
            bg: "bg-orange-500/10",
            icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-card border rounded-xl p-4 flex items-center gap-3"
          >
            <div className={`${stat.bg} p-2 rounded-lg`}>{stat.icon}</div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap items-center">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              statusFilter === tab.value
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card hover:bg-muted border-border text-muted-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.value === "PENDING" && stats?.pending > 0 && (
              <span className="ml-1 bg-yellow-500 text-black text-xs rounded-full px-1.5 py-0.5 font-bold">
                {stats.pending}
              </span>
            )}
          </button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["admin", "moderation-queue"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "moderation-stats"] });
            toast.info("Refreshing queue...");
          }}
        >
          <RefreshCw className="w-4 h-4 mr-1" /> Refresh
        </Button>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {isLoading || directLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))
        ) : queueError && !directReviews ? (
          <div className="text-center py-20 text-red-500 border border-red-200 rounded-xl bg-red-50">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">Failed to load moderation queue</p>
            <p className="text-sm text-red-400">{(queueError as any)?.response?.data?.message || "Please check the console for details"}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground border rounded-xl bg-card">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">Queue is empty.</p>
            <p className="text-sm">No reviews with this status.</p>
          </div>
        ) : (
          items.map((item) => {
            // Support both moderation queue structure (item.content) and direct reviews structure (flat)
            const review = item.content ?? item;
            const reviewId = item.contentId ?? item.id;
            const itemStatus = item.status ?? review.status;
            const itemCreatedAt = item.createdAt ?? review.createdAt;
            const isPending = itemStatus === "PENDING";

            return (
              <div
                key={item.id || review.id}
                className="bg-card border rounded-xl p-5 space-y-3 transition-all hover:border-primary/30"
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {review?.user?.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {review?.user?.name ?? "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {review?.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge
                    className={`shrink-0 ${
                      itemStatus === "APPROVED"
                        ? "bg-green-500/20 text-green-500 border-green-500/30"
                        : itemStatus === "REJECTED"
                        ? "bg-red-500/20 text-red-500 border-red-500/30"
                        : "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
                    }`}
                    variant="outline"
                  >
                    {itemStatus}
                  </Badge>
                </div>

                {/* Movie + Rating */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md text-xs">
                    🎬 {review?.movie?.title ?? "Unknown Movie"}
                  </span>
                  {review?.rating && (
                    <span className="flex items-center gap-1 text-yellow-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-yellow-400" />
                      {review.rating}/10
                    </span>
                  )}
                  {review?.containsSpoiler && (
                    <span className="text-xs bg-red-500/15 text-red-500 border border-red-500/30 px-2 py-0.5 rounded-full">
                      ⚠ Spoiler
                    </span>
                  )}
                  {review?.title && (
                    <span className="text-xs text-muted-foreground italic">
                      &quot;{review.title}&quot;
                    </span>
                  )}
                </div>

                {/* Review comment */}
                {review?.comment && (
                  <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-border pl-3 italic">
                    {review.comment.length > 280
                      ? `${review.comment.slice(0, 280)}…`
                      : review.comment}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">
                    Submitted {new Date(itemCreatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {isPending && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/40 text-red-500 hover:bg-red-500/10 hover:text-red-500 gap-1.5"
                        onClick={() => handleRejectOpen({ ...item, content: review, contentId: reviewId })}
                        disabled={rejectMutation.isPending || approveMutation.isPending}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                        onClick={() => approveMutation.mutate(reviewId)}
                        disabled={approveMutation.isPending || rejectMutation.isPending}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages} — {total} total
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Reject Reason Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={(v) => !v && setRejectDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Review</DialogTitle>
            <DialogDescription>
              Provide an optional reason for rejection. This helps with transparency.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="e.g. Contains inappropriate language or misleading content..."
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={rejectMutation.isPending}
              onClick={() => {
                if (rejectingItem) {
                  rejectMutation.mutate({
                    reviewId: rejectingItem.contentId,
                    reason: rejectReason,
                  });
                }
              }}
            >
              {rejectMutation.isPending ? "Rejecting..." : "Confirm Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
