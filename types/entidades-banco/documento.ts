import { Client } from "./client";
import { DocumentStatus } from "./documento-status";
import { DocumentoObrigatorio } from "./documentoObrigatorio";

export interface Documento {
  id: string;
  client: Client;
  numero: string;
  tipo?: DocumentoObrigatorio;
  data_emissao?: string;
  data_validade?: string;
  file_url?: string;
  file_name?: string;
  created_at?: string;
  updated_at?: string;
  status?: DocumentStatus;
}
