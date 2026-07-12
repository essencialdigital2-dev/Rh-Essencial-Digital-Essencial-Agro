alter table colaboradores add column if not exists tipo_pcd text default '' check (tipo_pcd in ('', 'Visual', 'Auditiva', 'Motora'));
