-- Cole isso no SQL Editor do Supabase e clique em Run

-- Permitir leitura pública de colaboradores (para validar token do formulário)
create policy "leitura publica colaboradores" on colaboradores
  for select using (true);

-- Permitir inserção pública de respostas (colaborador envia sem login)
create policy "insercao publica respostas" on respostas
  for insert with check (true);

-- Permitir inserção pública de itens das respostas
create policy "insercao publica resposta_itens" on resposta_itens
  for insert with check (true);

-- Permitir leitura pública de empresas (para mostrar nome no formulário)
create policy "leitura publica empresas" on empresas
  for select using (true);

-- Permitir leitura pública de formularios e perguntas
alter table formularios enable row level security;
alter table perguntas enable row level security;
alter table lead_historico enable row level security;
alter table logs enable row level security;

create policy "leitura publica formularios" on formularios for select using (true);
create policy "leitura publica perguntas" on perguntas for select using (true);
create policy "acesso autenticado lead_historico" on lead_historico for all using (auth.role() = 'authenticated');
create policy "acesso autenticado logs" on logs for all using (auth.role() = 'authenticated');
