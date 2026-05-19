import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/account';
  const { signIn, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const { error } = await signIn({ email, password });
    setBusy(false);
    if (error) {
      setError(error.message || 'Could not sign in.');
    } else {
      navigate(from, { replace: true });
    }
  };

  const google = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in to your account"
      subtitle="Track your repairs, manage bookings and access your warranty in one place."
      altLink={{ label: 'New to Spider Mobiles?', cta: 'Create an account', to: '/signup' }}
    >
      <button onClick={google} className="w-full h-11 rounded-full border border-ink-200 bg-white hover:bg-ink-50 text-sm font-medium text-ink-900 inline-flex items-center justify-center gap-2.5 transition">
        <GoogleIcon /> Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-ink-400">
        <span className="flex-1 h-px bg-ink-100" />
        OR
        <span className="flex-1 h-px bg-ink-100" />
      </div>

      <form onSubmit={submit} className="space-y-4" noValidate>
        <FieldIcon icon={Mail} type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <FieldIcon
          icon={Lock}
          type={showPw ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Password"
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

        <button type="submit" disabled={busy} className="btn-accent w-full disabled:opacity-60">
          {busy ? <><Loader2 size={16} className="animate-spin"/> Signing in…</> : 'Sign in'}
        </button>

        <p className="text-center text-sm">
          <Link to="/forgot-password" className="text-ink-500 hover:text-ink-950 transition">
            Forgot your password?
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

export function FieldIcon({ icon: Icon, right, ...rest }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
      <input
        {...rest}
        className="w-full h-11 pl-11 pr-11 rounded-xl bg-white border border-ink-200 text-sm text-ink-950 placeholder:text-ink-400 outline-none focus:border-ink-950 transition"
      />
      {right && <div className="absolute right-2 top-1/2 -translate-y-1/2">{right}</div>}
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"/>
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.83Z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.07.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38Z"/>
    </svg>
  );
}
