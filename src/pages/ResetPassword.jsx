import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import { FieldIcon } from './Login';
import { useAuth } from '../contexts/AuthContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setBusy(true);
    const { error } = await updatePassword(password);
    setBusy(false);
    if (error) setError(error.message);
    else navigate('/account', { replace: true });
  };

  return (
    <AuthCard eyebrow="New password" title="Choose a new password" subtitle="Make it at least 8 characters and something you'll remember.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <FieldIcon
          icon={Lock}
          type={showPw ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="New password"
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
            <AlertCircle size={16} className="mt-0.5 shrink-0"/> {error}
          </div>
        )}
        <button type="submit" disabled={busy} className="btn-accent w-full disabled:opacity-60">
          {busy ? <><Loader2 size={16} className="animate-spin"/> Updating…</> : 'Update password'}
        </button>
      </form>
    </AuthCard>
  );
}
