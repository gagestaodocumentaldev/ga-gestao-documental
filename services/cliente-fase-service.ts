import { ClienteFase } from "@/types/entidades-banco/clienteFase";

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
