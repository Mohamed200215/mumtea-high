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
  body text not null check (char_length(btrim(body)) between 1 and 10000),
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

-- Game leaderboard: each person's best score per game. A row with no user_id is Ms. Fangtastic's.
-- Scores only change through submit_score and admin_submit_score.
create table if not exists public.game_scores (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles (id) on delete cascade,
  game text not null check (game in ('spill', 'riptide', 'casket', 'kick', 'hoops', 'pageant')),
  score integer not null check (score between 1 and 1000000),
  at timestamptz not null default now(),
  unique (user_id, game)
);
alter table public.game_scores drop constraint if exists game_scores_game_check;
alter table public.game_scores add constraint game_scores_game_check check (game in ('spill', 'riptide', 'casket', 'kick', 'hoops', 'pageant'));
create unique index if not exists game_scores_one_fang on public.game_scores (game) where user_id is null;
create index if not exists game_scores_top on public.game_scores (game, score desc);
alter table public.game_scores enable row level security;
drop policy if exists "scores are public" on public.game_scores;
create policy "scores are public" on public.game_scores for select using (true);
revoke all on public.game_scores from anon, authenticated;
grant select on public.game_scores to anon, authenticated;

create or replace function public.submit_score(which text, points integer) returns integer
language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); best integer;
begin
  if me is null then raise exception 'log in first'; end if;
  if not exists (select 1 from public.profiles where id = me and verified) then raise exception 'verify your email first'; end if;
  if which is null or which not in ('spill', 'riptide', 'casket', 'kick', 'hoops', 'pageant') then raise exception 'unknown game'; end if;
  if points is null or points < 1 or points > 1000000 then raise exception 'bad score'; end if;
  insert into public.game_scores as s (user_id, game, score) values (me, which, points)
    on conflict (user_id, game) do update set score = excluded.score, at = now() where s.score < excluded.score;
  select s.score into best from public.game_scores s where s.user_id = me and s.game = which;
  return best;
end $$;
revoke all on function public.submit_score(text, integer) from public, anon;
grant execute on function public.submit_score(text, integer) to authenticated;

create or replace function public.admin_submit_score(token text, which text, points integer) returns integer
language plpgsql security definer set search_path = '' as $$
declare best integer;
begin
  perform private.require_admin(token);
  if which is null or which not in ('spill', 'riptide', 'casket', 'kick', 'hoops', 'pageant') then raise exception 'unknown game'; end if;
  if points is null or points < 1 or points > 1000000 then raise exception 'bad score'; end if;
  insert into public.game_scores as s (user_id, game, score) values (null, which, points)
    on conflict (game) where user_id is null do update set score = excluded.score, at = now() where s.score < excluded.score;
  select s.score into best from public.game_scores s where s.user_id is null and s.game = which;
  return best;
end $$;
revoke all on function public.admin_submit_score(text, text, integer) from public;
grant execute on function public.admin_submit_score(text, text, integer) to anon, authenticated;

create or replace function public.admin_delete_score(token text, target uuid, which text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_admin(token);
  delete from public.game_scores where user_id is not distinct from target and game = which;
end $$;
revoke all on function public.admin_delete_score(text, uuid, text) from public;
grant execute on function public.admin_delete_score(text, uuid, text) to anon, authenticated;

-- Editing posts. People change only the words of their own posts; edited_at is set by the database.
alter table public.posts add column if not exists edited_at timestamptz;
create or replace function private.mark_edited() returns trigger language plpgsql set search_path = '' as $$
begin
  if new.title is distinct from old.title or new.body is distinct from old.body then new.edited_at := now(); end if;
  return new;
end $$;
drop trigger if exists posts_mark_edited on public.posts;
create trigger posts_mark_edited before update on public.posts for each row execute function private.mark_edited();
drop policy if exists "people edit their posts" on public.posts;
create policy "people edit their posts" on public.posts for update to authenticated
  using (author_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and verified and not muted))
  with check (author_id = auth.uid());
grant update (title, body) on public.posts to authenticated;

-- Comments. No author means Ms. Fangtastic, the same as posts.
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid default auth.uid() references public.profiles (id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 1000),
  created_at timestamptz not null default now()
);
create index if not exists comments_post on public.comments (post_id, created_at);
alter table public.comments enable row level security;
drop policy if exists "comments are public" on public.comments;
create policy "comments are public" on public.comments for select using (true);
drop policy if exists "people comment as themselves" on public.comments;
create policy "people comment as themselves" on public.comments for insert to authenticated with check (
  author_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and verified and not muted)
);
drop policy if exists "people delete their comments" on public.comments;
create policy "people delete their comments" on public.comments for delete to authenticated using (author_id = auth.uid());
revoke all on public.comments from anon, authenticated;
grant select on public.comments to anon, authenticated;
grant insert (post_id, body) on public.comments to authenticated;
grant delete on public.comments to authenticated;

-- Reactions: one of each kind per person per post. No user means Ms. Fangtastic.
create table if not exists public.post_reactions (
  id bigint generated always as identity primary key,
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid default auth.uid() references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('fang', 'tea', 'skull', 'heart', 'fire')),
  unique (post_id, user_id, kind)
);
create unique index if not exists post_reactions_one_fang on public.post_reactions (post_id, kind) where user_id is null;
alter table public.post_reactions enable row level security;
drop policy if exists "reactions are public" on public.post_reactions;
create policy "reactions are public" on public.post_reactions for select using (true);
drop policy if exists "people react as themselves" on public.post_reactions;
create policy "people react as themselves" on public.post_reactions for insert to authenticated with check (
  user_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and verified)
);
drop policy if exists "people remove their reactions" on public.post_reactions;
create policy "people remove their reactions" on public.post_reactions for delete to authenticated using (user_id = auth.uid());
revoke all on public.post_reactions from anon, authenticated;
grant select on public.post_reactions to anon, authenticated;
grant insert (post_id, kind) on public.post_reactions to authenticated;
grant delete on public.post_reactions to authenticated;

-- Reports go only to whoever holds the admin code. Nobody else can read them, including who reported what.
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid default auth.uid() references public.profiles (id) on delete set null,
  post_id uuid references public.posts (id) on delete cascade,
  comment_id uuid references public.comments (id) on delete cascade,
  target_user uuid references public.profiles (id) on delete cascade,
  reason text not null check (char_length(reason) between 1 and 300),
  created_at timestamptz not null default now(),
  check (num_nonnulls(post_id, comment_id, target_user) = 1)
);
create unique index if not exists reports_once on public.reports (reporter_id, coalesce(post_id, comment_id, target_user));
alter table public.reports enable row level security;
drop policy if exists "people report as themselves" on public.reports;
create policy "people report as themselves" on public.reports for insert to authenticated with check (
  reporter_id = auth.uid() and exists (select 1 from public.profiles where id = auth.uid() and verified)
);
revoke all on public.reports from anon, authenticated;
grant insert (post_id, comment_id, target_user, reason) on public.reports to authenticated;

-- Bones follow the account. Scores already do, through game_scores.
create table if not exists public.player_progress (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  bones integer not null default 0 check (bones between 0 and 10000000),
  updated_at timestamptz not null default now()
);
alter table public.player_progress enable row level security;
drop policy if exists "progress is public" on public.player_progress;
create policy "progress is public" on public.player_progress for select using (true);
revoke all on public.player_progress from anon, authenticated;
grant select on public.player_progress to anon, authenticated;
create or replace function public.save_bones(total integer) returns void
language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid();
begin
  if me is null then raise exception 'log in first'; end if;
  if not exists (select 1 from public.profiles where id = me and verified) then raise exception 'verify your email first'; end if;
  if total is null or total < 0 or total > 10000000 then raise exception 'bad total'; end if;
  insert into public.player_progress (user_id, bones) values (me, total)
    on conflict (user_id) do update set bones = excluded.bones, updated_at = now();
end $$;
revoke all on function public.save_bones(integer) from public, anon;
grant execute on function public.save_bones(integer) to authenticated;

-- What the admin code can do with all of this.
create or replace function public.admin_edit_post(token text, target uuid, title text, body text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_admin(token);
  update public.posts p set title = admin_edit_post.title, body = admin_edit_post.body where p.id = target and p.author_id is null;
end $$;
create or replace function public.admin_comment(token text, target uuid, body text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
  perform private.require_admin(token);
  insert into public.comments (post_id, author_id, body) values (target, null, admin_comment.body) returning id into new_id;
  return new_id;
end $$;
create or replace function public.admin_delete_comment(token text, target uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_admin(token);
  delete from public.comments where id = target;
end $$;
create or replace function public.admin_toggle_reaction(token text, target uuid, which text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_admin(token);
  delete from public.post_reactions where post_id = target and kind = which and user_id is null;
  if not found then insert into public.post_reactions (post_id, user_id, kind) values (target, null, which); end if;
end $$;
create or replace function public.admin_reports(token text) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare result jsonb;
begin
  perform private.require_admin(token);
  select coalesce(jsonb_agg(row order by row.at desc), '[]'::jsonb) into result from (
    select r.id, r.reason, r.created_at as at, who.username as reporter, r.post_id, r.comment_id, r.target_user,
      coalesce(p.title, '') as title, coalesce(p.body, c.body, '') as body, coalesce(c.post_id, r.post_id) as in_post,
      coalesce(p.author_id, c.author_id, r.target_user) as author_id
    from public.reports r
    left join public.profiles who on who.id = r.reporter_id
    left join public.posts p on p.id = r.post_id
    left join public.comments c on c.id = r.comment_id
  ) row;
  return result;
end $$;
create or replace function public.admin_dismiss_report(token text, target uuid) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_admin(token);
  delete from public.reports where id = target;
end $$;
do $$
declare f text;
begin
  foreach f in array array['admin_edit_post(text, uuid, text, text)', 'admin_comment(text, uuid, text)', 'admin_delete_comment(text, uuid)', 'admin_toggle_reaction(text, uuid, text)', 'admin_reports(text)', 'admin_dismiss_report(text, uuid)'] loop
    execute 'revoke all on function public.' || f || ' from public';
    execute 'grant execute on function public.' || f || ' to anon, authenticated';
  end loop;
end $$;

-- Live updates.
do $$ begin
  alter publication supabase_realtime add table public.comments;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.post_reactions;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.game_scores;
exception when duplicate_object then null; end $$;
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

-- Polaroids and the laughing reaction.
-- A photo lives in its own table so the timeline stays quick, and goes when its post or its author's account goes.
create table if not exists public.post_photos (
  post_id uuid primary key references public.posts (id) on delete cascade,
  photo text not null check (char_length(photo) <= 400000 and photo ~ '^data:image/jpeg;base64,[A-Za-z0-9+/]+={0,2}$')
);
alter table public.post_photos enable row level security;
drop policy if exists "polaroids are public" on public.post_photos;
create policy "polaroids are public" on public.post_photos for select using (true);
revoke all on public.post_photos from anon, authenticated;
grant select on public.post_photos to anon, authenticated;

create or replace function public.post_polaroid(caption text, photo text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); new_id uuid;
begin
  if me is null or not exists (select 1 from public.profiles where id = me and verified and not muted) then
    raise exception 'not allowed to post';
  end if;
  if (select count(*) from public.post_photos f join public.posts p on p.id = f.post_id where p.author_id = me and p.created_at > now() - interval '1 day') >= 30 then
    raise exception 'only 30 polaroids a day';
  end if;
  insert into public.posts (author_id, title, body) values (me, '', caption) returning id into new_id;
  insert into public.post_photos (post_id, photo) values (new_id, post_polaroid.photo);
  return new_id;
end $$;
create or replace function public.admin_post_polaroid(token text, caption text, photo text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
  perform private.require_admin(token);
  insert into public.posts (author_id, title, body) values (null, '', caption) returning id into new_id;
  insert into public.post_photos (post_id, photo) values (new_id, admin_post_polaroid.photo);
  return new_id;
end $$;
revoke all on function public.post_polaroid(text, text) from public;
grant execute on function public.post_polaroid(text, text) to authenticated;
revoke all on function public.admin_post_polaroid(text, text, text) from public;
grant execute on function public.admin_post_polaroid(text, text, text) to anon, authenticated;

alter table public.post_reactions drop constraint if exists post_reactions_kind_check;
alter table public.post_reactions add constraint post_reactions_kind_check check (kind in ('fang', 'tea', 'skull', 'heart', 'fire', 'laugh'));

-- Notifications: written only by triggers. A row with no user_id is for Ms. Fangtastic; a row with no actor_id is from her.
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id) on delete cascade,
  actor_id uuid references public.profiles (id) on delete cascade,
  kind text not null check (kind in ('comment', 'reply', 'reaction', 'score')),
  post_id uuid references public.posts (id) on delete cascade,
  detail text not null default '' check (char_length(detail) <= 40),
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_mine on public.notifications (user_id, created_at desc);
-- Toggling a reaction on and off only tells someone once.
create unique index if not exists notifications_one_reaction on public.notifications (coalesce(user_id, '00000000-0000-0000-0000-000000000000'::uuid), coalesce(actor_id, '00000000-0000-0000-0000-000000000000'::uuid), post_id, detail) where kind = 'reaction';
alter table public.notifications enable row level security;
drop policy if exists "see my notifications" on public.notifications;
create policy "see my notifications" on public.notifications for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "mark my notifications read" on public.notifications;
create policy "mark my notifications read" on public.notifications for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
revoke all on public.notifications from anon, authenticated;
grant select on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;

create or replace function private.notify_comment() returns trigger
language plpgsql security definer set search_path = '' as $$
declare owner_id uuid;
begin
  select p.author_id into owner_id from public.posts p where p.id = new.post_id;
  if not found then return new; end if;
  if new.author_id is distinct from owner_id then
    insert into public.notifications (user_id, actor_id, kind, post_id) values (owner_id, new.author_id, 'comment', new.post_id);
  end if;
  -- Others already in the conversation hear about it too.
  insert into public.notifications (user_id, actor_id, kind, post_id)
    select distinct c.author_id, new.author_id, 'reply', new.post_id from public.comments c
    where c.post_id = new.post_id and c.id <> new.id and c.author_id is distinct from new.author_id and c.author_id is distinct from owner_id
    limit 20;
  return new;
end $$;
drop trigger if exists comment_notifies on public.comments;
create trigger comment_notifies after insert on public.comments for each row execute function private.notify_comment();

create or replace function private.notify_reaction() returns trigger
language plpgsql security definer set search_path = '' as $$
declare owner_id uuid;
begin
  select p.author_id into owner_id from public.posts p where p.id = new.post_id;
  if not found or new.user_id is not distinct from owner_id then return new; end if;
  insert into public.notifications (user_id, actor_id, kind, post_id, detail) values (owner_id, new.user_id, 'reaction', new.post_id, new.kind) on conflict do nothing;
  return new;
end $$;
drop trigger if exists reaction_notifies on public.post_reactions;
create trigger reaction_notifies after insert on public.post_reactions for each row execute function private.notify_reaction();

create or replace function private.notify_score() returns trigger
language plpgsql security definer set search_path = '' as $$
declare was integer := 0;
begin
  if tg_op = 'UPDATE' then
    if new.score <= old.score then return new; end if;
    was := old.score;
  end if;
  insert into public.notifications (user_id, actor_id, kind, detail)
    select s.user_id, new.user_id, 'score', new.game from public.game_scores s
    where s.game = new.game and s.id <> new.id and s.score < new.score and s.score >= was
    order by s.score desc limit 3;
  return new;
end $$;
drop trigger if exists score_notifies on public.game_scores;
create trigger score_notifies after insert or update of score on public.game_scores for each row execute function private.notify_score();

-- Old notifications tidy themselves away.
create or replace function private.tidy_notifications() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  delete from public.notifications n where n.user_id is not distinct from new.user_id and n.created_at < now() - interval '60 days';
  return null;
end $$;
drop trigger if exists notifications_tidy on public.notifications;
create trigger notifications_tidy after insert on public.notifications for each row execute function private.tidy_notifications();
revoke all on function private.notify_comment(), private.notify_reaction(), private.notify_score(), private.tidy_notifications() from public, anon, authenticated;

create or replace function public.admin_notifications(token text) returns setof public.notifications
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_admin(token);
  return query select * from public.notifications n where n.user_id is null order by n.created_at desc limit 60;
end $$;
create or replace function public.admin_read_notifications(token text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform private.require_admin(token);
  update public.notifications n set read_at = now() where n.user_id is null and n.read_at is null;
end $$;
revoke all on function public.admin_notifications(text), public.admin_read_notifications(text) from public;
grant execute on function public.admin_notifications(text), public.admin_read_notifications(text) to anon, authenticated;

do $$ begin
  alter publication supabase_realtime add table public.notifications;
exception when duplicate_object then null; end $$;

-- The Polaroid gallery: private to each account, the pictures in a private bucket under the owner's own folder.
create table if not exists public.gallery_polaroids (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  caption text not null default '' check (char_length(caption) <= 200),
  taken_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists gallery_mine on public.gallery_polaroids (user_id, taken_at desc);
alter table public.gallery_polaroids enable row level security;
drop policy if exists "see my polaroids" on public.gallery_polaroids;
create policy "see my polaroids" on public.gallery_polaroids for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "keep my polaroids" on public.gallery_polaroids;
create policy "keep my polaroids" on public.gallery_polaroids for insert to authenticated with check (user_id = (select auth.uid()) and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.verified));
drop policy if exists "remove my polaroids" on public.gallery_polaroids;
create policy "remove my polaroids" on public.gallery_polaroids for delete to authenticated using (user_id = (select auth.uid()));
revoke all on public.gallery_polaroids from anon, authenticated;
grant select, insert, delete on public.gallery_polaroids to authenticated;

create or replace function private.gallery_limit() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if (select count(*) from public.gallery_polaroids g where g.user_id = new.user_id) >= 200 then raise exception 'gallery full'; end if;
  return new;
end $$;
drop trigger if exists gallery_limit on public.gallery_polaroids;
create trigger gallery_limit before insert on public.gallery_polaroids for each row execute function private.gallery_limit();
revoke all on function private.gallery_limit() from public, anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values ('polaroids', 'polaroids', false, 1048576, array['image/jpeg'])
  on conflict (id) do update set public = false, file_size_limit = 1048576, allowed_mime_types = array['image/jpeg'];
drop policy if exists "see my polaroid files" on storage.objects;
create policy "see my polaroid files" on storage.objects for select to authenticated using (bucket_id = 'polaroids' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "add my polaroid files" on storage.objects;
create policy "add my polaroid files" on storage.objects for insert to authenticated with check (bucket_id = 'polaroids' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "remove my polaroid files" on storage.objects;
create policy "remove my polaroid files" on storage.objects for delete to authenticated using (bucket_id = 'polaroids' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- The full set of reactions.
alter table public.post_reactions drop constraint if exists post_reactions_kind_check;
alter table public.post_reactions add constraint post_reactions_kind_check check (kind in ('fang', 'tea', 'skull', 'heart', 'fire', 'laugh', 'love', 'queen', 'aww', 'giggle', 'shades', 'cap', 'mic', 'bored', 'flat', 'feet', 'dizzy'));

-- The shop: what each student owns. Only buy_shop_item can add to it, and it sets the prices itself.
create table if not exists public.shop_owned (
  user_id uuid not null references public.profiles (id) on delete cascade,
  item text not null check (char_length(item) <= 40),
  price integer not null default 0,
  bought_at timestamptz not null default now(),
  primary key (user_id, item)
);
alter table public.shop_owned enable row level security;
drop policy if exists "see what I own" on public.shop_owned;
create policy "see what I own" on public.shop_owned for select to authenticated using (user_id = (select auth.uid()));
revoke all on public.shop_owned from anon, authenticated;
grant select on public.shop_owned to authenticated;

create or replace function public.buy_shop_item(which text) returns integer
language plpgsql security definer set search_path = '' as $$
declare me uuid := auth.uid(); cost integer; have integer;
begin
  if me is null then raise exception 'log in first'; end if;
  if not exists (select 1 from public.profiles where id = me and verified) then raise exception 'verify your email first'; end if;
  cost := case which
    when 'rangerover' then 1200
    when 'gwagon' then 1500
    when 'audir8' then 1400
    when 'bmwm4' then 900
    when 'porsche911' then 1300
    when 'bentley' then 1800
    when 'ferrari' then 2200
    when 'lamborghini' then 2500
    when 'rollsroyce' then 3000
    when 'nikecap' then 40
    when 'nikebeanie' then 35
    when 'pumacap' then 35
    when 'pumabucket' then 40
    when 'pradabucket' then 90
    when 'pradaberet' then 80
    when 'nikeaf1' then 90
    when 'nikedunk' then 110
    when 'pumasuede' then 70
    when 'pumaspeedcat' then 85
    when 'asicskayano' then 95
    when 'asicsnyc' then 105
    when 'diorbar' then 320
    when 'diorcorset' then 260
    when 'diorhoodie' then 180
    when 'diorblouse' then 210
    when 'diortulle' then 300
    when 'diorpleats' then 270
    when 'diorjeans' then 170
    when 'diamondpendant' then 350
    when 'tennisnecklace' then 480
    when 'diamondchain' then 650
    when 'tennisbracelet' then 400
    when 'rolexsub' then 700
    when 'rolexdaydate' then 1000
    when 'aproyaloak' then 1200
    when 'pateknautilus' then 1500
    else null end;
  if cost is null then raise exception 'unknown item'; end if;
  if exists (select 1 from public.shop_owned o where o.user_id = me and o.item = which) then raise exception 'already owned'; end if;
  select p.bones into have from public.player_progress p where p.user_id = me for update;
  if have is null or have < cost then raise exception 'not enough bones'; end if;
  update public.player_progress p set bones = p.bones - cost, updated_at = now() where p.user_id = me;
  insert into public.shop_owned (user_id, item, price) values (me, which, cost);
  return have - cost;
end $$;
revoke all on function public.buy_shop_item(text) from public, anon;
grant execute on function public.buy_shop_item(text) to authenticated;
