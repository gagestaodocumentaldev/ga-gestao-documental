"use client";

import {
  useState,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

interface TabelaGenericaProps<T> {
  value: T[];
  titulo: string;
  children: ReactNode;
  toolbarEsquerda?: ReactNode; // Para os botões Novo/Deletar do CRUD
  toolbarDireita?: ReactNode; // Para os botões Importar/Exportar
  selection?: any; // Para seleção múltipla de linhas
  onSelectionChange?: (e: any) => void;
  headerActions?: ReactNode; // Botões ao lado da busca geral
}

// Usamos forwardRef para permitir que o componente pai acione o exportCSV(), igual ao Sakai
const TabelaGenerica = forwardRef(
  <T extends Record<string, any>>(
    {
      value,
      titulo,
      children,
      toolbarEsquerda,
      toolbarDireita,
      selection,
      onSelectionChange,
      headerActions,
    }: TabelaGenericaProps<T>,
    ref: any,
  ) => {
    const [filters, setFilters] = useState<DataTableFilterMeta>({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const dtRef = useRef<DataTable<any>>(null);

    // Expõe os métodos internos do DataTable (como exportCSV) para quem chamar a TabelaGenerica
    useImperativeHandle(ref, () => ({
      exportCSV: () => dtRef.current?.exportCSV(),
    }));

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value.replace(",", ".");
      let _filters = { ...filters };
      // @ts-ignore
      _filters["global"].value = inputValue;
      setFilters(_filters);
      setGlobalFilterValue(inputValue);
    };

    const header = (
      <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center gap-3">
        <h1 className="text-2xl font-bold">{titulo}</h1>
        <div className="flex align-items-center gap-3">
          {headerActions}
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Busca geral..."
            />
          </IconField>
        </div>
      </div>
    );

    return (
      <div className="card p-4">
        {/* Barra de Ferramentas Condicional igual ao Sakai */}
        {(toolbarEsquerda || toolbarDireita) && (
          <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div>{toolbarEsquerda}</div>
            <div>{toolbarDireita}</div>
          </div>
        )}

        <DataTable
          ref={dtRef}
          value={value}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          filters={filters}
          header={header}
          dataKey="id"
          selection={selection}
          onSelectionChange={onSelectionChange}
          removableSort
          sortMode="multiple"
          showGridlines
          stripedRows
          responsiveLayout="scroll"
          emptyMessage="Nenhum registro encontrado."
        >
          {children}
        </DataTable>
      </div>
    );
  },
);

TabelaGenerica.displayName = "TabelaGenerica";
export default TabelaGenerica;
