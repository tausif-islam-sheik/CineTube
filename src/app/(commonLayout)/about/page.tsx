"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <section className="container mx-auto px-4 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            About CineTube
          </p>
          <h1 className="text-3xl font-black tracking-tight md:text-5xl">
            Built for movie and series enthusiasts
          </h1>
          <p className="text-muted-foreground md:text-lg">
            CineTube is a modern rating and streaming discovery portal where users can
            find great titles, write thoughtful reviews, save watchlists, and follow
            what is trending right now.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-2 font-semibold">Community Reviews</h2>
            <p className="text-sm text-muted-foreground">
              Share ratings and opinions to help others discover quality content.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-2 font-semibold">Smart Discovery</h2>
            <p className="text-sm text-muted-foreground">
              Search and filter by genre, platform, popularity, and release year.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-2 font-semibold">Premium Experience</h2>
            <p className="text-sm text-muted-foreground">
              Upgrade for full access and uninterrupted viewing across devices.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/discover">Explore Catalog</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/pricing">See Subscription Plans</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
