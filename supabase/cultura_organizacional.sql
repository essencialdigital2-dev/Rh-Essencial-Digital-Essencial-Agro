-- Cultura Organizacional Preditiva — peça central transversal, usável por qualquer
-- app do ecossistema (Sense AI, Agro Tech, NexoPerform, RH Essencial Digital) via link.

alter table empresas add column if not exists token_cultura text default gen_random_uuid()::text;
alter table empresas add column if not exists valores_cultura jsonb default '[]'::jsonb;

create table if not exists pulsos_cultura (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  valor_nome text not null,
  nota int not null check (nota between 1 and 5),
  colaborador_nome text,
  origem_app text default 'hub',
  criado_em timestamptz default now()
);

alter table pulsos_cultura enable row level security;
drop policy if exists "service role full access pulsos_cultura" on pulsos_cultura;
create policy "service role full access pulsos_cultura" on pulsos_cultura
  for all using (true) with check (true);
