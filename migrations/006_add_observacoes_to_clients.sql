alter table public.clients
add column observacoes text null;

comment on column public.clients.observacoes is 'Observações gerais do cliente (máx. 5000 caracteres)';
