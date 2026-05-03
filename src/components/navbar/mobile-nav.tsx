"use client";

import Link from "next/link";
import { User, LogOut, Heart, Star, Gift, Shield, Sparkles, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LOGGED_OUT_LINKS } from "./logged-out-links";
import { LOGGED_IN_LINKS } from "./logged-in-links";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface MobileNavProps {
  session: { user: { name?: string | null; email?: string | null; image?: string | null } } | null;
  isAdmin: boolean;
  isActive: (href: string) => boolean;
  onClose: () => void;
}

export function MobileNav({ session, isAdmin, isActive, onClose }: MobileNavProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    onClose();
    router.push("/");
  };

  return (
    <div className="md:hidden bg-background/95 border-t border-border px-4 pb-4 pt-2 space-y-1 animate-in slide-in-from-top-2 fade-in duration-150">
      {/* LOGGED OUT LINKS */}
      {!session && (
        <>
          {LOGGED_OUT_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive(href)
                  ? "text-primary font-semibold underline underline-offset-4 decoration-2"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </Link>
          ))}

          {/* Auth Buttons */}
          <div className="pt-2 mt-2 border-t border-border space-y-2">
            <Link
              href="/login"
              onClick={onClose}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={onClose}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center"
            >
              Sign Up Free
            </Link>
          </div>
        </>
      )}

      {/* LOGGED IN LINKS */}
      {session && (
        <>
          {/* Nav Links with Badges */}
          {LOGGED_IN_LINKS.map(({ href, label, badge }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive(href)
                  ? "text-primary font-semibold underline underline-offset-4 decoration-2"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
              {badge === "sparkle" && <Sparkles className="w-3 h-3 text-yellow-400" />}
              {badge === "dot" && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
              {badge === "fire" && <Flame className="w-3 h-3 text-orange-500" />}
            </Link>
          ))}

          {/* Admin Link */}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-yellow-400 hover:bg-yellow-400/10 transition-colors"
            >
              <Shield className="w-4 h-4" />
              Admin Dashboard
            </Link>
          )}

          {/* User Section */}
          <div className="pt-3 mt-3 border-t border-border">
            {/* User Info */}
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session.user.image || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                    {session.user.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{session.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
              </div>
            </div>

            {/* User Links */}
            <div className="space-y-1">
              <Link
                href="/watchlist"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Heart className="w-4 h-4" />
                My Watchlist
              </Link>
              <Link
                href="/profile"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
              <Link
                href="/reviews"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Star className="w-4 h-4" />
                My Reviews
              </Link>
              <Link
                href="/subscription"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <Gift className="w-4 h-4" />
                Subscription Plan
              </Link>
            </div>

            {/* Logout */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2.5 mt-2 w-full rounded-lg text-sm text-red-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
