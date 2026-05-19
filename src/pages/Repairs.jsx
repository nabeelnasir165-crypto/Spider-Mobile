import React from 'react';
import { motion } from 'framer-motion';
import {
  Smartphone, BatteryCharging, Plug, Camera, Droplets, Volume2, TerminalSquare, Tablet,
  ChevronRight, ShieldCheck, Clock, BadgeCheck,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import InstantQuote from '../sections/InstantQuote';
import FinalCTA from '../sections/FinalCTA';
import { services } from '../data/repairs';
import { Reveal, SectionHeader } from '../components/Section';

const iconMap = {
  Smartphone, BatteryCharging, Plug, Camera, Droplets, Volume2, TerminalSquare, Tablet,
};

const flow = [
  { num: '01', title: 'Get a Quote', desc: 'Pick brand, model and issue. Transparent pricing in seconds.' },
  { num: '02', title: 'Book or Walk In', desc: 'Choose a slot online or drop in — we&rsquo;re open 6 days a week.' },
  { num: '03', title: 'Repaired Fast', desc: 'Most fixes done in 30–60 min by certified technicians.' },
  { num: '04', title: 'Quality Tested', desc: '15-point QC and 12-month warranty before you collect.' },
];

export default function Repairs() {
  return (
    <>
      <PageHeader
        eyebrow="Repairs"
        title="Premium phone, tablet & watch repairs — done right."
        subtitle="Drop in, post in, or book online. We&rsquo;ll fix your device with OEM-grade parts and back it with a 12-month warranty."
      >
        <div className="flex flex-wrap gap-2.5">
          <span className="pill"><Clock size={12}/> Most fixes in 30 min</span>
          <span className="pill"><ShieldCheck size={12}/> 12-month warranty</span>
          <span className="pill"><BadgeCheck size={12}/> Certified technicians</span>
        </div>
      </PageHeader>

      <section className="py-16 lg:py-20 bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow="Our Services"
            title="What we fix"
            subtitle="Genuine, expert repairs across all major brands. Pricing starts from £25."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((s, i) => {
              const Icon = iconMap[s.icon] || Smartphone;
              return (
                <Reveal key={s.title} delay={i * 0.04}>
                  <div className="h-full p-6 rounded-2xl bg-ink-50 border border-ink-100 hover:bg-white hover:border-ink-300 hover:shadow-soft-lg transition group flex flex-col">
                    <div className="w-12 h-12 rounded-xl bg-ink-950 text-white grid place-items-center mb-5 group-hover:bg-brand transition">
                      <Icon size={22}/>
                    </div>
                    <h3 className="text-lg font-semibold text-ink-950 mb-1.5">{s.title}</h3>
                    <p className="text-sm text-ink-600 leading-relaxed flex-1">{s.desc}</p>
                    <div className="mt-5 flex items-center justify-between text-sm">
                      <span className="text-ink-500">From <span className="font-bold text-ink-950">£{s.from}</span></span>
                      <a href="#quote" className="text-brand font-medium inline-flex items-center gap-1">
                        Get quote <ChevronRight size={14}/>
                      </a>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <InstantQuote />

      <section className="py-24 bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow="How it works"
            title="A repair process built around you."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {flow.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.06}>
                <div className="relative p-7 rounded-2xl border border-ink-100 bg-white h-full">
                  <span className="text-sm font-bold tracking-widest text-brand">{step.num}</span>
                  <h3 className="mt-2 text-lg font-semibold text-ink-950">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink-600 leading-relaxed">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
