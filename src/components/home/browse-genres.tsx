/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { 
  Swords, 
  Drama, 
  Ghost, 
  Rocket, 
  Heart, 
  Film, 
  Palette, 
  Laugh,
  Search,
  Footprints,
  Sparkles,
  Flame
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ===== SECTION: Browse by Genre / Categories ===== */
/* Table of Contents:
   - Genre data with icons and colors
   - GenreCard Component
   - BrowseGenres Section Component
*/

const GENRES = [
  { 
    name: "Action", 
    icon: Swords, 
    color: "from-red-500 to-orange-600",
    bgColor: "bg-red-500/10",
    description: "Explosive thrills"
  },
  { 
    name: "Drama", 
    icon: Drama, 
    color: "from-purple-500 to-indigo-600",
    bgColor: "bg-purple-500/10",
    description: "Emotional stories"
  },
  { 
    name: "Horror", 
    icon: Ghost, 
    color: "from-slate-700 to-slate-900",
    bgColor: "bg-slate-500/10",
    description: "Spine-chilling"
  },
  { 
    name: "Sci-Fi", 
    icon: Rocket, 
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-500/10",
    description: "Future worlds"
  },
  { 
    name: "Romance", 
    icon: Heart, 
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-500/10",
    description: "Love stories"
  },
  { 
    name: "Documentary", 
    icon: Film, 
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    description: "Real stories"
  },
  { 
    name: "Animation", 
    icon: Palette, 
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-500/10",
    description: "Family fun"
  },
  { 
    name: "Comedy", 
    icon: Laugh, 
    color: "from-green-400 to-emerald-600",
    bgColor: "bg-green-500/10",
    description: "Laugh out loud"
  },
  { 
    name: "Thriller", 
    icon: Search, 
    color: "from-violet-600 to-purple-800",
    bgColor: "bg-violet-500/10",
    description: "Edge of seat"
  },
  { 
    name: "Adventure", 
    icon: Footprints, 
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10",
    description: "Epic journeys"
  },
  { 
    name: "Fantasy", 
    icon: Sparkles, 
    color: "from-indigo-400 to-purple-600",
    bgColor: "bg-indigo-500/10",
    description: "Magical realms"
  },
  { 
    name: "Crime", 
    icon: Flame, 
    color: "from-red-600 to-rose-800",
    bgColor: "bg-red-600/10",
    description: "Mystery & law"
  },
];

interface GenreCardProps {
  genre: typeof GENRES[0];
  index: number;
}

function GenreCard({ genre, index }: GenreCardProps) {
  const router = useRouter();
  const Icon = genre.icon;

  return (
    <button
      onClick={() => router.push(`/discover?genre=${genre.name.toLowerCase()}`)}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-500",
        "border border-border hover:border-transparent",
        "hover:scale-[1.02] hover:shadow-xl",
        genre.bgColor
      )}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Gradient Background on Hover */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br",
        genre.color
      )} />

      {/* Content */}
      <div className="relative z-10">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-500",
          "bg-gradient-to-br",
          genre.color,
          "group-hover:bg-white/20 group-hover:scale-110"
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>

        <h3 className="text-lg font-bold text-foreground group-hover:text-white transition-colors duration-500">
          {genre.name}
        </h3>
        <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors duration-500">
          {genre.description}
        </p>
      </div>

      {/* Arrow indicator */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </button>
  );
}

export function BrowseGenres() {
  return (
    <section id="genres" className="container mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          Explore
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
          Browse by Genre
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto md:text-lg text-balance">
          Find your next favorite movie or series by exploring our curated genre collections
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {GENRES.map((genre, index) => (
          <GenreCard key={genre.name} genre={genre} index={index} />
        ))}
      </div>
    </section>
  );
}
