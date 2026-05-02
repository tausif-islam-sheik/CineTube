/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

/* ===== SECTION: User Testimonials / Community Reviews ===== */
/* Table of Contents:
   - TestimonialCard Component
   - Testimonials Section Component
   - Features: Carousel, star ratings, user avatars
*/

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Mitchell",
    country: "US",
    flag: "🇺🇸",
    avatar: "SM",
    rating: 5,
    review: "CineTube completely changed how I discover movies. The recommendations are spot-on, and I love the community reviews. Found so many hidden gems I never would have watched otherwise!",
    movieReviewed: "Inception",
    color: "from-purple-500 to-indigo-600",
  },
  {
    id: 2,
    name: "Raj Patel",
    country: "IN",
    flag: "🇮🇳",
    avatar: "RP",
    rating: 5,
    review: "The streaming quality is incredible, even on my older TV. The download feature for premium members is a game-changer for my commute. Best platform I've used by far.",
    movieReviewed: "The Dark Knight",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: 3,
    name: "Emma Larsson",
    country: "SE",
    flag: "🇸🇪",
    avatar: "EL",
    rating: 4,
    review: "As a film student, I appreciate the depth of information available for each title. The director interviews and behind-the-scenes content are invaluable resources.",
    movieReviewed: "Parasite",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: 4,
    name: "Michael Chen",
    country: "AU",
    flag: "🇦🇺",
    avatar: "MC",
    rating: 5,
    review: "Finally a streaming service that understands movie lovers! The curated collections and editor picks have introduced me to incredible international cinema. Worth every penny.",
    movieReviewed: "Spirited Away",
    color: "from-amber-500 to-orange-600",
  },
];

interface TestimonialCardProps {
  testimonial: typeof TESTIMONIALS[0];
  isActive: boolean;
}

function TestimonialCard({ testimonial, isActive }: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "relative p-6 md:p-8 rounded-2xl transition-all duration-500",
        "bg-card border border-border",
        isActive ? "scale-100 opacity-100" : "scale-95 opacity-70"
      )}
    >
      {/* Quote Icon */}
      <div className={cn(
        "absolute -top-3 -left-3 w-10 h-10 rounded-xl flex items-center justify-center",
        "bg-gradient-to-br",
        testimonial.color
      )}>
        <Quote className="w-5 h-5 text-white" />
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "w-4 h-4",
              i < testimonial.rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-muted-foreground"
            )}
          />
        ))}
      </div>

      {/* Review Text */}
      <p className="text-foreground/90 text-sm md:text-base leading-relaxed mb-6 line-clamp-4">
        &ldquo;{testimonial.review}&rdquo;
      </p>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm",
          "bg-gradient-to-br",
          testimonial.color
        )}>
          {testimonial.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground truncate">{testimonial.name}</p>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>{testimonial.flag}</span>
            <span>{testimonial.country}</span>
            <span className="mx-1">•</span>
            <span className="text-primary font-medium">Reviewed {testimonial.movieReviewed}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const visibleTestimonials = isMobile 
    ? [TESTIMONIALS[currentIndex]]
    : TESTIMONIALS.slice(currentIndex, currentIndex + 3).length >= 3 
      ? TESTIMONIALS.slice(currentIndex, currentIndex + 3)
      : [...TESTIMONIALS.slice(currentIndex), ...TESTIMONIALS.slice(0, 3 - (TESTIMONIALS.length - currentIndex))];

  return (
    <section id="testimonials" className="container mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Star className="w-3.5 h-3.5 fill-current" />
            Community
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground max-w-xl">
            Join millions of movie lovers who trust CineTube for their entertainment
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full border border-border bg-card hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full border border-border bg-card hover:bg-muted flex items-center justify-center transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Testimonials Grid/Carousel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleTestimonials.map((testimonial, index) => (
          <TestimonialCard 
            key={testimonial.id} 
            testimonial={testimonial} 
            isActive={index === 0 || !isMobile}
          />
        ))}
      </div>

      {/* Pagination Dots (Mobile) */}
      {isMobile && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "w-6 bg-primary" 
                  : "w-2 bg-muted-foreground/30"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
