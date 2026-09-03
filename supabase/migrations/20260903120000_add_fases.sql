create table if not exists public.fases (
  id          uuid not null default gen_random_uuid(),
  descricao   text not null,
  consultoria boolean not null default false,
  treinamento boolean not null default false,
  created_at  timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at  timestamp with time zone not null default timezone('utc'::text, now()),
  constraint fases_pkey primary key (id),
  constraint fases_consultoria_ou_treinamento check (
    consultoria = true or treinamento = true
  )
) tablespace pg_default;

drop trigger if exists fases_updated_at on public.fases;
create trigger fases_updated_at
  before update on fases
  for each row execute function update_updated_at();

alter table public.fases enable row level security;

drop policy if exists "Usuários autenticados podem visualizar fases" on public.fases;
create policy "Usuários autenticados podem visualizar fases"
  on public.fases as permissive
  for select to authenticated using (true);

drop policy if exists "Usuários autenticados podem inserir fases" on public.fases;
create policy "Usuários autenticados podem inserir fases"
  on public.fases as permissive
  for insert to authenticated with check (true);

drop policy if exists "Usuários autenticados podem atualizar fases" on public.fases;
create policy "Usuários autenticados podem atualizar fases"
  on public.fases as permissive
  for update to authenticated using (true) with check (true);

drop policy if exists "Usuários autenticados podem excluir fases" on public.fases;
create policy "Usuários autenticados podem excluir fases"
  on public.fases as permissive
  for delete to authenticated using (true);

create table if not exists public.clientes_fases (
  client_id    uuid not null,
  fase_id      uuid not null,
  concluido    boolean not null default false,
  concluido_em timestamp with time zone null,
  created_at   timestamp with time zone not null default timezone('utc'::text, now()),
  constraint clientes_fases_pkey primary key (client_id, fase_id),
  constraint clientes_fases_client_id_fkey
    foreign key (client_id) references clients (id) on delete cascade,
  constraint clientes_fases_fase_id_fkey
    foreign key (fase_id) references fases (id) on delete cascade
) tablespace pg_default;

alter table public.clientes_fases enable row level security;

drop policy if exists "Usuários autenticados podem visualizar clientes_fases" on public.clientes_fases;
create policy "Usuários autenticados podem visualizar clientes_fases"
  on public.clientes_fases as permissive
  for select to authenticated using (true);

drop policy if exists "Usuários autenticados podem inserir clientes_fases" on public.clientes_fases;
create policy "Usuários autenticados podem inserir clientes_fases"
  on public.clientes_fases as permissive
  for insert to authenticated with check (true);

drop policy if exists "Usuários autenticados podem atualizar clientes_fases" on public.clientes_fases;
create policy "Usuários autenticados podem atualizar clientes_fases"
  on public.clientes_fases as permissive
  for update to authenticated using (true) with check (true);

drop policy if exists "Usuários autenticados podem excluir clientes_fases" on public.clientes_fases;
create policy "Usuários autenticados podem excluir clientes_fases"
  on public.clientes_fases as permissive
  for delete to authenticated using (true);

-- ------------------------------------------------------------
-- Dados iniciais
-- ------------------------------------------------------------

insert into public.fases (descricao, consultoria, treinamento)
select descricao, consultoria, treinamento
from (values
  ('Relatório de adequação física', true, false),
  ('Montagem da pasta sanitária', true, false),
  ('Impressão dos documentos da pasta', true, false),
  ('Envio pro cliente', true, false),
  ('Montagem da pasta digital', true, false),
  ('Personal Organizer', true, false),
  ('Biossegurança/Descarte de Resíduos/Acidente com materiais perfurocortantes', false, true),
  ('Como receber os fiscais da vigilância sanitária', false, true),
  ('Esterilização', false, true),
  ('Primeiros socorros aplicados', false, true),
  ('Emissão do certificado de participação', false, true),
  ('segurança do paciente', false, true),
  ('núcleo de segurança do paciente', false, true)
) as v(descricao, consultoria, treinamento)
where not exists (
  select 1 from public.fases f where f.descricao = v.descricao
);
