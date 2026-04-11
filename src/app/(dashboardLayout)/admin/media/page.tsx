"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { Movie } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MovieFormDialog } from "@/components/admin/movie-form-dialog";
import { toast } from "sonner";

export default function AdminMediaPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery<{ data: Movie[]; meta: { total: number } }>({
    queryKey: ["admin", "movies", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      params.append("limit", "50");
      const { data } = await apiClient.get(`/api/v1/movies?${params.toString()}`);
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/v1/movies/${id}`);
    },
    onSuccess: () => {
      toast.success("Movie deleted.");
      queryClient.invalidateQueries({ queryKey: ["admin", "movies"] });
      setDeletingMovie(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete movie.");
      setDeletingMovie(null);
    },
  });

  const handleAdd = () => {
    setEditingMovie(null);
    setDialogOpen(true);
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setDialogOpen(true);
  };

  const movies = response?.data ?? [];
  const total = response?.meta?.total ?? 0;

  return (
    <div className="p-8 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
          <p className="text-muted-foreground">
            Manage your streaming catalog — {total} titles total.
          </p>
        </div>
        <Button className="w-full sm:w-auto gap-2" onClick={handleAdd}>
          <Plus className="w-4 h-4" /> Add Movie
        </Button>
      </div>

      {/* Table Card */}
      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search movies..."
              className="pl-8 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr className="border-b text-left uppercase text-xs tracking-wider">
                <th className="h-10 px-4 w-[72px]">Poster</th>
                <th className="h-10 px-4">Title</th>
                <th className="h-10 px-4 whitespace-nowrap">Year</th>
                <th className="h-10 px-4">Director</th>
                <th className="h-10 px-4">Tier</th>
                <th className="h-10 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-4">
                        <Skeleton className="h-12 w-8 rounded" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-48" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-12" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-4 w-16" />
                      </td>
                      <td className="p-4">
                        <Skeleton className="h-8 w-8 ml-auto rounded-full" />
                      </td>
                    </tr>
                  ))
                : movies.length === 0
                ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="h-32 text-center text-muted-foreground"
                      >
                        No movies found. Click &quot;Add Movie&quot; to get started.
                      </td>
                    </tr>
                  )
                : movies.map((movie) => (
                    <tr
                      key={movie.id}
                      className="border-b transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-2">
                        {movie.posterUrl ? (
                          <img
                            src={movie.posterUrl}
                            className="w-8 h-12 object-cover rounded-sm border"
                            alt=""
                          />
                        ) : (
                          <div className="w-8 h-12 bg-secondary rounded-sm border flex items-center justify-center text-[8px] text-muted-foreground">
                            N/A
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 font-medium">{movie.title}</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {movie.releaseYear}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {movie.director}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            movie.pricing === "PREMIUM"
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {movie.pricing}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="cursor-pointer gap-2"
                              onClick={() => handleEdit(movie)}
                            >
                              <Edit className="w-4 h-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer text-destructive gap-2 focus:text-destructive"
                              onClick={() => setDeletingMovie(movie)}
                            >
                              <Trash2 className="w-4 h-4" /> Delete Movie
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t text-xs text-muted-foreground">
          Showing {movies.length} of {total} movies
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <MovieFormDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingMovie(null);
        }}
        movie={editingMovie}
      />

      {/* Delete Confirm Dialog */}
      <AlertDialog
        open={!!deletingMovie}
        onOpenChange={(v) => !v && setDeletingMovie(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{deletingMovie?.title}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The movie will be permanently
              removed from the catalog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={() =>
                deletingMovie && deleteMutation.mutate(deletingMovie.id)
              }
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
