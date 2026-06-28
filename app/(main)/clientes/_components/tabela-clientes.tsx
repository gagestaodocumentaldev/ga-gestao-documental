"use client";

import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";

import { formatDate } from "@/utils/dateUtil";
import { pesquisarCategorias } from "@/services/categoria-service";
import { pesquisarTiposDocumentos } from "@/services/tipodocumento-service";
import {
  atualizarCliente,
  ClienteForm,
  criarCliente,
  deletarCliente as deletarClienteService,
  pesquisarClientes,
} from "@/services/cliente-service";
import { Categoria } from "@/types/entidades-banco/categoria";
import { Client } from "@/types/entidades-banco/client";
import { TipoDocumento } from "@/types/entidades-banco/tipoDocumento";
import ConfirmarExclusaoDialog from "../../../../components/confirmarExclusaoDialog";
import CrudDialog from "../../../../components/crudDialog";
import TabelaGenerica from "../../../../components/tabelaGenerica";
import { useCrud } from "../../../../hooks/useCrud";
import DialogDocumentosCliente from "./dialog-documentos-cliente";

interface TabelaClientesProps {
  titulo: string;
}

const clienteVazio: ClienteForm = {
  id: "",
  nome: "",
  cnpj: "",
  telefone: "",
  categoria_id: "",
  tiposDocumentosIds: [],
};

export default function TabelaClientes({ titulo }: TabelaClientesProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tiposDocumentos, setTiposDocumentos] = useState<TipoDocumento[]>([]);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [clienteParaDocumentos, setClienteParaDocumentos] =
    useState<Client | null>(null);
  const [dialogDocumentosVisivel, setDialogDocumentosVisivel] = useState(false);

  useEffect(() => {
    pesquisarCategorias().then(setCategorias).catch(console.error);
    pesquisarTiposDocumentos().then(setTiposDocumentos).catch(console.error);
  }, []);

  const {
    items: clientes,
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
  } = useCrud<ClienteForm>(clienteVazio, pesquisarClientes, {
    acoesExtras: (row) => (
      <Button
        icon="pi pi-folder-open"
        rounded
        severity="info"
        tooltip="Documentos"
        onClick={() => {
          setClienteParaDocumentos(row as unknown as Client);
          setDialogDocumentosVisivel(true);
        }}
      />
    ),
  });

  const fecharDialog = () => {
    setFiltroTipo("");
    fechar();
  };

  return (
    <>
      <Toast ref={toast} />

      <TabelaGenerica
        value={clientes}
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
          { field: "nome", header: "Nome", sortable: true },
          {
            header: "Categoria",
            sortable: false,
            body: (row: ClienteForm) => row.categoria?.descricao ?? "—",
          },
          {
            header: "Documentos",
            sortable: false,
            body: (row: ClienteForm) =>
              `${row.documentos_count ?? 0}/${row.tipos_count ?? 0}`,
          },
          { field: "cnpj", header: "CNPJ", sortable: true },
          { field: "telefone", header: "Telefone", sortable: false },
          {
            header: "Cadastrado em",
            sortable: true,
            body: (row: ClienteForm) => formatDate(row.created_at) || "—",
          },
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
        titulo="Detalhes do Cliente"
        onHide={fecharDialog}
        onSalvar={handleSubmit((data) =>
          salvar(data, {
            criarFn: criarCliente,
            atualizarFn: atualizarCliente,
            mensagens: {
              criado: "Cliente Criado",
              atualizado: "Cliente Atualizado",
            },
          }),
        )}
        salvando={salvando}
        largura="90%"
      >
        <div className="field mb-3">
          <label htmlFor="nome" className="font-bold">
            Nome
          </label>
          <Controller
            name="nome"
            control={control}
            rules={{ required: "Nome é obrigatório" }}
            render={({ field }) => (
              <>
                <InputText
                  id="nome"
                  {...field}
                  autoFocus
                  className={classNames({ "p-invalid": errors.nome })}
                />
                {errors.nome && (
                  <small className="p-error">{errors.nome.message}</small>
                )}
              </>
            )}
          />
        </div>

        <div className="field mb-3">
          <label htmlFor="cnpj" className="font-bold">
            CNPJ
          </label>
          <Controller
            name="cnpj"
            control={control}
            rules={{ required: "CNPJ é obrigatório" }}
            render={({ field }) => (
              <>
                <InputMask
                  id="cnpj"
                  mask="99.999.999/9999-99"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.value)}
                  className={classNames({ "p-invalid": errors.cnpj })}
                />
                {errors.cnpj && (
                  <small className="p-error">{errors.cnpj.message}</small>
                )}
              </>
            )}
          />
        </div>

        <div className="field mb-3">
          <label htmlFor="telefone" className="font-bold">
            Telefone
          </label>
          <Controller
            name="telefone"
            control={control}
            render={({ field }) => (
              <InputMask
                id="telefone"
                mask="(99) 99999-9999"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.value)}
              />
            )}
          />
        </div>

        <div className="field mb-3">
          <label htmlFor="categoria_id" className="font-bold">
            Categoria
          </label>
          <Controller
            name="categoria_id"
            control={control}
            render={({ field }) => (
              <Dropdown
                id="categoria_id"
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                options={categorias}
                optionLabel="descricao"
                optionValue="id"
                placeholder="Selecione uma categoria"
                filter
                className="w-full"
              />
            )}
          />
        </div>

        <div className="field">
          <label className="font-bold block my-2">Tipos de Documentos</label>
          <InputText
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            placeholder="Pesquisar tipo..."
            className="w-full mb-5"
          />
          <Controller
            name="tiposDocumentosIds"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <div
                style={{
                  maxHeight: "320px",
                  overflowY: "auto",
                  paddingRight: "4px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "0.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {tiposDocumentos
                    .filter((t) =>
                      t.descricao
                        .toLowerCase()
                        .includes(filtroTipo.toLowerCase()),
                    )
                    .map((tipo) => (
                      <div
                        key={tipo.id}
                        className="flex align-items-center gap-2"
                      >
                        <Checkbox
                          inputId={`cliente-tipo-${tipo.id}`}
                          checked={field.value.includes(tipo.id)}
                          onChange={(e) => {
                            const next = e.checked
                              ? [...field.value, tipo.id]
                              : field.value.filter(
                                  (id: string) => id !== tipo.id,
                                );
                            field.onChange(next);
                          }}
                        />
                        <label
                          htmlFor={`cliente-tipo-${tipo.id}`}
                          className="cursor-pointer"
                        >
                          {tipo.descricao}
                        </label>
                      </div>
                    ))}
                  {tiposDocumentos.length === 0 && (
                    <small className="text-color-secondary">
                      Nenhum tipo de documento cadastrado
                    </small>
                  )}
                </div>
              </div>
            )}
          />
        </div>
      </CrudDialog>

      <ConfirmarExclusaoDialog
        visible={dialogDeletar}
        onHide={() => setDialogDeletar(false)}
        onConfirmar={() =>
          deletar({
            deletarFn: deletarClienteService,
            mensagem: "Cliente Excluído",
          })
        }
        deletando={deletando}
        descricao={
          <span>
            Tem certeza que deseja excluir o cliente{" "}
            <b>{itemSelecionado.nome}</b>?
            {(itemSelecionado.documentos_count ?? 0) > 0 && (
              <span className="p-error block mt-4">
                Este cliente possui <b>{itemSelecionado.documentos_count}</b>{" "}
                documento(s) cadastrado(s) que também serão excluídos
                permanentemente.
              </span>
            )}
          </span>
        }
      />

      {clienteParaDocumentos && (
        <DialogDocumentosCliente
          key={clienteParaDocumentos.id}
          clienteId={clienteParaDocumentos.id}
          nomeCliente={clienteParaDocumentos.nome}
          visible={dialogDocumentosVisivel}
          onHide={() => setDialogDocumentosVisivel(false)}
        />
      )}
    </>
  );
}
