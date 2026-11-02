-- Mumtea High database. Paste all of this into Supabase > SQL Editor and press Run. Safe to run again.

create extension if not exists pgcrypto with schema extensions;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  look jsonb,
  blend text check (blend is null or char_length(blend) <= 60),
  styled boolean not null default false,
  joined_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[A-Za-z0-9_.-]{3,20}$'),
  constraint look_size check (look is null or pg_column_size(look) < 4000)
);
alter table public.profiles add column if not exists muted boolean not null default false;
alter table public.profiles add column if not exists verified boolean not null default false;
update public.profiles p set verified = true from auth.users u where u.id = p.id and u.email_confirmed_at is not null and not p.verified;
create unique index if not exists profiles_username_lower on public.profiles (lower(username));

-- A post with no author is from Ms. Fangtastic, written by whoever holds the admin code.
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid default auth.uid() references public.profiles (id) on delete cascade,
  title text not null default '' check (char_length(title) <= 100),
  body text not null check (char_length(btrim(body)) between 1 and 1000),
  created_at timestamptz not null default now()
);
alter table public.posts alter column author_id drop not null;
create index if not exists posts_newest on public.posts (created_at desc);

-- The note on the main page and how Ms. Fangtastic is dressed.
create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  note text not null default '' check (char_length(note) <= 300)
);
alter table public.site_settings add column if not exists fang_look jsonb;
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- The admin code. These tables are out of reach of the website; only the functions below can touch them.
create table if not exists private.admin_secret (id int primary key default 1 check (id = 1), code_hash text not null);
create table if not exists private.admin_sessions (token_hash text primary key, expires_at timestamptz not null);
create table if not exists private.admin_attempts (ip text not null, at timestamptz not null default now());
create index if not exists admin_attempts_at on private.admin_attempts (at);

-- Remove the old way of being admin, from when it was tied to an account.
drop policy if exists "people and the headghoul see unverified" on public.profiles;
drop policy if exists "people or the headghoul delete posts" on public.posts;
drop policy if exists "the headghoul edits settings" on public.site_settings;
drop function if exists public.make_headghoul(text);
drop function if exists public.admin_delete_user(uuid);
drop function if exists public.admin_set_muted(uuid, boolean);
drop function if exists public.is_headghoul();
drop index if exists public.one_headghoul;
alter table public.profiles drop column if exists is_headghoul;

-- Row level security: anyone can read; people change only their own things.
-- People who have not verified their email stay hidden from everyone but themselves.
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "profiles are public" on public.profiles;
create policy "profiles are public" on public.profiles for select using (verified);
drop policy if exists "people see themselves" on public.profiles;
create policy "people see themselves" on public.profiles for select to authenticated using (id = auth.uid());
drop policy if exists "people update themselves" on public.profiles;
create policy "people update themselves" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "posts are public" on public.posts;
create policy "posts are public" on public.posts for select using (true);
drop policy if exists "people post as themselves" on public.posts;
create policy "people post as themselves" on public.posts for insert to authenticated with check (
  author_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and verified and not muted)
);
drop policy if exists "people delete their posts" on public.posts;
create policy "people delete their posts" on public.posts for delete to authenticated using (author_id = auth.uid());

drop policy if exists "settings are public" on public.site_settings;
create policy "settings are public" on public.site_settings for select using (true);

-- Only these columns can be changed from the site, so nobody can unmute or verify themselves, or rename.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant update (look, blend, styled) on public.profiles to authenticated;
revoke all on public.posts from anon, authenticated;
grant select on public.posts to anon, authenticated;
grant insert (title, body) on public.posts to authenticated;
grant delete on public.posts to authenticated;
revoke all on public.site_settings from anon, authenticated;
grant select on public.site_settings to anon, authenticated;

-- Every new account gets a profile. Ms. Fangtastic's names cannot be taken at sign-up.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare wanted text := new.raw_user_meta_data ->> 'username';
begin
  if lower(wanted) in ('mumtea', 'mumtas', 'fangtastic', 'msfangtastic', 'ms.fangtastic', 'msfantastic', 'ms.fantastic') then
    raise exception 'reserved username';
  end if;
  insert into public.profiles (id, username, look, verified) values (new.id, wanted, new.raw_user_meta_data -> 'look', new.email_confirmed_at is not null);
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Clicking the link in the verification email is what makes someone a visible student.
create or replace function public.handle_email_verified() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles set verified = true where id = new.id;
  return new;
end $$;
drop trigger if exists on_auth_user_verified on auth.users;
create trigger on_auth_user_verified after update of email_confirmed_at on auth.users for each row
  when (old.email_confirmed_at is null and new.email_confirmed_at is not null)
  execute function public.handle_email_verified();

-- Lets someone delete their own account from the site. Their profile and posts go with it.
create or replace function public.delete_me() returns void
language sql security definer set search_path = '' as $$
  delete from auth.users where id = auth.uid();
$$;
revoke all on function public.delete_me() from public, anon;
grant execute on function public.delete_me() to authenticated;

-- Used only by the login server function, to find whose account a username belongs to. Never from the website.
create or replace function public.login_user_id(name text) returns uuid
language sql stable security definer set search_path = '' as $$
  select id from public.profiles where lower(username) = lower(name);
$$;
revoke all on function public.login_user_id(text) from public, anon, authenticated;
grant execute on function public.login_user_id(text) to service_role;

-- ---------- The admin code ----------
-- Setting or changing the code. This can only be run here in the SQL Editor, never from the website.
-- Changing it also ends every admin pass already handed out.
create or replace function public.set_admin_code(code text) returns text
language plpgsql security definer set search_path = '' as $$
begin
  if char_length(code) < 6 then raise exception 'the admin code must be at least 6 characters'; end if;
  if upper(regexp_replace(code, '[^A-Za-z0-9]', '', 'g')) in ('MUMTEA', 'FANGTASTIC', 'MSFANTASTIC', 'EARLGHOUL', 'BOOBREW') then
    raise exception 'that is one of the public bonus codes';
  end if;
  insert into private.admin_secret (id, code_hash) values (1, extensions.crypt(code, extensions.gen_salt('bf', 10)))
    on conflict (id) do update set code_hash = excluded.code_hash;
  delete from private.admin_sessions;
  return 'Admin code set. Anyone already in admin mode has been signed out of it.';
end $$;
revoke all on function public.set_admin_code(text) from public, anon, authenticated;

-- Is this pass real and still in date? Not reachable from the website directly.
create or replace function private.admin_ok(token text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from private.admin_sessions where token_hash = encode(sha256(convert_to(coalesce(token, ''), 'UTF8')), 'hex') and expires_at > now());
$$;
revoke all on function private.admin_ok(text) from public, anon, authenticated;

create or replace function private.require_admin(token text) returns void
language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.admin_ok(token) then raise exception 'admin access has ended'; end if;
end $$;
revoke all on function private.require_admin(text) from public, anon, authenticated;

-- Trying the code from the box on the main page. Ten wrong tries from one address, or 200 from everywhere, locks it for 15 minutes.
create or replace function public.admin_enter(code text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  headers json := nullif(current_setting('request.headers', true), '')::json;
  client_ip text := coalesce(headers ->> 'cf-connecting-ip', split_part(headers ->> 'x-forwarded-for', ',', 1), 'unknown');
  stored text;
  token text;
begin
  delete from private.admin_attempts where at < now() - interval '15 minutes';
  if (select count(*) from private.admin_attempts where ip = client_ip) >= 10
     or (select count(*) from private.admin_attempts) >= 200 then
    return jsonb_build_object('ok', false, 'locked', true);
  end if;
  select code_hash into stored from private.admin_secret where id = 1;
  if stored is null or code is null or char_length(code) > 200 or extensions.crypt(code, stored) <> stored then
    insert into private.admin_attempts (ip) values (client_ip);
    return jsonb_build_object('ok', false);
  end if;
  delete from private.admin_attempts where ip = client_ip;
  delete from private.admin_sessions where expires_at < now();
  token := encode(extensions.gen_random_bytes(32), 'hex');
  insert into private.admin_sessions (token_hash, expires_at) values (encode(sha256(convert_to(token, 'UTF8')), 'hex'), now() + interval '12 hours');
  return jsonb_build_object('ok', true, 'token', token);
end $$;
revoke all on function public.admin_enter(text) from public;
grant execute on function public.admin_enter(text) to anon, authenticated;

create or replace function public.admin_check(token text) returns boolean
language sql stable security definer set search_path = '' as $$
  select private.admin_ok(token);
$$;
revoke all on function public.admin_check(text) from public;
grant execute on function public.admin_check(text) to anon, authenticated;

create or replace function public.admin_leave(token text) returns void
language sql security definer set search_path = '' as $$
  delete from private.admin_sessions where token_hash = encode(sha256(convert_to(coalesce(token, ''), 'UTF8')), 'hex');
$$;
revoke all on function public.admin_leave(text) from public;
grant execute on function public.admin_leave(text) to anon, authenticated;

-- ---------- The admin's powers. Each one checks the pass before doing anything. ----------
create or replace function public.admin_students(token text) returns setof public.profiles
language plpgsql stable security definer set search_path = '' as $$
begin
  perform private.require_admin(token);
  return query select * from public.profiles order by joined_at;
end $$;

create or replace function public.admin_delete_user(token text, target uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_admin(token);
  delete from auth.users where id = target;
end $$;

create or replace function public.admin_set_muted(token text, target uuid, value boolean) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_admin(token);
  update public.profiles set muted = value where id = target;
end $$;

create or replace function public.admin_delete_post(token text, target uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_admin(token);
  delete from public.posts where id = target;
end $$;

create or replace function public.admin_post(token text, title text, body text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
  perform private.require_admin(token);
  insert into public.posts (author_id, title, body) values (null, title, body) returning id into new_id;
  return new_id;
end $$;

create or replace function public.admin_set_note(token text, note text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_admin(token);
  update public.site_settings set note = admin_set_note.note where id = 1;
end $$;

create or replace function public.admin_set_fang_look(token text, look jsonb) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_admin(token);
  if pg_column_size(look) >= 4000 then raise exception 'look too large'; end if;
  update public.site_settings set fang_look = look where id = 1;
end $$;

do $$
declare f text;
begin
  foreach f in array array[
    'admin_students(text)', 'admin_delete_user(text, uuid)', 'admin_set_muted(text, uuid, boolean)', 'admin_delete_post(text, uuid)',
    'admin_post(text, text, text)', 'admin_set_note(text, text)', 'admin_set_fang_look(text, jsonb)'
  ] loop
    execute 'revoke all on function public.' || f || ' from public';
    execute 'grant execute on function public.' || f || ' to anon, authenticated';
  end loop;
end $$;

-- Live updates.
do $$ begin
  alter publication supabase_realtime add table public.posts;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.profiles;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.site_settings;
exception when duplicate_object then null; end $$;

-- Run this once, with your own secret code of at least 6 characters, to switch on admin mode.
-- Run it again any time to change the code. Do not save the real code in this file.
-- select public.set_admin_code('YOUR_SECRET_CODE');
