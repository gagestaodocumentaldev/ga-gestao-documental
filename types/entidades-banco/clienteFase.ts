import { Fase } from "./fase";

export interface ClienteFase {
  client_id: string;
  fase_id: string;
  concluido: boolean;
  concluido_em?: string | null;
  created_at?: string;
  fase?: Fase;
}
