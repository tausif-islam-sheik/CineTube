<div align="center">

# 🎬 CineTube

**A modern, Full-Stack movie streaming and discovery platform**

![Next.js](https://img.shields.io/badge/next.js@16-0a0a0a?style=for-the-badge&logo=next.js&logoColor=e5e5e5)
![TypeScript](https://img.shields.io/badge/typescript@5-10193e?style=for-the-badge&logo=typescript&logoColor=7aa3ff)
![Express.js](https://img.shields.io/badge/express.js-141414?style=for-the-badge&logo=express&logoColor=c0c0c0)
![PostgreSQL](https://img.shields.io/badge/postgresql-071525?style=for-the-badge&logo=postgresql&logoColor=6db3e8)
![MIT](https://img.shields.io/badge/mit_license-140d00?style=for-the-badge&logoColor=f59e0b)

[Live Demo](https://cinetube-omega.vercel.app) · [Backend Repository](https://github.com/tausif-islam-sheik/CineTube-Server)

</div>

---

## 📖 Overview

**CineTube** is a full-stack movie streaming platform where users can discover trending, popular, and upcoming films, manage a personal watchlist, and access premium content through a secure Stripe-powered subscription. All within a sleek, responsive, and theme-aware interface.

---

## ❓ Problem Statement

Movie enthusiasts face several challenges when trying to stream content online:
- **Fragmented Discovery** — Movies are scattered across multiple platforms, making it hard to find what to watch
- **No Centralized Watchlist** — Users struggle to keep track of movies they want to watch later
- **Complex Payment Systems** — Managing subscriptions across different services is inconvenient
- **Poor Mobile Experience** — Many streaming platforms aren't optimized for mobile viewing
- **Lack of Admin Tools** — Content creators need better tools to manage their movie catalog

---

## 💡 Solution Overview

CineTube solves these problems by providing:
- **Unified Discovery Hub** — Browse trending, popular, and upcoming movies in one place with smart filtering and search
- **Personal Watchlist** — Save movies with one click and manage your viewing queue effortlessly
- **Seamless Payments** — Integrated Stripe checkout for quick, secure subscription upgrades
- **Responsive Design** — Optimized experience across desktop, tablet, and mobile devices
- **Admin Dashboard** — Complete content management system for adding, editing, and organizing movies

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
├── src/app/                           # Next.js pages and routes
│   ├── (commonLayout)/                # Pages with shared layout
│   │   ├── (auth)/                    # Login, register, forgot-password
│   │   ├── about/                     # About page
│   │   ├── binge/                     # Binge zone page
│   │   ├── checkout/                  # Stripe checkout
│   │   ├── contact/                   # Contact page
│   │   ├── discover/                    # Discover movies
│   │   ├── free/                      # Free movies section
│   │   ├── movie/                     # Individual movie details
│   │   ├── movies/                    # Movie listing
│   │   ├── my-reviews/                # User reviews
│   │   ├── new-releases/              # New releases page
│   │   ├── pricing/                   # Subscription plans
│   │   ├── profile/                   # User profile
│   │   ├── recommended/               # Recommendations
│   │   ├── series/                    # TV series page
│   │   ├── trailers/                  # Movie trailers
│   │   └── watchlist/                 # User watchlist
│   ├── (dashboardLayout)/              # Admin dashboard routes
│   ├── layout.tsx                     # Root layout
│   └── globals.css                    # Global styles
├── src/components/                    # React components
│   ├── admin/                         # Admin panel components
│   ├── home/                          # Homepage sections
│   ├── layout/                        # Navbar, footer
│   ├── movies/                        # Movie-related components
│   ├── navbar/                        # Navigation components
│   ├── providers/                     # Context providers
│   ├── reviews/                       # Review components
│   ├── shared/                        # Shared/reusable components
│   ├── ui/                            # shadcn/ui components
│   └── watchlist/                     # Watchlist components
├── src/hooks/                         # Custom React hooks
├── src/lib/                           # Utilities and configurations
├── src/types/                         # TypeScript type definitions
└── public/                            # Static images and assets
```

---

## � Setup Instructions

### Prerequisites
- Node.js 18+ and pnpm/npm/yarn
- Backend API running ([CineTube Server](https://github.com/tausif-islam-sheik/CineTube-Server))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tausif-islam-sheik/CineTube.git
   cd cinetube
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables (see below).

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
pnpm build
pnpm start
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_BACKEND_URL` | Backend API base URL (e.g., `http://localhost:5000`) | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | Your app URL (e.g., `http://localhost:3000`) | ✅ Yes |

### Example `.env.local`
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Note**: Never commit your `.env.local` file to version control. It's already added to `.gitignore`.

---

## �� License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Made with by [Tausif Islam Sheik](https://github.com/tausif-islam-sheik)

</div>

## 📸 Screenshot

<img width="1152" height="8831" alt="CineTube" src="https://github.com/user-attachments/assets/8cd1c961-3a3f-4c53-9cec-234a4c2a95c0" />




