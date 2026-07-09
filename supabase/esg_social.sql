-- ESG Social: score calculado automaticamente a partir dos dados que a
-- empresa ja gera usando o Sense AI (ISHO, risco de burnout/saida), sem
-- questionario manual. Atualiza toda semana, sozinho.
create table if not exists esg_social_historico (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references empresas(id) on delete cascade,
  semana date not null,
  score_esg_social int not null,
  pilares jsonb not null,
  selos_elegiveis text[],
  recomendacao text,
  resumo_executivo text,
  calculado_em timestamptz not null default now(),
  unique(empresa_id, semana)
);
create index if not exists esg_social_historico_empresa_idx on esg_social_historico(empresa_id, semana desc);

alter table esg_social_historico enable row level security;
drop policy if exists "empresa ve proprio esg social" on esg_social_historico;
-- Sem policy de select direto do client: acesso via API com service_role,
-- que ja valida empresaPertenceAoUsuario antes de responder.
