"use client";

import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

import { useAcompanhamentoFases } from "../../../../hooks/useAcompanhamentoFases";
import { formatDateTime } from "@/utils/dateUtil";

interface AcompanhamentoFasesProps {
  titulo: string;
}

export default function AcompanhamentoFases({
  titulo,
}: AcompanhamentoFasesProps) {
  const {
    toast,
    clientes,
    clienteSelecionado,
    fasesAcompanhamento,
    progresso,
    totalConcluidas,
    totalAssociadas,
    loadingClientes,
    loadingFases,
    loadingVinculos,
    selecionarCliente,
    toggleAssociacao,
    toggleConclusao,
  } = useAcompanhamentoFases();

  const loading = loadingClientes || loadingFases;

  return (
    <div className="card">
      <Toast ref={toast} />

      <h4 className="mb-3">{titulo}</h4>

      <div className="field mb-4">
        <label htmlFor="cliente" className="font-bold block mb-2">
          Cliente
        </label>
        <Dropdown
          id="cliente"
          value={clienteSelecionado}
          onChange={(e) => selecionarCliente(e.value)}
          options={clientes}
          optionLabel="nome"
          optionValue="id"
          placeholder="Selecione um cliente"
          loading={loadingClientes}
          className="w-full md:w-30rem"
        />
      </div>

      {clienteSelecionado && (
        <div className="mb-4">
          <div className="flex justify-content-between align-items-center mb-2">
            <span className="font-semibold">Progresso</span>
            <span className="text-color-secondary">
              {totalConcluidas} de {totalAssociadas} fases concluídas
            </span>
          </div>
          <ProgressBar
            value={progresso}
            displayValueTemplate={() => `${progresso}%`}
          />
        </div>
      )}

      {loading ? (
        <p className="text-color-secondary">Carregando...</p>
      ) : fasesAcompanhamento.length === 0 ? (
        <p className="text-color-secondary">
          Nenhuma fase cadastrada. Cadastre fases no menu &quot;Fases&quot;.
        </p>
      ) : (
        <div className="flex flex-column gap-3">
          {fasesAcompanhamento.map((fase) => (
            <div
              key={fase.id}
              className={classNames(
                "border-1 surface-border border-round-lg p-3",
                {
                  "surface-100": !fase.associada,
                },
              )}
            >
              <div className="flex align-items-start justify-content-between gap-3">
                <div className="flex align-items-center gap-3">
                  <Checkbox
                    inputId={`associar-${fase.id}`}
                    checked={fase.associada}
                    onChange={() => toggleAssociacao(fase)}
                  />
                  <div>
                    <label
                      htmlFor={`associar-${fase.id}`}
                      className="font-semibold cursor-pointer"
                    >
                      {fase.descricao}
                    </label>
                    <div className="flex gap-2 mt-2">
                      {fase.consultoria && (
                        <Tag
                          icon="pi pi-briefcase"
                          severity="info"
                          value="Consultoria"
                        />
                      )}
                      {fase.treinamento && (
                        <Tag
                          icon="pi pi-users"
                          severity="success"
                          value="Treinamento"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {fase.associada && (
                  <div className="flex flex-column align-items-end gap-2">
                    <div className="flex align-items-center gap-2">
                      <Checkbox
                        inputId={`concluir-${fase.id}`}
                        checked={fase.concluida}
                        onChange={() => toggleConclusao(fase)}
                      />
                      <label
                        htmlFor={`concluir-${fase.id}`}
                        className="cursor-pointer text-sm"
                      >
                        Concluído
                      </label>
                    </div>
                    {fase.concluida && fase.concluido_em && (
                      <small className="text-color-secondary">
                        {formatDateTime(fase.concluido_em)}
                      </small>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {loadingVinculos && (
        <div className="mt-3 text-color-secondary">Atualizando vínculos...</div>
      )}
    </div>
  );
}
