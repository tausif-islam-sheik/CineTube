"use client";

import { UserPlus, Search, Play, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/* ===== SECTION: How It Works ===== */
/* Table of Contents:
   - Step data and icons
   - StepCard Component
   - HowItWorks Section Component
   - Features: 3-step layout, horizontal desktop, vertical mobile
*/

const STEPS = [
  {
    number: "01",
    title: "Create Your Free Account",
    description: "Sign up in seconds with your email or social accounts. No credit card required to start exploring.",
    icon: UserPlus,
    color: "from-blue-500 to-indigo-600",
  },
  {
    number: "02",
    title: "Browse Thousands of Titles",
    description: "Explore our vast collection of movies and series across all genres. Use smart filters to find exactly what you want.",
    icon: Search,
    color: "from-primary to-red-600",
  },
  {
    number: "03",
    title: "Watch Anytime, Anywhere",
    description: "Stream instantly on any device. Download for offline viewing with premium plans. Your entertainment, your way.",
    icon: Play,
    color: "from-emerald-500 to-teal-600",
  },
];

interface StepCardProps {
  step: typeof STEPS[0];
  isLast: boolean;
}

function StepCard({ step, isLast }: StepCardProps) {
  const Icon = step.icon;

  return (
    <div className="relative flex-1">
      {/* Connector Line (Desktop) */}
      {!isLast && (
        <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5">
          <div className="w-full h-full bg-gradient-to-r from-border via-primary/30 to-border rounded-full" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 text-primary/50">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}

      <div className="relative z-10 text-center px-4">
        {/* Icon Container */}
        <div className="relative inline-flex mb-6">
          <div className={`
            w-20 h-20 rounded-2xl flex items-center justify-center
            bg-gradient-to-br ${step.color}
            shadow-lg transform transition-transform duration-500 hover:scale-110
          `}>
            <Icon className="w-8 h-8 text-white" strokeWidth={2} />
          </div>
          {/* Step Number Badge */}
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center">
            <span className="text-xs font-black text-primary">{step.number}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 max-w-xs mx-auto">
          <h3 className="text-lg md:text-xl font-bold text-foreground">
            {step.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <Play className="w-3.5 h-3.5 fill-current" />
          Get Started
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
          How It Works
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto md:text-lg text-balance">
          Start watching your favorite movies and series in three simple steps
        </p>
      </div>

      {/* Steps */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-12 md:gap-8 mb-12">
{STEPS.map((step, index) => (
          <StepCard 
            key={step.number} 
            step={step} 
            isLast={index === STEPS.length - 1}
          />
        ))}
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link href="/register">
          <Button size="lg" className="rounded-xl px-8 h-14 text-base font-bold">
            <UserPlus className="w-5 h-5 mr-2" />
            Create Free Account
          </Button>
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">
          No credit card required • Cancel anytime
        </p>
      </div>
    </section>
  );
}
