-- RH Essencial Digital / Essencial Agro
-- Cole este SQL no Supabase > SQL Editor > Run

-- Empresas
create table empresas (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text,
  segmento text,
  responsavel text,
  email text,
  telefone text,
  cidade text,
  estado text,
  status text default 'ativo',
  observacoes text,
  created_at timestamptz default now()
);

-- Colaboradores
create table colaboradores (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cargo text,
  setor text,
  empresa_id uuid references empresas(id) on delete cascade,
  email text,
  telefone text,
  observacoes text,
  token_formulario text unique default gen_random_uuid()::text,
  created_at timestamptz default now()
);

-- Formulários
create table formularios (
  id serial primary key,
  nome text not null,
  descricao text,
  tipo text,
  ativo boolean default true
);

-- Perguntas
create table perguntas (
  id serial primary key,
  formulario_id int references formularios(id),
  ordem int,
  texto text not null,
  tipo text default 'escala'
);

-- Respostas (cabeçalho)
create table respostas (
  id uuid primary key default gen_random_uuid(),
  colaborador_id uuid references colaboradores(id) on delete cascade,
  formulario_id int references formularios(id),
  empresa_id uuid references empresas(id),
  concluido boolean default false,
  created_at timestamptz default now()
);

-- Itens das respostas
create table resposta_itens (
  id uuid primary key default gen_random_uuid(),
  resposta_id uuid references respostas(id) on delete cascade,
  pergunta_id int references perguntas(id),
  valor_escala int,
  valor_texto text
);

-- Leads
create table leads (
  id uuid primary key default gen_random_uuid(),
  nome text,
  empresa text,
  cargo text,
  email text,
  whatsapp text,
  linkedin text,
  segmento text,
  origem text,
  servico_interesse text,
  temperatura text default 'frio',
  status text default 'novo',
  valor_estimado numeric,
  proximo_contato date,
  observacoes text,
  created_at timestamptz default now()
);

-- Histórico de contatos do lead
create table lead_historico (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete cascade,
  tipo text,
  descricao text,
  created_at timestamptz default now()
);

-- Financeiro
create table financeiro (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid references empresas(id),
  descricao text not null,
  valor numeric not null,
  tipo text default 'receita',
  status text default 'pendente',
  vencimento date,
  pago_em date,
  forma_pagamento text,
  observacoes text,
  created_at timestamptz default now()
);

-- Recibos
create table recibos (
  id uuid primary key default gen_random_uuid(),
  financeiro_id uuid references financeiro(id),
  empresa_id uuid references empresas(id),
  numero text,
  servico text,
  valor numeric,
  data_emissao date default current_date,
  forma_pagamento text,
  created_at timestamptz default now()
);

-- Relatórios gerados
create table relatorios (
  id uuid primary key default gen_random_uuid(),
  resposta_id uuid references respostas(id),
  colaborador_id uuid references colaboradores(id),
  empresa_id uuid references empresas(id),
  formulario_id int references formularios(id),
  media_geral numeric,
  nivel text,
  resumo text,
  pontos_fortes text[],
  pontos_atencao text[],
  plano_acao jsonb,
  created_at timestamptz default now()
);

-- Logs
create table logs (
  id uuid primary key default gen_random_uuid(),
  acao text,
  modulo text,
  descricao text,
  created_at timestamptz default now()
);

-- Formulários padrão
insert into formularios (id, nome, descricao, tipo) values
(1, 'Mapeamento Psicossocial NR-1', 'Identificação de riscos psicossociais conforme NR-1', 'psicossocial'),
(2, 'Clima Organizacional', 'Avaliação do clima e satisfação da equipe', 'clima'),
(3, 'Cultura Organizacional', 'Análise dos valores e práticas culturais', 'cultura'),
(4, 'DISC Comportamental', 'Perfil comportamental baseado na metodologia DISC', 'disc'),
(5, 'Essencial Agro', 'Diagnóstico específico para equipes do agronegócio', 'agro');

-- RLS (Row Level Security) - habilitar em produção
alter table empresas enable row level security;
alter table colaboradores enable row level security;
alter table respostas enable row level security;
alter table resposta_itens enable row level security;
alter table leads enable row level security;
alter table financeiro enable row level security;
alter table recibos enable row level security;
alter table relatorios enable row level security;

-- Política temporária (acesso total autenticado)
create policy "acesso autenticado" on empresas for all using (auth.role() = 'authenticated');
create policy "acesso autenticado" on colaboradores for all using (auth.role() = 'authenticated');
create policy "acesso autenticado" on leads for all using (auth.role() = 'authenticated');
create policy "acesso autenticado" on financeiro for all using (auth.role() = 'authenticated');
create policy "acesso autenticado" on recibos for all using (auth.role() = 'authenticated');
create policy "acesso autenticado" on relatorios for all using (auth.role() = 'authenticated');

-- Respostas públicas (colaborador responde sem login)
create policy "leitura publica formulario" on respostas for select using (true);
create policy "insercao publica formulario" on respostas for insert with check (true);
create policy "acesso autenticado respostas" on respostas for all using (auth.role() = 'authenticated');
create policy "insercao publica itens" on resposta_itens for insert with check (true);
create policy "acesso autenticado itens" on resposta_itens for all using (auth.role() = 'authenticated');
