-- Metricas mensais do ecossistema. O funil de leads (CAC parcial, conversao)
-- ja vem de dados reais (edu_leads_maquina). O que falta pra fechar CAC/LTV/
-- NRR de verdade e alimentado aqui manualmente todo mes, ate a gente
-- automatizar a coleta desses numeros direto do Stripe/financeiro.
create table if not exists eco_metricas_mensais (
  id uuid primary key default gen_random_uuid(),
  mes date not null unique,
  investimento_marketing numeric default 0,
  mrr numeric default 0,
  clientes_ativos int default 0,
  novos_clientes int default 0,
  clientes_perdidos int default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
