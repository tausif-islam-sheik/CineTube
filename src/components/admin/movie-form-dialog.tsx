"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Movie } from "@/types";
import { toast } from "sonner";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime",
  "Documentary", "Drama", "Fantasy", "Horror", "Mystery",
  "Romance", "Sci-Fi", "Thriller", "Western", "Biography",
];

const movieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  director: z.string().min(1, "Director is required"),
  platform: z.string().min(1, "Platform is required"),
  releaseYear: z.coerce
    .number()
    .int()
    .min(1800)
    .max(new Date().getFullYear() + 5),
  duration: z.coerce.number().int().min(1).optional().or(z.literal("")),
  pricing: z.enum(["FREE", "PREMIUM"]),
  price: z.coerce.number().min(0).optional().or(z.literal("")),
  posterUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  trailerUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  youtubeLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  genre: z.string().min(1, "Genre is required"),  // comma-separated string → array on submit
  cast: z.string().optional(), // comma-separated string → array on submit
  language: z.string().min(1, "Language is required"), // comma-separated
});

type MovieFormValues = z.infer<typeof movieSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
  movie?: Movie | null; // if provided → edit mode
}

export function MovieFormDialog({ open, onClose, movie }: Props) {
  const queryClient = useQueryClient();
  const isEdit = !!movie;

  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: "",
      description: "",
      director: "",
      platform: "CineTube",
      releaseYear: new Date().getFullYear(),
      duration: "" as any,
      pricing: "FREE",
      price: "" as any,
      posterUrl: "",
      trailerUrl: "",
      youtubeLink: "",
      genre: "",
      cast: "",
      language: "English",
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (movie) {
      form.reset({
        title: movie.title,
        description: movie.description,
        director: movie.director,
        platform: movie.platform,
        releaseYear: movie.releaseYear,
        duration: movie.duration ?? ("" as any),
        pricing: movie.pricing,
        price: movie.price ?? ("" as any),
        posterUrl: movie.posterUrl ?? "",
        trailerUrl: movie.trailerUrl ?? "",
        youtubeLink: movie.youtubeLink ?? "",
        genre: movie.genre.join(", "),
        cast: movie.cast.join(", "),
        language: movie.language.join(", "),
      });
    } else {
      form.reset({
        title: "",
        description: "",
        director: "",
        platform: "CineTube",
        releaseYear: new Date().getFullYear(),
        duration: "" as any,
        pricing: "FREE",
        price: "" as any,
        posterUrl: "",
        trailerUrl: "",
        youtubeLink: "",
        genre: "",
        cast: "",
        language: "English",
      });
    }
  }, [movie, open]);

  const mutation = useMutation({
    mutationFn: async (values: MovieFormValues) => {
      const payload = {
        ...values,
        genre: values.genre.split(",").map((g) => g.trim()).filter(Boolean),
        cast: values.cast
          ? values.cast.split(",").map((c) => c.trim()).filter(Boolean)
          : [],
        language: values.language.split(",").map((l) => l.trim()).filter(Boolean),
        duration: values.duration === "" ? undefined : Number(values.duration),
        price: values.price === "" ? undefined : Number(values.price),
        posterUrl: values.posterUrl || undefined,
        trailerUrl: values.trailerUrl || undefined,
        youtubeLink: values.youtubeLink || undefined,
      };

      if (isEdit) {
        const { data } = await apiClient.patch(
          `/api/v1/movies/${movie!.id}`,
          payload
        );
        return data;
      } else {
        const { data } = await apiClient.post("/api/v1/movies", payload);
        return data;
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? "Movie updated!" : "Movie added successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin", "movies"] });
      onClose();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong";
      toast.error(msg);
    },
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Movie" : "Add New Movie"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the movie details below."
              : "Fill in the details to add a new movie to the catalog."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
            className="space-y-4"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Inception" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Movie synopsis..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Director + Platform */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="director"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Director *</FormLabel>
                    <FormControl>
                      <Input placeholder="Christopher Nolan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform *</FormLabel>
                    <FormControl>
                      <Input placeholder="CineTube" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Release Year + Duration */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="releaseYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Release Year *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2010" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (min)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="148" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Genre */}
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre * (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Action, Sci-Fi, Thriller" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cast */}
            <FormField
              control={form.control}
              name="cast"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cast (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Leonardo DiCaprio, Joseph Gordon-Levitt"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Language */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language * (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="English" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Pricing + Price */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pricing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pricing *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FREE">Free</SelectItem>
                        <SelectItem value="PREMIUM">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="9.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* URLs */}
            <FormField
              control={form.control}
              name="posterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poster URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="trailerUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trailer URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="youtubeLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending
                  ? isEdit
                    ? "Saving..."
                    : "Adding..."
                  : isEdit
                  ? "Save Changes"
                  : "Add Movie"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
