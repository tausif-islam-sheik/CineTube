/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { 
  Film, 
  Users, 
  Globe, 
  Star,
  TrendingUp,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ===== SECTION: Platform Statistics ===== */
/* Table of Contents:
   - AnimatedCounter Component
   - StatCard Component
   - PlatformStats Section Component
   - Features: Animated counters, intersection observer, dark bg
*/

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  decimals?: number;
}

function AnimatedCounter({ 
  end, 
  suffix = "", 
  prefix = "", 
  duration = 2000,
  decimals = 0 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(easeOutQuart * end);
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  const displayValue = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString();

  return (
    <span ref={ref}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  color: string;
  delay: number;
}

function StatCard({ icon, value, suffix, label, color, delay }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative group rounded-2xl p-6 md:p-8 transition-all duration-700",
        "border border-white/10 bg-white/[0.02] backdrop-blur-sm",
        "hover:border-white/20 hover:bg-white/[0.04]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {/* Glow Effect */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl",
        color
      )} />

      <div className="relative z-10">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
          "bg-gradient-to-br",
          color
        )}>
          {icon}
        </div>

        <div className="space-y-1">
          <p className="text-3xl md:text-4xl font-black tracking-tight text-white">
            <AnimatedCounter end={value} suffix={suffix} />
          </p>
          <p className="text-sm text-white/60 font-medium uppercase tracking-wider">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

const STATS = [
  {
    icon: <Film className="w-6 h-6 text-white" />,
    value: 10000,
    suffix: "+",
    label: "Movies & Series",
    color: "from-primary to-red-600",
  },
  {
    icon: <Users className="w-6 h-6 text-white" />,
    value: 2,
    suffix: "M+",
    label: "Active Viewers",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: <Globe className="w-6 h-6 text-white" />,
    value: 150,
    suffix: "+",
    label: "Countries Supported",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: <Star className="w-6 h-6 text-white" />,
    value: 4.8,
    suffix: "★",
    label: "Average Rating",
    color: "from-yellow-500 to-amber-600",
    decimals: 1,
  },
];

export function PlatformStats() {
  return (
    <section id="stats" className="relative py-20 md:py-32 overflow-hidden">
      {/* Dark Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-950 to-background" />
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            Our Impact
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Platform Statistics
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto md:text-lg text-balance">
            Numbers that showcase why millions choose CineTube for their entertainment
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {STATS.map((stat, index) => (
            <StatCard
              key={stat.label}
              {...stat}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12 text-white/40">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">99.9% Uptime</span>
          </div>
          <div className="w-px h-4 bg-white/20 hidden md:block" />
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">Global CDN</span>
          </div>
          <div className="w-px h-4 bg-white/20 hidden md:block" />
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">HD Streaming</span>
          </div>
        </div>
      </div>
    </section>
  );
}
