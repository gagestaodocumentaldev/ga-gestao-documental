"use client";

import { useState, useEffect } from "react";
import { pesquisarPecas } from "@/services/peca-service";
import ClientTabelaPecas from "./_components/tabelaPecas";
import { Peca } from "@/types/peca";

export default function TabelasPage() {
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pesquisarPecas()
      .then((data) => setPecas(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-4">Carregando...</div>;
  }

  return <ClientTabelaPecas pecas={pecas} titulo="Peças" />;
}