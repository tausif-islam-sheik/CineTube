"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const { data: session, refetch } = useSession();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      router.replace("/");
      return;
    }

    // Trigger confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Revalidate session so UI updates to show "PREMIUM" status if Better Auth synced properly from Webhook
    setVerifying(true);
    refetch().finally(() => {
        setVerifying(false);
    });

    return () => clearInterval(interval);
  }, [sessionId, router, refetch]);

  if (!sessionId) return null;

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in zoom-in duration-500">
      <div className="mb-8 relative">
         <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full" />
         <CheckCircle className="w-24 h-24 text-green-500 relative z-10" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Payment Successful!</h1>
      <p className="text-xl text-muted-foreground max-w-lg mb-8">
        Welcome to Premium. Your account has been upgraded and you now have full access to our cinematic library.
      </p>

      {verifying ? (
        <div className="text-sm text-muted-foreground animate-pulse mb-8">
           Verifying account status...
        </div>
      ) : null}

      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
         <Link href="/discover" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2">
               Start Watching <ArrowRight className="w-5 h-5" />
            </Button>
         </Link>
         <Link href="/profile" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
               View Account
            </Button>
         </Link>
      </div>
    </div>
  );
}
