"use client";

import { useState } from "react";
import { Check, Popcorn, Zap, Star, Shield } from "lucide-react";
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
  
  // Find tiers by name or cycle
  const monthlyTier = tiers.find(t => t.name === "PREMIUM" || t.billingCycle === 1);
  const yearlyTier = tiers.find(t => t.name === "VIP" || t.billingCycle === 12);
  const freeTier = tiers.find(t => t.name === "FREE" || t.price === 0);

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
        <h2 className="text-4xl md:text-5xl font-black tracking-tight">Choose your cinematic experience</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg text-balance">
          Whether you&apos;re a casual viewer or a hardcore cinephile, we have a plan tailored for your needs.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free Plan */}
        <Card className="flex flex-col border-border bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30">
          <CardHeader>
            <CardTitle className="text-xl">{freeTier?.displayName || "Free"}</CardTitle>
            <CardDescription>{freeTier?.description || "Perfect to get started"}</CardDescription>
            <div className="mt-4 font-black text-4xl">${freeTier?.price || 0}<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              {(freeTier?.features || ["720p HD streaming", "Access to free titles", "Ad-supported", "1 device support"]).map((f: string) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full rounded-xl" size="lg" onClick={() => router.push("/register")}>
              Get Started
            </Button>
          </CardFooter>
        </Card>

        {/* Monthly Plan */}
        <Card className="flex flex-col border-primary/50 bg-gradient-to-b from-primary/5 to-transparent relative shadow-xl shadow-primary/5">
          <CardHeader>
            <CardTitle className="text-xl text-primary">{monthlyTier?.displayName || "Monthly"}</CardTitle>
            <CardDescription>{monthlyTier?.description || "Most flexible option"}</CardDescription>
            <div className="mt-4 font-black text-4xl">${monthlyTier?.price || 9.99}<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              {(monthlyTier?.features || ["4K Ultra HD", "Zero Ads", "Download movies", "3 devices concurrent"]).map((f: string) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full rounded-xl shadow-lg shadow-primary/20" 
              size="lg" 
              disabled={isRedirecting !== null}
              onClick={() => handleCheckout(monthlyTier?.id)}
            >
              {isRedirecting === monthlyTier?.id ? "Redirecting..." : "Select Monthly"}
            </Button>
          </CardFooter>
        </Card>

        {/* Yearly Plan */}
        <Card className="flex flex-col border-border bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 relative">
          <div className="absolute -top-3 right-6 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            Best Value
          </div>
          <CardHeader>
            <CardTitle className="text-xl">{yearlyTier?.displayName || "Yearly"}</CardTitle>
            <CardDescription>{yearlyTier?.description || "Save big on full year"}</CardDescription>
            <div className="mt-4 font-black text-4xl">${yearlyTier?.price || 79.99}<span className="text-lg text-muted-foreground font-normal">/yr</span></div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              {(yearlyTier?.features || ["All Monthly features", "Save 33% annually", "Exclusive Early Access", "Priority Support"]).map((f: string) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground/80">
                  <Check className="w-4 h-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full rounded-xl border-primary/30 hover:bg-primary/5" 
              size="lg"
              disabled={isRedirecting !== null}
              onClick={() => handleCheckout(yearlyTier?.id)}
            >
              {isRedirecting === yearlyTier?.id ? "Redirecting..." : "Select Yearly"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
