"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Popcorn } from "lucide-react";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [loading, setLoading] = useState<"monthly" | "yearly" | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const handleCheckout = async (interval: "monthly" | "yearly") => {
    if (!session) {
      toast.error("Please sign in to subscribe.");
      router.push("/login");
      return;
    }

    try {
      setLoading(interval);

      const { data: tiersBody } = await apiClient.get("/api/v1/subscription-tiers", {
        params: { limit: 100 },
      });
      const tiers: { id: string; name: string; price: number; billingCycle: number }[] =
        Array.isArray(tiersBody?.data) ? tiersBody.data : [];

      // Match home pricing-section: monthly → PREMIUM (or any paid monthly tier); yearly → VIP, else PREMIUM + interval
      const monthlyTier =
        tiers.find((t) => t.name === "PREMIUM") ??
        tiers.find((t) => t.name !== "FREE" && t.price > 0 && t.billingCycle === 1);
      const yearlyTier =
        tiers.find((t) => t.name === "VIP") ?? tiers.find((t) => t.name === "PREMIUM");

      const tier = interval === "monthly" ? monthlyTier : yearlyTier;
      if (!tier) {
        throw new Error(
          interval === "monthly"
            ? "Monthly plan is not available. Please try again later."
            : "Yearly plan is not available. Please try again later.",
        );
      }

      const { data } = await apiClient.post("/api/v1/payments/checkout-session", {
        tierId: tier.id,
        interval,
      });

      if (data?.success && data?.data?.url) {
        window.location.href = data.data.url;
      } else {
        throw new Error("Failed to get checkout URL");
      }
    } catch (error: unknown) {
      console.error(error);
      const message =
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      const fallback =
        error instanceof Error ? error.message : "Failed to initiate checkout. Please try again.";
      toast.error(message || fallback);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="text-center mb-12 space-y-4 max-w-2xl">
         <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
             <Popcorn className="w-8 h-8 text-primary" />
         </div>
         <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Upgrade to Premium</h1>
         <p className="text-lg text-muted-foreground">
           Get unlimited access to high-fidelity 4K streaming, ad-free experience, and exclusive releases.
         </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Monthly Plan */}
        <Card className="relative flex flex-col transition-all hover:border-primary/50">
           <CardHeader>
              <CardTitle className="text-2xl">Monthly</CardTitle>
              <CardDescription>Flexible rolling subscription.</CardDescription>
              <div className="mt-4 font-bold text-4xl">
                 $9.99<span className="text-lg text-muted-foreground font-normal">/mo</span>
              </div>
           </CardHeader>
           <CardContent className="flex-1">
              <ul className="space-y-3">
                 {[
                   "Ad-free streaming", 
                   "Unlock 4K Ultra HD", 
                   "Download for offline viewing", 
                   "Cancel anytime"
                 ].map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                       <Check className="w-5 h-5 text-green-500 shrink-0" />
                       <span className="text-sm">{feature}</span>
                    </li>
                 ))}
              </ul>
           </CardContent>
           <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                size="lg" 
                disabled={loading !== null}
                onClick={() => handleCheckout("monthly")}
              >
                  {loading === "monthly" ? "Processing..." : "Choose Monthly"}
              </Button>
           </CardFooter>
        </Card>

        {/* Yearly Plan */}
        <Card className="relative flex flex-col border-primary shadow-lg shadow-primary/20 scale-100 md:scale-105 z-10">
           <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              Best Value
           </div>
           <CardHeader>
              <CardTitle className="text-2xl">Yearly</CardTitle>
              <CardDescription>Save big on a full year.</CardDescription>
              <div className="mt-4 font-bold text-4xl">
                 $79.99<span className="text-lg text-muted-foreground font-normal">/yr</span>
              </div>
           </CardHeader>
           <CardContent className="flex-1">
              <ul className="space-y-3">
                 {[
                   "Everything in Monthly",
                   "Save over 30%",
                   "Exclusive VIP community access",
                   "Priority support"
                 ].map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                       <Check className="w-5 h-5 text-primary shrink-0" />
                       <span className="text-sm">{feature}</span>
                    </li>
                 ))}
              </ul>
           </CardContent>
           <CardFooter>
              <Button 
                className="w-full" 
                size="lg" 
                disabled={loading !== null}
                onClick={() => handleCheckout("yearly")}
              >
                 {loading === "yearly" ? "Processing..." : "Choose Yearly"}
              </Button>
           </CardFooter>
        </Card>
      </div>
    </div>
  );
}
