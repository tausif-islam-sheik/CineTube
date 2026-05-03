"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthButtonsProps {
  isOverlay: boolean;
}

export function AuthButtons({ isOverlay }: AuthButtonsProps) {
  return (
    <>
      {/* Login Button */}
      <Link href="/login">
        <button
          className={cn(
            "flex items-center gap-2 border rounded-full px-4 py-1.5 text-sm transition-colors font-medium",
            isOverlay
              ? "border-white/20 text-white/80 hover:text-white hover:border-white/40"
              : "border-border text-foreground/80 hover:text-foreground hover:border-muted-foreground"
          )}
        >
          <User className="w-3.5 h-3.5" />
          Login
        </button>
      </Link>

      {/* Sign Up Button */}
      <Link href="/register">
        <button
          className={cn(
            "flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors font-medium",
            "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          Sign Up
        </button>
      </Link>
    </>
  );
}
