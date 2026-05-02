"use client";

import { Monitor, Laptop, Tablet, Smartphone, Check, Download, Play, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

/* ===== SECTION: Available On All Devices ===== */
/* Table of Contents:
   - Device data with icons
   - DeviceCard Component
   - App store badges
   - DevicesSection Component
*/

const DEVICES = [
  {
    name: "Smart TV",
    icon: Monitor,
    description: "4K streaming on Samsung, LG, Sony, and more",
    features: ["4K HDR", "Dolby Atmos", "Voice Control"],
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Laptop & Desktop",
    icon: Laptop,
    description: "Full HD experience on any browser",
    features: ["1080p HD", "Keyboard shortcuts", "Picture-in-picture"],
    color: "from-purple-500 to-violet-600",
  },
  {
    name: "Tablet",
    icon: Tablet,
    description: "Perfect for watching on the go",
    features: ["Offline downloads", "Touch controls", "Auto-rotate"],
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Mobile",
    icon: Smartphone,
    description: "Your pocket cinema, always ready",
    features: ["Data saver", "Mobile-optimized", "Push notifications"],
    color: "from-primary to-red-600",
  },
];

interface DeviceCardProps {
  device: typeof DEVICES[0];
}

function DeviceCard({ device }: DeviceCardProps) {
  const Icon = device.icon;

  return (
    <div 
      className={cn(
        "group relative rounded-xl md:rounded-2xl p-4 md:p-6 transition-all duration-500",
        "bg-card border border-border hover:border-primary/30",
        "hover:shadow-lg hover:-translate-y-1"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "w-11 h-11 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-transform duration-500 group-hover:scale-110",
        "bg-gradient-to-br",
        device.color
      )}>
        <Icon className="w-5 h-5 md:w-7 md:h-7 text-white" />
      </div>

      {/* Content */}
      <h3 className="text-base md:text-lg font-bold text-foreground mb-1 md:mb-2">{device.name}</h3>
      <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">{device.description}</p>

      {/* Features */}
      <ul className="space-y-1.5 md:space-y-2">
        {device.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-xs md:text-sm text-foreground/80 leading-tight">
            <Check className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AppStoreBadge({ type }: { type: "apple" | "google" }) {
  if (type === "apple") {
    return (
      <a 
        href="#" 
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 transition-colors"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
        <div className="text-left">
          <p className="text-[10px] leading-none">Download on the</p>
          <p className="text-sm font-bold leading-tight">App Store</p>
        </div>
      </a>
    );
  }

  return (
    <a 
      href="#" 
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black hover:bg-white/90 transition-colors"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.56,12.83L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.56,11.17L6.05,2.66Z"/>
      </svg>
      <div className="text-left">
        <p className="text-[10px] leading-none">GET IT ON</p>
        <p className="text-sm font-bold leading-tight">Google Play</p>
      </div>
    </a>
  );
}

export function DevicesSection() {
  return (
    <section id="devices" className="container mx-auto px-4 md:px-8 py-12 md:py-24">
      <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-medium">
          <Wifi className="w-3 h-3 md:w-3.5 md:h-3.5" />
          Cross-Platform
        </div>
        <h2 className="text-2xl md:text-5xl font-black tracking-tight">
          Available On All Devices
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-lg text-balance px-2 md:px-0">
          Watch on any screen, any time. Seamlessly switch between devices and never miss a moment.
        </p>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-10 md:mb-12">
        {DEVICES.map((device) => (
          <DeviceCard key={device.name} device={device} />
        ))}
      </div>

      {/* App Store Badges */}
      <div className="text-center">
        <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">Download our mobile app</p>
        <div className="flex items-center justify-center gap-2 md:gap-3 px-4">
          <AppStoreBadge type="apple" />
          <AppStoreBadge type="google" />
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 md:mt-10 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
          <span className="flex items-center gap-1 md:gap-1.5">
            <Download className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            Offline viewing
          </span>
          <span className="flex items-center gap-1 md:gap-1.5">
            <Play className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            Continue watching
          </span>
          <span className="flex items-center gap-1 md:gap-1.5">
            <Wifi className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
            Sync across devices
          </span>
        </div>
      </div>
    </section>
  );
}
