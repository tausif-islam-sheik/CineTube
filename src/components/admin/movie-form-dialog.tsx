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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
import {
  Film,
  User,
  Calendar,
  Clock,
  Tag,
  Users,
  Globe,
  DollarSign,
  Image,
  Play,
  Video,
  Sparkles,
  Clapperboard,
} from "lucide-react";

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
      <DialogContent className="!max-w-[700px] w-[96vw] max-h-[92vh] overflow-hidden p-0 bg-gradient-to-br from-background via-background to-muted/20 border-2 shadow-2xl">
        {/* Header with gradient */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background px-8 py-6 border-b">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Clapperboard className="w-24 h-24" />
          </div>
          <DialogHeader className="relative z-10 space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <DialogTitle className="text-2xl font-bold tracking-tight">
                {isEdit ? "Edit Movie" : "Add New Movie"}
              </DialogTitle>
              {isEdit && (
                <Badge variant="secondary" className="ml-2">Editing</Badge>
              )}
            </div>
            <DialogDescription className="text-base text-muted-foreground">
              {isEdit
                ? "Update the movie details in your catalog."
                : "Create a new movie entry for your streaming platform."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="overflow-y-auto max-h-[calc(92vh-180px)]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((v) => mutation.mutate(v))}
              className="p-8 space-y-8"
            >
              {/* Section: Basic Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Film className="w-5 h-5 text-primary" />
                  <h3>Basic Information</h3>
                  <Separator className="flex-1 ml-4" />
                </div>
                
                <div className="grid gap-6">
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Movie Title *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g. Inception" 
                            {...field} 
                            className="h-12 text-lg"
                          />
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
                        <FormLabel className="text-base font-medium">Synopsis *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter a compelling movie synopsis..."
                            rows={4}
                            {...field}
                            className="resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section: Cast & Crew */}
              <div className="space-y-7">
                <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  <h3>Cast & Crew</h3>
                  <Separator className="flex-1 ml-4" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="director"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          Director *
                        </FormLabel>
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
                        <FormLabel className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          Platform *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="CineTube" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="cast"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        Cast (comma-separated)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section: Details */}
              <div className="space-y-7">
                <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3>Movie Details</h3>
                  <Separator className="flex-1 ml-4" />
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="releaseYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          Release Year *
                        </FormLabel>
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
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          Duration (min)
                        </FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="148" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          Language *
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="English, Spanish..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        Genres * (comma-separated)
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Action, Sci-Fi, Thriller, Mystery..." {...field} />
                      </FormControl>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {GENRES.slice(0, 8).map((g) => (
                          <Badge
                            key={g}
                            variant="secondary"
                            className="cursor-pointer hover:bg-primary/20 transition-colors"
                            onClick={() => {
                              const current = field.value || "";
                              const genres = current.split(",").map(s => s.trim()).filter(Boolean);
                              if (!genres.includes(g)) {
                                field.onChange(current ? `${current}, ${g}` : g);
                              }
                            }}
                          >
                            + {g}
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Section: Pricing */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <h3>Pricing</h3>
                  <Separator className="flex-1 ml-4" />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="pricing"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Pricing Tier *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Select tier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="FREE">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-green-500/20 text-green-700">Free</Badge>
                                <span>Available to all users</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="PREMIUM">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-amber-500/20 text-amber-700">Premium</Badge>
                                <span>Paid content</span>
                              </div>
                            </SelectItem>
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
                        <FormLabel className="text-base font-medium">Price (USD)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="9.99" 
                              {...field} 
                              className="pl-10 h-12"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section: Media URLs */}
              <div className="space-y-7">
                <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Image className="w-5 h-5 text-primary" />
                  <h3>Media Assets</h3>
                  <Separator className="flex-1 ml-4" />
                </div>
                
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="posterUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Image className="w-4 h-4 text-muted-foreground" />
                          Poster Image URL
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/poster.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="trailerUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Play className="w-4 h-4 text-muted-foreground" />
                            Trailer URL
                          </FormLabel>
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
                          <FormLabel className="flex items-center gap-2">
                            <Video className="w-4 h-4 text-muted-foreground" />
                            YouTube Link
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t">
                <DialogFooter className="gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    size="lg"
                    className="px-8"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={mutation.isPending}
                    size="lg"
                    className="px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
                  >
                    {mutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        {isEdit ? "Saving..." : "Adding..."}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isEdit ? "Save Changes" : "Add Movie"}
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
