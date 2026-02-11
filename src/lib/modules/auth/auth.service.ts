import { supabase, SUPABASE_URL } from '@src/lib/core/supabase';

const REGISTER_FN_URL = `${SUPABASE_URL}/functions/v1/register-user`;

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signUp(email: string, password: string, fullName: string) {
    // Usamos la Edge Function con cliente admin para evitar el password strength check
    const res = await fetch(REGISTER_FN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? 'Error al registrarse');
    return json;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};
