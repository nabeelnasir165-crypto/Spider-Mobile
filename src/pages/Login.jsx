import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // If successful, redirect to dashboard
      navigate('/');
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container min-h-screen flex items-center justify-center p-margin-mobile md:p-xl w-full">
      <main className="w-full max-w-[420px] bg-surface-container-lowest border border-outline-variant rounded-xl p-lg md:p-xl flex flex-col gap-xl shadow-sm">
        {/* Header / Branding */}
        <header className="flex flex-col items-center text-center gap-sm">
          <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center mb-xs">
            <span className="material-symbols-outlined text-on-primary-container text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>precision_manufacturing</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Hybrid Repair</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Sign in to manage your workspace</p>
        </header>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-lg">
          {errorMsg && (
            <div className="p-sm bg-error-container text-on-error-container text-label-md rounded-lg text-center">
              {errorMsg}
            </div>
          )}

          {/* Email Input */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface-variant ml-[2px]" htmlFor="email">Email address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">mail</span>
              <input 
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-[44px] pr-md py-[10px] font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20 transition-all duration-200" 
                id="email" 
                name="email" 
                placeholder="manager@hybridrepair.co.uk" 
                required 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Password Input */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface-variant ml-[2px]" htmlFor="password">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">lock</span>
              <input 
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-[44px] pr-md py-[10px] font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20 transition-all duration-200" 
                id="password" 
                name="password" 
                placeholder="••••••••" 
                required 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          
          {/* Action Button */}
          <button 
            className="w-full bg-primary text-on-primary border border-transparent rounded-lg py-[10px] font-label-md text-label-md hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-sm mt-xs cursor-pointer disabled:opacity-70" 
            type="submit"
            disabled={loading}
          >
            <span>{loading ? 'Signing in...' : 'Login to Suite'}</span>
            {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
          </button>
        </form>

        {/* Secondary Actions */}
        <div className="flex flex-col items-center gap-md pt-sm border-t border-outline-variant/50">
          <a className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant hover:underline transition-colors cursor-pointer" href="#">
            Forgot password?
          </a>
          <p className="font-label-md text-label-md text-outline">
            Version 1.0.4 • Corporate Access Only
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
