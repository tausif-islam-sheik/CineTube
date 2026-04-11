"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Calendar, MonitorPlay, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const GENRES = ["Action", "Comedy", "Drama", "Sci-Fi", "Horror", "ROMANCE", "THRILLER"];
const PLATFORMS = ["Netflix", "Prime Video", "Disney+", "HBO Max", "Apple TV+"];
const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020];

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (genre) params.append("genre", genre);
    if (platform) params.append("platform", platform);
    if (year) params.append("yearMin", year.toString());
    
    router.push(`/discover?${params.toString()}`);
  };

  return (
    <div className="relative max-w-5xl mx-auto px-4 -mt-12 z-20">
      <div className="bg-background/60 backdrop-blur-2xl border border-white/10 p-2 md:p-3 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row items-center gap-2">
        {/* Search Input */}
        <div className="flex-1 flex items-center gap-3 px-4 w-full">
          <Search className="text-muted-foreground w-5 h-5 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search for movies, series, or actors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground py-3"
          />
        </div>

        <div className="h-8 w-[1px] bg-border hidden md:block" />

        {/* Filters Group */}
        <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2 px-2">
          {/* Genre */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full gap-2 text-muted-foreground hover:text-foreground">
                <Filter className="w-4 h-4" />
                <span className="max-w-[80px] truncate">{genre || "Genre"}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setGenre(null)}>All Genres</DropdownMenuItem>
              {GENRES.map((g) => (
                <DropdownMenuItem key={g} onClick={() => setGenre(g)}>{g}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Platform */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full gap-2 text-muted-foreground hover:text-foreground">
                <MonitorPlay className="w-4 h-4" />
                <span className="max-w-[80px] truncate">{platform || "Platform"}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setPlatform(null)}>All Platforms</DropdownMenuItem>
              {PLATFORMS.map((p) => (
                <DropdownMenuItem key={p} onClick={() => setPlatform(p)}>{p}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Year */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full gap-2 text-muted-foreground hover:text-foreground">
                <Calendar className="w-4 h-4" />
                <span>{year || "Year"}</span>
                <ChevronDown className="w-3 h-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => setYear(null)}>All Years</DropdownMenuItem>
              {YEARS.map((y) => (
                <DropdownMenuItem key={y} onClick={() => setYear(y)}>{y}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Button */}
        <Button 
          onClick={handleSearch}
          className="w-full md:w-auto rounded-full px-8 h-12 md:h-14 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
        >
          Search
        </Button>
      </div>
    </div>
  );
}
