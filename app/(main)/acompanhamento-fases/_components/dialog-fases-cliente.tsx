import { Checkbox } from "primereact/checkbox";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";

import CrudDialog from "../../../../components/crudDialog";
import { FaseDialogState } from "../../../../hooks/useAcompanhamentoFases";
import { formatDateTime } from "@/utils/dateUtil";

interface DialogFasesClienteProps {
  visible: boolean;
  titulo: string;
  fases: FaseDialogState[];
  loading: boolean;
  salvando: boolean;
  onHide: () => void;
  onSalvar: () => void;
  onToggleVinculada: (faseId: string) => void;
  onToggleConcluida: (faseId: string) => void;
}

export default function DialogFasesCliente({
  visible,
  titulo,
  fases,
  loading,
  salvando,
  onHide,
  onSalvar,
  onToggleVinculada,
  onToggleConcluida,
}: DialogFasesClienteProps) {
  const totalAssociadas = fases.filter((f) => f.associada).length;
  const totalConcluidas = fases.filter(
    (f) => f.associada && f.concluida,
  ).length;
  const progresso =
    totalAssociadas > 0
      ? Math.round((totalConcluidas / totalAssociadas) * 100)
      : 0;

  const fasesConsultoria = fases.filter((f) => f.consultoria);
  const fasesTreinamento = fases.filter((f) => f.treinamento);

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
            {lista.filter((f) => f.associada && f.concluida).length}/
            {lista.filter((f) => f.associada).length} concluídas
          </span>
        </div>
        <div className="p-3 flex flex-column gap-3">
          {lista.map((fase) => (
            <div
              key={fase.id}
              className="flex align-items-start justify-content-between gap-3 flex-wrap"
            >
              <div className="flex align-items-center gap-3">
                <Checkbox
                  inputId={`vincular-${fase.id}`}
                  checked={fase.associada}
                  onChange={() => onToggleVinculada(fase.id)}
                />
                <div>
                  <label
                    htmlFor={`vincular-${fase.id}`}
                    className={`cursor-pointer ${
                      fase.associada ? "font-semibold" : "text-color-secondary"
                    }`}
                  >
                    {fase.descricao}
                  </label>
                  {fase.associada && fase.concluida && fase.concluido_em && (
                    <div className="text-color-secondary text-sm">
                      Concluído em: {formatDateTime(fase.concluido_em)}
                    </div>
                  )}
                </div>
              </div>

              {fase.associada && (
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
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <CrudDialog
      visible={visible}
      titulo={titulo}
      onHide={onHide}
      onSalvar={onSalvar}
      salvando={salvando}
      largura="70%"
    >
      {loading ? (
        <p className="text-color-secondary">Carregando fases...</p>
      ) : fases.length === 0 ? (
        <p className="text-color-secondary">
          Nenhuma fase cadastrada. Cadastre fases no menu &quot;Fases&quot;.
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
  );
}
