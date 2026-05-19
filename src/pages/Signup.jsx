import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, Loader2, Check } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import SetupBanner from '../components/SetupBanner';
import { FieldIcon, GoogleIcon } from './Login';
import { useAuth } from '../contexts/AuthContext';

// Lenient international validation: optional leading +, 7–15 digits.
// Allows spaces, dashes, and parens for typing comfort — we strip them on save.
const PHONE_DIGITS = /^\+?\d{7,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalisePhone(p) {
  if (!p) return null;
  const stripped = String(p).replace(/[^\d+]/g, '');
  if (stripped.startsWith('+')) return '+' + stripped.slice(1).replace(/^0+/, '');
  return '+' + stripped.replace(/^0+/, '');
}

export default function Signup() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const trimmedEmail = email.trim();
  const trimmedPhone = phone.trim();

  const validation = useMemo(() => {
    if (!trimmedEmail && !trimmedPhone) {
      return { ok: false, msg: '' }; // no msg yet, just disable button silently
    }
    if (trimmedEmail && !EMAIL_RE.test(trimmedEmail)) {
      return { ok: false, msg: 'Enter a valid email address.' };
    }
    if (trimmedPhone) {
      const digits = trimmedPhone.replace(/[^\d+]/g, '');
      if (!PHONE_DIGITS.test(digits)) {
        return { ok: false, msg: 'Enter a valid mobile number (7–15 digits, international format).' };
      }
    }
    if (password.length < 8) {
      return { ok: false, msg: 'Password must be at least 8 characters.' };
    }
    return { ok: true, msg: '' };
  }, [trimmedEmail, trimmedPhone, password]);

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validation.ok) {
      setError(validation.msg || 'Please enter an email or mobile number.');
      return;
    }

    setBusy(true);
    const { data, error } = await signUp({
      email: trimmedEmail || undefined,
      phone: trimmedPhone ? normalisePhone(trimmedPhone) : undefined,
      password,
      fullName: fullName.trim() || undefined,
    });
    setBusy(false);

    if (error) {
      setError(friendlyAuthError(error.message));
      return;
    }
    if (data?.user && !data.session) {
      setDone(true);
    } else {
      navigate('/account');
    }
  };

  const google = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  if (done) {
    return (
      <AuthCard
        eyebrow="Almost there"
        title="Check your inbox"
        subtitle={
          trimmedEmail
            ? `We've sent a confirmation link to ${trimmedEmail}. Click it to activate your account.`
            : `We've sent a confirmation code by SMS to ${normalisePhone(trimmedPhone)}.`
        }
        altLink={{ label: 'Already confirmed?', cta: 'Sign in', to: '/login' }}
      >
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white grid place-items-center shrink-0">
            <Check size={18}/>
          </div>
          <div>
            <p className="font-semibold text-emerald-900">Account created</p>
            <p className="text-sm text-emerald-700 mt-1">
              Didn&rsquo;t get it? Check your spam folder, or request another from the login page.
            </p>
          </div>
        </div>
      </AuthCard>
    );
  }

  const oneOfMissing = !trimmedEmail && !trimmedPhone;

  return (
    <AuthCard
      eyebrow="Get started"
      title="Create your account"
      subtitle="Sign up with email or mobile number — just one is needed. We'll send you status updates by whichever you provide."
      altLink={{ label: 'Already have an account?', cta: 'Sign in', to: '/login' }}
    >
      <SetupBanner />

      <button onClick={google} className="w-full h-11 rounded-full border border-ink-200 bg-white hover:bg-ink-50 text-sm font-medium text-ink-900 inline-flex items-center justify-center gap-2.5 transition">
        <GoogleIcon/> Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
        <span className="flex-1 h-px bg-ink-100" /> OR <span className="flex-1 h-px bg-ink-100" />
      </div>

      <form onSubmit={submit} className="space-y-4" noValidate>
        <FieldIcon
          icon={User}
          type="text"
          autoComplete="name"
          placeholder="Full name (optional)"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <div className="rounded-xl border border-ink-200 p-1 bg-ink-50">
          <p className="px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
            Use email <span className="text-ink-300">or</span> mobile — one is enough
          </p>
          <div className="space-y-2 p-1">
            <FieldIcon
              icon={Mail}
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FieldIcon
              icon={Phone}
              type="tel"
              autoComplete="tel"
              placeholder="Mobile number (any country, e.g. +92 329 6919363)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <FieldIcon
          icon={Lock}
          type={showPw ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Password (min 8 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          right={
            <button type="button" onClick={() => setShowPw((s) => !s)} className="text-ink-400 hover:text-ink-700 p-1" aria-label="Toggle password visibility">
              {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          }
        />

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={busy || oneOfMissing}
          className="btn-accent w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy ? <><Loader2 size={16} className="animate-spin"/> Creating account…</> : 'Create account'}
        </button>

        <p className="text-center text-xs text-ink-500 leading-relaxed">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-ink-950">Terms</Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline hover:text-ink-950">Privacy Policy</Link>.
        </p>
      </form>
    </AuthCard>
  );
}

export function friendlyAuthError(msg) {
  if (!msg) return 'Something went wrong. Please try again.';
  const s = msg.toLowerCase();
  if (s.includes('invalid login') || s.includes('invalid credentials')) {
    return "Wrong details or password. If you haven't created an account yet, sign up first.";
  }
  if (s.includes('email not confirmed') || s.includes('phone not confirmed')) {
    return "Your account isn't confirmed yet — please check the link we sent.";
  }
  if (s.includes('user already registered') || s.includes('already been registered')) {
    return 'An account with that email or number already exists. Try signing in instead.';
  }
  if (s.includes('phone provider') || s.includes('sms')) {
    return 'Phone signup needs an SMS provider in your Supabase project. Add Twilio in Auth → Providers, or use email instead.';
  }
  if (s.includes('password should be') || s.includes('password')) {
    return msg;
  }
  if (s.includes('rate limit')) {
    return 'Too many attempts. Please wait a minute and try again.';
  }
  if (s.includes('fetch') || s.includes('network')) {
    return 'Could not reach the server. Check your Supabase URL/key in .env.local and try again.';
  }
  return msg;
}
