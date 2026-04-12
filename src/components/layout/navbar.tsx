"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Search, Popcorn, User, LogOut, Heart,
  Shield, Menu, X, Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "@/lib/auth-client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Movies" },
  { href: "/discover?type=series", label: "Series" },
  { href: "/discover?pricing=FREE", label: "Free" },
];

export function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Clear search when leaving discover
  useEffect(() => {
    if (pathname !== "/discover") setSearchQuery("");
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
    <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-xl border-b border-border">
      <div className="max-w-screen-xl mx-auto flex h-14 items-center px-4 md:px-8">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-1.5 select-none shrink-0 mr-10">
          <Popcorn className="h-5 w-5 text-primary" />
          <span className="font-black text-foreground tracking-tight text-lg">
            CINE<span className="text-primary">TUBE</span>
            <span className="text-primary text-xl leading-none">+</span>
          </span>
        </Link>

        {/* ── Center Nav Links (desktop) ── */}
        <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded transition-colors",
                isActive(href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </Link>
          ))}

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
                  placeholder="Search movies, shows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); }
                    if (e.key === "Enter" && searchQuery.trim()) {
                      router.push(`/discover?q=${encodeURIComponent(searchQuery)}`);
                      setSearchOpen(false);
                    }
                  }}
                  className="h-8 w-52 bg-muted border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/50 text-sm"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
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
                className="hidden md:flex h-8 gap-1.5 text-yellow-400 hover:text-yellow-400 hover:bg-yellow-400/10 border border-yellow-400/25 px-3"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Button>
            </Link>
          )}

          {/* Auth section */}
          {!searchOpen && (
            <>
              {isPending ? (
                <div className="h-8 w-16 rounded bg-muted animate-pulse" />
              ) : session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 border border-border rounded-full pl-3 pr-1 py-1 hover:border-muted-foreground transition-colors group">
                      <User className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <span className="text-foreground/80 text-sm group-hover:text-foreground transition-colors max-w-[90px] truncate hidden sm:block">
                        {session.user.name?.split(" ")[0]}
                      </span>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                          {session.user.name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuLabel className="font-normal text-xs pb-1">
                      <span className="block font-semibold text-sm">{session.user.name}</span>
                      <span className="text-muted-foreground text-xs">{session.user.email}</span>
                      {isAdmin && (
                        <span className="inline-flex mt-1.5 items-center gap-1 px-1.5 py-0.5 bg-yellow-400/10 text-yellow-400 rounded text-[10px] font-bold uppercase">
                          <Shield className="w-2.5 h-2.5" /> Admin
                        </span>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => router.push("/watchlist")}>
                      <Heart className="w-4 h-4" /> Watchlist
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => router.push("/profile")}>
                      <User className="w-4 h-4" /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => router.push("/pricing")}>
                      <Gift className="w-4 h-4" /> Upgrade Plan
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-yellow-500 focus:text-yellow-500 focus:bg-yellow-500/10 gap-2 cursor-pointer" onClick={() => router.push("/admin")}>
                          <Shield className="w-4 h-4" /> Admin Dashboard
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-400 hover:text-red-400 focus:text-red-400 focus:bg-red-400/10 gap-2 cursor-pointer"
                      onClick={async () => { await signOut(); router.push("/login"); }}
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <button className="flex items-center gap-2 border border-border rounded-full px-4 py-1.5 text-sm text-foreground/80 hover:text-foreground hover:border-muted-foreground transition-colors font-medium">
                    <User className="w-3.5 h-3.5" />
                    Login
                  </button>
                </Link>
              )}
            </>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border px-4 pb-4 pt-2 space-y-1 animate-in slide-in-from-top-2 fade-in duration-150">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive(href) ? "text-foreground bg-muted" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {label}
            </Link>
          ))}

          {isAdmin && (
            <Link href="/admin" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-yellow-400 hover:bg-yellow-400/10 transition-colors">
              Admin Dashboard
            </Link>
          )}
          {!session && (
            <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
