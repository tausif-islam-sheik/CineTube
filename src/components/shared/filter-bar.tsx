"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  title?: string;
  genres?: FilterOption[];
  sortOptions?: FilterOption[];
  years?: FilterOption[];
  statuses?: FilterOption[];
  accessTypes?: FilterOption[];
  activeFilters?: {
    genre?: string;
    sort?: string;
    year?: string;
    status?: string;
    accessType?: string;
    search?: string;
  };
  onFilterChange?: (filters: {
    genre?: string;
    sort?: string;
    year?: string;
    status?: string;
    accessType?: string;
    search?: string;
  }) => void;
  showSearch?: boolean;
  showGenre?: boolean;
  showSort?: boolean;
  showYear?: boolean;
  showStatus?: boolean;
  showAccessType?: boolean;
  resultsCount?: number;
  className?: string;
}

export function FilterBar({
  title,
  genres = [],
  sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "rating", label: "Top Rated" },
    { value: "popular", label: "Most Watched" },
    { value: "az", label: "A-Z" },
  ],
  years = [],
  statuses = [],
  accessTypes = [
    { value: "free", label: "Free" },
    { value: "premium", label: "Premium" },
  ],
  activeFilters = {},
  onFilterChange,
  showSearch = true,
  showGenre = true,
  showSort = true,
  showYear = false,
  showStatus = false,
  showAccessType = false,
  resultsCount,
  className,
}: FilterBarProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(activeFilters.search || "");

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    onFilterChange?.({ ...activeFilters, search: value });
  };

  const activeFilterCount = Object.entries(activeFilters).filter(
    ([key, value]) => key !== "sort" && value && value !== "all"
  ).length;

  return (
    <div
      className={cn(
        "sticky top-16 z-40 bg-background/80 backdrop-blur-xl border-y border-white/10 py-3 md:py-4 shadow-lg shadow-black/5",
        className
      )}
    >
      <div className="max-w-8xl mx-auto px-4 lg:px-10">
        {/* Desktop & Tablet (md+) Filter Bar */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          {/* Title on left - increased size */}
          {title && (
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black shrink-0 tracking-tight">{title}</h1>
          )}

          {/* Search in middle - centered */}
          {showSearch && (
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-sm lg:max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
                <Input
                  placeholder="Search movies..."
                  value={localSearch}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 h-9 md:h-10 lg:h-11 bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all w-full"
                />
              </div>
            </div>
          )}

          {/* Filters on right side */}
          <div className="flex items-center gap-1 md:gap-1.5 lg:gap-2 shrink-0 ml-auto">
            {showGenre && genres.length > 0 && (
              <Select
                value={activeFilters.genre || "all"}
                onValueChange={(value) =>
                  onFilterChange?.({ ...activeFilters, genre: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger className="w-[100px] md:w-28 lg:w-35 h-9 md:h-10 lg:h-11 text-xs md:text-sm bg-muted/30 border-0 hover:bg-muted/50 transition-colors">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre.value} value={genre.value}>
                      {genre.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {showAccessType && (
              <Select
                value={activeFilters.accessType || "all"}
                onValueChange={(value) =>
                  onFilterChange?.({ ...activeFilters, accessType: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger className="w-[100px] md:w-28 lg:w-35 h-9 md:h-10 lg:h-11 text-xs md:text-sm bg-muted/30 border-0 hover:bg-muted/50 transition-colors">
                  <SelectValue placeholder="Access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Access</SelectItem>
                  {accessTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {showYear && years.length > 0 && (
              <Select
                value={activeFilters.year || "all"}
                onValueChange={(value) =>
                  onFilterChange?.({ ...activeFilters, year: value === "all" ? undefined : value })
                }
              >
                <SelectTrigger className="w-20 md:w-24 lg:w-30 h-9 md:h-10 lg:h-11 text-xs md:text-sm bg-muted/30 border-0 hover:bg-muted/50 transition-colors">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value}>
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 md:ml-2 text-muted-foreground hover:text-foreground hover:bg-muted h-9 md:h-10 lg:h-11 px-2 md:px-3 transition-colors"
              onClick={() =>
                onFilterChange?.({
                  genre: undefined,
                  sort: activeFilters?.sort,
                  year: undefined,
                  status: undefined,
                  accessType: undefined,
                  search: "",
                })
              }
            >
              <X className="w-4 h-4 md:mr-1" />
              <span className="hidden lg:inline">Clear</span>
            </Button>
          )}
        </div>

        {/* Mobile Filter Bar (< md) */}
        <div className="md:hidden space-y-2.5">
          {/* Mobile Header with Title */}
          <div className="flex items-center justify-between">
            {title && (
              <h1 className="text-xl font-bold">{title}</h1>
            )}
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-8 px-2"
                onClick={() =>
                  onFilterChange?.({
                    genre: undefined,
                    sort: activeFilters?.sort,
                    year: undefined,
                    status: undefined,
                    accessType: undefined,
                    search: "",
                  })
                }
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Mobile Search */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70" />
              <Input
                placeholder="Search movies..."
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-10 bg-muted/50 border-0 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          )}

          {/* Mobile Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            <Button
              variant={isMobileFiltersOpen ? "default" : "outline"}
              size="sm"
              className="shrink-0 h-8 text-xs rounded-full border-muted-foreground/20"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1.5 bg-primary/20 text-primary text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Quick Filter Chips */}
            {activeFilters.genre && (
              <Button
                variant="secondary"
                size="sm"
                className="shrink-0 h-8 text-xs rounded-full pr-2"
                onClick={() => onFilterChange?.({ ...activeFilters, genre: undefined })}
              >
                {genres.find(g => g.value === activeFilters.genre)?.label}
                <X className="w-3 h-3 ml-1.5 opacity-60" />
              </Button>
            )}

            {activeFilters.accessType && (
              <Button
                variant="secondary"
                size="sm"
                className="shrink-0 h-8 text-xs rounded-full pr-2"
                onClick={() => onFilterChange?.({ ...activeFilters, accessType: undefined })}
              >
                {accessTypes.find(t => t.value === activeFilters.accessType)?.label}
                <X className="w-3 h-3 ml-1.5 opacity-60" />
              </Button>
            )}

            {activeFilters.year && (
              <Button
                variant="secondary"
                size="sm"
                className="shrink-0 h-8 text-xs rounded-full pr-2"
                onClick={() => onFilterChange?.({ ...activeFilters, year: undefined })}
              >
                {years.find(y => y.value === activeFilters.year)?.label}
                <X className="w-3 h-3 ml-1.5 opacity-60" />
              </Button>
            )}
          </div>

          {/* Mobile Filter Dropdown Panel */}
          {isMobileFiltersOpen && (
            <div className="space-y-2.5 pt-3 border-t border-border/50 bg-muted/20 rounded-xl p-3 animate-in slide-in-from-top-1 duration-200">
              {showGenre && genres.length > 0 && (
                <Select
                  value={activeFilters.genre || "all"}
                  onValueChange={(value) =>
                    onFilterChange?.({ ...activeFilters, genre: value === "all" ? undefined : value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres.map((genre) => (
                      <SelectItem key={genre.value} value={genre.value}>
                        {genre.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {showAccessType && (
                <Select
                  value={activeFilters.accessType || "all"}
                  onValueChange={(value) =>
                    onFilterChange?.({ ...activeFilters, accessType: value === "all" ? undefined : value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Access Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Access Types</SelectItem>
                    {accessTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {showYear && years.length > 0 && (
                <Select
                  value={activeFilters.year || "all"}
                  onValueChange={(value) =>
                    onFilterChange?.({ ...activeFilters, year: value === "all" ? undefined : value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
