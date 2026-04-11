"use client";

import { useQuery } from "@tanstack/react-query";
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

export default function AdminMediaPage() {
  const [search, setSearch] = useState("");

  const { data: response, isLoading } = useQuery<{ movies: Movie[], total: number }>({
      queryKey: ["admin", "movies", search],
      queryFn: async () => {
          const params = new URLSearchParams();
          if (search) params.append("search", search);
          const { data } = await apiClient.get(`/api/movies?${params.toString()}`);
          return data;
      }
  });

  return (
    <div className="p-8 space-y-6 animate-in fade-in">
       <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
           <div>
               <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
               <p className="text-muted-foreground">Manage your streaming catalog.</p>
           </div>
           <Button className="w-full sm:w-auto gap-2">
              <Plus className="w-4 h-4" /> Add Movie
           </Button>
       </div>

       <div className="bg-card rounded-xl border shadow-sm">
           <div className="p-4 border-b flex items-center justify-between">
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
                  <thead className="[&_tr]:border-b bg-muted/40 text-muted-foreground">
                      <tr className="border-b transition-colors uppercase text-xs tracking-wider text-left">
                          <th className="h-10 px-4 align-middle font-semibold w-[80px]">Cover</th>
                          <th className="h-10 px-4 align-middle font-semibold">Title</th>
                          <th className="h-10 px-4 align-middle font-semibold whitespace-nowrap">Release Year</th>
                          <th className="h-10 px-4 align-middle font-semibold">Director</th>
                          <th className="h-10 px-4 align-middle font-semibold">Tier</th>
                          <th className="h-10 px-4 align-middle text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0 text-foreground">
                      {isLoading ? Array.from({length: 5}).map((_, i) => (
                           <tr key={i} className="border-b">
                               <td className="p-4"><Skeleton className="h-12 w-8 rounded" /></td>
                               <td className="p-4"><Skeleton className="h-4 w-48" /></td>
                               <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                               <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                               <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                               <td className="p-4"><Skeleton className="h-8 w-8 ml-auto rounded-full" /></td>
                           </tr>
                      )) : response?.movies?.length === 0 ? (
                           <tr>
                               <td colSpan={6} className="h-24 text-center text-muted-foreground">
                                   No media found.
                               </td>
                           </tr>
                      ) : response?.movies?.map(movie => (
                           <tr key={movie.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                               <td className="px-4 py-2">
                                  {movie.posterUrl ? (
                                      <img src={movie.posterUrl} className="w-8 h-12 object-cover rounded-sm border" alt="" />
                                  ) : (
                                      <div className="w-8 h-12 bg-secondary rounded-sm border" />
                                  )}
                               </td>
                               <td className="px-4 py-2 font-medium">{movie.title}</td>
                               <td className="px-4 py-2">{movie.releaseYear}</td>
                               <td className="px-4 py-2">{movie.director}</td>
                               <td className="px-4 py-2 text-xs">
                                  <span className={`px-2 py-0.5 rounded-full font-semibold ${movie.pricing === 'PREMIUM' ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-muted text-muted-foreground'}`}>
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
                                          <DropdownMenuItem className="cursor-pointer gap-2">
                                              <Edit className="w-4 h-4" /> Edit Details
                                          </DropdownMenuItem>
                                          <DropdownMenuItem className="cursor-pointer text-destructive gap-2 focus:text-destructive">
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
               Showing {response?.movies?.length || 0} of {response?.total || 0} movies
           </div>
       </div>
    </div>
  );
}
