import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  BatteryCharging,
  Plug,
  Camera,
  Droplets,
  Volume2,
  Square,
  TerminalSquare,
  ChevronRight,
  Check,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { brands, models, issues, calcQuote } from '../data/repairs';
import { SectionHeader, Reveal } from '../components/Section';

const iconMap = {
  Smartphone, BatteryCharging, Plug, Camera, Droplets, Volume2, Square, TerminalSquare,
};

const stepLabels = ['Brand', 'Model', 'Issue', 'Quote'];

export default function InstantQuote() {
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState(null);
  const [model, setModel] = useState(null);
  const [issue, setIssue] = useState(null);

  const quote = useMemo(() => calcQuote(model?.id, issue?.id), [model, issue]);

  const reset = () => {
    setBrand(null); setModel(null); setIssue(null); setStep(0);
  };

  return (
    <section id="quote" className="relative py-24 lg:py-32 bg-ink-50 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-50 bg-grid-light"
        style={{ backgroundSize: '40px 40px' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />

      <div className="relative container-page">
        <SectionHeader
          eyebrow="Instant Quote"
          title="Get a transparent price in under 30 seconds."
          subtitle="Pick your device and issue — we&rsquo;ll show you a guaranteed price band and how fast we can get it done. No hidden fees, ever."
          align="center"
        />

        <Reveal>
          <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-ink-100 shadow-soft-lg p-5 sm:p-8 lg:p-10">
            {/* Progress steps */}
            <div className="flex items-center justify-between mb-8">
              {stepLabels.map((label, i) => {
                const active = i === step;
                const complete = i < step;
                return (
                  <div key={label} className="flex items-center flex-1 last:flex-none">
                    <div
                      className={`flex items-center gap-2.5 ${
                        active ? 'text-ink-950' : complete ? 'text-ink-700' : 'text-ink-400'
                      }`}
                    >
                      <span
                        className={`grid place-items-center w-7 h-7 rounded-full text-[11px] font-semibold transition ${
                          complete
                            ? 'bg-brand text-white'
                            : active
                            ? 'bg-ink-950 text-white'
                            : 'bg-ink-100 text-ink-500'
                        }`}
                      >
                        {complete ? <Check size={13} /> : i + 1}
                      </span>
                      <span className="hidden sm:block text-sm font-medium">{label}</span>
                    </div>
                    {i < stepLabels.length - 1 && (
                      <div className="flex-1 h-px bg-ink-100 mx-2 sm:mx-3 relative">
                        <div
                          className="absolute inset-y-0 left-0 bg-brand transition-all duration-500"
                          style={{ width: complete ? '100%' : '0%' }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="brand"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="text-lg font-semibold text-ink-950 mb-5">Choose your brand</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {brands.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => { setBrand(b); setStep(1); }}
                        className="group h-20 rounded-xl border-2 border-ink-100 hover:border-brand hover:bg-accent-50/40 transition flex items-center justify-center font-semibold text-ink-900"
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 1 && brand && (
                <motion.div
                  key="model"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-ink-950">Choose your {brand.name} model</h3>
                    <button onClick={() => setStep(0)} className="text-xs text-ink-500 hover:text-ink-950">
                      Change brand
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(models[brand.id] || []).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setModel(m); setStep(2); }}
                        className="group h-14 rounded-xl border-2 border-ink-100 hover:border-brand hover:bg-accent-50/40 px-4 text-left transition flex items-center justify-between"
                      >
                        <span className="font-medium text-ink-900">{m.name}</span>
                        <ChevronRight size={16} className="text-ink-400 group-hover:text-brand group-hover:translate-x-1 transition" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {step === 2 && model && (
                <motion.div
                  key="issue"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-ink-950">What&rsquo;s the issue?</h3>
                    <button onClick={() => setStep(1)} className="text-xs text-ink-500 hover:text-ink-950">
                      Change model
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {issues.map((it) => {
                      const Icon = iconMap[it.icon] || Smartphone;
                      return (
                        <button
                          key={it.id}
                          onClick={() => { setIssue(it); setStep(3); }}
                          className="group p-4 rounded-xl border-2 border-ink-100 hover:border-brand hover:bg-accent-50/40 transition flex flex-col items-start gap-3 text-left"
                        >
                          <div className="w-9 h-9 rounded-lg bg-ink-950 text-white grid place-items-center group-hover:bg-brand transition">
                            <Icon size={18} />
                          </div>
                          <span className="text-sm font-semibold text-ink-900 leading-tight">{it.label}</span>
                          <span className="text-xs text-ink-500">From £{it.basePrice}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {step === 3 && quote && model && issue && brand && (
                <motion.div
                  key="quote"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="grid lg:grid-cols-2 gap-8 items-center"
                >
                  <div>
                    <span className="pill-accent mb-4">Your Quote</span>
                    <p className="text-sm text-ink-500 mb-1">{brand.name} · {model.name}</p>
                    <p className="text-lg font-semibold text-ink-950 mb-6">{issue.label}</p>

                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl sm:text-6xl font-bold tracking-tight gradient-text">£{quote.min}</span>
                      <span className="text-ink-400 line-through text-lg">£{quote.max}</span>
                    </div>
                    <p className="mt-2 text-sm text-ink-500">Final price confirmed at diagnosis. No-fix, no-fee.</p>

                    <div className="mt-6 flex flex-wrap gap-2.5">
                      <span className="pill"><Clock size={13}/> ETA: {quote.eta}</span>
                      <span className="pill"><ShieldCheck size={13}/> 12-month warranty</span>
                      <span className="pill"><Check size={13}/> Genuine-grade parts</span>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      <a href="/repairs" className="btn-accent">
                        Book this repair <ChevronRight size={16} />
                      </a>
                      <button onClick={reset} className="btn-outline">Start over</button>
                    </div>
                  </div>

                  <div className="relative rounded-3xl bg-gradient-to-br from-ink-950 to-ink-800 p-8 text-white overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-brand/30 blur-3xl" />
                    <div className="relative">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/60 mb-3">What&rsquo;s included</p>
                      <ul className="space-y-3">
                        {[
                          'Free diagnostic check',
                          'OEM-grade parts only',
                          'Sanitised before return',
                          '15-point quality assurance',
                          '12-month return-to-base warranty',
                        ].map((f) => (
                          <li key={f} className="flex items-center gap-3 text-sm text-white/85">
                            <span className="grid place-items-center w-5 h-5 rounded-full bg-brand text-white">
                              <Check size={12} />
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
