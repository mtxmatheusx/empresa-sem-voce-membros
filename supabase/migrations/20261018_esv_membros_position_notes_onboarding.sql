-- Aplicada em 18/10/2026 no projeto mtx-workspace (gdbvrexbpiwdubusciwm).
-- 1. posição do vídeo para retomar no minuto exato
alter table public.lesson_progress
  add column if not exists last_position_seconds integer not null default 0
  check (last_position_seconds >= 0);

-- 2. anotações do aluno por aula (só o próprio aluno e admin)
create table if not exists public.lesson_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  content text not null default '' check (char_length(content) <= 20000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, lesson_id)
);
create index if not exists lesson_notes_client_idx on public.lesson_notes(client_id);
create index if not exists lesson_notes_lesson_idx on public.lesson_notes(lesson_id);
alter table public.lesson_notes enable row level security;
drop policy if exists lesson_notes_own on public.lesson_notes;
create policy lesson_notes_own on public.lesson_notes
  for all to authenticated
  using (client_id = public.esv_current_client_id() or public.esv_is_admin())
  with check (client_id = public.esv_current_client_id() or public.esv_is_admin());
revoke all on public.lesson_notes from anon;
grant select, insert, update, delete on public.lesson_notes to authenticated;

create or replace function public.esv_lesson_notes_touch()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists lesson_notes_touch on public.lesson_notes;
create trigger lesson_notes_touch before update on public.lesson_notes
  for each row execute function public.esv_lesson_notes_touch();

-- 3. primeiro acesso guiado
alter table public.clients add column if not exists onboarded_at timestamptz;
create or replace function public.esv_mark_onboarded()
returns void language sql security definer set search_path = public as $$
  update public.clients
     set onboarded_at = coalesce(onboarded_at, now())
   where email = auth.email();
$$;
revoke all on function public.esv_mark_onboarded() from public, anon;
grant execute on function public.esv_mark_onboarded() to authenticated;
