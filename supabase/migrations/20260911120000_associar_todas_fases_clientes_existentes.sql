-- ------------------------------------------------------------
-- Associa todas as fases cadastradas aos clientes existentes
-- que ainda não possuem vínculos.
-- ------------------------------------------------------------

insert into public.clientes_fases (client_id, fase_id, concluido, concluido_em)
select
  c.id as client_id,
  f.id as fase_id,
  false as concluido,
  null as concluido_em
from public.clients c
  cross join public.fases f
where not exists (
  select 1
  from public.clientes_fases cf
  where cf.client_id = c.id
    and cf.fase_id = f.id
);
