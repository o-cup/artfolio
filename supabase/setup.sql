-- parkmejung.com 데이터베이스 준비 (한 번만 실행)
-- Supabase 화면 → SQL Editor → 이 파일 내용을 통째로 붙여 넣고 [Run]
-- 여러 번 실행해도 괜찮아요.

-- 1) 관리자 목록: 여기에 있는 이메일만 사이트 내용을 고칠 수 있어요.
create table if not exists public.admin_emails (
  email text primary key
);
alter table public.admin_emails enable row level security;
-- (아무에게도 읽기/쓰기 권한을 주지 않아요. 아래 함수만 확인용으로 봐요.)

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_emails
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 2) 사이트 내용: works / exhibitions / about 세 줄. data에 한국어·영어가 같이 들어 있어요.
create table if not exists public.site_content (
  key text primary key check (key in ('works', 'exhibitions', 'about')),
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;

grant select on public.site_content to anon, authenticated;
grant insert, update on public.site_content to authenticated;

drop policy if exists "누구나 읽기" on public.site_content;
create policy "누구나 읽기" on public.site_content
  for select to anon, authenticated using (true);

drop policy if exists "관리자만 추가" on public.site_content;
create policy "관리자만 추가" on public.site_content
  for insert to authenticated with check (public.is_admin());

drop policy if exists "관리자만 수정" on public.site_content;
create policy "관리자만 수정" on public.site_content
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- 3) 사진 보관함: 누구나 볼 수 있고, 관리자만 올리고 지울 수 있어요.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('photos', 'photos', true, 10485760, array['image/jpeg', 'image/png'])
on conflict (id) do update
  set public = true, file_size_limit = 10485760, allowed_mime_types = array['image/jpeg', 'image/png'];

-- (사진을 덮어쓰려면 읽기 권한도 있어야 해요)
drop policy if exists "관리자만 사진 목록 보기" on storage.objects;
create policy "관리자만 사진 목록 보기" on storage.objects
  for select to authenticated using (bucket_id = 'photos' and public.is_admin());

drop policy if exists "관리자만 사진 올리기" on storage.objects;
create policy "관리자만 사진 올리기" on storage.objects
  for insert to authenticated with check (bucket_id = 'photos' and public.is_admin());

drop policy if exists "관리자만 사진 바꾸기" on storage.objects;
create policy "관리자만 사진 바꾸기" on storage.objects
  for update to authenticated using (bucket_id = 'photos' and public.is_admin());

drop policy if exists "관리자만 사진 지우기" on storage.objects;
create policy "관리자만 사진 지우기" on storage.objects
  for delete to authenticated using (bucket_id = 'photos' and public.is_admin());

-- 4) 관리자 이메일 넣기 ↓ 'your@email.com'을 관리자 로그인 이메일로 바꾸고 실행하세요.
--    (Authentication → Users에서 만든 계정과 똑같은 이메일)
-- insert into public.admin_emails (email) values ('your@email.com') on conflict do nothing;
