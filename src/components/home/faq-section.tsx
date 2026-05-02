"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/* ===== SECTION: FAQ Section ===== */
/* Table of Contents:
   - FAQ data
   - FAQItem Component with accordion
   - FAQSection Component
   - Features: Pure CSS/JS accordion, no library needed
*/

const FAQ_ITEMS = [
  {
    question: "Is there a free plan available?",
    answer: "Yes! CineTube offers a completely free tier that gives you access to thousands of movies and series with ad-supported streaming. You can watch in HD quality on one device at a time. Upgrade anytime to remove ads and unlock premium content.",
  },
  {
    question: "Can I download movies for offline viewing?",
    answer: "Absolutely! Both our Standard and Premium plans include offline downloads. You can download up to 10 titles on Standard or unlimited on Premium. Downloads are available on mobile and tablet apps, perfect for flights or commutes.",
  },
  {
    question: "How many screens can I watch on at once?",
    answer: "Free plan supports 1 screen, Standard plan supports 3 simultaneous streams, and Premium plan supports 5 screens at once. This means your whole household can enjoy different content on their own devices simultaneously.",
  },
  {
    question: "What devices are supported?",
    answer: "CineTube works on virtually every device: Smart TVs (Samsung, LG, Sony), streaming devices (Roku, Apple TV, Fire TV, Chromecast), gaming consoles (PS5, Xbox), mobile devices (iOS & Android), and any web browser. We also have dedicated apps for Windows and macOS.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time with no questions asked. Your access continues until the end of your current billing period. We also offer a 7-day money-back guarantee for new subscribers if you're not completely satisfied.",
  },
  {
    question: "Is content available in my country?",
    answer: "CineTube is available in 150+ countries worldwide. While our catalog varies by region due to licensing agreements, we work hard to offer the best selection everywhere. Use our discover page to see what's available in your location, or connect with a VPN for additional content.",
  },
  {
    question: "What video quality do you offer?",
    answer: "Free plan includes HD (720p) streaming. Standard plan upgrades you to Full HD (1080p). Premium members enjoy 4K Ultra HD and HDR content where available. All plans automatically adjust quality based on your internet connection to ensure smooth playback.",
  },
  {
    question: "Do you offer subtitles and multiple languages?",
    answer: "Yes! Most of our content includes subtitles in 20+ languages and many titles offer audio dubbing. You can customize subtitle appearance including font size, color, and background. Accessibility features like closed captions and audio descriptions are also available.",
  },
];

interface FAQItemProps {
  item: typeof FAQ_ITEMS[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQItem({ item, isOpen, onToggle, index }: FAQItemProps) {
  return (
    <div 
      className={cn(
        "border border-border rounded-xl overflow-hidden transition-all duration-300",
        isOpen ? "bg-card shadow-lg" : "bg-card/50 hover:bg-card"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-primary/60">{String(index + 1).padStart(2, '0')}</span>
          <span className="font-semibold text-foreground pr-4">{item.question}</span>
        </div>
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
          isOpen ? "bg-primary text-primary-foreground rotate-180" : "bg-muted text-muted-foreground"
        )}>
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>
      
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-5 pb-5 pt-0">
          <div className="pl-6 border-l-2 border-primary/20">
            <p className="text-muted-foreground leading-relaxed">
              {item.answer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="container mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <HelpCircle className="w-3.5 h-3.5" />
            Support
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            Everything you need to know about streaming with CineTube
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
