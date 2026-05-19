import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone, BatteryCharging, Plug, Camera, Droplets, Volume2, Square, TerminalSquare,
  ChevronRight, ChevronLeft, Loader2, CheckCircle2, Calendar, MessageSquare, ShieldCheck,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { brands, models, issues, calcQuote } from '../data/repairs';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

const iconMap = { Smartphone, BatteryCharging, Plug, Camera, Droplets, Volume2, Square, TerminalSquare };

const steps = ['Brand', 'Model', 'Issue', 'When', 'Confirm'];

export default function Book() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState(null);
  const [model, setModel] = useState(null);
  const [issue, setIssue] = useState(null);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(null);

  // Default date: tomorrow
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setDate(d.toISOString().split('T')[0]);
  }, []);

  const quote = calcQuote(model?.id, issue?.id);
  const next = () => setStep((s) => Math.min(steps.length - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    setError('');
    setBusy(true);
    const requested_date = new Date(`${date}T${time}`).toISOString();
    const payload = {
      customer_user_id: user.id,
      customer_name: profile?.full_name || user.email,
      customer_email: user.email,
      customer_phone: profile?.phone || null,
      device_brand: brand?.name,
      device_model: model?.name,
      issue: issue?.label,
      service_requested: issue?.label,
      requested_date,
      notes,
      status: 'Pending',
      stage: 0,
    };

    const { data, error: insertError } = await supabase
      .from('bookings')
      .insert(payload)
      .select()
      .single();

    if (insertError) {
      setBusy(false);
      setError(insertError.message);
      return;
    }

    // Fire-and-await the email function (graceful failure — booking still succeeds)
    try {
      await supabase.functions.invoke('send-booking-email', {
        body: {
          booking_ref: data.booking_ref,
          customer_email: user.email,
          customer_name: profile?.full_name || user.email,
          device: `${brand?.name} ${model?.name}`,
          issue: issue?.label,
          requested_date,
          quote_min: quote?.min,
          quote_max: quote?.max,
          eta: quote?.eta,
        },
      });
    } catch (e) {
      // Edge function not deployed or SMTP not configured — booking is still saved
      console.warn('Confirmation email skipped:', e?.message || e);
    }

    setBusy(false);
    setConfirmed(data);
  };

  if (confirmed) {
    return (
      <>
        <PageHeader eyebrow="Booking confirmed" title="You&rsquo;re booked in." subtitle="We&rsquo;ll see you soon. A confirmation email is on its way." />
        <section className="pb-24">
          <div className="container-page max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl bg-gradient-to-br from-ink-950 to-ink-800 text-white p-8 lg:p-10 mb-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500 grid place-items-center"><CheckCircle2 size={22}/></div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/60">Booking ref</p>
                  <p className="text-2xl font-bold">{confirmed.booking_ref}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <Info label="Device" value={`${brand?.name} ${model?.name}`}/>
                <Info label="Service" value={issue?.label}/>
                <Info label="Requested" value={new Date(`${date}T${time}`).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}/>
                <Info label="Estimated" value={quote ? `£${quote.min} – £${quote.max}` : '—'}/>
              </div>
            </motion.div>
            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={() => navigate('/account')} className="btn-primary">Go to dashboard</button>
              <button onClick={() => navigate('/track?ref=' + confirmed.booking_ref)} className="btn-outline">Track this repair</button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Book a repair"
        title="Tell us what&rsquo;s broken."
        subtitle="A few quick questions and we&rsquo;ll have your slot booked — usually 30–60 minutes to fix once you arrive."
      />

      <section className="pb-24">
        <div className="container-page max-w-3xl">
          <div className="rounded-3xl bg-white border border-ink-100 shadow-soft-lg p-5 sm:p-8 lg:p-10">
            <Progress step={step} steps={steps} />

            <AnimatePresence mode="wait">
              {step === 0 && (
                <Step key="brand">
                  <h3 className="text-lg font-semibold mb-5">Choose your brand</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {brands.map((b) => (
                      <Tile key={b.id} active={brand?.id === b.id} onClick={() => { setBrand(b); next(); }}>
                        {b.name}
                      </Tile>
                    ))}
                  </div>
                </Step>
              )}

              {step === 1 && (
                <Step key="model">
                  <h3 className="text-lg font-semibold mb-5">Choose your {brand?.name} model</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(models[brand?.id] || []).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => { setModel(m); next(); }}
                        className={`h-14 rounded-xl border-2 px-4 text-left flex items-center justify-between transition ${
                          model?.id === m.id ? 'border-brand bg-accent-50/40' : 'border-ink-100 hover:border-brand hover:bg-accent-50/40'
                        }`}
                      >
                        <span className="font-medium text-ink-900">{m.name}</span>
                        <ChevronRight size={16} className="text-ink-400"/>
                      </button>
                    ))}
                  </div>
                </Step>
              )}

              {step === 2 && (
                <Step key="issue">
                  <h3 className="text-lg font-semibold mb-5">What&rsquo;s the issue?</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {issues.map((it) => {
                      const Icon = iconMap[it.icon] || Smartphone;
                      return (
                        <button
                          key={it.id}
                          onClick={() => { setIssue(it); next(); }}
                          className={`p-4 rounded-xl border-2 text-left transition flex flex-col items-start gap-3 ${
                            issue?.id === it.id ? 'border-brand bg-accent-50/40' : 'border-ink-100 hover:border-brand hover:bg-accent-50/40'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-lg bg-ink-950 text-white grid place-items-center">
                            <Icon size={18}/>
                          </div>
                          <span className="text-sm font-semibold leading-tight">{it.label}</span>
                          <span className="text-xs text-ink-500">From £{it.basePrice}</span>
                        </button>
                      );
                    })}
                  </div>
                </Step>
              )}

              {step === 3 && (
                <Step key="when">
                  <h3 className="text-lg font-semibold mb-5">When works for you?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500 mb-1.5 block">Date</span>
                      <div className="relative">
                        <Calendar size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"/>
                        <input
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full h-11 pl-10 pr-3 rounded-xl bg-white border border-ink-200 text-sm outline-none focus:border-ink-950"
                        />
                      </div>
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500 mb-1.5 block">Time</span>
                      <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full h-11 px-3 rounded-xl bg-white border border-ink-200 text-sm outline-none focus:border-ink-950">
                        {['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block mt-5">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500 mb-1.5 block">Anything we should know? (optional)</span>
                    <div className="relative">
                      <MessageSquare size={14} className="absolute left-3.5 top-3 text-ink-400"/>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Passcode, IMEI, accessories, urgency…"
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-white border border-ink-200 text-sm outline-none focus:border-ink-950 resize-none"
                      />
                    </div>
                  </label>

                  <div className="mt-7 flex justify-between">
                    <button onClick={back} className="btn-outline">
                      <ChevronLeft size={16}/> Back
                    </button>
                    <button onClick={next} className="btn-accent">
                      Review <ChevronRight size={16}/>
                    </button>
                  </div>
                </Step>
              )}

              {step === 4 && (
                <Step key="confirm">
                  <h3 className="text-lg font-semibold mb-5">Confirm your booking</h3>

                  <div className="rounded-2xl bg-ink-50 border border-ink-100 p-6 space-y-4">
                    <Row label="Device" value={`${brand?.name} ${model?.name}`}/>
                    <Row label="Service" value={issue?.label}/>
                    <Row label="Estimated price" value={quote ? `£${quote.min} – £${quote.max}` : '—'} accent/>
                    <Row label="ETA" value={quote?.eta}/>
                    <Row label="Date / time" value={new Date(`${date}T${time}`).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}/>
                    <Row label="Notes" value={notes || '—'} mute/>
                  </div>

                  <div className="mt-5 flex items-start gap-2.5 text-xs text-ink-600">
                    <ShieldCheck size={14} className="text-brand mt-0.5 shrink-0"/>
                    <p>Final price confirmed at diagnosis. No-fix, no-fee. 12-month warranty on all repairs.</p>
                  </div>

                  {error && (
                    <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">{error}</div>
                  )}

                  <div className="mt-7 flex justify-between">
                    <button onClick={back} disabled={busy} className="btn-outline disabled:opacity-60">
                      <ChevronLeft size={16}/> Back
                    </button>
                    <button onClick={submit} disabled={busy} className="btn-accent disabled:opacity-60">
                      {busy ? <><Loader2 size={16} className="animate-spin"/> Booking…</> : <>Confirm booking <ChevronRight size={16}/></>}
                    </button>
                  </div>
                </Step>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}

function Progress({ step, steps }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((label, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className={`flex items-center gap-2.5 ${active ? 'text-ink-950' : done ? 'text-ink-700' : 'text-ink-400'}`}>
              <span className={`grid place-items-center w-7 h-7 rounded-full text-[11px] font-semibold ${done ? 'bg-brand text-white' : active ? 'bg-ink-950 text-white' : 'bg-ink-100 text-ink-500'}`}>
                {done ? '✓' : i + 1}
              </span>
              <span className="hidden sm:block text-sm font-medium">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px bg-ink-100 mx-2 sm:mx-3 relative">
                <div className="absolute inset-y-0 left-0 bg-brand transition-all duration-500" style={{ width: done ? '100%' : '0%' }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Step({ children }) {
  return (
    <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
      {children}
    </motion.div>
  );
}

function Tile({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`h-20 rounded-xl border-2 transition flex items-center justify-center font-semibold ${active ? 'border-brand bg-accent-50/40 text-ink-950' : 'border-ink-100 hover:border-brand hover:bg-accent-50/40 text-ink-900'}`}>
      {children}
    </button>
  );
}

function Row({ label, value, accent, mute }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-sm text-ink-500">{label}</p>
      <p className={`text-sm text-right ${accent ? 'font-bold text-ink-950 text-base' : mute ? 'text-ink-400' : 'font-medium text-ink-900'}`}>{value}</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-white/55 mb-1">{label}</p>
      <p className="font-semibold text-white">{value}</p>
    </div>
  );
}
