import { Peca } from "@/types/peca";

export async function pesquisarPecas(termo?: string): Promise<Peca[]> {
  const url = termo
    ? `/api/pecas?termo=${encodeURIComponent(termo)}`
    : "/api/pecas";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erro ao buscar peças");
  const data = await res.json();
  return data.pecas ?? [];
}

export async function criarPeca(peca: Partial<Peca>): Promise<Peca> {
  const res = await fetch("/api/pecas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(peca),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao criar peça");
  }
  return res.json();
}

export async function atualizarPeca(
  id: number,
  peca: Partial<Peca>,
): Promise<Peca> {
  const res = await fetch(`/api/pecas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(peca),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao atualizar peça");
  }
  return res.json();
}

export async function deletarPeca(id: number): Promise<void> {
  const res = await fetch(`/api/pecas/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao excluir peça");
  }
}