import Link from "next/link";
import { Globe, Mail, PlayCircle, Popcorn, Share2, Tv } from "lucide-react";

const PRODUCT_LINKS = [
  { href: "/discover", label: "Discover Movies" },
  { href: "/discover?type=series", label: "Discover Series" },
  { href: "/watchlist", label: "My Watchlist" },
  { href: "/pricing", label: "Plans & Pricing" },
];

const COMPANY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
  { href: "/profile", label: "Profile" },
];

const SUPPORT_LINKS = [
  { href: "mailto:support@cinetube.com", label: "support@cinetube.com" },
  { href: "mailto:partnerships@cinetube.com", label: "partnerships@cinetube.com" },
];

const SOCIAL_LINKS = [
  { href: "https://x.com", label: "Twitter", icon: Share2 },
  { href: "https://youtube.com", label: "YouTube", icon: PlayCircle },
  { href: "https://instagram.com", label: "Instagram", icon: Tv },
  { href: "https://facebook.com", label: "Facebook", icon: Globe },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-border bg-background/95">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <Popcorn className="h-5 w-5 text-primary" />
              <span className="text-base font-extrabold tracking-tight text-foreground">
                CINE<span className="text-primary">TUBE</span>+
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              CineTube brings premium movies and series together with smart discovery,
              personalized watchlists, and cinematic streaming experiences.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <a href="mailto:hello@cinetube.com" className="hover:text-foreground transition-colors">
                hello@cinetube.com
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Product</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Company</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Support</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-foreground">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} CineTube. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/faq" className="transition-colors hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/about" className="transition-colors hover:text-foreground">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
