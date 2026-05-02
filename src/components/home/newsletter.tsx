"use client";

import { useState } from "react";
import { Mail, Send, Check, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ===== SECTION: Newsletter Signup ===== */
/* Table of Contents:
   - Newsletter component
   - Features: Email input, inline form, trust indicators
*/

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    setIsSubmitting(false);
    toast.success("You're subscribed! Check your inbox for a welcome email.");
  };

  return (
    <section id="newsletter" className="container mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="relative rounded-3xl overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black" />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 animate-pulse delay-1000" />

        {/* Content */}
        <div className="relative z-10 px-6 py-16 md:px-16 md:py-20 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight mb-3 md:mb-4">
            Never Miss a New Release
          </h2>
          
          {/* Subtext */}
          <p className="text-white/60 text-base md:text-lg max-w-2xl mx-auto mb-6 md:mb-8 px-2">
            Get weekly picks, trailers, and exclusive early access to our biggest premieres. 
            Join 250,000+ subscribers.
          </p>

          {/* Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto px-2 sm:px-0">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 sm:h-14 pl-10 sm:pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-primary focus:ring-primary/20 rounded-lg sm:rounded-xl text-sm sm:text-base"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="h-12 sm:h-14 px-6 sm:px-8 rounded-lg sm:rounded-xl font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      <span className="text-sm sm:text-base">Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      <span className="text-sm sm:text-base">Subscribe</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Trust Text */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-4 text-xs sm:text-sm text-white/40">
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  No spam
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>Unsubscribe anytime</span>
              </div>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <Check className="w-5 h-5" />
                <span className="font-semibold">You're subscribed! Welcome aboard.</span>
              </div>
            </div>
          )}

          {/* Social Proof */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Weekly curated picks</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Exclusive trailers</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Early access drops</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
