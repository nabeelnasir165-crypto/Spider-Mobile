import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, Loader2, Check } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import SetupBanner from '../components/SetupBanner';
import { FieldIcon, GoogleIcon } from './Login';
import { useAuth } from '../contexts/AuthContext';

// Lenient international validation: optional leading +, 7–15 digits.
// Spaces, dashes and parens are allowed in the input — we strip them before save.
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

  const submit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!EMAIL_RE.test(trimmedEmail)) {
      setError('Enter a valid email address.');
      return;
    }
    const phoneDigits = trimmedPhone.replace(/[^\d+]/g, '');
    if (!PHONE_DIGITS.test(phoneDigits)) {
      setError('Enter a valid mobile number (7–15 digits, with country code).');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setBusy(true);
    const { data, error } = await signUp({
      email: trimmedEmail,
      password,
      fullName: fullName.trim() || undefined,
      phone: normalisePhone(trimmedPhone),
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
        subtitle={`We've sent a confirmation link to ${email}. Click it to activate your account.`}
        altLink={{ label: 'Already confirmed?', cta: 'Sign in', to: '/login' }}
      >
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white grid place-items-center shrink-0">
            <Check size={18}/>
          </div>
          <div>
            <p className="font-semibold text-emerald-900">Account created</p>
            <p className="text-sm text-emerald-700 mt-1">
              Didn&rsquo;t get the email? Check your spam folder, or request another from the login page.
            </p>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      eyebrow="Get started"
      title="Create your account"
      subtitle="Book repairs and get status updates straight to your inbox. We'll use your mobile for SMS alerts when your device is ready."
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
        <FieldIcon
          icon={Mail}
          type="email"
          autoComplete="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FieldIcon
          icon={Phone}
          type="tel"
          autoComplete="tel"
          placeholder="Mobile number (with country code, e.g. +92 329 6919363)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <div>
          <FieldIcon
            icon={Lock}
            type={showPw ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Create a password (min 8 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            right={
              <button type="button" onClick={() => setShowPw((s) => !s)} className="text-ink-400 hover:text-ink-700 p-1" aria-label="Toggle password visibility">
                {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            }
          />
          <p className="mt-1.5 ml-1 text-[11px] text-ink-500 leading-snug">
            This is a new password just for Spider Mobiles — <strong>not your email password</strong>. You&rsquo;ll use it to sign in here later.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}

        <button type="submit" disabled={busy} className="btn-accent w-full disabled:opacity-60">
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
    return "Wrong email or password. If you haven't created an account yet, sign up first.";
  }
  if (s.includes('email not confirmed')) {
    return "Your email isn't confirmed yet — please check your inbox for the confirmation link.";
  }
  if (s.includes('user already registered') || s.includes('already been registered')) {
    return 'An account with that email already exists. Try signing in instead.';
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
