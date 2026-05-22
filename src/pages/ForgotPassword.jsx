import React, { useState } from 'react';
import { Mail, AlertCircle, Loader2, Check } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import { FieldIcon } from './Login';
import { useAuth } from '../contexts/AuthContext';

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error } = await sendPasswordReset(email);
    setBusy(false);
    if (error) setError(error.message);
    else setDone(true);
  };

  return (
    <AuthCard
      eyebrow="Account help"
      title={done ? 'Reset link sent' : 'Forgot your password?'}
      subtitle={done ? `If an account exists for ${email}, you'll receive an email shortly.` : "Enter your email and we'll send you a link to reset your password."}
      altLink={{ label: 'Remembered it?', cta: 'Back to sign in', to: '/login' }}
    >
      {done ? (
        <div role="status" aria-live="polite" className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white grid place-items-center shrink-0">
            <Check size={18}/>
          </div>
          <p className="text-sm text-emerald-800">Check your inbox for the reset link. It will expire in 30 minutes.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <FieldIcon icon={Mail} type="email" autoComplete="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {error && (
            <div role="alert" aria-live="polite" className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0"/> {error}
            </div>
          )}
          <button type="submit" disabled={busy} className="btn-accent w-full disabled:opacity-60">
            {busy ? <><Loader2 size={16} className="animate-spin"/> Sending…</> : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
