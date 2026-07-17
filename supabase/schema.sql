-- ============================================================
-- Programa Empresa Sem Você — Schema de Leads
-- Run this in your Supabase SQL Editor after creating the project
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),

  -- Identificação
  name text not null,
  whatsapp text not null,
  email text not null,
  instagram text,

  -- Empresa
  company_name text,
  company_sector text,
  employees_range text check (employees_range in ('10-15','16-20','21-30','30+')),
  revenue_range text check (revenue_range in ('ate-200k','200-300k','300-500k','500k+')),
  years_in_business int,

  -- Dor
  energy_suck text,
  thirty_days_test text,
  tactical_time_pct text check (tactical_time_pct in ('0-25%','25-50%','50-75%','75-100%')),

  -- Compromisso
  desire_120d text,
  investment_ready text,
  preferred_call_time text,

  -- Status / metadata
  status text not null default 'recebida'
    check (status in ('recebida','triagem','diag-agendado','diag-feito','proposta','negociacao','fechou','perdeu')),
  source text default 'organico',

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_created_at_idx on public.leads(created_at desc);

create table if not exists public.lead_events (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  event_type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists lead_events_lead_id_idx on public.lead_events(lead_id);

create table if not exists public.lead_notes (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists lead_notes_lead_id_idx on public.lead_notes(lead_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on public.leads;
create trigger set_updated_at
  before update on public.leads
  for each row execute function public.update_updated_at();

-- Log status changes
create or replace function public.log_status_change()
returns trigger as $$
begin
  if (old.status is distinct from new.status) then
    insert into public.lead_events(lead_id, event_type, payload)
    values (new.id, 'status_changed', jsonb_build_object('from', old.status, 'to', new.status));
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists log_lead_status on public.leads;
create trigger log_lead_status
  after update on public.leads
  for each row execute function public.log_status_change();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.leads enable row level security;
alter table public.lead_events enable row level security;
alter table public.lead_notes enable row level security;

-- Public can only INSERT leads (via form). Cannot read others, cannot update/delete.
drop policy if exists "Public can insert leads" on public.leads;
create policy "Public can insert leads"
  on public.leads for insert
  to anon
  with check (true);

-- Authenticated users (admin) can do everything
drop policy if exists "Admins can select all leads" on public.leads;
create policy "Admins can select all leads"
  on public.leads for select
  to authenticated
  using (true);

drop policy if exists "Admins can update leads" on public.leads;
create policy "Admins can update leads"
  on public.leads for update
  to authenticated
  using (true);

drop policy if exists "Admins can delete leads" on public.leads;
create policy "Admins can delete leads"
  on public.leads for delete
  to authenticated
  using (true);

-- Events
drop policy if exists "Admins can manage events" on public.lead_events;
create policy "Admins can manage events"
  on public.lead_events for all
  to authenticated
  using (true) with check (true);

-- Notes
drop policy if exists "Admins can manage notes" on public.lead_notes;
create policy "Admins can manage notes"
  on public.lead_notes for all
  to authenticated
  using (true) with check (true);
