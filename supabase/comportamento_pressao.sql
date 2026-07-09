-- Nova dimensao no perfil de risco individual: como a pessoa tende a agir e
-- decidir sob pressao, cruzando o perfil DISC com o estresse/energia reais.
alter table scores_risco_individual add column if not exists comportamento_sob_pressao text;
