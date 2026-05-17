"use client";

import { ArrowRight, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BLOG_POSTS } from "@/data/blog-posts";

/* ===== SECTION: Blog / What's New ===== */
/* Table of Contents:
   - BlogCard Component
   - BlogSection Component
   - Features: 3-column grid, category tags, excerpts
*/

interface BlogCardProps {
  post: typeof BLOG_POSTS[0];
  index: number;
}

function BlogCard({ post, index }: BlogCardProps) {
  return (
    <article 
      className="group relative rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-xl"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <Badge className={cn(
            "text-white border-0 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gradient-to-r",
            post.color
          )}>
            <Tag className="w-3 h-3 mr-1" />
            {post.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Date & Read Time */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{post.date}</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>{post.readTime}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Read More Link */}
        <Link 
          href={`/blog/${post.slug}`} 
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
        >
          Read More
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}

export function BlogSection() {
  return (
    <section id="blog" className="container mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
            <Tag className="w-3.5 h-3.5" />
            Latest Updates
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            From The Blog
          </h2>
          <p className="text-muted-foreground max-w-xl">
            News, interviews, recommendations and more from the CineTube team
          </p>
        </div>
        <Link 
          href="/blog" 
          className="text-sm font-bold text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
        >
          View All Articles →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </section>
  );
}
