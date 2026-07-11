alter table edu_leads_maquina drop constraint if exists edu_leads_maquina_origem_check;
alter table edu_leads_maquina add constraint edu_leads_maquina_origem_check
  check (origem in ('ecossistema', 'ecossistema_auto_diario', 'manual', 'debug_teste'));
