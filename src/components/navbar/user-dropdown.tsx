"use client";

import { useRouter } from "next/navigation";
import { User, LogOut, Heart, Star, Gift, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";

interface UserDropdownProps {
  session: {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  };
  isOverlay: boolean;
  isAdmin?: boolean;
}

export function UserDropdown({ session, isOverlay, isAdmin }: UserDropdownProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 border rounded-full pl-3 pr-1 py-1 transition-colors group relative",
            isOverlay
              ? "border-white/50 hover:border-white/70"
              : "border-foreground/50 hover:border-foreground/70"
          )}
        >
          <User
            className={cn(
              "w-3.5 h-3.5 transition-colors",
              isOverlay
                ? "text-white/80 group-hover:text-white"
                : "text-muted-foreground group-hover:text-foreground"
            )}
          />
          <span
            className={cn(
              "text-sm transition-colors max-w-22.5 truncate hidden sm:block",
              isOverlay
                ? "text-white/80 group-hover:text-white"
                : "text-foreground/80 group-hover:text-foreground"
            )}
          >
            {session.user.name?.split(" ")[0]}
          </span>
          <div className="relative">
            <Avatar className="h-6 w-6">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                {session.user.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border-2 border-background" />
          </div>
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

        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => router.push("/profile")}>
          <User className="w-4 h-4" /> Profile
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => router.push("/my-reviews")}>
          <Star className="w-4 h-4" /> My Reviews
        </DropdownMenuItem>

         <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => router.push("/watchlist")}>
          <Heart className="w-4 h-4" /> My Watchlist
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => router.push("/pricing")}>
          <Gift className="w-4 h-4" /> Upgrade Plan
        </DropdownMenuItem>

        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-yellow-500 focus:text-yellow-500 focus:bg-yellow-500/10 gap-2 cursor-pointer"
              onClick={() => router.push("/admin")}
            >
              <Shield className="w-4 h-4" /> Admin Dashboard
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-400 hover:text-red-400 focus:text-red-400 focus:bg-red-400/10 gap-2 cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
