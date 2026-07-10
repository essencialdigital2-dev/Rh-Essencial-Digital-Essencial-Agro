-- Rastreia a ultima vez que alguem vinculado a essa instituicao/empresa
-- acessou qualquer app do ecossistema (atualizado automaticamente toda vez
-- que um app chama /api/eco-clientes/verificar pra checar a licenca).
alter table eco_clientes add column if not exists ultimo_acesso timestamptz;
