-- Registro central unico de clientes do Ecossistema Essencial Digital Human
-- Tech. Cada cliente (instituicao de ensino OU empresa) escolhe modulos de
-- QUALQUER catalogo — uma escola pode ter Edu/Teens e tambem Sense AI pra
-- gerir a propria equipe, por exemplo. Este e o registro que a "central
-- administradora" consulta e edita.
create table if not exists eco_clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  tipo text not null check (tipo in ('instituicao', 'empresa')),
  cnpj text,
  cidade text,
  estado text,
  modulos_liberados text[] not null default '{}',
  observacoes text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists eco_clientes_tipo_idx on eco_clientes(tipo);
create unique index if not exists eco_clientes_cnpj_idx on eco_clientes(cnpj) where cnpj is not null;
