"use client";

import { Controller } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

import TabelaGenerica from "../../../../components/tabelaGenerica";
import CrudDialog from "../../../../components/crudDialog";
import ConfirmarExclusaoDialog from "../../../../components/confirmarExclusaoDialog";
import { useCrud } from "../../../../hooks/useCrud";
import { DocumentoObrigatorio } from "@/types/entidades-banco/documentoObrigatorio";
import {
  pesquisarDocumentosObrigatorios,
  criarDocumentoObrigatorio,
  atualizarDocumentoObrigatorio,
  deletarDocumentoObrigatorio as deletarDocumentoObrigatorioService,
} from "@/services/documentoobrigatorio-service";

interface TabelaDocumentosObrigatoriosProps {
  titulo: string;
}

const documentoObrigatorioVazio: DocumentoObrigatorio = {
  id: "",
  descricao: "",
};

export default function TabelaDocumentosObrigatorios({
  titulo,
}: TabelaDocumentosObrigatoriosProps) {
  const {
    items: documentosObrigatorios,
    control,
    handleSubmit,
    errors,
    itemSelecionado,
    salvando,
    deletando,
    dialogAberto,
    dialogDeletar,
    setDialogDeletar,
    toast,
    abrirNovo,
    fechar,
    colunaAcoes,
    salvar,
    deletar,
  } = useCrud<DocumentoObrigatorio>(documentoObrigatorioVazio, pesquisarDocumentosObrigatorios);

  return (
    <>
      <Toast ref={toast} />

      <TabelaGenerica
        value={documentosObrigatorios}
        titulo={titulo}
        headerActions={
          <Button
            label="Novo"
            icon="pi pi-plus"
            severity="success"
            onClick={abrirNovo}
          />
        }
        columns={[
          { field: "descricao", header: "Descrição", sortable: true },
          {
            header: "Ações",
            body: colunaAcoes,
            exportable: false,
            style: { minWidth: "12rem" },
          },
        ]}
      />

      <CrudDialog
        visible={dialogAberto}
        titulo="Detalhes do Documento Obrigatório"
        onHide={fechar}
        onSalvar={handleSubmit((data) =>
          salvar(data, {
            criarFn: criarDocumentoObrigatorio,
            atualizarFn: atualizarDocumentoObrigatorio,
            mensagens: {
              criado: "Documento Obrigatório Criado",
              atualizado: "Documento Obrigatório Atualizado",
            },
          }),
        )}
        salvando={salvando}
      >
        <div className="field mb-3">
          <label htmlFor="descricao" className="font-bold">
            Descrição
          </label>
          <Controller
            name="descricao"
            control={control}
            rules={{ required: "Descrição é obrigatória" }}
            render={({ field }) => (
              <>
                <InputText
                  id="descricao"
                  {...field}
                  autoFocus
                  className={classNames({ "p-invalid": errors.descricao })}
                />
                {errors.descricao && (
                  <small className="p-error">{errors.descricao.message}</small>
                )}
              </>
            )}
          />
        </div>
      </CrudDialog>

      <ConfirmarExclusaoDialog
        visible={dialogDeletar}
        onHide={() => setDialogDeletar(false)}
        onConfirmar={() =>
          deletar({
            deletarFn: deletarDocumentoObrigatorioService,
            mensagem: "Documento Obrigatório Excluído",
          })
        }
        deletando={deletando}
        descricao={
          <span>
            Tem certeza que deseja excluir o documento obrigatório{" "}
            <b>{itemSelecionado.descricao}</b>?
          </span>
        }
      />
    </>
  );
}
