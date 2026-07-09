-- ============================================================
-- UNIFICACAO DO SENSE AI NO BANCO CENTRAL (mesmo do Edu/Sense/RH/Nexo)
-- Antes os dados de empresa/checkins viviam em um projeto Supabase
-- separado (uysmvziehlpugmgssibs, do Essencial Estudo). Como ainda
-- nao ha dados reais de clientes, migramos a estrutura para ca,
-- ficando tudo num unico banco central (feivfptwfbcftyhaypov).
-- Rode este SQL no projeto Supabase do Edu (o mesmo de sempre).
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

CREATE TABLE IF NOT EXISTS sense_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES sense_empresas(id) ON DELETE CASCADE,
  colaborador_id UUID,
  humor INT CHECK (humor BETWEEN 0 AND 10),
  energia INT CHECK (energia BETWEEN 0 AND 10),
  estresse INT CHECK (estresse BETWEEN 0 AND 10),
  criado_em TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sense_isho_historico_idx ON sense_isho_historico (empresa_id, semana DESC);
CREATE INDEX IF NOT EXISTS sense_checkins_idx ON sense_checkins (empresa_id, criado_em DESC);

ALTER TABLE sense_empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE sense_isho_historico ENABLE ROW LEVEL SECURITY;
ALTER TABLE sense_checkins ENABLE ROW LEVEL SECURITY;

-- Cada usuario ve/edita apenas a propria empresa; admin ve tudo
DROP POLICY IF EXISTS sense_empresas_select ON sense_empresas;
CREATE POLICY sense_empresas_select ON sense_empresas FOR SELECT
  USING (usuario_id = auth.uid() OR sou_admin());
DROP POLICY IF EXISTS sense_empresas_insert ON sense_empresas;
CREATE POLICY sense_empresas_insert ON sense_empresas FOR INSERT
  WITH CHECK (usuario_id = auth.uid() OR sou_admin());
DROP POLICY IF EXISTS sense_empresas_update ON sense_empresas;
CREATE POLICY sense_empresas_update ON sense_empresas FOR UPDATE
  USING (usuario_id = auth.uid() OR sou_admin());

-- ISHO e check-ins: acesso via vinculo com a empresa do usuario
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
  WITH CHECK (true); -- colaboradores respondem checkin sem login proprio (identificados por link/token)
