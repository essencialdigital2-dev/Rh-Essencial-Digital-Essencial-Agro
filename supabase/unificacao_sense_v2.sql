-- ============================================================
-- UNIFICACAO DO SENSE AI NO BANCO CENTRAL (correcao v2)
-- sense_checkins JA EXISTE neste banco (criado_em -> created_at).
-- Este script so cria o que falta e ajusta o indice/policies
-- para a tabela sense_checkins existente, sem tentar recria-la.
-- ============================================================

CREATE TABLE IF NOT EXISTS sense_empresas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_empresa TEXT NOT NULL,
  cnpj TEXT,
  setor TEXT,
  porte TEXT,
  criado_em TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sense_isho_historico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES sense_empresas(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score BETWEEN 0 AND 100),
  semana DATE NOT NULL,
  criado_em TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sense_isho_historico_idx ON sense_isho_historico (empresa_id, semana DESC);

-- sense_checkins ja existe (colunas: id, colaborador_id, empresa_id, humor,
-- energia, estresse, observacao, created_at). So garantimos o indice certo.
CREATE INDEX IF NOT EXISTS sense_checkins_idx ON sense_checkins (empresa_id, created_at DESC);

ALTER TABLE sense_empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sense_isho_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE sense_checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sense_empresas_select ON sense_empresas;
CREATE POLICY sense_empresas_select ON sense_empresas FOR SELECT
  USING (usuario_id = auth.uid() OR sou_admin());
DROP POLICY IF EXISTS sense_empresas_insert ON sense_empresas;
CREATE POLICY sense_empresas_insert ON sense_empresas FOR INSERT
  WITH CHECK (usuario_id = auth.uid() OR sou_admin());
DROP POLICY IF EXISTS sense_empresas_update ON sense_empresas;
CREATE POLICY sense_empresas_update ON sense_empresas FOR UPDATE
  USING (usuario_id = auth.uid() OR sou_admin());

DROP POLICY IF EXISTS sense_isho_historico_select ON sense_isho_historico;
CREATE POLICY sense_isho_historico_select ON sense_isho_historico FOR SELECT
  USING (
    sou_admin() OR
    empresa_id IN (SELECT id FROM sense_empresas WHERE usuario_id = auth.uid())
  );
DROP POLICY IF EXISTS sense_isho_historico_insert ON sense_isho_historico;
CREATE POLICY sense_isho_historico_insert ON sense_isho_historico FOR INSERT
  WITH CHECK (
    sou_admin() OR
    empresa_id IN (SELECT id FROM sense_empresas WHERE usuario_id = auth.uid())
  );

DROP POLICY IF EXISTS sense_checkins_select ON sense_checkins;
CREATE POLICY sense_checkins_select ON sense_checkins FOR SELECT
  USING (
    sou_admin() OR
    empresa_id IN (SELECT id FROM sense_empresas WHERE usuario_id = auth.uid())
  );
DROP POLICY IF EXISTS sense_checkins_insert ON sense_checkins;
CREATE POLICY sense_checkins_insert ON sense_checkins FOR INSERT
  WITH CHECK (true);
