"use client";

import { useState, ReactNode } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

// Definimos uma interface genérica para aceitar qualquer array de objetos
interface TabelaGenericaProps<T> {
  value: T[];
  titulo: string; // Adicionado para deixar o título "Peças" dinâmico também
  children: ReactNode;
}

export default function TabelaGenerica<T extends Record<string, any>>({
  value,
  titulo,
  children,
}: TabelaGenericaProps<T>) {
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(",", ".");
    let _filters = { ...filters };

    // @ts-ignore
    _filters["global"].value = inputValue;

    setFilters(_filters);
    setGlobalFilterValue(inputValue);
  };

  const header = (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold mb-3">{titulo}</h1>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Busca geral"
        />
      </IconField>
    </div>
  );

  return (
    <DataTable
      value={value}
      paginator
      rows={10}
      filters={filters}
      header={header}
      dataKey="id" // Garanta que todos os seus objetos de banco tenham a propriedade 'id'
      removableSort
      sortMode="multiple"
      showGridlines
      stripedRows
    >
      {children}
    </DataTable>
  );
}
