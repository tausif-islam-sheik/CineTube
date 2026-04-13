"use client";

const FAQ_ITEMS = [
  {
    question: "How do I rate a movie or series?",
    answer:
      "Open a title page, sign in, and submit your rating with a review in the review section.",
  },
  {
    question: "Why can I not watch premium content?",
    answer:
      "Premium titles require an active subscription. You can upgrade from the pricing page.",
  },
  {
    question: "Can I edit my review later?",
    answer:
      "Yes. Reviews can be edited while unpublished, then they are re-checked by moderation.",
  },
  {
    question: "How does watchlist work?",
    answer:
      "Click Add to Watchlist on any title to save it. You can manage all saved titles in your watchlist page.",
  },
];

export default function FaqPage() {
  return (
    <section className="container mx-auto px-4 py-12 md:px-8 md:py-20">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            FAQ
          </p>
          <h1 className="text-3xl font-black tracking-tight md:text-5xl">
            Frequently asked questions
          </h1>
          <p className="text-muted-foreground md:text-lg">
            Quick answers about accounts, subscriptions, ratings, and watchlists.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question} className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-2 font-semibold">{item.question}</h2>
              <p className="text-sm text-muted-foreground">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
