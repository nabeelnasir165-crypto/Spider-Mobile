import React from 'react';
import { ShieldCheck, BadgeCheck, Lock, ScanLine, Hammer, Sparkles } from 'lucide-react';
import { Reveal, SectionHeader } from '../components/Section';

const points = [
  { Icon: ShieldCheck, title: '12-Month Warranty', desc: 'Every repair and refurb covered against defects.' },
  { Icon: BadgeCheck, title: 'Certified Technicians', desc: 'Apple-trained, Samsung-experienced engineers.' },
  { Icon: Hammer, title: 'OEM-Grade Parts', desc: 'Only premium components — no cheap aftermarket.' },
  { Icon: ScanLine, title: '15-Point QC', desc: 'Multi-stage testing before any device leaves us.' },
  { Icon: Lock, title: 'Your Data Stays Safe', desc: 'GDPR-compliant handling. We never look at your data.' },
  { Icon: Sparkles, title: 'No-Fix, No-Fee', desc: 'If we can&rsquo;t fix it, you don&rsquo;t pay a penny.' },
];

export default function Warranty() {
  return (
    <section id="warranty" className="relative py-24 lg:py-32 bg-ink-950 text-white overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle at 18% 20%, rgba(14,165,233,0.28), transparent 40%), radial-gradient(circle at 80% 80%, rgba(14,165,233,0.16), transparent 50%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative container-page">
        <SectionHeader
          dark
          align="center"
          eyebrow="Warranty & Trust"
          title="Repairs you can trust, guaranteed."
          subtitle="We hold ourselves to the highest standards in the industry — and we back every job with a real, no-fine-print warranty."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {points.map(({ Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.05}>
              <div className="h-full p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 transition group">
                <div className="w-11 h-11 rounded-xl bg-brand/20 text-brand-light grid place-items-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-semibold mb-1.5">{title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
