"use client";

import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { Tag } from "primereact/tag";
import { useState } from "react";

import { Documento } from "@/types/entidades-banco/documento";
import { TipoDocumento } from "@/types/entidades-banco/tipoDocumento";

interface Props {
  documentos: Documento[];
  tiposDisponiveis: TipoDocumento[];
}

const LIMIT = 10;

export default function PainelCoberturaDocumental({
  documentos,
  tiposDisponiveis,
}: Props) {
  const [expandido, setExpandido] = useState(false);

  const tiposPreenchidos = documentos
    .map((d) => d.tipo)
    .filter((t): t is TipoDocumento => !!t);

  const preenchidosVisiveis = expandido
    ? tiposPreenchidos
    : tiposPreenchidos.slice(0, LIMIT);
  const faltandoVisiveis = expandido
    ? tiposDisponiveis
    : tiposDisponiveis.slice(0, LIMIT);
  const totalOculto =
    Math.max(0, tiposPreenchidos.length - LIMIT) +
    Math.max(0, tiposDisponiveis.length - LIMIT);
  const temMais = totalOculto > 0;

  return (
    <Panel header="Cobertura Documental" toggleable className="mb-3">
      <div className="grid">
        <div className="col-6">
          <span className="font-bold text-sm">
            Preenchidos ({tiposPreenchidos.length})
          </span>
          <div className="flex flex-wrap gap-1 mt-2">
            {preenchidosVisiveis.map((t) => (
              <Tag key={t.id} value={t.descricao} severity="success" />
            ))}
            {tiposPreenchidos.length === 0 && (
              <span className="text-color-secondary text-sm">Nenhum</span>
            )}
          </div>
        </div>
        <div className="col-6">
          <span className="font-bold text-sm">
            Faltandos ({tiposDisponiveis.length})
          </span>
          <div className="flex flex-wrap gap-1 mt-2">
            {faltandoVisiveis.map((t) => (
              <Tag
                key={t.id}
                value={t.descricao}
                style={{ background: "#808080" }}
              />
            ))}
            {tiposDisponiveis.length === 0 && (
              <span className="text-color-secondary text-sm">Nenhum</span>
            )}
          </div>
        </div>
      </div>
      {temMais && (
        <div className="mt-2">
          <Button
            label={expandido ? "Ver menos" : `Ver mais +${totalOculto} tipos`}
            link
            icon={expandido ? "pi pi-chevron-up" : "pi pi-chevron-down"}
            iconPos="right"
            type="button"
            onClick={() => setExpandido((p) => !p)}
            className="p-0 text-sm"
          />
        </div>
      )}
    </Panel>
  );
}
