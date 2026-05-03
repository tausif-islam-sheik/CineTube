"use client";

import { Play, Check, X, CreditCard, Clock, Download, Tv, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MovieCard } from "@/components/shared/movie-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useMovies } from "@/hooks/use-movies";
import { cn } from "@/lib/utils";
import Link from "next/link";

const FREE_FEATURES = [
  { icon: Play, label: "Watch 100+ movies & series" },
  { icon: Clock, label: "Limited ad-supported viewing" },
  { icon: Tv, label: "Stream on any device" },
  { icon: Sparkles, label: "New titles added monthly" },
];

const COMPARISON_FEATURES = [
  { feature: "Movies & TV Series", free: "100+ titles", premium: "10,000+ titles" },
  { feature: "Video Quality", free: "720p HD", premium: "4K Ultra HD + HDR" },
  { feature: "Ads", free: "Limited ads", premium: "Ad-free" },
  { feature: "Downloads", free: false, premium: true },
  { feature: "Multiple Devices", free: "1 device", premium: "Up to 4 devices" },
  { feature: "New Releases", free: "Delayed access", premium: "Day-one access" },
  { feature: "Exclusive Content", free: false, premium: true },
  { feature: "Offline Viewing", free: false, premium: true },
];

function FeatureIcon({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-green-500" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default function FreeToWatchPage() {
  const { data: moviesData, isLoading } = useMovies({
    sortBy: "createdAt",
    order: "desc",
  });

  const allMovies = moviesData?.pages?.flatMap((page) => page.data) || [];
  const freeMovies = allMovies.filter((m) => m.pricing === "FREE").slice(0, 8);
  const freeSeries = allMovies.slice(0, 8); // Mock series data
  const limitedTime = allMovies.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent" />

        <div className="relative max-w-8xl mx-auto px-4 md:px-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4" />
            No Credit Card Required
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
            Watch Free. <span className="text-green-500">No Strings Attached.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Enjoy hundreds of movies and TV shows for free. Create an account
            to start watching instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 bg-green-500 hover:bg-green-600" asChild>
              <Link href="/register">Start Watching Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8"
              asChild
            >
              <Link href="/pricing">Compare Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-8xl mx-auto px-4 md:px-10">
          <SectionHeading
            title="What's Included"
            subtitle="Everything you get with a free account"
            className="text-center [&>*]:mx-auto"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {FREE_FEATURES.map((feature) => (
              <div
                key={feature.label}
                className="p-6 rounded-xl bg-background border border-border hover:border-green-500/30 transition-colors"
              >
                <FeatureIcon icon={feature.icon} label={feature.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-8xl mx-auto px-4 md:px-10 py-16 space-y-20">
        {/* Free Movies */}
        <section>
          <SectionHeading
            title="Free Movies"
            subtitle="Watch these movies at no cost"
            action={{ label: "Browse All", href: "/movies" }}
          />
          {isLoading ? (
            <LoadingSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {freeMovies.length > 0 ? (
                freeMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} isFree variant="portrait" />
                ))
              ) : (
                allMovies.slice(0, 8).map((movie) => (
                  <MovieCard key={movie.id} movie={movie} isFree variant="portrait" />
                ))
              )}
            </div>
          )}
        </section>

        {/* Free TV Series */}
        <section>
          <SectionHeading
            title="Free TV Series"
            subtitle="Binge-watch these series for free"
            action={{ label: "Browse All", href: "/series" }}
          />
          {isLoading ? (
            <LoadingSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {allMovies.slice(8, 16).map((movie, i) => (
                <div key={movie.id} className="relative">
                  <MovieCard movie={movie} isFree variant="portrait" />
                  {/* Episode count badge */}
                  <div className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-bold">
                    {Math.floor(Math.random() * 20 + 5)} Episodes
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Free vs Premium Comparison */}
        <section>
          <SectionHeading
            title="Free vs Premium"
            subtitle="Compare what you get with each plan"
            className="text-center [&>*]:mx-auto"
          />
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm">
                        Free
                      </span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                        Premium
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((item, i) => (
                  <tr
                    key={item.feature}
                    className={cn(
                      "border-b border-border/50",
                      i % 2 === 0 && "bg-muted/30"
                    )}
                  >
                    <td className="py-4 px-4 text-sm">{item.feature}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof item.free === "boolean" ? (
                        item.free ? (
                          <Check className="w-5 h-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        <span
                          className={cn(
                            "text-sm",
                            item.free.includes("Limited") || item.free.includes("Delayed")
                              ? "text-muted-foreground"
                              : "text-green-500 font-medium"
                          )}
                        >
                          {item.free}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof item.premium === "boolean" ? (
                        item.premium ? (
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-medium text-primary">
                          {item.premium}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Limited Time Free */}
        <section className="p-6 md:p-10 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20">
          <SectionHeading
            title="Limited Time Free"
            subtitle="These titles are free for a limited time only"
            badge="fire"
          />
          {isLoading ? (
            <LoadingSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {limitedTime.map((movie) => (
                <div key={movie.id} className="relative">
                  <MovieCard movie={movie} isFree variant="portrait" />
                  {/* Countdown badge */}
                  <div className="absolute top-2 right-2 z-10 bg-amber-500 px-2 py-1 rounded text-white text-xs font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.floor(Math.random() * 24 + 1)}h left
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Upgrade CTA */}
        <section className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80" />
          <div className="relative px-8 py-12 md:py-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                  Want More? Upgrade to Premium
                </h2>
                <p className="text-white/80">
                  Get unlimited access to 10,000+ movies and series.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="px-8" asChild>
                  <Link href="/pricing">View Pricing</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/register">Start Free Trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
