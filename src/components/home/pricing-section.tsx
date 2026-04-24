/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface SubscriptionTier {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  billingCycle: number;
  currency: string;
  features: string[] | any;
}

export function PricingSection() {
  const [isRedirecting, setIsRedirecting] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const { data: tiersResp, isLoading } = useQuery<{ data: SubscriptionTier[] }>({
    queryKey: ["subscription-tiers"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/subscription-tiers");
      return data;
    },
  });

  const tiers = tiersResp?.data || [];
  
  // Resolve tiers deterministically to avoid wrong labels/content mapping
  const freeTier =
    tiers.find((t) => t.name === "FREE") ??
    tiers.find((t) => t.price === 0);
  const monthlyTier =
    tiers.find((t) => t.name === "PREMIUM") ??
    tiers.find((t) => t.price > 0 && t.billingCycle === 1);
  const yearlyTier =
    tiers.find((t) => t.name === "VIP") ??
    tiers.find((t) => t.price > 0 && t.billingCycle === 12) ??
    monthlyTier;

  const freeFeatures = Array.isArray(freeTier?.features) && freeTier.features.length > 0
    ? freeTier.features
    : ["HD quality", "Access to free catalog", "Ad-supported", "1 device"];
  const monthlyFeatures = Array.isArray(monthlyTier?.features) && monthlyTier.features.length > 0
    ? monthlyTier.features
    : ["Ad-free streaming", "Premium titles unlocked", "Offline downloads", "Up to 3 devices"];
  const yearlyFeatures = Array.isArray(yearlyTier?.features) && yearlyTier.features.length > 0
    ? yearlyTier.features
    : ["Everything in monthly", "Save more annually", "Early access drops", "Priority support"];

  const handleCheckout = async (tierId: string | undefined) => {
    if (!session) {
      toast.error("Please sign in to subscribe.");
      router.push("/login");
      return;
    }

    if (!tierId) {
      toast.error("Invalid subscription plan selection.");
      return;
    }

    try {
      setIsRedirecting(tierId);
      const { data } = await apiClient.post("/api/v1/payments/checkout-session", {
        tierId
      });

      if (data?.success && data?.data?.url) {
        window.location.href = data.data.url;
      } else {
        throw new Error("Failed to get checkout URL");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to initiate checkout.");
    } finally {
      setIsRedirecting(null);
    }
  };

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <Star className="w-3.5 h-3.5" />
          Flexible Plans
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight">Choose your cinematic experience</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto md:text-lg text-balance">
          Whether you&apos;re a casual viewer or a hardcore cinephile, we have a plan tailored for your needs.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto items-stretch">
        {/* Free Plan */}
        <Card className="flex h-full flex-col border-border bg-card/60 transition-all hover:border-primary/30">
          <CardHeader>
            <div className="inline-flex w-fit rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Starter
            </div>
            <CardTitle className="mt-3 text-2xl">{freeTier?.displayName || "Free Tier"}</CardTitle>
            <CardDescription>{freeTier?.description || "Perfect for trying CineTube"}</CardDescription>
            <div className="mt-4 font-black text-4xl">
              ${freeTier?.price || 0}
              <span className="text-base text-muted-foreground font-normal">/mo</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              {freeFeatures.map((f: string) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button variant="outline" className="w-full rounded-xl" size="lg" onClick={() => router.push("/register")}>
              Get Started
            </Button>
          </CardFooter>
        </Card>

        {/* Monthly Plan */}
        <Card className="relative flex h-full flex-col border-primary/40 bg-linear-to-b from-primary/10 to-transparent shadow-xl shadow-primary/10">
          <CardHeader>
            <div className="mb-1 inline-flex w-fit rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              Most Popular
            </div>
            <CardTitle className="text-2xl text-primary">{monthlyTier?.displayName || "Monthly Premium"}</CardTitle>
            <CardDescription>{monthlyTier?.description || "Best for flexibility and premium access."}</CardDescription>
            <div className="mt-4 font-black text-4xl">
              ${monthlyTier?.price || 9.99}
              <span className="text-base text-muted-foreground font-normal">/mo</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              {monthlyFeatures.map((f: string) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button 
              className="w-full rounded-xl shadow-lg shadow-primary/20" 
              size="lg" 
              disabled={isRedirecting !== null}
              onClick={() => handleCheckout(monthlyTier?.id)}
            >
              {isRedirecting === monthlyTier?.id ? "Redirecting..." : "Start Monthly Plan"}
            </Button>
          </CardFooter>
        </Card>

        {/* Yearly Plan */}
        <Card className="relative flex h-full flex-col border-border bg-card/60 transition-all hover:border-primary/30">
          <CardHeader>
            <div className="mb-1 inline-flex w-fit rounded-full bg-yellow-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black">
              Best Value
            </div>
            <CardTitle className="text-2xl">{yearlyTier?.displayName || "Yearly VIP"}</CardTitle>
            <CardDescription>{yearlyTier?.description || "Lowest monthly cost with yearly billing."}</CardDescription>
            <div className="mt-4 font-black text-4xl">
              ${yearlyTier?.price || 79.99}
              <span className="text-base text-muted-foreground font-normal">/yr</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              {yearlyFeatures.map((f: string) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button 
              variant="outline" 
              className="w-full rounded-xl border-primary/30 hover:bg-primary/5" 
              size="lg"
              disabled={isRedirecting !== null}
              onClick={() => handleCheckout(yearlyTier?.id)}
            >
              {isRedirecting === yearlyTier?.id ? "Redirecting..." : "Choose Yearly Plan"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
