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

alter table sense_usuarios enable row level security;

drop policy if exists sense_usuarios_select on sense_usuarios;
create policy sense_usuarios_select on sense_usuarios for select
  using (id = auth.uid() or empresa_id in (select id from sense_empresas where id = empresa_id));

drop policy if exists sense_usuarios_all_service on sense_usuarios;
create policy sense_usuarios_all_service on sense_usuarios for all
  using (auth.role() = 'service_role');

-- Cria a empresa e o registro da propria Alana, ja que hoje sense_empresas esta vazia
insert into sense_empresas (nome, plano, ativo)
values ('Essencial Digital', 'enterprise', true)
on conflict do nothing;

insert into sense_usuarios (id, empresa_id, nome, email, perfil)
select 'c18d064a-7475-465a-91c9-070a76ca2505', e.id, 'Alana Carvalho', 'essencialdigital2@gmail.com', 'superadmin'
from sense_empresas e where e.nome = 'Essencial Digital'
on conflict (id) do update set empresa_id = excluded.empresa_id, perfil = excluded.perfil;
