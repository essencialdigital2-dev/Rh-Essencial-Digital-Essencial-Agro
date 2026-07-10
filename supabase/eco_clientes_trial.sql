-- Suporte a trial de demonstracao com prazo: um cliente pode ter modulos
-- liberados temporariamente (ex: 7 dias) para conhecer o ecossistema antes
-- de fechar contrato. Apos trial_fim, o acesso volta a ficar bloqueado.
alter table eco_clientes add column if not exists trial_fim timestamptz;
alter table eco_clientes add column if not exists trial boolean not null default false;
