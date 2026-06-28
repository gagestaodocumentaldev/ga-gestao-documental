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
import { Categoria } from "@/types/entidades-banco/categoria";
import {
  pesquisarCategorias,
  criarCategoria,
  atualizarCategoria,
  deletarCategoria as deletarCategoriaService,
} from "@/services/categoria-service";

interface TabelaCategoriasProps {
  titulo: string;
}

const categoriaVazia: Categoria = {
  id: "",
  descricao: "",
};

export default function TabelaCategorias({ titulo }: TabelaCategoriasProps) {
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
  } = useCrud<Categoria>(categoriaVazia, pesquisarCategorias);

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
        onHide={fechar}
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
