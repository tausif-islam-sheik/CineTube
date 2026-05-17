"use client";

import { useState } from "react";
import { BLOG_POSTS } from "@/data/blog-posts";
import Link from "next/link";
import { ArrowRight, Calendar, Clock, Eye, Heart, Search, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Top Lists", "Interviews", "New Releases"];

export default function BlogListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Filtering logic
  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-10%] w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[100px] pointer-events-none" />

      {/* Hero Header Section */}
      <header className="relative z-10 border-b border-border dark:border-white/5 bg-card/40 dark:bg-zinc-950/40 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-24 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider"
          >
            <Tag className="w-3.5 h-3.5" />
            CineTube+ Newsroom
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-500 dark:from-white dark:via-zinc-200 dark:to-zinc-500 bg-clip-text text-transparent"
          >
            Stories, Lists & Deep Dives
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Stay updated with the latest cinematic recommendations, director interviews, weekly new arrivals, and expert commentary from the CineTube team.
          </motion.p>
        </div>
      </header>

      {/* Filter and Search Bar Section */}
      <section className="container mx-auto px-4 md:px-8 py-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 rounded-2xl bg-card/50 border border-border backdrop-blur-sm">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-hide py-1">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer",
                  activeCategory === category
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border dark:bg-zinc-900/60 dark:hover:bg-zinc-800 dark:border-white/5"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search articles or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-muted/40 border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/30 rounded-xl transition-all dark:bg-zinc-950/60 dark:border-white/5 dark:hover:border-white/10"
            />
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <main className="container mx-auto px-4 md:px-8 py-6 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map((post, index) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  key={post.id}
                  className="group relative flex flex-col h-full rounded-2xl overflow-hidden bg-card border border-border/80 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                >
                  {/* Glowing Outline Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Image Div */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-950 shrink-0">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={cn(
                          "text-white border-0 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r",
                          post.color
                        )}
                      >
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content Div */}
                  <div className="flex flex-col flex-1 p-6 space-y-4 relative z-10">
                    {/* Meta Section */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{post.readTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-xl text-zinc-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                      {post.excerpt}
                    </p>

                    {/* Tags List */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-muted border border-border text-[10px] text-muted-foreground font-medium dark:bg-zinc-900 dark:border-white/5 dark:text-zinc-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer Info / Link */}
                    <div className="flex items-center justify-between pt-4 border-t border-border dark:border-white/5 mt-auto">
                      {/* Author */}
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-white/10"
                        />
                        <span className="text-xs text-muted-foreground font-medium line-clamp-1">
                          {post.author.name}
                        </span>
                      </div>

                      {/* Read Button */}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:gap-2 transition-all"
                      >
                        Read Post
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-muted/10 border border-dashed border-border rounded-3xl space-y-4 max-w-md mx-auto dark:bg-zinc-950/20 dark:border-zinc-800"
            >
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground dark:bg-zinc-900">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white">No articles found</h3>
                <p className="text-sm text-muted-foreground">
                  We couldn't find any articles matching your search query or filter. Try adjusting your terms!
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
                className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
