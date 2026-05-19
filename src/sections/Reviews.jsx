import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { reviews } from '../data/products';
import { SectionHeader, Reveal } from '../components/Section';

export default function Reviews() {
  // Duplicate list for seamless marquee
  const row1 = reviews.slice(0, 3);
  const row2 = reviews.slice(3);

  return (
    <section className="py-24 lg:py-32 bg-ink-50 overflow-hidden">
      <div className="container-page">
        <SectionHeader
          eyebrow="Customer Reviews"
          title="Trusted by 12,000+ Derby locals."
          subtitle="Real reviews from real customers. Verified by Google."
          align="center"
        />

        <Reveal className="flex flex-col items-center gap-3 mb-12">
          <div className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <p className="text-sm text-ink-600">
            <span className="font-bold text-ink-950">4.9 / 5.0</span> · based on 1,247 Google reviews
          </p>
        </Reveal>

        <div className="space-y-4">
          <ReviewRow reviews={row1} />
          <ReviewRow reviews={row2} reverse />
        </div>
      </div>
    </section>
  );
}

function ReviewRow({ reviews, reverse = false }) {
  const list = [...reviews, ...reviews, ...reviews];
  return (
    <div className="relative -mx-5 sm:-mx-6 lg:-mx-8">
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-ink-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-ink-50 to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        {list.map((r, i) => (
          <ReviewCard key={`${r.handle}-${i}`} r={r} />
        ))}
      </motion.div>
    </div>
  );
}

function ReviewCard({ r }) {
  return (
    <div className="w-[300px] sm:w-[360px] shrink-0 rounded-2xl bg-white border border-ink-100 p-6 shadow-soft">
      <Quote size={20} className="text-brand mb-4 opacity-60" />
      <p className="text-sm text-ink-700 leading-relaxed mb-5">&ldquo;{r.text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-200 to-accent-500 grid place-items-center text-white font-semibold">
          {r.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-950">{r.name}</p>
          <div className="flex items-center gap-0.5 mt-0.5">
            {[...Array(r.rating)].map((_, i) => (
              <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
