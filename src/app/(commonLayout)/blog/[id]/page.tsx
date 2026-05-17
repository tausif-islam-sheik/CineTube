"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { BLOG_POSTS, BlogPost } from "@/data/blog-posts";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  Tag, 
  MessageSquare, 
  Check, 
  Copy, 
  Award, 
  Send,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, useScroll, useSpring } from "framer-motion";

interface Comment {
  id: string;
  name: string;
  comment: string;
  date: string;
}

export default function BlogDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // Find the post (supports lookup by both SEO slug and fallback numeric ID)
  const post = BLOG_POSTS.find((p) => p.slug === id || String(p.id) === id);

  // States
  const [claps, setClaps] = useState(0);
  const [hasClapped, setHasClapped] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [floatingClaps, setFloatingClaps] = useState<{ id: number; y: number }[]>([]);

  // Refs
  const commentSectionRef = useRef<HTMLDivElement>(null);

  // Load claps and comments from localStorage on mount
  useEffect(() => {
    if (!post) return;

    // Load Claps
    const savedClaps = localStorage.getItem(`cinetube-blog-claps-${post.id}`);
    if (savedClaps) {
      setClaps(Number(savedClaps));
    } else {
      setClaps(post.likes);
    }

    const savedHasClapped = localStorage.getItem(`cinetube-blog-has-clapped-${post.id}`);
    if (savedHasClapped) {
      setHasClapped(true);
    }

    // Load Comments
    const savedComments = localStorage.getItem(`cinetube-blog-comments-${post.id}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      // Default placeholder comments to make the page look lively
      const defaultComments: Comment[] = [
        {
          id: "1",
          name: "Emily Watson",
          comment: `This is a phenomenal write-up! I completely agree with the analysis of ${post.id === 1 ? "Titanic's visual design" : post.id === 2 ? "Sarah's use of cyan color tones" : "Inception's complex world building"}. CineTube always puts out the best content.`,
          date: "Jan 16, 2024"
        },
        {
          id: "2",
          name: "David Miller",
          comment: "Added all these recommendations directly to my CineTube Watchlist. Extremely detailed reviews, thanks for the amazing work Alexander!",
          date: "Jan 15, 2024"
        }
      ];
      setComments(defaultComments);
      localStorage.setItem(`cinetube-blog-comments-${post.id}`, JSON.stringify(defaultComments));
    }
  }, [post]);

  // Framer Motion scroll hook for reading progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Handle Claps click
  const handleClap = () => {
    if (!post) return;
    
    const newClaps = claps + 1;
    setClaps(newClaps);
    setHasClapped(true);
    
    localStorage.setItem(`cinetube-blog-claps-${post.id}`, String(newClaps));
    localStorage.setItem(`cinetube-blog-has-clapped-${post.id}`, "true");

    // Float-up animation element trigger
    const newFloatingClap = {
      id: Date.now(),
      y: 0
    };
    setFloatingClaps((prev) => [...prev, newFloatingClap]);

    // Cleanup floating elements after animation
    setTimeout(() => {
      setFloatingClaps((prev) => prev.filter((item) => item.id !== newFloatingClap.id));
    }, 1000);

    toast.success("Thanks for loving this article!", {
      duration: 1000,
      position: "bottom-right",
    });
  };

  // Copy Link to clipboard
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Article link copied to clipboard!");
    }
  };

  // Submit Comment
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentName.trim() || !commentEmail.trim() || !commentText.trim()) {
      toast.error("Please fill in all comment fields");
      return;
    }

    if (!post) return;

    const newComment: Comment = {
      id: String(Date.now()),
      name: commentName.trim(),
      comment: commentText.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`cinetube-blog-comments-${post.id}`, JSON.stringify(updatedComments));

    // Reset inputs
    setCommentName("");
    setCommentEmail("");
    setCommentText("");

    toast.success("Comment published successfully!");
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center flex-col space-y-4">
        <h1 className="text-2xl font-bold text-destructive">Article Not Found</h1>
        <p className="text-muted-foreground">The blog article you are looking for does not exist.</p>
        <Button onClick={() => router.push("/blog")}>Back to Blog Archive</Button>
      </div>
    );
  }

  // Get related/more articles (excluding current one)
  const moreArticles = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 relative overflow-hidden selection:bg-primary selection:text-white">
      {/* Dynamic Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-rose-500 to-purple-600 origin-left z-50 shadow-md"
        style={{ scaleX }}
      />

      {/* Parallax Blurred Hero Banner */}
      <div className="w-full relative h-[45vh] md:h-[55vh] flex items-end overflow-hidden border-b border-border dark:border-white/5 bg-zinc-950">
        {/* Parallax Image Background */}
        <div className="absolute inset-0">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover opacity-35 scale-105 animate-slow-zoom" 
          />
          {/* Radial & linear gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_90%)]" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 md:px-8 pb-10 relative z-10 space-y-6">
          {/* Navigation & Breadcrumb */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-muted border border-border text-foreground hover:text-foreground hover:border-primary/50 transition-all hover:gap-2.5 active:scale-95 w-fit dark:bg-white/5 dark:border-white/10 dark:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Blog
            </Link>
            <div className="flex items-center gap-2 flex-wrap">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-primary">{post.category}</span>
            </div>
          </div>

          <div className="space-y-4 max-w-4xl">
            {/* Tag Badge */}
            <Badge className={cn("text-white border-0 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-gradient-to-r", post.color)}>
              <Tag className="w-3.5 h-3.5 mr-1.5" />
              {post.category}
            </Badge>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight dark:text-shadow-premium">
              {post.title}
            </h1>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 pt-2 text-xs md:text-sm text-muted-foreground border-t border-border dark:border-white/5 pt-4 mt-4">
              <div className="flex items-center gap-2">
                <img 
                  src={post.author.avatar} 
                  alt={post.author.name} 
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/40 shadow-xl"
                />
                <span className="text-zinc-800 dark:text-white font-semibold">{post.author.name}</span>
              </div>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                <span>{post.views} Reads</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <section className="container mx-auto px-4 md:px-8 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Article Body & Comments */}
        <main className="lg:col-span-2 space-y-12 relative z-10">
          
          {/* Article Contents */}
          <article className="prose dark:prose-invert max-w-none space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed text-base md:text-lg">
            {post.content.map((block, idx) => {
              switch (block.type) {
                case "paragraph":
                  // Enhance the first paragraph as a bold lead paragraph
                  const isLead = idx === 0;
                  return (
                    <p 
                      key={idx} 
                      className={cn(
                        "leading-relaxed",
                        isLead 
                          ? "text-lg md:text-xl font-medium text-zinc-850 dark:text-white/90 border-l-2 border-primary pl-4 py-1 italic" 
                          : "text-zinc-700 dark:text-[#c2c8d0]"
                      )}
                    >
                      {block.text}
                    </p>
                  );

                case "heading":
                  if (block.level === 2) {
                    return (
                      <h2 
                        key={idx} 
                        className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white mt-10 mb-4 pb-2 border-b border-border dark:border-white/5 tracking-tight flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-6 rounded bg-primary inline-block shrink-0 group-hover:scale-y-125 transition-transform" />
                        {block.text}
                      </h2>
                    );
                  } else {
                    return (
                      <h3 key={idx} className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white mt-8 mb-3 tracking-tight">
                        {block.text}
                      </h3>
                    );
                  }

                case "quote":
                  return (
                    <blockquote 
                      key={idx} 
                      className="relative p-6 my-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 border-l-4 border-primary shadow-xl dark:from-zinc-950 dark:to-zinc-900"
                    >
                      <div className="absolute top-4 right-6 text-primary/10 select-none text-8xl font-serif leading-none">“</div>
                      <p className="text-lg md:text-xl font-semibold text-zinc-800 dark:text-white italic relative z-10 leading-snug">
                        "{block.text}"
                      </p>
                      {block.author && (
                        <cite className="block mt-3 text-xs md:text-sm font-bold uppercase tracking-wider text-primary not-italic">
                          — {block.author}
                        </cite>
                      )}
                    </blockquote>
                  );

                case "list":
                  return (
                    <ul key={idx} className="space-y-3.5 my-6 pl-1.5">
                      {block.items?.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300">
                          <span className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 text-primary text-xs font-bold shadow-inner shadow-primary/20">
                            ✓
                          </span>
                          <span className="flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  );

                case "media-card":
                  return (
                    <div 
                      key={idx} 
                      className="group/card relative my-10 p-5 rounded-2xl bg-gradient-to-r from-muted/30 to-muted/10 border border-border hover:border-primary/30 shadow-2xl transition-all duration-500 flex flex-col md:flex-row gap-6 items-center dark:from-zinc-950 dark:to-[#161b22] dark:border-white/5"
                    >
                      {/* Image block */}
                      <div className="w-full md:w-56 aspect-[16/10] md:aspect-[4/3] rounded-xl overflow-hidden shrink-0 bg-muted shadow-xl border border-border relative dark:bg-zinc-900 dark:border-white/5">
                        <img 
                          src={block.imageUrl} 
                          alt={block.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>

                      {/* Content block */}
                      <div className="flex-1 space-y-3 text-center md:text-left">
                        <Badge className="text-white border-0 px-2.5 py-0.5 text-[9px] font-bold bg-primary uppercase tracking-widest shadow">
                          CineTube Recommendation
                        </Badge>
                        <h4 className="font-extrabold text-xl text-zinc-900 dark:text-white tracking-tight group-hover/card:text-primary transition-colors">
                          {block.title}
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {block.subtitle}
                        </p>
                        
                        {block.movieLink && (
                          <div className="pt-2">
                            <Link 
                              href={block.movieLink}
                              className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-primary hover:bg-primary/95 text-white text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                            >
                              Explore / Watch Title
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </article>

          {/* Tags cloud & Small Claps in content */}
          <div className="flex flex-wrap items-center justify-between gap-6 py-6 border-t border-b border-border dark:border-white/5">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-3.5 py-1.5 rounded-xl bg-muted border border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/20 transition-all cursor-pointer dark:bg-zinc-950/80 dark:border-white/5 dark:text-zinc-400 dark:hover:text-white"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Quick Claps */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">Loved this write-up?</span>
              <button 
                onClick={handleClap}
                className={cn(
                  "relative p-3.5 rounded-full border transition-all active:scale-90 flex items-center justify-center cursor-pointer",
                  hasClapped 
                    ? "bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20" 
                    : "bg-muted border-border hover:border-primary/40 text-foreground hover:text-foreground dark:bg-white/5 dark:border-white/10 dark:text-zinc-300 dark:hover:text-white"
                )}
              >
                <Heart className={cn("w-5 h-5", hasClapped ? "fill-current" : "")} />
                {floatingClaps.map((clap) => (
                  <motion.span
                    key={clap.id}
                    initial={{ y: 0, opacity: 1, scale: 1 }}
                    animate={{ y: -45, opacity: 0, scale: 1.4 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute font-black text-xs text-red-500 pointer-events-none select-none"
                  >
                    +1 ❤️
                  </motion.span>
                ))}
              </button>
            </div>
          </div>

          {/* Comments Discussion Section */}
          <section ref={commentSectionRef} className="space-y-8 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border dark:border-white/5 pb-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary shrink-0" />
                Discussion ({comments.length})
              </h3>
              <span className="text-xs text-muted-foreground font-medium bg-muted border border-border px-3 py-1 rounded-full w-fit dark:bg-zinc-900 dark:border-white/5">
                All Comments Stored Locally
              </span>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="p-6 rounded-2xl bg-card border border-border backdrop-blur-sm space-y-4 dark:bg-zinc-950/40 dark:border-white/5">
              <h4 className="text-sm font-bold text-zinc-800 dark:text-white uppercase tracking-wider mb-2">Leave a Comment</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Input 
                    type="text" 
                    placeholder="Your Name" 
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="bg-muted/40 border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl dark:bg-zinc-900 dark:border-white/5 dark:hover:border-white/10"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Input 
                    type="email" 
                    placeholder="Your Email" 
                    value={commentEmail}
                    onChange={(e) => setCommentEmail(e.target.value)}
                    className="bg-muted/40 border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl dark:bg-zinc-900 dark:border-white/5 dark:hover:border-white/10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Textarea 
                  placeholder="Share your thoughts on this article..." 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="bg-muted/40 border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 min-h-[120px] rounded-xl dark:bg-zinc-900 dark:border-white/5 dark:hover:border-white/10"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full sm:w-auto px-6 h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Publish Comment
              </Button>
            </form>

            {/* Comment List */}
            <div className="space-y-5">
              {comments.length > 0 ? (
                comments.map((c) => {
                  const initials = c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <div 
                      key={c.id} 
                      className="p-5 rounded-2xl bg-muted/20 border border-border flex gap-4 items-start dark:bg-zinc-950/20 dark:border-white/5 dark:hover:border-white/10 transition-colors"
                    >
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-purple-600/30 border border-primary/20 flex items-center justify-center shrink-0 text-primary font-bold text-sm shadow">
                        {initials}
                      </div>

                      {/* Text details */}
                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center justify-between gap-4">
                          <h4 className="font-bold text-zinc-850 dark:text-white text-sm">{c.name}</h4>
                          <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">{c.date}</span>
                        </div>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
                          {c.comment}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 bg-muted/10 border border-dashed border-border rounded-2xl text-muted-foreground text-sm dark:bg-zinc-950/10 dark:border-zinc-900">
                  No comments yet. Be the first to start the discussion!
                </div>
              )}
            </div>
          </section>
        </main>

        {/* Right Column: Sticky Sidebar */}
        <aside className="space-y-8 relative z-10 lg:sticky lg:top-24 h-fit">
          
          {/* Author Profile */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-card to-background border border-border hover:border-primary/20 transition-all duration-300 shadow-xl space-y-4 dark:from-[#161b22] dark:to-zinc-950 dark:border-white/5">
            <div className="flex items-center gap-3.5 border-b border-border dark:border-white/5 pb-4">
              <img 
                src={post.author.avatar} 
                alt={post.author.name} 
                className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/40 shadow-2xl"
              />
              <div className="space-y-0.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-extrabold uppercase tracking-wider mb-1">
                  <Award className="w-2.5 h-2.5" />
                  {post.author.role}
                </span>
                <h4 className="font-extrabold text-base text-zinc-900 dark:text-white tracking-tight">{post.author.name}</h4>
              </div>
            </div>
            
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {post.author.bio}
            </p>
          </div>

          {/* Share & Clap Card */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-5 dark:bg-[#161b22] dark:border-white/5">
            <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider border-b border-border dark:border-white/5 pb-2">Article Engagement</h4>
            
            {/* Claps Component */}
            <div className="flex items-center justify-between gap-4 p-3 bg-muted border border-border rounded-xl dark:bg-zinc-950/40 dark:border-white/5">
              <div className="space-y-0.5">
                <span className="block font-black text-lg text-zinc-900 dark:text-white">{claps}</span>
                <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Total Claps</span>
              </div>
              <Button 
                onClick={handleClap}
                className={cn(
                  "relative h-12 px-6 rounded-lg text-xs font-bold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer",
                  hasClapped 
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/25 border-0 hover:bg-red-600" 
                    : "bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20 border-0"
                )}
              >
                <Heart className={cn("w-4 h-4 fill-current", hasClapped ? "animate-pulse" : "")} />
                {hasClapped ? "Clapped!" : "Clap Article"}
              </Button>
            </div>

            {/* Sharing Tools */}
            <div className="space-y-3">
              <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Share this Post</span>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`, "_blank")}
                  variant="outline" 
                  className="h-10 border-border bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg flex items-center justify-center gap-1.5 cursor-pointer dark:border-white/5 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white"
                >
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-[10px] font-bold">X</span>
                </Button>
                <Button 
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`, "_blank")}
                  variant="outline" 
                  className="h-10 border-border bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg flex items-center justify-center gap-1.5 cursor-pointer dark:border-white/5 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white"
                >
                  <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                  </svg>
                  <span className="text-[10px] font-bold">FB</span>
                </Button>
                <Button 
                  onClick={handleCopyLink}
                  variant="outline" 
                  className="h-10 border-border bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg flex items-center justify-center gap-1.5 cursor-pointer dark:border-white/5 dark:bg-zinc-900/60 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">Copy</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Related/Recommend Movies Widget */}
          <div className="p-6 rounded-2xl bg-card border border-border shadow-xl space-y-4 dark:bg-[#161b22] dark:border-white/5">
            <h4 className="text-xs font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider border-b border-border dark:border-white/5 pb-2">Related Movies</h4>
            
            <div className="space-y-4">
              {/* Movie Item 1: Titanic */}
              <Link 
                href="/movie/1" 
                className="group/item flex items-center gap-3.5 p-2 bg-muted/40 hover:bg-muted border border-border rounded-xl transition-all duration-300 cursor-pointer dark:bg-zinc-950/40 dark:hover:bg-zinc-950 dark:border-white/5 dark:hover:border-primary/20"
              >
                <img 
                  src="https://images.unsplash.com/photo-1500077423678-25eead48513a?w=100&auto=format&fit=crop&q=80" 
                  alt="Titanic" 
                  className="w-11 h-14 rounded-lg object-cover bg-muted shadow border border-border shrink-0 transition-transform group-hover/item:scale-105 dark:bg-zinc-900 dark:border-white/5"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <h5 className="font-extrabold text-xs text-zinc-900 dark:text-white group-hover/item:text-primary transition-colors truncate">Titanic</h5>
                  <p className="text-[10px] text-muted-foreground font-bold truncate">Disaster • Romance</p>
                  <div className="flex items-center gap-1 text-[10px] text-yellow-400 font-bold">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>8.8</span>
                  </div>
                </div>
              </Link>

              {/* Movie Item 2: Inception */}
              <Link 
                href="/movies"
                className="group/item flex items-center gap-3.5 p-2 bg-muted/40 hover:bg-muted border border-border rounded-xl transition-all duration-300 cursor-pointer dark:bg-zinc-950/40 dark:hover:bg-zinc-950 dark:border-white/5 dark:hover:border-primary/20"
              >
                <img 
                  src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=100&auto=format&fit=crop&q=80" 
                  alt="Inception" 
                  className="w-11 h-14 rounded-lg object-cover bg-muted shadow border border-border shrink-0 transition-transform group-hover/item:scale-105 dark:bg-zinc-900 dark:border-white/5"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <h5 className="font-extrabold text-xs text-zinc-900 dark:text-white group-hover/item:text-primary transition-colors truncate">Inception</h5>
                  <p className="text-[10px] text-muted-foreground font-bold truncate">Sci-Fi • Suspense</p>
                  <div className="flex items-center gap-1 text-[10px] text-yellow-400 font-bold">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>9.2</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </aside>
      </section>

      {/* More Articles bottom slider */}
      <section className="container mx-auto px-4 md:px-8 py-16 border-t border-border relative z-10 space-y-8 dark:border-white/5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
              Continue Browsing
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">More Articles For You</h3>
          </div>
          <Link 
            href="/blog" 
            className="text-xs md:text-sm font-bold text-primary hover:text-primary/80 transition-colors"
          >
            All Articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {moreArticles.map((article) => (
            <Link 
              key={article.id}
              href={`/blog/${article.id}`}
              className="group p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/30 transition-all duration-500 flex flex-col sm:flex-row gap-5 items-center hover:shadow-2xl"
            >
              {/* Cover */}
              <div className="w-full sm:w-44 aspect-[16/10] sm:aspect-square rounded-xl overflow-hidden shrink-0 bg-muted shadow border border-border relative dark:bg-zinc-950 dark:border-white/5">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Text */}
              <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
                <Badge className={cn("text-white border-0 px-2 py-0.5 text-[9px] font-bold uppercase bg-gradient-to-r", article.color)}>
                  {article.category}
                </Badge>
                <h4 className="font-extrabold text-zinc-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-3.5 text-muted-foreground font-bold pt-2 uppercase">
                  <span>{article.date}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
