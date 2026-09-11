"use client";

import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Toast } from "primereact/toast";

import DialogFasesCliente from "./dialog-fases-cliente";
import TabelaGenerica from "../../../../components/tabelaGenerica";
import { useAcompanhamentoFases } from "../../../../hooks/useAcompanhamentoFases";
import { ClienteFaseResumo } from "@/services/cliente-fase-service";

interface AcompanhamentoFasesProps {
  titulo: string;
}

export default function AcompanhamentoFases({
  titulo,
}: AcompanhamentoFasesProps) {
  const {
    toast,
    resumo,
    dialogAberto,
    clienteDialog,
    fasesDialog,
    loadingDialog,
    salvando,
    dialogSelecaoAberto,
    fasesSelecao,
    loadingSelecao,
    salvandoSelecao,
    abrirDialog,
    fecharDialog,
    toggleConcluida,
    salvar,
    abrirSelecaoFases,
    fecharSelecaoFases,
    salvarSelecaoFases,
    toggleSelecaoFase,
  } = useAcompanhamentoFases();

  const colunaAcoes = (rowData: ClienteFaseResumo) => (
    <Button
      icon="pi pi-pencil"
      rounded
      severity="success"
      tooltip="Gerenciar fases"
      onClick={() => abrirDialog(rowData)}
    />
  );

  return (
    <>
      <Toast ref={toast} />

      <TabelaGenerica
        value={resumo}
        titulo={titulo}
        columns={[
          { field: "nome", header: "Nome", sortable: true },
          {
            header: "Categoria",
            sortable: true,
            body: (row: ClienteFaseResumo) =>
              row.categoria?.descricao ?? (
                <span className="text-color-secondary">—</span>
              ),
            filterValue: (row: ClienteFaseResumo) =>
              row.categoria?.descricao ?? "",
          },
          {
            header: "Progresso",
            sortable: true,
            body: (row: ClienteFaseResumo) => (
              <div className="flex align-items-center gap-2">
                <ProgressBar
                  value={row.progresso}
                  className="w-12rem"
                  displayValueTemplate={() => `${row.progresso}%`}
                />
                <span className="text-sm text-color-secondary">
                  {row.concluidas}/{row.total}
                </span>
              </div>
            ),
            filterValue: (row: ClienteFaseResumo) => String(row.progresso),
          },
          {
            header: "Ações",
            body: colunaAcoes,
            exportable: false,
            style: { minWidth: "8rem" },
          },
        ]}
      />

      {clienteDialog && (
        <DialogFasesCliente
          key={clienteDialog.id}
          visible={dialogAberto}
          titulo={`Fases do cliente: ${clienteDialog.nome}`}
          tituloSelecao={`Selecionar fases — ${clienteDialog.nome}`}
          fases={fasesDialog}
          fasesSelecao={fasesSelecao}
          loading={loadingDialog}
          loadingSelecao={loadingSelecao}
          salvando={salvando}
          salvandoSelecao={salvandoSelecao}
          dialogSelecaoAberto={dialogSelecaoAberto}
          onHide={fecharDialog}
          onSalvar={salvar}
          onToggleConcluida={toggleConcluida}
          onAbrirSelecao={abrirSelecaoFases}
          onFecharSelecao={fecharSelecaoFases}
          onSalvarSelecao={salvarSelecaoFases}
          onToggleSelecaoFase={toggleSelecaoFase}
        />
      )}
    </>
  );
}
