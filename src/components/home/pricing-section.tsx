"use client";

import { useState } from "react";
import { Check, Popcorn, Zap, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import apiClient from "@/lib/axios";
import { getStripe } from "@/lib/stripe";

export function PricingSection() {
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
      const { data } = await apiClient.post("/api/checkout/session", {
        tier: "PREMIUM",
        interval: interval
      });

      const stripe = await getStripe();
      if (!stripe) throw new Error("Stripe could not load");

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (error) throw error;
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to initiate checkout.");
    } finally {
      setLoading(null);
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
            <CardTitle className="text-xl">Free</CardTitle>
            <CardDescription>Perfect to get started</CardDescription>
            <div className="mt-4 font-black text-4xl">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              {["720p HD streaming", "Access to free titles", "Ad-supported", "1 device support"].map((f) => (
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
            <CardTitle className="text-xl text-primary">Monthly</CardTitle>
            <CardDescription>Most flexible option</CardDescription>
            <div className="mt-4 font-black text-4xl">$9.99<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              {["4K Ultra HD", "Zero Ads", "Download movies", "3 devices concurrent"].map((f) => (
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
              disabled={loading !== null}
              onClick={() => handleCheckout("monthly")}
            >
              {loading === "monthly" ? "Processing..." : "Select Monthly"}
            </Button>
          </CardFooter>
        </Card>

        {/* Yearly Plan */}
        <Card className="flex flex-col border-border bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 relative">
          <div className="absolute -top-3 right-6 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            Best Value
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Yearly</CardTitle>
            <CardDescription>Save big on full year</CardDescription>
            <div className="mt-4 font-black text-4xl">$79.99<span className="text-lg text-muted-foreground font-normal">/yr</span></div>
          </CardHeader>
          <CardContent className="flex-1">
            <ul className="space-y-4">
              {["All Monthly features", "Save 33% annually", "Exclusive Early Access", "Priority Support"].map((f) => (
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
              disabled={loading !== null}
              onClick={() => handleCheckout("yearly")}
            >
              {loading === "yearly" ? "Processing..." : "Select Yearly"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
