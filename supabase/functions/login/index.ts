// Logs someone in with a username and password. This runs on Supabase's servers so that nobody's
// email address ever reaches the browser: usernames are public, emails must stay private.
import { createClient } from 'npm:@supabase/supabase-js@2.118.0';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
const NO_MATCH = { ok: false };

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return reply({ error: 'POST only' }, 405);

  let username = '', password = '';
  try {
    const body = await req.json();
    username = String(body.username ?? '').trim();
    password = String(body.password ?? '');
  } catch {
    return reply({ error: 'bad request' }, 400);
  }
  if (!/^[A-Za-z0-9_.-]{3,20}$/.test(username) || !password || password.length > 200) return reply(NO_MATCH);

  const url = Deno.env.get('SUPABASE_URL')!;
  const options = { auth: { persistSession: false, autoRefreshToken: false } };
  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, options);

  const { data: id, error: lookupError } = await admin.rpc('login_user_id', { name: username });
  if (lookupError) return reply({ error: 'lookup failed' }, 500);
  if (!id) return reply(NO_MATCH);

  const { data: found, error: userError } = await admin.auth.admin.getUserById(id);
  if (userError || !found.user?.email) return reply({ error: 'lookup failed' }, 500);

  const client = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, options);
  const { data, error } = await client.auth.signInWithPassword({ email: found.user.email, password });
  // Supabase only says this once the password is right, so it reveals nothing to a stranger.
  if (error?.code === 'email_not_confirmed') {
    await client.auth.resend({ type: 'signup', email: found.user.email }).catch(() => {});
    return reply({ ok: false, unverified: true });
  }
  if (error || !data.session) return reply(NO_MATCH);

  // Only the session goes back. The email address stays here.
  return reply({ ok: true, access_token: data.session.access_token, refresh_token: data.session.refresh_token });
});
