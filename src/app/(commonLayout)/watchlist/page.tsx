"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { useSession } from "@/lib/auth-client";
import { WatchlistCard } from "@/components/watchlist/watchlist-card";
import { Loader2, Plus, Play, MoreVertical } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function WatchlistPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const [view, setView] = useState<"folders" | "detail">("folders");

  const { data: watchlistResp, isLoading } = useQuery({
    queryKey: ["watchlist", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data } = await apiClient.get("/api/v1/watchlist/user/watchlist");
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (sessionPending || isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-white mb-4">Sign in to view your watchlist</h1>
        <Link href="/login">
            <Button className="bg-white text-black hover:bg-white/90 font-bold rounded-md px-8">
                Login
            </Button>
        </Link>
      </div>
    );
  }

  const watchlistItems = watchlistResp?.data || [];

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-12 py-10">
      {/* Header Container */}
      <div className="max-w-7xl mx-auto flex items-start justify-between mb-12">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Watchlist</h1>
          <p className="text-zinc-400 text-sm md:text-base font-medium">
            Keeps track of what you want to watch next.
          </p>
        </div>

        <Button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold h-11 px-4 gap-2 rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          New Watchlist
        </Button>
      </div>

      <div className="max-w-7xl mx-auto">
        {view === "folders" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Watch Later Folder Card */}
            <div 
              className="group relative flex flex-col cursor-pointer"
              onClick={() => setView("detail")}
            >
              <div className="relative aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-white/5 transition-all group-hover:border-white/10 group-hover:bg-zinc-800 flex items-center justify-center shadow-lg">
                {watchlistItems.length > 0 ? (
                  <img 
                    src={watchlistItems[0].movie.posterUrl} 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[1px] group-hover:opacity-30 group-hover:scale-105 transition-all duration-500"
                    alt="" 
                  />
                ) : null}
                
                <div className="relative flex flex-col items-center gap-4">
                     <div className="relative">
                        {/* Stacked Icon effect */}
                        <div className="absolute -top-1 left-0 w-12 h-12 bg-zinc-700 rounded-lg -z-10 opacity-40 translate-x-1" />
                        <div className="absolute -top-2 left-0 w-12 h-12 bg-zinc-600 rounded-lg -z-20 opacity-20 translate-x-2" />
                        <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-white/10 shadow-2xl">
                            <Play className="w-5 h-5 text-white/50 fill-current" />
                        </div>
                     </div>
                </div>
              </div>
              
              <div className="mt-4 space-y-0.5">
                <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">Watch Later</h3>
                <p className="text-zinc-500 text-sm font-semibold tracking-tight">
                  {watchlistItems.length > 0 ? `${watchlistItems.length} Videos` : "No Video"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-4">
                 <button 
                    onClick={() => setView("folders")}
                    className="p-2 -ml-2 text-zinc-400 hover:text-white transition-colors"
                 >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                 </button>
                 <h2 className="text-xl font-bold">Watch Later</h2>
             </div>

             {watchlistItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {watchlistItems.map((item: any) => (
                        <WatchlistCard 
                            key={item.id} 
                            watchlistId={item.id} 
                            movie={item.movie} 
                        />
                    ))}
                </div>
             ) : (
                <div className="py-20 text-center text-zinc-500">
                    Your collection is currently empty
                </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
