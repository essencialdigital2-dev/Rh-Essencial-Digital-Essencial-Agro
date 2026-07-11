alter table eco_clientes add column if not exists valor_mensal numeric default 0;
alter table eco_clientes add column if not exists status text default 'ativo' check (status in ('ativo','cancelado'));
alter table eco_clientes add column if not exists cancelado_em timestamptz;
