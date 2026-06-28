import { Categoria } from './categoria';
import { DocumentoObrigatorio } from './documentoObrigatorio';

export interface CategoriaTipoDocumento {
    categoria: Categoria;
    documento_obrigatorio: DocumentoObrigatorio;
    created_at?: string;
}
