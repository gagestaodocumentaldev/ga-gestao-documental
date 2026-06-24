"use client";

import { pesquisarDocumentos } from "@/services/document-service";
import { Documento } from "@/types/document";

import { useEffect, useState } from "react";
import TabelaDashboard from "./_components/dashboard/tabela-dashboard/tabela-dashboard";

const Dashboard = () => {
  const [documento, setDocumento] = useState<Documento[]>([]);

  useEffect(() => {
    pesquisarDocumentos()
      .then((data) => setDocumento(data))
      .catch((err) => console.error(err));
  }, []);

  console.log(documento);

  return (
    <TabelaDashboard documentos={documento} titulo="Todos os Documentos" />
  );
};

export default Dashboard;
