"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal } from "lucide-react";

const GENRES = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Romance", "Thriller"];

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [yearMin, setYearMin] = useState(searchParams.get("yearMin") || "");
  const [yearMax, setYearMax] = useState(searchParams.get("yearMax") || "");
  const [ratingMin, setRatingMin] = useState(searchParams.get("ratingMin") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt");
  const [order, setOrder] = useState(searchParams.get("order") || "desc");
  const [pricing, setPricing] = useState(searchParams.get("pricing") || "");
  const [selectedGenres, setSelectedGenres] = useState<string[]>(searchParams.getAll("genre"));

  useEffect(() => {
    setYearMin(searchParams.get("yearMin") || "");
    setYearMax(searchParams.get("yearMax") || "");
    setRatingMin(searchParams.get("ratingMin") || "");
    setSortBy(searchParams.get("sortBy") || "createdAt");
    setOrder(searchParams.get("order") || "desc");
    setPricing(searchParams.get("pricing") || "");
    setSelectedGenres(searchParams.getAll("genre"));
  }, [searchParams]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    params.delete("genre");
    selectedGenres.forEach((genre) => params.append("genre", genre));

    if (yearMin) params.set("yearMin", yearMin); else params.delete("yearMin");
    if (yearMax) params.set("yearMax", yearMax); else params.delete("yearMax");
    if (ratingMin) params.set("ratingMin", ratingMin); else params.delete("ratingMin");
    if (sortBy) params.set("sortBy", sortBy); else params.delete("sortBy");
    if (order) params.set("order", order); else params.delete("order");
    if (pricing) params.set("pricing", pricing); else params.delete("pricing");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
    setYearMin("");
    setYearMax("");
    setRatingMin("");
    setSortBy("createdAt");
    setOrder("desc");
    setPricing("");
    setSelectedGenres([]);
  };

  return (
    <div className="w-full lg:w-72 self-start h-fit space-y-6 p-5 shrink-0 rounded-2xl border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center gap-2 border-b pb-3">
        <SlidersHorizontal className="h-4 w-4 text-primary" />
        <h2 className="font-semibold">Smart Filters</h2>
      </div>
      <div>
        <h3 className="font-semibold mb-4 text-lg">Genres</h3>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => {
            const isActive = selectedGenres.includes(genre);
            return (
              <Button
                key={genre}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => toggleGenre(genre)}
                className="h-8 rounded-full px-3"
              >
                {genre}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Release Year</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="yearMin" className="text-xs">From (1990)</Label>
            <Input 
               id="yearMin" 
               type="number" 
               placeholder="1990" 
               min="1990" max="2026"
               value={yearMin}
               onChange={(e) => setYearMin(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="yearMax" className="text-xs">To (2026)</Label>
            <Input 
               id="yearMax" 
               type="number" 
               placeholder="2026" 
               min="1990" max="2026"
               value={yearMax}
               onChange={(e) => setYearMax(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Rating</h3>
        <div>
           <Label htmlFor="ratingMin" className="text-xs">Minimum Score (1-10)</Label>
           <Input 
              id="ratingMin" 
              type="number" 
              placeholder="e.g. 7" 
              min="1" max="10" step="0.5"
              value={ratingMin}
              onChange={(e) => setRatingMin(e.target.value)}
           />
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="pricing" className="text-xs">Access Type</Label>
          <select
            id="pricing"
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">All</option>
            <option value="FREE">Free</option>
            <option value="PREMIUM">Premium</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="sortBy" className="text-xs">Sort By</Label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="createdAt">Recent</option>
              <option value="rating">Rating</option>
              <option value="releaseYear">Year</option>
              <option value="title">Title</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="order" className="text-xs">Order</Label>
            <select
              id="order"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col gap-2 border-t">
        <Button onClick={applyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button variant="ghost" onClick={clearFilters} className="w-full">
          Clear All
        </Button>
      </div>
    </div>
  );
}
