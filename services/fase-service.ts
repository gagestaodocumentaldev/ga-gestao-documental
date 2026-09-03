import { Fase } from "@/types/entidades-banco/fase";

export async function pesquisarFases(): Promise<Fase[]> {
  const res = await fetch("/api/fases");
  if (!res.ok) throw new Error("Erro ao buscar fases");
  const data = await res.json();
  return data.fases ?? [];
}

export async function criarFase(fase: Partial<Fase>): Promise<Fase> {
  const res = await fetch("/api/fases", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fase),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao criar fase");
  }
  return res.json();
}

export async function atualizarFase(
  id: string,
  fase: Partial<Fase>,
): Promise<Fase> {
  const res = await fetch(`/api/fases/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fase),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao atualizar fase");
  }
  return res.json();
}

export async function deletarFase(id: string): Promise<void> {
  const res = await fetch(`/api/fases/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao excluir fase");
  }
}
