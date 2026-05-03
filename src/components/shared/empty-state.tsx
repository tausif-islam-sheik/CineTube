"use client";

import { Film, Search, Heart, Star, Ticket, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  type?: "movies" | "search" | "watchlist" | "reviews" | "trailers" | "series";
  title?: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

const defaultContent = {
  movies: {
    icon: Film,
    title: "No movies found",
    description: "Try adjusting your filters or browse our collection.",
  },
  search: {
    icon: Search,
    title: "No results found",
    description: "Try different search terms or browse all content.",
  },
  watchlist: {
    icon: Heart,
    title: "Your watchlist is empty",
    description: "Start adding movies you want to watch later.",
  },
  reviews: {
    icon: Star,
    title: "No reviews yet",
    description: "You haven't written any reviews yet. Start watching and share your thoughts!",
  },
  trailers: {
    icon: Ticket,
    title: "No trailers available",
    description: "Check back later for new trailers.",
  },
  series: {
    icon: Tv,
    title: "No series found",
    description: "Try adjusting your filters or browse our collection.",
  },
};

export function EmptyState({
  type = "movies",
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const content = defaultContent[type];
  const Icon = content.icon;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        {title || content.title}
      </h3>
      <p className="text-muted-foreground max-w-md mb-6">
        {description || content.description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          asChild={!!action.href}
        >
          {action.href ? (
            <a href={action.href}>{action.label}</a>
          ) : (
            action.label
          )}
        </Button>
      )}
    </div>
  );
}
