"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Popcorn, LayoutDashboard, Film, ShieldAlert, FileText, CheckSquare, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Helper to check if route is active
  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin" || pathname === "/admin/";
    }
    return pathname.startsWith(path);
  };

  useEffect(() => {
    // If auth is loaded and user is not an admin, redirect them out
    if (!isPending) {
        if (!session) {
            router.replace("/login");
        } else if ((session.user as any).role !== "ADMIN") {
            router.replace("/");
        }
    }
  }, [session, isPending, router]);

  if (isPending) {
     return <div className="min-h-screen flex items-center justify-center bg-background">Loading...</div>;
  }

  // Double check so UI doesn't flash
  if (!session || (session.user as any).role !== "ADMIN") {
      return null;
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r bg-background/50 backdrop-blur shrink-0 hidden md:flex flex-col">
          <div className="h-16 flex flex-col justify-center px-6 border-b">
             <Link href="/" className="flex items-center space-x-2 text-primary">
                <Popcorn className="w-6 h-6" />
                <span className="font-semibold text-2xl tracking-tight">Admin <span className="text-foreground">Panel</span></span>
             </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
             <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-4">Overview</div>
             <Link href="/admin">
               <Button
                 variant={isActive("/admin") ? "secondary" : "ghost"}
                 className={cn(
                   "w-full justify-start",
                   isActive("/admin") && "bg-primary/10 text-primary hover:bg-primary/20 font-medium"
                 )}
               >
                  <LayoutDashboard className={cn("w-4 h-4 mr-2", isActive("/admin") && "text-primary")} /> Dashboard
               </Button>
             </Link>
             <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-6">Content Management</div>
             <Link href="/admin/media">
               <Button
                 variant={isActive("/admin/media") ? "secondary" : "ghost"}
                 className={cn(
                   "w-full justify-start",
                   isActive("/admin/media") && "bg-primary/10 text-primary hover:bg-primary/20 font-medium"
                 )}
               >
                  <Film className={cn("w-4 h-4 mr-2", isActive("/admin/media") && "text-primary")} /> Media Library
               </Button>
             </Link>
             <Link href="/admin/reviews">
               <Button
                 variant={isActive("/admin/reviews") ? "secondary" : "ghost"}
                 className={cn(
                   "w-full justify-start",
                   isActive("/admin/reviews") && "bg-primary/10 text-primary hover:bg-primary/20 font-medium"
                 )}
               >
                  <CheckSquare className={cn("w-4 h-4 mr-2", isActive("/admin/reviews") && "text-primary")} /> Review Queue
               </Button>
             </Link>
             <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-2 mt-6">Configuration</div>
             <Link href="/admin/settings">
               <Button
                 variant={isActive("/admin/settings") ? "secondary" : "ghost"}
                 className={cn(
                   "w-full justify-start",
                   isActive("/admin/settings") && "bg-primary/10 text-primary hover:bg-primary/20 font-medium"
                 )}
               >
                  <Settings className={cn("w-4 h-4 mr-2", isActive("/admin/settings") && "text-primary")} /> Settings
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
