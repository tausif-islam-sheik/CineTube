// Section: Movie Row (Netflix Style) | Location: components/home/movie-row.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/types";
import { cn } from "@/lib/utils";
import { MovieCard } from "./movie-card";

interface MovieRowProps {
  title: string;
  icon?: React.ReactNode;
  movies: Movie[];
  subtitle?: string;
  isFirstNew?: boolean;
  variant?: "portrait" | "landscape";
}

export function MovieRow({
  title,
  icon,
  movies,
  subtitle,
  isFirstNew = false,
  variant = "portrait",
}: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = variant === "landscape" ? 400 : 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="space-y-4">
      <div className="px-4 md:px-12">
        <div className="flex items-center gap-3">
          {icon && <span className="text-foreground/80">{icon}</span>}
          <h2 className="text-lg md:text-2xl font-bold tracking-wide text-foreground">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
        )}
      </div>

      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300",
            canScrollLeft
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className={cn(
            "absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300",
            canScrollRight
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto px-4 md:px-12 pb-2 scrollbar-hide scroll-smooth"
        >
          {movies.map((m, idx) => (
            <div key={m.id} className="flex-shrink-0">
              <MovieCard
                movie={m}
                isNew={isFirstNew && idx === 0}
                variant={variant}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
