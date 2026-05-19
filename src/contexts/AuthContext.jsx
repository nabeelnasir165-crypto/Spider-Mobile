import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

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

  // Email is the auth credential. Phone is collected as a contact field
  // and stored on the customer profile via the signup trigger.
  const signUp = async ({ email, password, fullName, phone }) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || null,
          phone: phone || null,
        },
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });
  };

  const signIn = ({ email, password }) =>
    supabase.auth.signInWithPassword({ email, password });

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/account` },
    });

  const resendConfirmation = (email) =>
    supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: `${window.location.origin}/account` },
    });

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
