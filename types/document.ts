import { Client } from './client';
import { TipoDocumento } from './tipoDocumento';

export interface Document {
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
}
