create table familias_documentos (
  id uuid primary key default gen_random_uuid(),
  descricao text not null,
  created_at timestamptz default now()
);

alter table "public"."familias_documentos" enable row level security;

create policy "authenticated users can update familias_documentos"
on "public"."familias_documentos"
for UPDATE
to authenticated
using (true);

create policy "authenticated users can insert familias_documentos"
on "public"."familias_documentos"
for INSERT
to authenticated
with check (true);

create policy "authenticated users can delete familias_documentos"
on "public"."familias_documentos"
for DELETE
to authenticated
using (true);

create policy "authenticated users can select familias_documentos"
on "public"."familias_documentos"
for SELECT
to authenticated
using (true);
