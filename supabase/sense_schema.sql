-- ================================================
-- ESSENCIAL SENSE AI — Schema do Banco de Dados
-- Executar no Supabase SQL Editor
-- ================================================

-- EMPRESAS
create table if not exists sense_empresas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text unique,
  plano text not null default 'starter' check (plano in ('starter','growth','enterprise')),
  ativo boolean default true,
  colaboradores_limite integer default 50,
  stripe_customer_id text,
  stripe_subscription_id text,
  criado_em timestamptz default now()
);

-- Adicionar colunas Stripe a empresas existentes (rodar se a tabela já existe)
alter table sense_empresas add column if not exists stripe_customer_id text;
alter table sense_empresas add column if not exists stripe_subscription_id text;

-- USUÁRIOS DO SENSE (vinculados ao auth.users)
create table if not exists sense_usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  empresa_id uuid references sense_empresas(id) on delete cascade,
  nome text not null,
  email text not null,
  perfil text not null default 'colaborador' check (perfil in ('superadmin','admin','rh','gestor','colaborador')),
  dept text,
  cargo text,
  ativo boolean default true,
  criado_em timestamptz default now()
);

-- CHECK-INS EMOCIONAIS (Sense Health)
create table if not exists sense_checkins (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references sense_usuarios(id) on delete cascade,
  empresa_id uuid references sense_empresas(id) on delete cascade,
  estado text not null check (estado in ('excelente','bem','cansado','ansioso','desmotivado','sobrecarregado')),
  comentario text,
  criado_em timestamptz default now()
);

-- PERFIS DISC
create table if not exists sense_disc (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references sense_usuarios(id) on delete cascade,
  empresa_id uuid references sense_empresas(id) on delete cascade,
  perfil_predominante text check (perfil_predominante in ('D','I','S','C')),
  pontuacao_d integer default 0,
  pontuacao_i integer default 0,
  pontuacao_s integer default 0,
  pontuacao_c integer default 0,
  respostas jsonb,
  criado_em timestamptz default now()
);

-- ALERTAS DO SENSE PREVENT
create table if not exists sense_alertas (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid references sense_empresas(id) on delete cascade,
  usuario_id uuid references sense_usuarios(id),
  tipo text not null check (tipo in ('burnout','turnover','conflito','sobrecarga','nr1')),
  severidade text not null check (severidade in ('critico','alto','medio','baixo')),
  titulo text not null,
  descricao text,
  resolvido boolean default false,
  criado_em timestamptz default now()
);

-- FEEDBACKS 360
create table if not exists sense_feedbacks (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid references sense_empresas(id) on delete cascade,
  avaliador_id uuid references sense_usuarios(id),
  avaliado_id uuid references sense_usuarios(id),
  tipo text check (tipo in ('autoavaliacao','par','lider','subordinado')),
  notas jsonb,
  comentario text,
  criado_em timestamptz default now()
);

-- CLIMA ORGANIZACIONAL (Sense Climate / Culture Map)
create table if not exists sense_clima (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid references sense_empresas(id) on delete cascade,
  usuario_id uuid references sense_usuarios(id),
  dept text,
  enps integer check (enps between -100 and 100),
  seguranca_psicologica integer check (seguranca_psicologica between 0 and 100),
  engajamento integer check (engajamento between 0 and 100),
  confianca_lideranca integer check (confianca_lideranca between 0 and 100),
  criado_em timestamptz default now()
);

-- LOGS DE ACESSO (LGPD)
create table if not exists sense_logs (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid references sense_usuarios(id),
  empresa_id uuid references sense_empresas(id),
  acao text not null,
  modulo text,
  ip text,
  criado_em timestamptz default now()
);

-- ================================================
-- ROW LEVEL SECURITY (LGPD — cada empresa vê só os próprios dados)
-- ================================================

alter table sense_empresas enable row level security;
alter table sense_usuarios enable row level security;
alter table sense_checkins enable row level security;
alter table sense_disc enable row level security;
alter table sense_alertas enable row level security;
alter table sense_feedbacks enable row level security;
alter table sense_clima enable row level security;
alter table sense_logs enable row level security;

-- Política: usuário só vê dados da própria empresa
create policy "empresa_propria" on sense_usuarios
  for all using (
    empresa_id = (select empresa_id from sense_usuarios where id = auth.uid())
  );

create policy "checkins_proprios" on sense_checkins
  for all using (
    empresa_id = (select empresa_id from sense_usuarios where id = auth.uid())
  );

create policy "disc_proprio" on sense_disc
  for all using (
    empresa_id = (select empresa_id from sense_usuarios where id = auth.uid())
  );

create policy "alertas_empresa" on sense_alertas
  for all using (
    empresa_id = (select empresa_id from sense_usuarios where id = auth.uid())
  );

create policy "feedbacks_empresa" on sense_feedbacks
  for all using (
    empresa_id = (select empresa_id from sense_usuarios where id = auth.uid())
  );

create policy "clima_empresa" on sense_clima
  for all using (
    empresa_id = (select empresa_id from sense_usuarios where id = auth.uid())
  );

-- Superadmin vê tudo
create policy "superadmin_tudo" on sense_empresas
  for all using (
    exists (
      select 1 from sense_usuarios
      where id = auth.uid() and perfil = 'superadmin'
    )
  );
