"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Ticket, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (sessionId) {
      console.log("Payment successful for session:", sessionId);
    }
  }, [sessionId]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-8"
      >
        <CheckCircle2 className="w-12 h-12 text-primary" />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center max-w-lg space-y-6"
      >
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">Welcome to the Inner Circle</h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Your payment was successful and your account has been upgraded. You now have unlimited access to our entire premium catalog.
        </p>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/discover" className="w-full sm:w-auto">
            <Button size="lg" className="w-full rounded-full h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold gap-2">
              <Play className="w-5 h-5 fill-current" />
              Start Watching
            </Button>
          </Link>
          <Link href="/watchlist" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full rounded-full h-14 px-8 border-white/10 hover:bg-white/5 text-white font-bold gap-2">
              <Ticket className="w-5 h-5" />
              View Watchlist
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
