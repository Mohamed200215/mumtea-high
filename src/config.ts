/* Supabase connection. This key is the public one, made to live in a website: row level security in
   supabase/schema.sql is what protects the data. Never put the service_role key here. */
const SUPABASE_URL = 'https://lhnonknherklzygksbkk.supabase.co';
const SUPABASE_KEY = 'sb_publishable_wwAJQa4jMi0F7MQIUtKLAg_jrJfHDge';
const backendReady = !SUPABASE_KEY.startsWith('PASTE');
/* Read these before the client below tidies the address bar. */
const cameFromResetLink = /type=recovery/.test(location.hash);
const cameFromVerifyLink = /type=signup/.test(location.hash);
const resetLinkFailed = /error_code=/.test(location.hash);
const sb: any = backendReady ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { flowType: 'implicit', detectSessionInUrl: true } }) : null;
