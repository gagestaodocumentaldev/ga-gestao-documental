import { buscarPecas } from "@/services/peca-service";
import ClientTabelaPecas from "./_components/tabelaPecas";

export default async function TabelasPage() {
  const pecas = await buscarPecas("");
  return (
    <>
      <ClientTabelaPecas pecas={pecas} titulo="Peças" />
    </>
  );
}
