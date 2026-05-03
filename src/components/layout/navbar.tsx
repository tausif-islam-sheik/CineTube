/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, Popcorn, Shield, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

// Navbar Components
import { LoggedOutLinks } from "@/components/navbar/logged-out-links";
import { LoggedInLinks } from "@/components/navbar/logged-in-links";
import { AuthButtons } from "@/components/navbar/auth-buttons";
import { UserDropdown } from "@/components/navbar/user-dropdown";
import { MobileNav } from "@/components/navbar/mobile-nav";

export function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const isHome = pathname === "/";
  const isOverlay = isHome && !isScrolled;

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Clear search when leaving discover
  useEffect(() => {
    if (pathname !== "/discover") {
      requestAnimationFrame(() => setSearchQuery(""));
    }
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      // Keep hero navbar transparent longer at top section.
      setIsScrolled(window.scrollY > 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Debounce search — only fires while typing, never on initial render
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        router.push(`/discover?q=${encodeURIComponent(searchQuery)}`);
      } else if (pathname === "/discover") {
        router.push("/discover");
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    if (href === "/") return pathname === "/";
    return pathname.startsWith(base);
  };

  return (
    <nav
      className={cn(
        "top-0 z-50 w-full transition-colors",
        isOverlay ? "absolute inset-x-0" : "sticky",
        isOverlay
          ? "bg-transparent border-b border-transparent"
          : "sticky border border-white/20 bg-background/60 backdrop-blur-xl shadow-lg"
      )}
    >
      <div className="max-w-8xl mx-auto flex h-16 items-center px-4 md:px-10">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-1.5 select-none shrink-0 mr-8">
          <Popcorn className="h-6 w-6 text-primary" />
          <span className={cn("font-black tracking-tight text-xl", isOverlay ? "text-white" : "text-foreground")}>
            CINE<span className="text-primary">TUBE</span>
            <span className="text-primary text-xl leading-none">+</span>
          </span>
        </Link>

        {/* ── Center Nav Links (desktop) ── */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {isPending ? (
            // Loading skeleton for nav links
            <div className="flex items-center gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-5 w-16 rounded bg-muted animate-pulse" />
              ))}
            </div>
          ) : session ? (
            <LoggedInLinks isActive={isActive} isOverlay={isOverlay} />
          ) : (
            <LoggedOutLinks isActive={isActive} isOverlay={isOverlay} />
          )}
        </div>

        {/* ── Right side ── */}
        <div className="flex items-center gap-2 ml-auto shrink-0">

          {/* Search toggle */}
          <div className="relative flex items-center">
            {searchOpen ? (
              <div className="flex items-center gap-2 animate-in slide-in-from-right-4 fade-in duration-150">
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
                    if (e.key === "Enter" && searchQuery.trim()) {
                      router.push(`/discover?q=${encodeURIComponent(searchQuery)}`);
                      setSearchOpen(false);
                    }
                  }}
                  className={cn(
                    "h-8 w-32 sm:w-52 focus-visible:ring-primary/50 text-sm",
                    isOverlay
                      ? "bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      : "bg-background border-border text-foreground placeholder:text-muted-foreground"
                  )}
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className={cn(
                    "transition-colors",
                    isOverlay ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className={cn(
                  "p-2 transition-colors rounded-lg",
                  isOverlay
                    ? "text-white/75 hover:text-white hover:bg-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Admin link */}
          {isAdmin && !searchOpen && (
            <Link href="/admin">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "hidden md:flex h-8 gap-1.5 px-3",
                  isOverlay
                    ? "text-yellow-400 hover:text-yellow-400 hover:bg-yellow-600 border border-yellow-600"
                    : "text-yellow-400 hover:text-yellow-400 hover:bg-yellow-600 border border-yellow-400"
                )}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Button>
            </Link>
          )}

          {/* Theme Toggle */}
          {!searchOpen && (
            <ThemeToggle isOverlay={isOverlay} />
          )}

          {/* Auth section */}
          {!searchOpen && (
            <>
              {isPending ? (
                <div className="h-8 w-16 rounded bg-muted animate-pulse hidden sm:block" />
              ) : session ? (
                <UserDropdown session={session} isOverlay={isOverlay} isAdmin={isAdmin} />
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <AuthButtons isOverlay={isOverlay} />
                </div>
              )}
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className={cn(
              "md:hidden p-2 transition-colors",
              isOverlay ? "text-white/75 hover:text-white" : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <MobileNav
          session={session}
          isAdmin={isAdmin}
          isActive={isActive}
          onClose={() => setMobileOpen(false)}
        />
      )}
    </nav>
  );
}