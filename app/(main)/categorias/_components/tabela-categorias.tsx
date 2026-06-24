"use client";

import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

import TabelaGenerica from "../../../../components/tabelaGenerica";
import CrudDialog from "../../../../components/crudDialog";
import ConfirmarExclusaoDialog from "../../../../components/confirmarExclusaoDialog";
import { useCrud } from "../../../../hooks/useCrud";
import { TipoDocumento } from "@/types/entidades-banco/tipoDocumento";
import { pesquisarTiposDocumentos } from "@/services/tipodocumento-service";
import {
  CategoriaForm,
  pesquisarCategorias,
  criarCategoria,
  atualizarCategoria,
  deletarCategoria as deletarCategoriaService,
} from "@/services/categoria-service";

interface TabelaCategoriasProps {
  titulo: string;
}

const categoriaVazia: CategoriaForm = {
  id: "",
  descricao: "",
  tiposDocumentosIds: [],
};

export default function TabelaCategorias({ titulo }: TabelaCategoriasProps) {
  const [tiposDocumentos, setTiposDocumentos] = useState<TipoDocumento[]>([]);
  const [filtroTipo, setFiltroTipo] = useState("");

  useEffect(() => {
    pesquisarTiposDocumentos().then(setTiposDocumentos).catch(console.error);
  }, []);

  const {
    items: categorias,
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
  } = useCrud<CategoriaForm>(categoriaVazia, pesquisarCategorias);

  const fecharDialog = () => {
    setFiltroTipo("");
    fechar();
  };

  return (
    <>
      <Toast ref={toast} />

      <TabelaGenerica
        value={categorias}
        titulo={titulo}
        headerActions={
          <Button
            label="Nova"
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
        titulo="Detalhes da Categoria"
        onHide={fecharDialog}
        onSalvar={handleSubmit((data) =>
          salvar(data, {
            criarFn: criarCategoria,
            atualizarFn: atualizarCategoria,
            mensagens: {
              criado: "Categoria Criada",
              atualizado: "Categoria Atualizada",
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

        <div className="field">
          <label className="font-bold block mb-2">Tipos de Documentos</label>
          <InputText
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            placeholder="Pesquisar tipo..."
            className="w-full mb-5"
          />
          <Controller
            name="tiposDocumentosIds"
            control={control}
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
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.5rem",
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
                          inputId={`tipo-${tipo.id}`}
                          checked={field.value.includes(tipo.id)}
                          onChange={(e) => {
                            const next = e.checked
                              ? [...field.value, tipo.id]
                              : field.value.filter((id) => id !== tipo.id);
                            field.onChange(next);
                          }}
                        />
                        <label
                          htmlFor={`tipo-${tipo.id}`}
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
            deletarFn: deletarCategoriaService,
            mensagem: "Categoria Excluída",
          })
        }
        deletando={deletando}
        descricao={
          <span>
            Tem certeza que deseja excluir a categoria{" "}
            <b>{itemSelecionado.descricao}</b>?
          </span>
        }
      />
    </>
  );
}
