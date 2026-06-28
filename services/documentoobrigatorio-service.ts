import { DocumentoObrigatorio } from "@/types/entidades-banco/documentoObrigatorio";

export async function pesquisarDocumentosObrigatorios(): Promise<DocumentoObrigatorio[]> {
  const res = await fetch("/api/documentos-obrigatorios");
  if (!res.ok) throw new Error("Erro ao buscar documentos obrigatórios");
  const data = await res.json();
  return data.documentosObrigatorios ?? [];
}

export async function pesquisarDocumentosObrigatoriosDisponiveis(
  clientId: string,
  excluirDocumentoId?: string,
): Promise<DocumentoObrigatorio[]> {
  const params = new URLSearchParams({ client_id: clientId });
  if (excluirDocumentoId) params.set("excluir_documento_id", excluirDocumentoId);
  const res = await fetch(`/api/documentos-obrigatorios/disponiveis?${params}`);
  if (!res.ok) throw new Error("Erro ao buscar documentos obrigatórios disponíveis");
  const data = await res.json();
  return data.documentosObrigatorios ?? [];
}

export async function criarDocumentoObrigatorio(
  documentoObrigatorio: Partial<DocumentoObrigatorio>,
): Promise<DocumentoObrigatorio> {
  const res = await fetch("/api/documentos-obrigatorios", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(documentoObrigatorio),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao criar documento obrigatório");
  }
  return res.json();
}

export async function atualizarDocumentoObrigatorio(
  id: string,
  documentoObrigatorio: Partial<DocumentoObrigatorio>,
): Promise<DocumentoObrigatorio> {
  const res = await fetch(`/api/documentos-obrigatorios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(documentoObrigatorio),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao atualizar documento obrigatório");
  }
  return res.json();
}

export async function deletarDocumentoObrigatorio(id: string): Promise<void> {
  const res = await fetch(`/api/documentos-obrigatorios/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erro ao excluir documento obrigatório");
  }
}
