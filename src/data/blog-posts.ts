export interface BlogSectionContent {
  type: "paragraph" | "heading" | "quote" | "list" | "media-card";
  text?: string;
  level?: number; // for heading
  items?: string[]; // for lists
  author?: string; // for quote
  title?: string; // for media-card
  subtitle?: string; // for media-card
  imageUrl?: string; // for media-card
  movieLink?: string; // for media-card (optional link to real movies)
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  readTime: string;
  color: string;
  tags: string[];
  views: number;
  likes: number;
  author: {
    name: string;
    avatar: string;
    role: string;
    bio: string;
  };
  content: BlogSectionContent[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "top-10-hidden-gems-you-missed-in-2024",
    title: "Top 10 Hidden Gems You Missed in 2024",
    excerpt: "Our editors scour through thousands of titles to bring you the most underrated masterpieces that flew under the radar this year.",
    category: "Top Lists",
    date: "Jan 15, 2024",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=60",
    readTime: "5 min read",
    color: "from-purple-500 to-indigo-600",
    tags: ["Underrated", "Cinematic", "Must Watch", "Best of 2024"],
    views: 1245,
    likes: 312,
    author: {
      name: "Alexander Vance",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      role: "Senior Movie Critic",
      bio: "Alexander has been writing about cinema for over a decade. His favorite directors include Denis Villeneuve and Christopher Nolan."
    },
    content: [
      {
        type: "paragraph",
        text: "Every year, blockbusters steal the headlines and dominate theater screens worldwide. But beyond the flashing lights of massive marketing campaigns lies a treasure trove of cinematic brilliance—underrated indie projects, foreign masterpieces, and small-scale thrillers that deserve just as much, if not more, attention. This year, we’ve done the heavy lifting for you."
      },
      {
        type: "paragraph",
        text: "Our editors have scoured thousands of streaming platforms, festival archives, and arthouse rosters to bring you ten masterpieces that you probably missed in 2024. These films push boundaries, challenge narratives, and offer raw storytelling that will stick with you long after the credits roll."
      },
      {
        type: "heading",
        level: 2,
        text: "The Return of Intimate Storytelling"
      },
      {
        type: "paragraph",
        text: "What makes a 'hidden gem'? For us, it’s a movie that blends outstanding performances, tight direction, and unique conceptual risks, yet failed to secure wide distribution or got buried in algorithm pools. In 2024, the trend shifted heavily toward character studies—movies focusing on close-up relationships, quiet dread, and deep emotional resonance."
      },
      {
        type: "quote",
        text: "True cinema doesn’t shout to get your attention; it whispers so that you lean closer to hear its secrets.",
        author: "Alexander Vance"
      },
      {
        type: "heading",
        level: 2,
        text: "Our Top Recommendations"
      },
      {
        type: "paragraph",
        text: "Here are three standout films we highly encourage you to queue up tonight. You can stream these right now on CineTube using the links in the cards below:"
      },
      {
        type: "media-card",
        title: "Titanic (Remastered)",
        subtitle: "The timeless romantic disaster classic, brought to life with pristine high-fidelity details.",
        imageUrl: "https://images.unsplash.com/photo-1500077423678-25eead48513a?w=800&auto=format&fit=crop&q=60",
        movieLink: "/movie/1" // Example routing
      },
      {
        type: "paragraph",
        text: "Revisiting classic storytelling reminds us of the grandeur and emotional pull of early blockbusters. The meticulous pacing and stunning scale serve as an ongoing benchmark for modern directors looking to match scale with romance."
      },
      {
        type: "heading",
        level: 3,
        text: "Why You Should Step Outside Your Comfort Zone"
      },
      {
        type: "paragraph",
        text: "It is incredibly easy to fall into the trap of comfortable algorithms—clicking whatever is currently trending on your dashboard. However, stepping off the beaten path is where the magic of cinema truly resides. Here is why you should try these underrated selections:"
      },
      {
        type: "list",
        items: [
          "Unique narrative risks that massive studio budgets can never afford.",
          "Dazzling performances from breakout actors and newcomer international directors.",
          "Visually striking cinematography that makes full use of shadows and lighting.",
          "Genuine surprises—no formulaic plots or predictable cookie-cutter endings."
        ]
      },
      {
        type: "paragraph",
        text: "Stay tuned as we update this list monthly with more hidden gems. Drop a comment below if you have watched any of these, and share your own underrated discoveries!"
      }
    ]
  },
  {
    id: 2,
    slug: "interview-director-sarah-chen-on-her-latest-thriller",
    title: "Interview: Director Sarah Chen on Her Latest Thriller",
    excerpt: "We sat down with the visionary director to discuss her creative process, the challenges of modern filmmaking, and what's next.",
    category: "Interviews",
    date: "Jan 12, 2024",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=60",
    readTime: "8 min read",
    color: "from-primary to-red-600",
    tags: ["Interviews", "Directing", "Thriller", "Behind The Scenes"],
    views: 2410,
    likes: 589,
    author: {
      name: "Sophia Martinez",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      role: "Editorial Director",
      bio: "Sophia manages the CineTube blog, conducting interviews with industry veterans and covering global film festivals."
    },
    content: [
      {
        type: "paragraph",
        text: "Sarah Chen is quickly becoming one of the most exciting voices in modern cinema. Known for her tight pacing, heavy atmosphere, and morally gray characters, her latest mystery thriller has left audiences and critics alike absolutely breathless. We had the pleasure of sitting down with Sarah in her Seattle studio to talk about her inspiration, lighting techniques, and the future of suspense."
      },
      {
        type: "heading",
        level: 2,
        text: "The Birth of Suspense"
      },
      {
        type: "paragraph",
        text: "CineTube: Sarah, thank you for joining us. Let's start with the central hook of your film. Where did the idea come from?"
      },
      {
        type: "paragraph",
        text: "Sarah Chen: Thanks for having me! Honestly, the idea grew from a simple feeling of isolation. During a residency in Maine, I spent three weeks in a cabin surrounded by dense pine forests. The absolute silence at night wasn't peaceful—it was terrifying. Every creak of the floorboards felt like an intrusion. I wanted to capture that exact psychological dread, where your own mind becomes your worst enemy."
      },
      {
        type: "quote",
        text: "In a great thriller, the monster isn’t hiding in the dark closet; the monster is your own guilt projected onto the shadows around you.",
        author: "Sarah Chen"
      },
      {
        type: "heading",
        level: 2,
        text: "Crafting the Visual Identity"
      },
      {
        type: "paragraph",
        text: "CineTube: The lighting in your film is extraordinary. The heavy use of deep reds and contrasting blue tones makes every frame feel like a painting. Can you talk about your collaboration with your DP?"
      },
      {
        type: "paragraph",
        text: "Sarah Chen: Yes! My Director of Photography and I spent weeks researching classic neo-noir and German Expressionism. We wanted the environment itself to mirror the protagonist's mental decay. We decided to restrict our color palette almost entirely. Every time a character lies, we hit them with a subtle cyan key light. By the final act, the whole frame is bathed in a sickly cyan and red. It's a visual language that operates sub-consciously."
      },
      {
        type: "heading",
        level: 3,
        text: "Sarah's Top Filmmaking Rules"
      },
      {
        type: "paragraph",
        text: "We asked Sarah to share her golden guidelines for young, aspiring directors looking to break into the psychological thriller genre:"
      },
      {
        type: "list",
        items: [
          "Sound design is 60% of the horror. What the audience hears is ten times more evocative than what they see.",
          "Keep your characters compromised. Flawed protagonists make the stakes feel immediate and dangerous.",
          "Respect the silence. Constant music dilutes tension. Build your silence and then break it with deliberate impact.",
          "Location is a character. Spend time finding spaces that tell their own history and reflect the character's journey."
        ]
      },
      {
        type: "paragraph",
        text: "Sarah's film has cemented her place as a director to watch. If you want to dive into gripping thrillers with similar visual flair, you can browse our curated suspense catalog in the CineTube dashboard right now!"
      }
    ]
  },
  {
    id: 3,
    slug: "new-arrivals-this-week-january-edition",
    title: "New Arrivals This Week: January Edition",
    excerpt: "Discover the hottest movies and series landing on CineTube this week. From blockbuster hits to indie darlings, we've got you covered.",
    category: "New Releases",
    date: "Jan 10, 2024",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=60",
    readTime: "4 min read",
    color: "from-emerald-500 to-teal-600",
    tags: ["New Releases", "CineTube Originals", "Streaming Now", "Series"],
    views: 3105,
    likes: 824,
    author: {
      name: "Marcus Thompson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      role: "Content Curator",
      bio: "Marcus spends day and night scouting for the latest additions to the streaming library, ensuring you always have something spectacular to watch."
    },
    content: [
      {
        type: "paragraph",
        text: "Welcome back, cinephiles! Happy New Year. As we kick off January 2024, our streaming servers are buzzing with spectacular fresh content. Whether you're looking for heart-pounding sci-fi, gripping true crime documentaries, or a heartwarming family drama to cozy up with, this week's lineup is absolutely packed."
      },
      {
        type: "paragraph",
        text: "Here is your definitive guide to the major releases landing on CineTube starting this Friday. Get your popcorn ready!"
      },
      {
        type: "heading",
        level: 2,
        text: "Highlighted Releases of the Week"
      },
      {
        type: "paragraph",
        text: "Check out these featured films that are trending heavily across our global platform:"
      },
      {
        type: "media-card",
        title: "Inception (Sci-Fi / Thriller)",
        subtitle: "Enter the dream within a dream. A heist movie where the treasure is an idea, and the vault is the human mind.",
        imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=60",
        movieLink: "/movies" // Dynamic category list
      },
      {
        type: "paragraph",
        text: "This modern classic remains one of the absolute peaks of high-concept cinema. The complex narrative layers, combined with breathtaking visual effects and Hans Zimmer's iconic score, make it an essential repeat-watch."
      },
      {
        type: "heading",
        level: 2,
        text: "What Else is Dropping?"
      },
      {
        type: "paragraph",
        text: "In addition to our headline blockbusters, we're expanding our library with highly anticipated series, documentaries, and foreign language imports:"
      },
      {
        type: "list",
        items: [
          "The Deep Blue: A breathtaking 6-part nature documentary series exploring the uncharted hydrothermal vents of the Pacific Ocean.",
          "Chrono-Cross: An edge-of-your-seat dystopian anime series about time travel, parallel universes, and high school friendships.",
          "Parisian Whispers: A quiet, beautiful French romance set against the rainy autumn streets of Montmartre.",
          "Code Red: A fast-paced cyberpunk heist movie filled with neon hacking rooms, synthwave beats, and high-octane motorbike chases."
        ]
      },
      {
        type: "quote",
        text: "Our January slate is designed to give you a balance of pure action escapism and thought-provoking storytelling. There is a story waiting here for every single mood.",
        author: "Marcus Thompson"
      },
      {
        type: "paragraph",
        text: "All releases are available in stunning Ultra-HD 4K with Dolby Atmos sound support for our Premium and VIP subscribers. Not a subscriber yet? Head over to our plans page to upgrade in one click and start watching instantly!"
      }
    ]
  }
];
