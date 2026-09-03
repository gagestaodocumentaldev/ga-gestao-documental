"use client";

import { Controller } from "react-hook-form";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

import ConfirmarExclusaoDialog from "../../../../components/confirmarExclusaoDialog";
import CrudDialog from "../../../../components/crudDialog";
import TabelaGenerica from "../../../../components/tabelaGenerica";
import { useCrud } from "../../../../hooks/useCrud";
import { Fase } from "@/types/entidades-banco/fase";
import {
  atualizarFase,
  criarFase,
  deletarFase as deletarFaseService,
  pesquisarFases,
} from "@/services/fase-service";

interface TabelaFasesProps {
  titulo: string;
}

const faseVazia: Fase = {
  id: "",
  descricao: "",
  consultoria: false,
  treinamento: false,
};

export default function TabelaFases({ titulo }: TabelaFasesProps) {
  const {
    items: fases,
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
  } = useCrud<Fase>(faseVazia, pesquisarFases);

  const onSalvar = (data: Fase) => {
    if (!data.consultoria && !data.treinamento) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Selecione pelo menos uma opção: Consultoria ou Treinamento",
        life: 3000,
      });
      return;
    }

    salvar(data, {
      criarFn: criarFase,
      atualizarFn: atualizarFase,
      mensagens: {
        criado: "Fase Criada",
        atualizado: "Fase Atualizada",
      },
    });
  };

  return (
    <>
      <Toast ref={toast} />

      <TabelaGenerica
        value={fases}
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
            field: "consultoria",
            header: "Consultoria",
            sortable: true,
            body: (row: Fase) => (row.consultoria ? "Sim" : "Não"),
          },
          {
            field: "treinamento",
            header: "Treinamento",
            sortable: true,
            body: (row: Fase) => (row.treinamento ? "Sim" : "Não"),
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
        titulo="Detalhes da Fase"
        onHide={fechar}
        onSalvar={() => handleSubmit(onSalvar)()}
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

        <div className="field mb-3">
          <label className="font-bold block mb-2">Tipo</label>
          <div className="flex gap-3">
            <Controller
              name="consultoria"
              control={control}
              render={({ field }) => (
                <div className="flex align-items-center gap-2">
                  <Checkbox
                    id="consultoria"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.checked)}
                  />
                  <label htmlFor="consultoria" className="cursor-pointer">
                    Consultoria
                  </label>
                </div>
              )}
            />
            <Controller
              name="treinamento"
              control={control}
              render={({ field }) => (
                <div className="flex align-items-center gap-2">
                  <Checkbox
                    id="treinamento"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.checked)}
                  />
                  <label htmlFor="treinamento" className="cursor-pointer">
                    Treinamento
                  </label>
                </div>
              )}
            />
          </div>
        </div>
      </CrudDialog>

      <ConfirmarExclusaoDialog
        visible={dialogDeletar}
        onHide={() => setDialogDeletar(false)}
        onConfirmar={() =>
          deletar({
            deletarFn: deletarFaseService,
            mensagem: "Fase Excluída",
          })
        }
        deletando={deletando}
        descricao={
          <span>
            Tem certeza que deseja excluir a fase{" "}
            <b>{itemSelecionado.descricao}</b>?
          </span>
        }
      />
    </>
  );
}
