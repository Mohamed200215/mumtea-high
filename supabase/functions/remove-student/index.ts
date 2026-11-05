// Removes a student for whoever holds the admin code: their private Polaroid files first, then the account.
// Stored files can only be deleted through Supabase's storage service, so this runs on Supabase's servers.
import { createClient } from 'npm:@supabase/supabase-js@2.118.0';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return reply({ error: 'POST only' }, 405);

  let token = '', target = '';
  try {
    const body = await req.json();
    token = String(body.token ?? '');
    target = String(body.target ?? '').toLowerCase();
  } catch {
    return reply({ ok: false, error: 'bad request' }, 400);
  }
  if (!token || token.length > 200 || !UUID.test(target)) return reply({ ok: false, error: 'bad request' }, 400);

  const options = { auth: { persistSession: false, autoRefreshToken: false } };
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, options);

  const { data: allowed, error: checkError } = await admin.rpc('admin_check', { token });
  if (checkError) return reply({ ok: false, error: 'check failed' }, 500);
  if (!allowed) return reply({ ok: false, error: 'admin access has ended' });

  const bucket = admin.storage.from('polaroids');
  const { data: files, error: listError } = await bucket.list(target, { limit: 1000 });
  if (listError) return reply({ ok: false, error: 'could not list photos' }, 500);
  if (files.length) {
    const { error: removeError } = await bucket.remove(files.map(f => target + '/' + f.name));
    if (removeError) return reply({ ok: false, error: 'could not remove photos' }, 500);
  }

  // The database checks the code again before it deletes anything.
  const { error: deleteError } = await admin.rpc('admin_delete_user', { token, target });
  if (deleteError) return reply({ ok: false, error: deleteError.message });
  return reply({ ok: true });
});
