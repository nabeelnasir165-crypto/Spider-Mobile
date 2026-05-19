import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

const isEmail = (s) => typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
const looksLikePhone = (s) => typeof s === 'string' && /^\+?[\d\s()-]{7,20}$/.test(s.trim()) && /\d/.test(s);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (data) setProfile(data);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) loadProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) loadProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  // signUp with email, phone, or both. At least one must be provided.
  const signUp = async ({ email, phone, password, fullName }) => {
    const credential = {};
    if (email) credential.email = email;
    if (phone) credential.phone = phone;

    return supabase.auth.signUp({
      ...credential,
      password,
      options: {
        data: {
          full_name: fullName || null,
          phone: phone || null,
        },
        emailRedirectTo: email ? `${window.location.origin}/account` : undefined,
      },
    });
  };

  // signIn accepts an "identifier" (email or phone) plus password.
  // Auto-detects which credential to use.
  const signIn = ({ identifier, password }) => {
    const trimmed = String(identifier || '').trim();
    if (isEmail(trimmed)) {
      return supabase.auth.signInWithPassword({ email: trimmed, password });
    }
    if (looksLikePhone(trimmed)) {
      const phone = trimmed.replace(/[^\d+]/g, '');
      const normalised = phone.startsWith('+') ? phone : '+' + phone.replace(/^0+/, '');
      return supabase.auth.signInWithPassword({ phone: normalised, password });
    }
    return Promise.resolve({
      data: null,
      error: { message: 'Enter a valid email address or mobile number.' },
    });
  };

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/account` },
    });

  // Resend works for either email or phone
  const resendConfirmation = (identifier) => {
    const trimmed = String(identifier || '').trim();
    if (isEmail(trimmed)) {
      return supabase.auth.resend({
        type: 'signup',
        email: trimmed,
        options: { emailRedirectTo: `${window.location.origin}/account` },
      });
    }
    if (looksLikePhone(trimmed)) {
      const phone = trimmed.replace(/[^\d+]/g, '');
      const normalised = phone.startsWith('+') ? phone : '+' + phone.replace(/^0+/, '');
      return supabase.auth.resend({ type: 'sms', phone: normalised });
    }
    return Promise.resolve({ error: { message: 'Enter a valid email or mobile number first.' } });
  };

  const sendPasswordReset = (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

  const updatePassword = (password) =>
    supabase.auth.updateUser({ password });

  const updateProfile = async (updates) => {
    if (!session?.user) return { error: 'Not signed in' };
    const { data, error } = await supabase
      .from('customer_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', session.user.id)
      .select()
      .single();
    if (!error) setProfile(data);
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const value = {
    session,
    user: session?.user || null,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    sendPasswordReset,
    resendConfirmation,
    updatePassword,
    updateProfile,
    refreshProfile: () => session?.user && loadProfile(session.user.id),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
