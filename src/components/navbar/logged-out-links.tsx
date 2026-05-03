"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LoggedOutLinksProps {
  isActive: (href: string) => boolean;
  isOverlay: boolean;
  onNavigate?: () => void;
}

const LOGGED_OUT_LINKS = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/trailers", label: "Trailers" },
  { href: "/free", label: "Free to Watch" },
];

export function LoggedOutLinks({ isActive, isOverlay, onNavigate }: LoggedOutLinksProps) {
  return (
    <>
      {LOGGED_OUT_LINKS.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={cn(
            "px-3 py-1.5 text-sm font-semibold rounded-md transition-colors relative",
            isActive(href)
              ? isOverlay
                ? "text-white underline underline-offset-10 decoration-2"
                : "text-primary underline underline-offset-10 decoration-2"
              : isOverlay
                ? "text-white/95 hover:text-white"
                : "text-muted-foreground hover:text-foreground"
          )}
        >
          {label}
        </Link>
      ))}
    </>
  );
}

export { LOGGED_OUT_LINKS };
