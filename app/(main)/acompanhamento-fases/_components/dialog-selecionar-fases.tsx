import { Checkbox } from "primereact/checkbox";
import { Tag } from "primereact/tag";

import CrudDialog from "../../../../components/crudDialog";

export interface FaseSelecaoState {
  id: string;
  descricao: string;
  consultoria: boolean;
  treinamento: boolean;
  associada: boolean;
}

interface DialogSelecionarFasesProps {
  visible: boolean;
  titulo: string;
  fases: FaseSelecaoState[];
  loading: boolean;
  salvando: boolean;
  onHide: () => void;
  onSalvar: () => void;
  onToggleFase: (faseId: string) => void;
}

export default function DialogSelecionarFases({
  visible,
  titulo,
  fases,
  loading,
  salvando,
  onHide,
  onSalvar,
  onToggleFase,
}: DialogSelecionarFasesProps) {
  const fasesConsultoria = fases.filter((f) => f.consultoria);
  const fasesTreinamento = fases.filter((f) => f.treinamento);

  const renderBloco = (
    tituloBloco: string,
    lista: FaseSelecaoState[],
    icone: string,
    severidade: "info" | "success",
  ) => {
    if (lista.length === 0) return null;

    return (
      <div className="border-1 surface-border border-round-lg overflow-hidden mb-3">
        <div className="flex align-items-center gap-2 p-3 surface-100 border-bottom-1 surface-border">
          <Tag icon={icone} severity={severidade} value={tituloBloco} />
          <span className="text-sm text-color-secondary">
            {lista.filter((f) => f.associada).length} de {lista.length}{" "}
            selecionadas
          </span>
        </div>
        <div className="p-3 flex flex-column gap-3">
          {lista.map((fase) => (
            <div
              key={fase.id}
              className="flex align-items-center gap-3"
            >
              <Checkbox
                inputId={`selecionar-${fase.id}`}
                checked={fase.associada}
                onChange={() => onToggleFase(fase.id)}
              />
              <label
                htmlFor={`selecionar-${fase.id}`}
                className={`cursor-pointer ${
                  fase.associada ? "font-semibold" : "text-color-secondary"
                }`}
              >
                {fase.descricao}
              </label>
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
      largura="60%"
    >
      {loading ? (
        <p className="text-color-secondary">Carregando fases cadastradas...</p>
      ) : fases.length === 0 ? (
        <p className="text-color-secondary">
          Nenhuma fase cadastrada. Cadastre fases no menu &quot;Fases&quot;.
        </p>
      ) : (
        <>
          <p className="text-color-secondary mb-4">
            Selecione as fases que estarão disponíveis para este cliente. As
            desmarcadas serão removidas do acompanhamento.
          </p>

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
