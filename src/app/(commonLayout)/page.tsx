"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import apiClient from "@/lib/axios";
import { Movie } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import {
  HeroSpotlight,
  HeroSpotlightSkeleton,
  MovieRowSkeleton,
  TrendingNow,
  BrowseGenres,
  NewReleases,
  PlatformStats,
  FeaturedSpotlight,
  Testimonials,
  HowItWorks,
  PricingSection,
  FAQSection,
  BlogSection,
  Newsletter,
  DevicesSection,
  FinalCTA,
} from "@/components/home";

/* ─────────────────────────────────────────────
   Main HomePage
 ───────────────────────────────────────────── */
export default function HomePage() {
  const { data: session } = useSession();

  // Fetch Newly Added
  const { data: newlyAddedResp, isLoading: isLoadingNewlyAdded } = useQuery<{ data: Movie[] }>({
    queryKey: ["homepage", "newly-added"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/movies?limit=15&sortBy=createdAt&order=desc");
      return data;
    },
  });

  // Fetch Top Rated
  const { data: topRatedResp, isLoading: isLoadingTopRated } = useQuery<{ data: Movie[] }>({
    queryKey: ["homepage", "top-rated"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/movies?limit=15&sortBy=rating&order=desc");
      return data;
    },
  });

  // Fetch Editor's Picks (High Rated in specific genres or just high rated)
  const { data: editorPicksResp, isLoading: isLoadingEditorPicks } = useQuery<{ data: Movie[] }>({
    queryKey: ["homepage", "editor-picks"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/movies?limit=12&minRating=8&sortBy=rating&order=desc");
      return data;
    },
  });

  const isLoadingHero = isLoadingTopRated || isLoadingNewlyAdded;
  const newlyAdded = newlyAddedResp?.data ?? [];
  const topRated = (topRatedResp?.data ?? []).filter((m: Movie) => (m.averageRating ?? 0) >= 7);
  const editorPicks = editorPicksResp?.data ?? [];
  const heroMovie = topRated[0] || newlyAdded[0];
  
  // State for selected hero movie (for thumbnail click feature)
  const [selectedHeroMovie, setSelectedHeroMovie] = useState<Movie | null>(null);
  
  // Use selected movie if set, otherwise fall back to hero movie from data
  const displayHeroMovie = selectedHeroMovie || heroMovie;

  // Deduplicate spotlight movies (prevent hero movie appearing twice)
  const allSpotlightMovies = [heroMovie, ...topRated, ...newlyAdded].filter(Boolean);
  const uniqueSpotlightMovies = allSpotlightMovies.filter(
    (movie, index, self) => self.findIndex((m) => m.id === movie.id) === index
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground pb-20">
      {/* ── HERO ── */}
      {isLoadingHero ? (
        <HeroSpotlightSkeleton />
      ) : displayHeroMovie ? (
        <HeroSpotlight
          movie={displayHeroMovie}
          spotlightMovies={uniqueSpotlightMovies}
          onMovieSelect={setSelectedHeroMovie}
        />
      ) : null}



      {/* ── Trending Now (Floats at bottom of hero) ── */}
      {isLoadingTopRated ? (
        <div className="relative z-20 -mt-32">
          <MovieRowSkeleton title="Trending Now" variant="portrait" />
        </div>
      ) : topRated.length > 0 && (
        <div className="relative z-20 -mt-44">
          <TrendingNow movies={topRated} />
        </div>
      )}

      {/* ── Browse by Genre ── */}
      <BrowseGenres />

      {/* ── New Releases ── */}
      {isLoadingNewlyAdded ? (
        <div className="container mx-auto px-4 md:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[16/9] rounded-xl" />
            ))}
          </div>
        </div>
      ) : newlyAdded.length > 0 && (
        <NewReleases movies={newlyAdded} />
      )}

      {/* ── Platform Statistics ── */}
      <PlatformStats />

      {/* ── Featured / Editor's Pick ── */}
      {isLoadingEditorPicks ? (
        <div className="container mx-auto px-4 md:px-8 py-16">
          <Skeleton className="w-full h-[400px] rounded-3xl" />
        </div>
      ) : editorPicks.length > 0 && (
        <FeaturedSpotlight movies={editorPicks} />
      )}

      {/* ── User Testimonials ── */}
      <Testimonials />

      {/* ── How It Works ── */}
      <HowItWorks />

      {/* ── Pricing Plans ── */}
      <PricingSection />

      {/* ── FAQ ── */}
      <FAQSection />

      {/* ── Blog / What's New ── */}
      <BlogSection />

      {/* ── Newsletter ── */}
      <Newsletter />

      {/* ── Available On All Devices ── */}
      <DevicesSection />

      {/* ── Final CTA ── */}
      <FinalCTA />
    </div>
  );
}