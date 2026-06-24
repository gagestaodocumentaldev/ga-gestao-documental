import { Client } from './client';
import { TipoDocumento } from './tipoDocumento';
import { DocumentStatus } from './document-status';

export interface Documento {
    id: string;
    client: Client;
    numero: string;
    tipo?: TipoDocumento;
    data_emissao?: string;
    data_validade?: string;
    file_url?: string;
    file_name?: string;
    created_at?: string;
    updated_at?: string;
    status?: DocumentStatus;
}
