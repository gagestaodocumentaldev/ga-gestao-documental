import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";

import CrudDialog from "../../../../components/crudDialog";
import DialogSelecionarFases, {
  FaseSelecaoState,
} from "./dialog-selecionar-fases";
import { FaseDialogState } from "../../../../hooks/useAcompanhamentoFases";
import { formatDateTime } from "@/utils/dateUtil";

interface DialogFasesClienteProps {
  visible: boolean;
  titulo: string;
  tituloSelecao: string;
  fases: FaseDialogState[];
  fasesSelecao: FaseSelecaoState[];
  loading: boolean;
  loadingSelecao: boolean;
  salvando: boolean;
  salvandoSelecao: boolean;
  dialogSelecaoAberto: boolean;
  onHide: () => void;
  onSalvar: () => void;
  onToggleConcluida: (faseId: string) => void;
  onAbrirSelecao: () => void;
  onFecharSelecao: () => void;
  onSalvarSelecao: () => void;
  onToggleSelecaoFase: (faseId: string) => void;
}

export default function DialogFasesCliente({
  visible,
  titulo,
  tituloSelecao,
  fases,
  fasesSelecao,
  loading,
  loadingSelecao,
  salvando,
  salvandoSelecao,
  dialogSelecaoAberto,
  onHide,
  onSalvar,
  onToggleConcluida,
  onAbrirSelecao,
  onFecharSelecao,
  onSalvarSelecao,
  onToggleSelecaoFase,
}: DialogFasesClienteProps) {
  const fasesAssociadas = fases.filter((f) => f.associada);
  const totalAssociadas = fasesAssociadas.length;
  const totalConcluidas = fasesAssociadas.filter((f) => f.concluida).length;
  const progresso =
    totalAssociadas > 0
      ? Math.round((totalConcluidas / totalAssociadas) * 100)
      : 0;

  const fasesConsultoria = fasesAssociadas.filter((f) => f.consultoria);
  const fasesTreinamento = fasesAssociadas.filter((f) => f.treinamento);

  const renderBloco = (
    tituloBloco: string,
    lista: FaseDialogState[],
    icone: string,
    severidade: "info" | "success",
  ) => {
    if (lista.length === 0) return null;

    return (
      <div className="border-1 surface-border border-round-lg overflow-hidden mb-3">
        <div className="flex align-items-center gap-2 p-3 surface-100 border-bottom-1 surface-border">
          <Tag icon={icone} severity={severidade} value={tituloBloco} />
          <span className="text-sm text-color-secondary">
            {lista.filter((f) => f.concluida).length}/{lista.length} concluídas
          </span>
        </div>
        <div className="p-3 flex flex-column gap-3">
          {lista.map((fase) => (
            <div
              key={fase.id}
              className="flex align-items-start justify-content-between gap-3 flex-wrap"
            >
              <div>
                <label className="font-semibold">{fase.descricao}</label>
                {fase.concluida && fase.concluido_em && (
                  <div className="text-color-secondary text-sm">
                    Concluído em: {formatDateTime(fase.concluido_em)}
                  </div>
                )}
              </div>

              <div className="flex align-items-center gap-2">
                <Checkbox
                  inputId={`concluir-${fase.id}`}
                  checked={fase.concluida}
                  onChange={() => onToggleConcluida(fase.id)}
                />
                <label
                  htmlFor={`concluir-${fase.id}`}
                  className="cursor-pointer text-sm"
                >
                  Concluído
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <CrudDialog
        visible={visible}
        titulo={titulo}
        onHide={onHide}
        onSalvar={onSalvar}
        salvando={salvando}
        largura="70%"
        footerExtra={
          <Button
            label="Configurar fases"
            icon="pi pi-list"
            text
            onClick={onAbrirSelecao}
            disabled={salvando}
          />
        }
      >
        {loading ? (
          <p className="text-color-secondary">Carregando fases...</p>
        ) : fasesAssociadas.length === 0 ? (
          <p className="text-color-secondary">
            Nenhuma fase associada a este cliente. Clique em
            &quot;Configurar fases&quot; para selecionar as fases disponíveis.
          </p>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex justify-content-between align-items-center mb-2">
                <span className="font-semibold">Progresso do cliente</span>
                <span className="text-color-secondary">
                  {totalConcluidas} de {totalAssociadas} fases concluídas
                </span>
              </div>
              <ProgressBar
                value={progresso}
                displayValueTemplate={() => `${progresso}%`}
              />
            </div>

            {renderBloco(
              "Consultoria",
              fasesConsultoria,
              "pi pi-briefcase",
              "info",
            )}
            {renderBloco(
              "Treinamento",
              fasesTreinamento,
              "pi pi-users",
              "success",
            )}
          </>
        )}
      </CrudDialog>

      <DialogSelecionarFases
        visible={dialogSelecaoAberto}
        titulo={tituloSelecao}
        fases={fasesSelecao}
        loading={loadingSelecao}
        salvando={salvandoSelecao}
        onHide={onFecharSelecao}
        onSalvar={onSalvarSelecao}
        onToggleFase={onToggleSelecaoFase}
      />
    </>
  );
}
