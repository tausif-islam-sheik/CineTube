"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { NavBadge } from "./nav-badge";

interface LoggedInLinksProps {
  isActive: (href: string) => boolean;
  isOverlay: boolean;
  onNavigate?: () => void;
}

type BadgeType = "dot" | "sparkle" | "fire" | null;

interface NavLink {
  href: string;
  label: string;
  badge: BadgeType;
}

const LOGGED_IN_LINKS: NavLink[] = [
  { href: "/", label: "Home", badge: null },
  { href: "/movies", label: "Movies", badge: null },
  { href: "/series", label: "Series", badge: null },
  { href: "/recommended", label: "For You", badge: null },
  { href: "/new-releases", label: "New Drops", badge: "dot" },
  { href: "/binge", label: "Binge Zone", badge: null },
];

export function LoggedInLinks({ isActive, isOverlay, onNavigate }: LoggedInLinksProps) {
  return (
    <>
      {LOGGED_IN_LINKS.map(({ href, label, badge }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={cn(
            "px-3 py-1.5 text-sm font-semibold rounded-md transition-colors relative inline-flex items-center gap-1.5",
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
          {badge && <NavBadge type={badge} />}
        </Link>
      ))}
    </>
  );
}

export { LOGGED_IN_LINKS };
export type { BadgeType, NavLink };
