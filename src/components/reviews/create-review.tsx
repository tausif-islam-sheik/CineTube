"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

const reviewSchema = z.object({
  rating: z.number().min(1).max(10),
  title: z.string().min(2, "Title is too short").max(100),
  comment: z.string().min(10, "Review must be at least 10 characters").max(2000),
  containsSpoiler: z.boolean().default(false),
  tagsInput: z.string().max(200).optional(),
});

export function CreateReview({ movieId }: { movieId: string }) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: "",
      comment: "",
      containsSpoiler: false,
      tagsInput: "",
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async (values: z.infer<typeof reviewSchema>) => {
      const tags =
        values.tagsInput
          ?.split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean)
          .slice(0, 8) ?? [];
      const { data } = await apiClient.post("/api/v1/reviews", {
        rating: values.rating,
        title: values.title,
        comment: values.comment,
        containsSpoiler: values.containsSpoiler,
        tags,
        movieId,
      });
      return data;
    },
    onMutate: async (newReview) => {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({ queryKey: ["reviews", movieId] });
        
        // Snapshot previous
        const previousReviews = queryClient.getQueryData(["reviews", movieId]);
        
        // Optimistically add
        queryClient.setQueryData(["reviews", movieId], (old: any) => {
             const tempReview = {
                id: Math.random().toString(),
                ...newReview,
                tags: newReview.tagsInput
                  ?.split(",")
                  .map((tag) => tag.trim().toLowerCase())
                  .filter(Boolean)
                  .slice(0, 8),
                createdAt: new Date().toISOString(),
                user: session?.user || { name: "You" }
             };
             return old ? [tempReview, ...old] : [tempReview];
        });

        return { previousReviews };
    },
    onError: (err, newReview, context) => {
      queryClient.setQueryData(["reviews", movieId], context?.previousReviews);
      toast.error("Failed to post review. Please try again.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
      form.reset();
      toast.success("Review posted successfully!");
    },
  });

  function onSubmit(values: z.infer<typeof reviewSchema>) {
    if (values.rating === 0) {
       form.setError("rating", { message: "Please select a rating" });
       return;
    }
    createReviewMutation.mutate(values);
  }

  const currentRating = form.watch("rating");

  return (
    <div className="bg-card rounded-xl p-6 border shadow-sm">
      <h4 className="font-semibold mb-4">Write a Review</h4>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => field.onChange(star)}
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        className="transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${(hoveredStar ? star <= hoveredStar : star <= currentRating)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground hover:text-primary"
                            }`}
                        />
                      </button>
                    ))}
                    <span className="ml-2 font-bold text-lg">{currentRating > 0 ? `${currentRating}/10` : ""}</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Headline for your review" {...field} className="bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="What did you think of the movie?"
                    className="min-h-[100px] resize-y bg-background"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tagsInput"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='Tags (comma separated): classic, family-friendly, underrated'
                    {...field}
                    className="bg-background"
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Optional. Add up to 8 tags separated by commas.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <FormField
               control={form.control}
               name="containsSpoiler"
               render={({ field }) => (
                 <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                   <FormControl>
                     <Checkbox
                       checked={field.value}
                       onCheckedChange={field.onChange}
                     />
                   </FormControl>
                   <div className="space-y-1 leading-none">
                     <p className="text-sm font-medium text-muted-foreground">Contains Spoilers</p>
                   </div>
                 </FormItem>
               )}
            />

            <Button type="submit" disabled={createReviewMutation.isPending}>
              {createReviewMutation.isPending ? "Posting..." : "Post Review"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
