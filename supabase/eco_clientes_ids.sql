-- Em vez de tentar casar CNPJ entre projetos diferentes (nem todo app guarda
-- CNPJ, e formatos divergem), cada cliente central guarda o ID que ele tem
-- DENTRO de cada app. Mais confiavel e simples de administrar num so lugar.
alter table eco_clientes add column if not exists edu_escola_id text;
alter table eco_clientes add column if not exists sense_empresa_id text;
alter table eco_clientes add column if not exists teens_instituicao_id text;
alter table eco_clientes add column if not exists agro_empresa_id text;
