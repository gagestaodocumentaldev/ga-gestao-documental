-- ============================================================
-- ga-gestao-documental — full schema
-- Run in Supabase SQL editor (top to bottom)
-- ============================================================

-- Trigger function used by clients + documents
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

-- ------------------------------------------------------------

create table public.familias_documentos (
  id uuid not null default gen_random_uuid(),
  descricao text not null,
  created_at timestamp with time zone null default now(),
  constraint familias_pop_pkey primary key (id)
) tablespace pg_default;

-- ------------------------------------------------------------

create table public.tipos_documentos (
  id          uuid not null default gen_random_uuid(),
  descricao   text not null,
  familia_id  uuid null,
  created_at  timestamp with time zone not null default timezone('utc'::text, now()),
  constraint tipos_documentos_pkey primary key (id),
  constraint tipos_documentos_familia_id_fkey
    foreign key (familia_id) references public.familias_documentos (id) on delete set null
) tablespace pg_default;

-- ------------------------------------------------------------

create table public.categorias (
  id          uuid not null default gen_random_uuid(),
  descricao   text not null,
  created_at  timestamp with time zone not null default timezone('utc'::text, now()),
  constraint categorias_pkey primary key (id)
) tablespace pg_default;

-- ------------------------------------------------------------

create table public.clients (
  id              uuid not null default gen_random_uuid(),
  nome            text not null,
  cnpj            text not null,
  telefone        text null,
  drive_folder_id text null,
  categoria_id    uuid null,
  created_at      timestamp with time zone null default now(),
  updated_at      timestamp with time zone null default now(),
  constraint clients_pkey primary key (id),
  constraint clients_cnpj_key unique (cnpj),
  constraint clients_categoria_id_fkey
    foreign key (categoria_id) references categorias (id) on delete restrict
) tablespace pg_default;

create trigger clients_updated_at
  before update on clients
  for each row execute function update_updated_at();

-- ------------------------------------------------------------

create table public.clientes_tipos_documentos (
  client_id      uuid not null,
  tipo_documento_id uuid not null,
  created_at        timestamp with time zone not null default timezone('utc'::text, now()),
  constraint clientes_tipos_documentos_pkey
    primary key (client_id, tipo_documento_id),
  constraint clientes_tipos_documentos_client_id_fkey
    foreign key (client_id) references clients (id) on delete cascade,
  constraint clientes_tipos_documentos_tipo_documento_id_fkey
    foreign key (tipo_documento_id) references tipos_documentos (id) on delete cascade
) tablespace pg_default;

alter table public.clientes_tipos_documentos enable row level security;

create policy "Usuários autenticados podem visualizar"
  on public.clientes_tipos_documentos as permissive
  for select to authenticated using (true);

create policy "Usuários autenticados podem inserir"
  on public.clientes_tipos_documentos as permissive
  for insert to authenticated with check (true);

create policy "Usuários autenticados podem atualizar"
  on public.clientes_tipos_documentos as permissive
  for update to authenticated using (true) with check (true);

create policy "Usuários autenticados podem excluir"
  on public.clientes_tipos_documentos as permissive
  for delete to authenticated using (true);

-- ------------------------------------------------------------

create table public.documents (
  id             uuid not null default gen_random_uuid(),
  client_id      uuid not null,
  numero         text not null,
  tipo           uuid null,
  data_emissao   date null,
  data_validade  date null,
  file_url       text null,
  file_name      text null,
  created_at     timestamp with time zone null default now(),
  updated_at     timestamp with time zone null default now(),
  constraint documents_pkey primary key (id),
  constraint documents_client_id_fkey
    foreign key (client_id) references clients (id) on delete cascade,
  constraint documents_tipo_fkey
    foreign key (tipo) references tipos_documentos (id) on delete set null
) tablespace pg_default;

create trigger documents_updated_at
  before update on documents
  for each row execute function update_updated_at();

-- ------------------------------------------------------------

create table public.profiles (
  id         uuid not null,
  nome       text not null,
  perfil     text not null,
  created_at timestamp with time zone not null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey
    foreign key (id) references auth.users (id) on delete cascade,
  constraint profiles_perfil_check check (
    perfil = any (array['desenvolvedor'::text, 'admin'::text, 'viewer'::text])
  )
) tablespace pg_default;

-- ------------------------------------------------------------

create table public.fases (
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

create trigger fases_updated_at
  before update on fases
  for each row execute function update_updated_at();

alter table public.fases enable row level security;

create policy "Usuários autenticados podem visualizar fases"
  on public.fases as permissive
  for select to authenticated using (true);

create policy "Usuários autenticados podem inserir fases"
  on public.fases as permissive
  for insert to authenticated with check (true);

create policy "Usuários autenticados podem atualizar fases"
  on public.fases as permissive
  for update to authenticated using (true) with check (true);

create policy "Usuários autenticados podem excluir fases"
  on public.fases as permissive
  for delete to authenticated using (true);

-- ------------------------------------------------------------

create table public.clientes_fases (
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

create policy "Usuários autenticados podem visualizar clientes_fases"
  on public.clientes_fases as permissive
  for select to authenticated using (true);

create policy "Usuários autenticados podem inserir clientes_fases"
  on public.clientes_fases as permissive
  for insert to authenticated with check (true);

create policy "Usuários autenticados podem atualizar clientes_fases"
  on public.clientes_fases as permissive
  for update to authenticated using (true) with check (true);

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