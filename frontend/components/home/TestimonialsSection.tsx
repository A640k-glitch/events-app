"use client";

import { Star } from "lucide-react";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "FifthLab Nexus reduced our event demo request response time from 3 days to under 90 seconds. The zero-manual-entry lead pipeline is a game changer for enterprise sales ops.",
      author: "Jonathan Hayes",
      title: "VP of Enterprise Systems",
      company: "Stripe Enterprise",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
    {
      quote: "The internal event discovery split-pane layout gave our global engineering team instant clarity on booth staffing and keynote attendance across 20+ summits.",
      author: "Catherine DuPont",
      title: "Head of Digital Operations",
      company: "BNP Paribas Digital",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
    },
    {
      quote: "Direct calendar routing seamlessly connects external visitors with our designated product owners without double booking or timezone friction.",
      author: "Devon Miller",
      title: "Senior Director of Architecture",
      company: "Plaid Global",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-20 bg-[#08090b] font-sans">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono text-[#30d158] bg-[#30d158]/10 px-3.5 py-1 rounded-full border border-[#30d158]/30 uppercase tracking-wider">
            Trusted by Industry Leaders
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
            Loved by Enterprise Engineering Teams
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="soft-card p-6 space-y-6 flex flex-col justify-between rounded-2xl hover:border-[#0a84ff]/50 transition-all hover:-translate-y-1 shadow-xl"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-[#ffd60a]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#ffd60a]" />
                  ))}
                </div>

                <p className="text-sm text-[#e5e5ea] leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-10 h-10 rounded-full object-cover border border-[#0a84ff]/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-white font-mono">{t.author}</h4>
                  <p className="text-[11px] text-[#8e9bb0]">{t.title} • <span className="text-[#0a84ff]">{t.company}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
