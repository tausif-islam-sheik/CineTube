"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bookmark, CalendarDays, CreditCard, Crown, User } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/axios";

type UserSubscription = {
  id: string;
  status: string;
  endDate: string | null;
  autoRenew: boolean;
  tier?: {
    name?: string;
    displayName?: string;
    price?: number;
    currency?: string;
  };
};

type UserPayment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  description?: string | null;
};

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString();
};

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const { data: activeSubscription, isLoading: subscriptionLoading } = useQuery<UserSubscription | null>({
    queryKey: ["profile-active-subscription"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/user/subscription");
      return data.data;
    },
    enabled: !!session,
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery<UserPayment[]>({
    queryKey: ["profile-payments"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/user/payments?limit=5&page=1&sortBy=createdAt&order=desc");
      return data.data ?? [];
    },
    enabled: !!session,
  });

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

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Billing & Subscription</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/pricing">Manage Plan</Link>
            </Button>
          </div>

          {subscriptionLoading ? (
            <div className="h-20 animate-pulse rounded-lg border border-border bg-muted/40" />
          ) : activeSubscription ? (
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-primary" />
                  <p className="font-semibold">
                    {activeSubscription.tier?.displayName || activeSubscription.tier?.name || "Active Plan"}
                  </p>
                </div>
                <span className="rounded-full border border-border px-2 py-0.5 text-xs font-semibold">
                  {activeSubscription.status}
                </span>
              </div>
              <div className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Renews/Ends: {formatDate(activeSubscription.endDate)}
                </p>
                <p className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Auto renew: {activeSubscription.autoRenew ? "Enabled" : "Disabled"}
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              You have no active subscription right now.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">Recent Payment History</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/pricing">Upgrade / Renew</Link>
            </Button>
          </div>

          {paymentsLoading ? (
            <div className="space-y-2">
              <div className="h-12 animate-pulse rounded-lg border border-border bg-muted/40" />
              <div className="h-12 animate-pulse rounded-lg border border-border bg-muted/40" />
            </div>
          ) : payments && payments.length > 0 ? (
            <div className="space-y-2">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {payment.amount} {payment.currency.toUpperCase()} • {payment.paymentMethod}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(payment.createdAt)}</p>
                  </div>
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs font-semibold">
                    {payment.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              No payment records yet.
            </div>
          )}
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
