-- ============================================================
-- RADAR DE INOVACAO PREDITIVO DO ECOSSISTEMA
-- Um radar por produto (nao so 3 areas como no Edu) — pesquisa
-- real na web + IA gerando tendencias/oportunidades/ameacas.
-- ============================================================

CREATE TABLE IF NOT EXISTS eco_radar_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto TEXT NOT NULL,
  radar JSONB NOT NULL,
  pesquisa_web BOOLEAN DEFAULT false,
  origem TEXT NOT NULL DEFAULT 'manual' CHECK (origem IN ('manual', 'cron')),
  criado_em TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS eco_radar_historico_idx ON eco_radar_historico (produto, criado_em DESC);

ALTER TABLE eco_radar_historico ENABLE ROW LEVEL SECURITY;
