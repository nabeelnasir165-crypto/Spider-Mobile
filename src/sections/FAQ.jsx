import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Reveal, SectionHeader } from '../components/Section';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

// Fallback FAQ used when Supabase is unreachable or the cms_content row is
// missing. Mirrors the seed data in src/data/admin.js → cms_content.faqs.
const DEFAULT_FAQS = [
  { question: 'Do you use original Apple parts?',     answer: 'Yes — we use Genuine Apple parts via the Independent Repair Provider programme, plus high-quality aftermarket options if requested.' },
  { question: 'How long does a screen repair take?',   answer: 'Most screen repairs are completed within 30–45 minutes of drop-off.' },
  { question: 'Do you offer a warranty?',              answer: 'All repairs come with a 12-month warranty against defects in workmanship and the parts we supply.' },
  { question: 'Can I post my device in for repair?',   answer: 'Yes — get in touch and we will email you a pre-paid postal repair pack.' },
];

export default function FAQ() {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [openIdx, setOpenIdx] = useState(0); // first one expanded by default

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('cms_content')
          .select('content')
          .eq('section_key', 'faqs')
          .maybeSingle();
        if (cancelled || error || !data?.content) return;
        if (Array.isArray(data.content) && data.content.length) setFaqs(data.content);
      } catch (e) {
        console.warn('[faq] cms fetch skipped:', e?.message || e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section className="py-20 bg-ink-50" id="faq">
      <div className="container-page max-w-3xl">
        <SectionHeader
          eyebrow="FAQ"
          title="Questions we hear a lot."
          subtitle="If you don’t see your question here, message us — we reply within the hour Mon–Sat."
          align="center"
        />
        <ul className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = openIdx === i;
            return (
              <Reveal key={f.question} delay={i * 0.04}>
                <li className="rounded-2xl bg-white border border-ink-100 overflow-hidden">
                  <button
                    onClick={() => setOpenIdx(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="w-full flex items-center gap-3 text-left px-5 py-4 hover:bg-ink-50/50 transition"
                  >
                    <span className="w-8 h-8 rounded-lg bg-brand/10 text-brand grid place-items-center shrink-0">
                      <HelpCircle size={16} aria-hidden="true"/>
                    </span>
                    <span className="flex-1 font-semibold text-ink-950 text-[15px]">{f.question}</span>
                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className={`text-ink-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 pt-1 text-sm text-ink-600 leading-relaxed">
                          {f.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
