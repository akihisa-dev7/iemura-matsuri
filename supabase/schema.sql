-- 家村祭 参加申請 テーブル（Supabase の SQL Editor に貼り付けて Run）
-- 何度実行しても大丈夫なように書いてあります。

create table if not exists public.entries (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(btrim(name)) between 1 and 100),
  count       text not null check (count in ('1名','2名','3名','4名','5名','6名以上')),
  university  text not null check (char_length(btrim(university)) between 1 and 100)
);

-- 管理画面を見られる人（Supabase の Authentication で作ったユーザーのメールアドレス）
create table if not exists public.admins (
  email text primary key
);

alter table public.entries enable row level security;
alter table public.admins  enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where email = auth.jwt() ->> 'email');
$$;

-- 申請フォーム：誰でも追加だけできる（読む・変更する・消すことはできない）
drop policy if exists "anyone can submit" on public.entries;
create policy "anyone can submit" on public.entries
  for insert to anon, authenticated
  with check (true);

-- 管理画面：admins に登録されたユーザーだけ読める
-- （削除・修正は Supabase の Table Editor で行う）
drop policy if exists "admins can read" on public.entries;
create policy "admins can read" on public.entries
  for select to authenticated
  using (public.is_admin());

-- id・受付日時はクライアントから指定させない
revoke insert on public.entries from anon, authenticated;
grant insert (name, count, university) on public.entries to anon, authenticated;
grant select on public.entries to authenticated;

-- ▼ 管理者のメールアドレスを登録（自分のアドレスに書き換えて実行）
-- insert into public.admins (email) values ('you@example.com') on conflict do nothing;
