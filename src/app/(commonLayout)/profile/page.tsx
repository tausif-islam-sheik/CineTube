"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Bookmark, Crown, User } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <section className="container mx-auto px-4 py-16 md:px-8">
        <div className="mx-auto h-48 max-w-3xl animate-pulse rounded-xl border border-border bg-card" />
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{session.user.name || "CineTube User"}</h1>
              <p className="text-sm text-muted-foreground">{session.user.email}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/watchlist" className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/40">
              <div className="mb-2 flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-primary" />
                <span className="font-semibold">Watchlist</span>
              </div>
              <p className="text-sm text-muted-foreground">Review and manage saved titles.</p>
            </Link>
            <Link href="/pricing" className="rounded-xl border border-border p-4 transition-colors hover:bg-muted/40">
              <div className="mb-2 flex items-center gap-2">
                <Crown className="h-4 w-4 text-primary" />
                <span className="font-semibold">Subscription</span>
              </div>
              <p className="text-sm text-muted-foreground">Upgrade or manage your plan.</p>
            </Link>
          </div>
        </div>

        <div className="flex gap-3">
          <Button asChild>
            <Link href="/discover">Continue Exploring</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/faq">Need Help?</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
