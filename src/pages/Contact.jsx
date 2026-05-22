import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Check } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Reveal } from '../components/Section';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', company: '' });
  const [sent, setSent] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const onSubmit = (e) => {
    e.preventDefault();
    // Honeypot: bots fill hidden fields; humans don't. Silently drop.
    if (form.company) {
      setForm({ name: '', email: '', phone: '', message: '', company: '' });
      return;
    }
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', phone: '', message: '', company: '' });
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Pop in, call, or drop us a message."
        subtitle="We&rsquo;re open six days a week and respond to all messages within an hour during business hours."
      />

      <section className="pb-20 lg:pb-32 bg-white">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16">
            <Reveal>
              <div className="rounded-3xl bg-ink-50 border border-ink-100 p-6 lg:p-10">
                <h2 className="text-2xl font-bold text-ink-950 mb-1">Send us a message</h2>
                <p className="text-sm text-ink-600 mb-7">We&rsquo;ll reply within the hour, Mon–Sat.</p>

                <form onSubmit={onSubmit} className="space-y-4" noValidate>
                  {/* Honeypot — hidden from real users + screen readers */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                    <label>
                      Company
                      <input
                        tabIndex={-1}
                        autoComplete="off"
                        name="company"
                        value={form.company}
                        onChange={onChange}
                      />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Name" name="name" value={form.name} onChange={onChange} required />
                    <Field label="Phone" name="phone" value={form.phone} onChange={onChange} type="tel" autoComplete="tel" />
                  </div>
                  <Field label="Email" name="email" value={form.email} onChange={onChange} type="email" autoComplete="email" required />
                  <Field
                    label="Message"
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    multiline
                    required
                  />
                  <motion.button
                    type="submit"
                    whileTap={{ scale: 0.98 }}
                    className={`w-full h-12 rounded-full font-medium text-sm flex items-center justify-center gap-2 transition ${
                      sent ? 'bg-emerald-500 text-white' : 'bg-ink-950 text-white hover:bg-ink-800'
                    }`}
                  >
                    {sent ? <><Check size={16}/> Sent — we&rsquo;ll be in touch</> : <><Send size={16}/> Send message</>}
                  </motion.button>
                </form>
              </div>
            </Reveal>

            <div className="space-y-6">
              <Reveal>
                <ContactCard
                  icon={MapPin}
                  title="Find us"
                  lines={['835 Osmaston Road', 'Derby, DE24 8EX', 'United Kingdom']}
                />
              </Reveal>
              <Reveal delay={0.05}>
                <ContactCard
                  icon={Clock}
                  title="Opening hours"
                  lines={['Mon–Fri · 9:00 – 18:30', 'Saturday · 10:00 – 17:00', 'Sunday · Closed']}
                />
              </Reveal>
              <Reveal delay={0.1}>
                <ContactCard
                  icon={Phone}
                  title="Phone"
                  lines={['01332 986446', 'WhatsApp 07700 900 000']}
                />
              </Reveal>
              <Reveal delay={0.15}>
                <ContactCard
                  icon={Mail}
                  title="Email"
                  lines={['hello@spidermobiles.co.uk', 'support@spidermobiles.co.uk']}
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section id="map" className="pb-24">
        <div className="container-page">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden border border-ink-100 h-[420px] bg-ink-100">
              <iframe
                title="Spider Mobiles Derby store map"
                src="https://www.google.com/maps?q=Derby+UK&output=embed"
                className="absolute inset-0 w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, value, onChange, type = 'text', multiline = false, required, autoComplete }) {
  const base =
    'w-full bg-white border border-ink-200 rounded-xl px-4 outline-none text-sm text-ink-950 placeholder:text-ink-400 focus:border-ink-950 transition';
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500 mb-1.5 block">
        {label}
      </span>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={4}
          className={`${base} py-3 resize-none`}
          placeholder="Tell us how we can help…"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={`${base} h-11`}
        />
      )}
    </label>
  );
}

function ContactCard({ icon: Icon, title, lines }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-ink-100">
      <div className="w-10 h-10 rounded-xl bg-ink-950 text-white grid place-items-center mb-4">
        <Icon size={18}/>
      </div>
      <h3 className="text-base font-semibold text-ink-950 mb-2">{title}</h3>
      <div className="text-sm text-ink-600 space-y-0.5">
        {lines.map((l, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: l }} />
        ))}
      </div>
    </div>
  );
}
