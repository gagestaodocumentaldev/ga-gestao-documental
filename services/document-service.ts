import { Documento } from "@/types/document";

type DocumentPayload = {
  client_id?: string;
  numero?: string;
  tipo?: string;
  data_emissao?: string;
  data_validade?: string;
  file_url?: string;
  file_name?: string;
};

export async function pesquisarDocumentos(
  termo?: string,
  clientId?: string,
): Promise<Documento[]> {
  const params = new URLSearchParams();
  if (termo) params.set("termo", termo);
  if (clientId) params.set("client_id", clientId);
  const query = params.toString() ? `?${params.toString()}` : "";
  const res = await fetch(`/api/documents${query}`);
  if (!res.ok) throw new Error("Erro ao buscar documentos");
  const data = await res.json();
  return data.documents ?? [];
}

export async function criarDocumento(doc: DocumentPayload): Promise<Documento> {
  const res = await fetch("/api/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doc),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao criar documento");
  }
  return res.json();
}

export async function atualizarDocumento(
  id: string,
  doc: DocumentPayload,
): Promise<Documento> {
  const res = await fetch(`/api/documents/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doc),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao atualizar documento");
  }
  return res.json();
}

export async function deletarDocumento(id: string): Promise<void> {
  const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao excluir documento");
  }
}
