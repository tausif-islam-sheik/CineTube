"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const GENRES = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "ROMANCE", "THRILLER"];

export function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [yearMin, setYearMin] = useState(searchParams.get("yearMin") || "");
  const [yearMax, setYearMax] = useState(searchParams.get("yearMax") || "");
  const [ratingMin, setRatingMin] = useState(searchParams.get("ratingMin") || "");

  const activeGenres = searchParams.getAll("genre");

  const createQueryString = useCallback(
    (name: string, value: string, addMultiple = false) => {
      const params = new URLSearchParams(searchParams.toString());
      if (addMultiple) {
         if (params.getAll(name).includes(value)) {
            // Remove it
            const existing = params.getAll(name);
            params.delete(name);
            existing.filter(v => v !== value).forEach(v => params.append(name, v));
         } else {
             params.append(name, value);
         }
      } else {
          if (value) {
            params.set(name, value);
          } else {
            params.delete(name);
          }
      }
      return params.toString();
    },
    [searchParams]
  );

  const toggleGenre = (genre: string) => {
      router.push(pathname + "?" + createQueryString("genre", genre, true));
  };

  const applyFilters = () => {
    let params = new URLSearchParams(searchParams.toString());
    if (yearMin) params.set("yearMin", yearMin); else params.delete("yearMin");
    if (yearMax) params.set("yearMax", yearMax); else params.delete("yearMax");
    if (ratingMin) params.set("ratingMin", ratingMin); else params.delete("ratingMin");
    router.push(pathname + "?" + params.toString());
  };

  const clearFilters = () => {
    router.push(pathname);
    setYearMin("");
    setYearMax("");
    setRatingMin("");
  };

  return (
    <div className="w-full lg:w-64 space-y-8 p-4 shrink-0 rounded-xl border bg-card text-card-foreground shadow">
      <div>
        <h3 className="font-semibold mb-4 text-lg">Genres</h3>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((genre) => {
            const isActive = activeGenres.includes(genre);
            return (
              <Button
                key={genre}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => toggleGenre(genre)}
                className="h-8 rounded-full"
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
