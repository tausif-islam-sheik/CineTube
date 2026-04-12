"use client";

import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-8"
      >
        <XCircle className="w-10 h-10 text-zinc-400" />
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold text-white mb-4"
      >
        Payment Cancelled
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-zinc-400 max-w-sm mb-8"
      >
        No worries! If you change your mind, we'll be here waiting for you to join our cinematic community.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Link href="/">
          <Button variant="ghost" className="text-white font-medium gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
