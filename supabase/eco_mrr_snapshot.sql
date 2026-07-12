-- Snapshot mensal do valor_mensal de cada cliente, necessário para calcular
-- NRR (Net Revenue Retention) de verdade: precisa comparar a receita de uma
-- MESMA base de clientes entre dois meses (expansão, contração, churn).
create table if not exists eco_mrr_snapshot (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references eco_clientes(id) on delete cascade,
  valor_mensal numeric not null default 0,
  mes date not null,
  criado_em timestamptz not null default now(),
  unique (cliente_id, mes)
);

alter table eco_mrr_snapshot enable row level security;
drop policy if exists "service role full access eco_mrr_snapshot" on eco_mrr_snapshot;
create policy "service role full access eco_mrr_snapshot" on eco_mrr_snapshot
  for all using (true) with check (true);
