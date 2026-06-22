// app/(dashboard)/tabelas/_components/client-tabela-pecas.tsx
"use client";

import { formatCurrency } from "@/utils/numberUtil";
import { Column } from "primereact/column";
import TabelaGenerica from "../../../../components/tabelaGenerica"; // Seu componente genérico
import { Peca } from "@/types/peca";

interface ClientTabelaPecasProps {
  pecas: Peca[];
  titulo: string;
}

export default function ClientTabelaPecas({
  pecas,
  titulo,
}: ClientTabelaPecasProps) {
  return (
    <TabelaGenerica value={pecas} titulo={titulo}>
      <Column field="codigo" header="Código" sortable />
      <Column field="descricao" header="Descrição" sortable />
      <Column field="marca" header="Marca" sortable />
      <Column field="estoque" header="Estoque" sortable />

      <Column
        header="Preço custo"
        sortField="preco_custo"
        filterField="preco_custo"
        sortable
        body={(rowData) => formatCurrency(rowData.preco_custo)}
      />

      <Column
        header="Preço venda"
        sortField="preco_venda"
        filterField="preco_venda"
        sortable
        body={(rowData) => formatCurrency(rowData.preco_venda)}
      />
    </TabelaGenerica>
  );
}
