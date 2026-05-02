"use client";

import { useEffect, useRef } from "react";
import { Play, Search, Sparkles, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ===== SECTION: Final Call to Action (CTA) ===== */
/* Table of Contents:
   - ParticleBackground Component
   - FinalCTA Section Component
   - Features: Animated background, gradient shift, CTAs
*/

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const createParticles = () => {
      particles = [];
      const count = Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 15000);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.offsetWidth;
        if (particle.x > canvas.offsetWidth) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.offsetHeight;
        if (particle.y > canvas.offsetHeight) particle.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 0, 18, ${particle.opacity})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(230, 0, 18, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    createParticles();
    draw();

    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.6 }}
    />
  );
}

export function FinalCTA() {
  return (
    <section id="final-cta" className="relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        {/* Shifting Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 animate-pulse" />
      </div>

      {/* Particle Animation */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 py-16 sm:py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-medium mb-6 sm:mb-8">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Start Your Journey Today
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-4 sm:mb-6">
            Start Watching{" "}
            <span className="text-primary">for Free</span>
          </h2>

          {/* Subtext */}
          <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8 sm:mb-10 px-4 sm:px-0">
            Join millions of movie lovers. No credit card required. 
            Cancel anytime. Your next favorite film is waiting.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <Link href="/register" className="w-full sm:w-auto">
              <Button 
                className="w-full sm:w-auto h-13 sm:h-16 px-8 sm:px-10 rounded-full text-base sm:text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:scale-105"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-current" />
                Sign Up Free
              </Button>
            </Link>
            <Link href="/discover" className="w-full sm:w-auto">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto h-13 sm:h-16 px-8 sm:px-10 rounded-full text-base sm:text-lg font-bold border-white/30 text-white hover:bg-white/10 hover:border-white/50"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="sm:hidden">Browse</span>
                <span className="hidden sm:inline">Browse Movies</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/50">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              <span className="sm:hidden">No card needed</span>
              <span className="hidden sm:inline">No credit card required</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
