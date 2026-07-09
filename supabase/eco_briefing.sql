-- ============================================================
-- BRIEFING DIARIO AUTOMATICO DO ECOSSISTEMA
-- Roda sozinho todo dia via cron: junta radar de erros, leads
-- quentes e radar de inovacao recente numa analise unica da IA,
-- e envia por e-mail para a fundadora.
-- ============================================================

CREATE TABLE IF NOT EXISTS eco_briefing_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing JSONB NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS eco_briefing_historico_idx ON eco_briefing_historico (criado_em DESC);

ALTER TABLE eco_briefing_historico ENABLE ROW LEVEL SECURITY;
