/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useEffect, useState } from "react";
import { Flame, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Movie } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/* ===== SECTION: Trending Now ===== */
/* Table of Contents:
   - TrendingCard Component
   - TrendingNow Section Component
   - Features: Horizontal scroll, fire badge, IMDB rating, drag support
*/

interface TrendingCardProps {
  movie: Movie;
  index: number;
}

function TrendingCard({ movie, index }: TrendingCardProps) {
  const genre = movie.genre?.[0] || "Drama";
  
  return (
    <Link href={`/movie/${movie.id}`} className="block">
      <div className="group relative rounded-xl overflow-hidden cursor-pointer shrink-0 bg-muted/20 border border-white/5 hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:z-10 hover:shadow-[0_0_30px_rgba(230,0,18,0.2)] aspect-[2/3] w-36 sm:w-44 md:w-52">
        {/* Fire Badge - Top 3 get special treatment */}
        {index < 3 && (
          <div className={cn(
            "absolute top-2 left-2 z-20 px-2 py-1 rounded-md text-white text-[10px] font-black uppercase tracking-wide flex items-center gap-1 shadow-lg",
            index === 0 ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
            index === 1 ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900" :
            "bg-gradient-to-r from-amber-600 to-amber-700"
          )}>
            <Flame className="w-3 h-3" />
            #{index + 1} Trending
          </div>
        )}

        {/* Image */}
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.9] group-hover:brightness-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground p-4 text-center text-sm bg-gradient-to-br from-slate-900 to-slate-800">
            {movie.title}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div className="absolute bottom-0 inset-x-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-white text-sm font-bold leading-tight line-clamp-1 mb-2">
            {movie.title}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5 h-auto">
              {genre}
            </Badge>
            <div className="flex items-center gap-0.5 ml-auto">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-yellow-400 text-[10px] font-bold">
                {movie.averageRating?.toFixed(1) ?? "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface TrendingNowProps {
  movies: Movie[];
}

export function TrendingNow({ movies }: TrendingNowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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
      scrollRef.current.scrollBy({
        left: direction === "left" ? -400 : 400,
        behavior: "smooth",
      });
    }
  };

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section id="trending" className="py-12 md:py-16">
      <div className="px-4 md:px-12 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold tracking-wide text-white drop-shadow-lg">
              Trending Now
            </h2>
            <p className="text-white/70 text-sm drop-shadow-md">Hot titles everyone&apos;s watching</p>
          </div>
        </div>
      </div>

      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className={cn(
            "absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300",
            canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
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
            canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={cn(
            "flex gap-4 overflow-x-auto px-4 md:px-12 pb-2 scrollbar-hide scroll-smooth",
            isDragging && "cursor-grabbing"
          )}
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          {movies.slice(0, 12).map((movie, index) => (
            <div key={movie.id} className="flex-shrink-0">
              <TrendingCard movie={movie} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
