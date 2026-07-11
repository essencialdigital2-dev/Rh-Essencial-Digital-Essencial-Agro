create table if not exists eco_inovacoes (
  id uuid primary key default gen_random_uuid(),
  produto text not null,
  titulo text not null,
  descricao text,
  esforco text,
  status text not null default 'aprovada' check (status in ('aprovada','implementada','descartada')),
  criado_em timestamptz default now()
);

alter table eco_inovacoes enable row level security;

drop policy if exists eco_inovacoes_service on eco_inovacoes;
create policy eco_inovacoes_service on eco_inovacoes for all
  using (auth.role() = 'service_role');
