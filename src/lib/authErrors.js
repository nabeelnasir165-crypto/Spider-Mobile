// Translate Supabase auth error messages into copy customers actually
// understand. Lives in /lib so both Login and Signup can import it without
// pulling each other's full route module into the same chunk.
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
