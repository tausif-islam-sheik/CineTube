"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Popcorn, LayoutDashboard, Film, ShieldAlert, FileText, CheckSquare, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If auth is loaded and user is not an admin, redirect them out
    if (!isPending) {
        if (!session) {
            router.replace("/login");
        } else if (session.user.role !== "ADMIN") {
            router.replace("/");
        }
    }
  }, [session, isPending, router]);

  if (isPending) {
     return <div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>;
  }

  // Double check so UI doesn't flash
  if (!session || session.user.role !== "ADMIN") {
      return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r bg-background/50 backdrop-blur shrink-0 hidden md:flex flex-col">
          <div className="h-16 flex flex-col justify-center px-6 border-b">
             <Link href="/" className="flex items-center space-x-2 text-primary">
                <Popcorn className="w-6 h-6" />
                <span className="font-bold tracking-tight">Admin<span className="text-foreground">Panel</span></span>
             </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
             <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-4">Overview</div>
             <Link href="/admin">
               <Button variant="ghost" className="w-full justify-start">
                  <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
               </Button>
             </Link>
             <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-6">Content Management</div>
             <Link href="/admin/media">
               <Button variant="ghost" className="w-full justify-start">
                  <Film className="w-4 h-4 mr-2" /> Media Library
               </Button>
             </Link>
             <Link href="/admin/reviews">
               <Button variant="ghost" className="w-full justify-start">
                  <CheckSquare className="w-4 h-4 mr-2" /> Review Queue
               </Button>
             </Link>
             <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-6">Configuration</div>
             <Link href="/admin/settings">
               <Button variant="ghost" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" /> Settings
               </Button>
             </Link>
          </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
          {/* Mobile Admin Header */}
          <header className="h-16 md:hidden border-b flex items-center px-4 bg-background">
             <ShieldAlert className="text-yellow-500 mr-2 w-5 h-5" />
             <span className="font-bold">Admin Panel</span>
          </header>
          
          <div className="flex-1 overflow-auto">
             {children}
          </div>
      </main>
    </div>
  );
}
