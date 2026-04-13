"use client";

import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <section className="container mx-auto px-4 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Contact
          </p>
          <h1 className="text-3xl font-black tracking-tight md:text-5xl">
            Get in touch with our team
          </h1>
          <p className="text-muted-foreground md:text-lg">
            Need support, have partnership ideas, or found an issue? Reach us through
            the channels below and we will respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <Mail className="mb-3 h-5 w-5 text-primary" />
            <h2 className="mb-1 font-semibold">Email</h2>
            <a href="mailto:support@cinetube.com" className="text-sm text-muted-foreground hover:text-foreground">
              support@cinetube.com
            </a>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <Phone className="mb-3 h-5 w-5 text-primary" />
            <h2 className="mb-1 font-semibold">Phone</h2>
            <p className="text-sm text-muted-foreground">+1 (555) 245-8812</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <MapPin className="mb-3 h-5 w-5 text-primary" />
            <h2 className="mb-1 font-semibold">Office</h2>
            <p className="text-sm text-muted-foreground">Dhaka, Bangladesh</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Before reaching out, check our{" "}
          <Link href="/faq" className="text-primary hover:underline">
            FAQ page
          </Link>{" "}
          for quick answers.
        </p>
      </div>
    </section>
  );
}
