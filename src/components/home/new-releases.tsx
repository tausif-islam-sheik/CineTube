"use client";

import { Sparkles, Star, Calendar, Play } from "lucide-react";
import { Movie } from "@/types";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/* ===== SECTION: New Releases ===== */
/* Table of Contents:
   - ReleaseCard Component with NEW badge
   - NewReleases Section Component
   - Features: Glow effect, release date, grid layout
*/

interface ReleaseCardProps {
  movie: Movie;
}

function ReleaseCard({ movie }: ReleaseCardProps) {
  const genre = movie.genre?.[0] || "Drama";
  const releaseDate = movie.releaseYear 
    ? new Date(movie.releaseYear, 0, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : "Coming Soon";

  return (
    <div className="group relative">
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
      
      <div className="relative rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-500">
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden">
          {movie.backdropUrl || movie.posterUrl ? (
            <img
              src={movie.backdropUrl || movie.posterUrl || ""}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 brightness-[0.85] group-hover:brightness-100"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-bold text-muted-foreground p-4 text-center text-sm bg-gradient-to-br from-slate-900 to-slate-800">
              {movie.title}
            </div>
          )}

          {/* NEW Badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-primary text-primary-foreground border-0 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow-lg">
              <Sparkles className="w-3 h-3 mr-1" />
              NEW
            </Badge>
          </div>

          {/* Play Button on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <Link href={`/movie/${movie.id}`}>
              <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500 shadow-2xl cursor-pointer hover:bg-primary">
                <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
              </div>
            </Link>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {movie.title}
            </h3>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{releaseDate}</span>
            </div>
            <span className="text-border">|</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-auto">
              {genre}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-foreground">
                {movie.averageRating?.toFixed(1) ?? "N/A"}
              </span>
              <span className="text-muted-foreground text-sm">/10</span>
            </div>
            <Link href={`/movie/${movie.id}`}>
              <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold hover:text-primary">
                Watch Now →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NewReleasesProps {
  movies: Movie[];
}

export function NewReleases({ movies }: NewReleasesProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <section id="new-releases" className="container mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Fresh Arrivals
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            New Releases
          </h2>
          <p className="text-muted-foreground max-w-xl">
            The latest movies and series added to our collection this week
          </p>
        </div>
        <Link 
          href="/discover?sort=newest" 
          className="text-sm font-bold text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
        >
          View All New →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.slice(0, 8).map((movie) => (
          <ReleaseCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
}
