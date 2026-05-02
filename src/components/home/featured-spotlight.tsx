/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Play, Plus, Star, Clock, Calendar, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Movie } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ===== SECTION: Featured / Editor's Pick (Spotlight) ===== */
/* Table of Contents:
   - FeaturedSpotlight Component
   - Features: Auto-rotating carousel, blur backdrop, CTAs
*/

interface FeaturedSpotlightProps {
  movies: Movie[];
}

export function FeaturedSpotlight({ movies }: FeaturedSpotlightProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const featuredMovies = movies.slice(0, 5);
  const currentMovie = featuredMovies[currentIndex];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  }, [featuredMovies.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || featuredMovies.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, featuredMovies.length]);

  if (!featuredMovies || featuredMovies.length === 0) return null;

  const genre = currentMovie.genre?.[0] || "Drama";
  const secondaryGenre = currentMovie.genre?.[1] || "Thriller";

  return (
    <section id="featured" className="container mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          Editor&apos;s Choice
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
          Featured This Week
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
          Handpicked cinematic gems our editors think you&apos;ll love
        </p>
      </div>

      <div 
        className="relative rounded-3xl overflow-hidden min-h-[400px] md:min-h-[600px]"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Background Image with Blur */}
        <div className="absolute inset-0">
          {currentMovie.backdropUrl || currentMovie.posterUrl ? (
            <img
              src={currentMovie.backdropUrl || currentMovie.posterUrl}
              alt={currentMovie.title}
              className="w-full h-full object-cover blur-sm scale-110 brightness-[0.4] transition-all duration-1000"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-primary/20 to-slate-900" />
          )}
        </div>

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col md:flex-row items-end md:items-center p-4 sm:p-6 md:p-12 lg:p-16 lg:px-28 min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
          {/* Left: Info */}
          <div className="flex-1 space-y-4 md:space-y-6 max-w-2xl w-full">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-primary text-white border-0 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Featured Pick
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white bg-white/10">
                {genre}
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white bg-white/10">
                {secondaryGenre}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-tight mt-10 md:mt-6">
              {currentMovie.title}
            </h3>

            {/* Meta Row */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-white/80 text-xs md:text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-white">{currentMovie.averageRating?.toFixed(1) ?? "N/A"}</span>
                <span>/10</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{currentMovie.releaseYear || "2024"}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-white/40" />
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{currentMovie.duration ? `${Math.floor(currentMovie.duration / 60)}h ${currentMovie.duration % 60}m` : "2h 15m"}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/70 text-sm md:text-base lg:text-lg line-clamp-2 md:line-clamp-3 max-w-xl">
              {currentMovie.plot || "An epic cinematic journey that pushes the boundaries of storytelling. Experience breathtaking visuals and a gripping narrative that will keep you on the edge of your seat."}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4 pt-6">
              <Link href={`/movie/${currentMovie.id}`}>
                <Button 
                  size="default"
                  className="bg-primary hover:bg-primary/90 text-white rounded-lg md:rounded-xl px-5 md:px-8 h-11 md:h-14 text-sm md:text-base font-bold"
                >
                  <Play className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 fill-current" />
                  Watch Now
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="default"
                className="border-white/30 text-white hover:bg-white/10 rounded-lg md:rounded-xl px-4 md:px-6 h-11 md:h-14 text-sm md:text-base font-bold bg-transparent"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2" />
                <span className="hidden sm:inline">Add to Watchlist</span>
                <span className="sm:hidden">Watchlist</span>
              </Button>
            </div>
          </div>

          {/* Right: Poster (hidden on mobile) */}
          <div className="hidden lg:block ml-12">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              {currentMovie.posterUrl ? (
                <img
                  src={currentMovie.posterUrl}
                  alt={currentMovie.title}
                  className="w-64 h-96 object-cover"
                />
              ) : (
                <div className="w-64 h-96 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <span className="text-white/50 font-bold">{currentMovie.title}</span>
                </div>
              )}
              {/* Gloss effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all duration-300 text-white"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all duration-300 text-white"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "w-8 bg-primary" 
                  : "w-2 bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
