import { ClienteFase } from "@/types/entidades-banco/clienteFase";

export interface ClienteFaseResumo {
  id: string;
  nome: string;
  categoria?: { id: string; descricao: string };
  total: number;
  concluidas: number;
  progresso: number;
}

export interface FaseClientePayload {
  fase_id: string;
  associada: boolean;
  concluido: boolean;
  concluido_em?: string | null;
}

export async function pesquisarResumoClientesFases(): Promise<
  ClienteFaseResumo[]
> {
  const res = await fetch("/api/clientes-fases/resumo");
  if (!res.ok) throw new Error("Erro ao buscar resumo de clientes");
  const data = await res.json();
  return data.resumo ?? [];
}

export async function salvarFasesCliente(
  clientId: string,
  fases: FaseClientePayload[],
): Promise<void> {
  const res = await fetch("/api/clientes-fases/salvar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, fases }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao salvar fases do cliente");
  }
}

export async function pesquisarClientesFases(
  clientId: string,
): Promise<ClienteFase[]> {
  const res = await fetch(`/api/clientes-fases?client_id=${clientId}`);
  if (!res.ok) throw new Error("Erro ao buscar fases do cliente");
  const data = await res.json();
  return data.clientesFases ?? [];
}

export async function vincularFaseCliente(
  clientId: string,
  faseId: string,
): Promise<ClienteFase> {
  const res = await fetch("/api/clientes-fases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, fase_id: faseId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao vincular fase ao cliente");
  }
  return res.json();
}

export async function atualizarStatusFaseCliente(
  clientId: string,
  faseId: string,
  concluido: boolean,
): Promise<ClienteFase> {
  const res = await fetch("/api/clientes-fases", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, fase_id: faseId, concluido }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao atualizar status da fase");
  }
  return res.json();
}

export async function desvincularFaseCliente(
  clientId: string,
  faseId: string,
): Promise<void> {
  const res = await fetch("/api/clientes-fases", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, fase_id: faseId }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao desvincular fase do cliente");
  }
}
