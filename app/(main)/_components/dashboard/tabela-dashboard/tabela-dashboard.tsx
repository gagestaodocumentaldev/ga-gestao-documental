import TabelaGenerica from "@/components/tabelaGenerica";
import { Column } from "primereact/column";

interface TabelaDashboardProps {
  documentos: Document[];
  titulo: string;
}

export default function TabelaDashboard({
  documentos,
  titulo,
}: TabelaDashboardProps) {
  return (
    <TabelaGenerica value={documentos} titulo={titulo}>
      <Column field="codigo" header="Código" sortable />
      <Column field="descricao" header="Descrição" sortable />
      <Column field="marca" header="Marca" sortable />
      <Column field="estoque" header="Estoque" sortable />
    </TabelaGenerica>
  );
}
