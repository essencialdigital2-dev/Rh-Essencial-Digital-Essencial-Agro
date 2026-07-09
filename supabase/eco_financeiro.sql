-- ============================================================
-- FINANCEIRO CONSOLIDADO DO ECOSSISTEMA
-- O Sense AI/RH ja tem tabela "financeiro" automatica (Stripe).
-- Os outros produtos ainda nao tem billing integrado aqui, entao
-- criamos um registro manual simples por produto/mes, so para
-- a fundadora ter visao consolidada ate cada produto ter Stripe.
-- ============================================================

CREATE TABLE IF NOT EXISTS eco_financeiro_manual (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto TEXT NOT NULL,
  mes DATE NOT NULL,
  receita NUMERIC NOT NULL DEFAULT 0,
  despesas NUMERIC NOT NULL DEFAULT 0,
  observacao TEXT,
  criado_em TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS eco_financeiro_manual_produto_mes ON eco_financeiro_manual (produto, mes);

ALTER TABLE eco_financeiro_manual ENABLE ROW LEVEL SECURITY;
