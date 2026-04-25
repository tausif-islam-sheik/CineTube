<div align="center">

# 🎬 CineTube

**A modern, full-stack movie streaming and discovery platform**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff?logo=stripe)](https://stripe.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Live Demo](https://cinetube-omega.vercel.app) · [Backend Repository](https://github.com/tausif-islam-sheik/CineTube-Server)

</div>

---

## 📖 Overview

CineTube is a movie streaming portal built with a modern full-stack architecture. Users can discover trending, popular, and upcoming movies, build personal watchlists, and unlock premium content through a Stripe-powered subscription system — all wrapped in a responsive, theme-aware UI.

---

## ✨ Features

### 👤 User-Facing
- **Authentication** — Secure sign-up, login, email verification, and password reset powered by Better Auth with HTTP-only cookies
- **Movie Discovery** — Browse curated categories: Trending, Popular, and Upcoming
- **Real-time Search** — Instantly find movies by title or keyword
- **Watchlist** — Save and manage a personal movie collection
- **Subscription Plans** — Choose from Basic, Standard, or Premium tiers with Stripe checkout
- **Responsive Design** — Optimized for desktop, tablet, and mobile viewports
- **Dark / Light Mode** — System-aware theme toggle

### 🛠️ Admin Panel
- **Dashboard Analytics** — Platform-wide statistics at a glance
- **Movie Management** — Create, edit, and delete movie entries
- **User Management** — View and manage all registered users
- **Subscription Overview** — Monitor active subscriptions across plans

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 | SSR, routing, and API routes |
| **Language** | TypeScript | Type safety across the codebase |
| **Styling** | Tailwind CSS 4 | Utility-first responsive design |
| **UI Components** | shadcn/ui | Accessible, composable component library |
| **Authentication** | Better Auth | Session management with HTTP-only cookies |
| **Payments** | Stripe | Subscription billing and checkout |
| **Server State** | TanStack Query | Data fetching, caching, and synchronization |
| **Forms** | React Hook Form + Zod | Validated, type-safe form handling |

---

## 📁 Project Structure

```
cinetube/
├── src/app/                    # Next.js pages and routes
│   ├── (commonLayout)/         # Pages with shared layout
│   │   ├── (auth)/             # Login, register, forgot-password
│   │   ├── (admin)/            # Admin dashboard
│   │   └── movies/             # Movie listing pages
│   └── api/                    # API routes (Stripe checkout)
├── src/components/             # React components
│   ├── layout/                 # Navbar, footer
│   ├── movie/                  # Movie cards, lists
│   └── ui/                     # shadcn/ui components
├── src/lib/                    # Utilities and configurations
│   ├── auth-client.ts          # Better Auth setup
│   └── utils.ts                # Helper functions
├── src/hooks/                  # Custom React hooks
└── public/                     # Static images and assets
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by [Tausif Islam Sheik](https://github.com/tausif-islam-sheik)

</div>

<img width="1920" height="5895" alt="CineTube" src="https://github.com/user-attachments/assets/a1cb1e47-186b-4e78-8f0f-85a15bd9488f" />

