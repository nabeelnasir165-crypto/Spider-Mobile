import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, MapPin, Sparkles, Star, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import Warranty from '../sections/Warranty';
import Reviews from '../sections/Reviews';
import FinalCTA from '../sections/FinalCTA';
import { Reveal, SectionHeader } from '../components/Section';

const milestones = [
  { year: '2014', title: 'Started in Derby', desc: 'Opened our first small workshop fixing iPhones and BlackBerries.' },
  { year: '2017', title: '1,000 repairs', desc: 'Quickly outgrew our space — moved to St Peter&rsquo;s Street.' },
  { year: '2020', title: 'Refurb store launch', desc: 'Started selling certified pre-owned phones across the UK.' },
  { year: '2024', title: '12,000+ customers', desc: 'Now Derby&rsquo;s highest-rated phone repair specialist.' },
];

const team = [
  { name: 'Adam Khan', role: 'Founder & Lead Technician', img: 'https://i.pravatar.cc/300?img=12' },
  { name: 'Priya Shah', role: 'Senior Engineer', img: 'https://i.pravatar.cc/300?img=47' },
  { name: 'James Holt', role: 'Refurb Manager', img: 'https://i.pravatar.cc/300?img=33' },
  { name: 'Leah Cole', role: 'Customer Care Lead', img: 'https://i.pravatar.cc/300?img=24' },
];

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About Us"
        title="Built in Derby. Trusted across the UK."
        subtitle="We started fixing phones from a tiny workshop in 2014. A decade later, we&rsquo;ve become the UK&rsquo;s most-loved local repair specialists — without losing the personal touch."
      />

      <section className="py-16 lg:py-24 bg-white">
        <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <Reveal>
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-ink-100">
              <img
                src="https://images.unsplash.com/photo-1581092583537-20d51b4b4f1b?auto=format&fit=crop&w=800&q=80"
                alt="Spider Mobiles workshop"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 to-transparent"/>
              <div className="absolute bottom-5 left-5 right-5 p-5 rounded-2xl bg-white/85 backdrop-blur border border-white/40">
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} className="text-amber-400 fill-amber-400"/>)}
                  <span className="text-sm font-semibold text-ink-950">4.9 · 1,247 reviews</span>
                </div>
                <p className="text-xs text-ink-600">&ldquo;Honest, fast and friendly — the only place I&rsquo;ll go.&rdquo;</p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <span className="section-eyebrow inline-flex items-center gap-2 mb-4">
                <span className="inline-block w-6 h-px bg-accent-500"/> Our Story
              </span>
              <h2 className="text-display-md text-ink-950 text-balance mb-5">
                A repair shop built on trust, not pressure.
              </h2>
              <p className="text-ink-600 leading-relaxed mb-4">
                Spider Mobiles started with a simple frustration — too many repair shops treating
                customers like cash machines. We do the opposite: honest pricing, transparent process,
                and a no-fix, no-fee promise on everything we touch.
              </p>
              <p className="text-ink-600 leading-relaxed mb-8">
                Today, our team of certified technicians repairs over 200 devices a week, and our
                refurbished phones ship across the UK with a 12-month warranty.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <Stat icon={Users} value="12K+" label="Happy customers"/>
                <Stat icon={Award} value="10yr" label="In Derby"/>
                <Stat icon={ShieldCheck} value="100%" label="Warrantied"/>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-24 bg-ink-50">
        <div className="container-page">
          <SectionHeader
            eyebrow="Milestones"
            title="Ten years in the making."
            align="center"
          />
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-ink-200 lg:-translate-x-px"/>
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <Reveal key={m.year} delay={i * 0.06}>
                  <div className={`relative pl-12 lg:pl-0 lg:flex ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center`}>
                    <div className="absolute left-0 lg:left-1/2 -translate-x-0 lg:-translate-x-1/2 w-9 h-9 rounded-full bg-ink-950 text-white grid place-items-center text-xs font-bold">
                      <Sparkles size={14}/>
                    </div>
                    <div className="lg:w-1/2 lg:px-10">
                      <p className="text-sm font-bold tracking-widest text-brand mb-1">{m.year}</p>
                      <h3 className="text-xl font-semibold text-ink-950 mb-1">{m.title}</h3>
                      <p className="text-sm text-ink-600 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container-page">
          <SectionHeader
            eyebrow="The Team"
            title="The faces behind your fix."
            align="center"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.05}>
                <div className="group">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-ink-100">
                    <motion.img
                      src={t.img}
                      alt={t.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-base font-semibold text-ink-950">{t.name}</h3>
                  <p className="text-sm text-ink-500">{t.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div id="warranty"><Warranty/></div>
      <div id="reviews"><Reviews/></div>
      <FinalCTA/>
    </>
  );
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="p-4 rounded-2xl bg-ink-50 border border-ink-100">
      <Icon size={18} className="text-brand mb-2"/>
      <p className="text-xl font-bold text-ink-950">{value}</p>
      <p className="text-xs text-ink-500">{label}</p>
    </div>
  );
}
