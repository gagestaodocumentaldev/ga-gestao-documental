"use client";

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";

import {
  ClienteFaseResumo,
  FaseClientePayload,
  pesquisarClientesFases,
  pesquisarResumoClientesFases,
  salvarFasesCliente,
} from "@/services/cliente-fase-service";
import { pesquisarFases } from "@/services/fase-service";
import { ClienteFase } from "@/types/entidades-banco/clienteFase";
import { Fase } from "@/types/entidades-banco/fase";

export interface FaseDialogState extends Fase {
  associada: boolean;
  concluida: boolean;
  concluido_em?: string | null;
}

function montarFasesDialog(
  fases: Fase[],
  vinculos: ClienteFase[],
): FaseDialogState[] {
  const vinculosPorFase = new Map(vinculos.map((cf) => [cf.fase_id, cf]));

  return fases.map((fase) => {
    const vinculo = vinculosPorFase.get(fase.id);
    return {
      ...fase,
      associada: !!vinculo,
      concluida: vinculo?.concluido ?? false,
      concluido_em: vinculo?.concluido_em ?? null,
    };
  });
}

export function useAcompanhamentoFases() {
  const toast = useRef<Toast>(null);

  const [resumo, setResumo] = useState<ClienteFaseResumo[] | undefined>(
    undefined,
  );
  const [dialogAberto, setDialogAberto] = useState(false);
  const [clienteDialog, setClienteDialog] = useState<ClienteFaseResumo | null>(
    null,
  );
  const [fasesDialog, setFasesDialog] = useState<FaseDialogState[]>([]);
  const [loadingDialog, setLoadingDialog] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const carregarResumo = () => {
    pesquisarResumoClientesFases()
      .then(setResumo)
      .catch((err) => {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail:
            err instanceof Error
              ? err.message
              : "Erro ao buscar acompanhamento",
          life: 3000,
        });
      });
  };

  useEffect(() => {
    carregarResumo();
  }, []);

  useEffect(() => {
    if (!clienteDialog) return;

    Promise.all([pesquisarFases(), pesquisarClientesFases(clienteDialog.id)])
      .then(([fases, vinculos]) => {
        setFasesDialog(montarFasesDialog(fases, vinculos));
      })
      .catch((err) => {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail:
            err instanceof Error
              ? err.message
              : "Erro ao buscar fases do cliente",
          life: 3000,
        });
      })
      .finally(() => setLoadingDialog(false));
  }, [clienteDialog]);

  const abrirDialog = (cliente: ClienteFaseResumo) => {
    setClienteDialog(cliente);
    setFasesDialog([]);
    setLoadingDialog(true);
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setClienteDialog(null);
    setFasesDialog([]);
  };

  const toggleVinculada = (faseId: string) => {
    setFasesDialog((prev) =>
      prev.map((fase) => {
        if (fase.id !== faseId) return fase;
        const associada = !fase.associada;
        return {
          ...fase,
          associada,
          concluida: associada ? fase.concluida : false,
          concluido_em: associada ? fase.concluido_em : null,
        };
      }),
    );
  };

  const toggleConcluida = (faseId: string) => {
    setFasesDialog((prev) =>
      prev.map((fase) => {
        if (fase.id !== faseId || !fase.associada) return fase;
        const concluida = !fase.concluida;
        return {
          ...fase,
          concluida,
          concluido_em: concluida ? new Date().toISOString() : null,
        };
      }),
    );
  };

  const salvar = async () => {
    if (!clienteDialog) return;

    setSalvando(true);
    try {
      const payload: FaseClientePayload[] = fasesDialog.map((fase) => ({
        fase_id: fase.id,
        associada: fase.associada,
        concluido: fase.concluida,
        concluido_em: fase.concluido_em,
      }));

      await salvarFasesCliente(clienteDialog.id, payload);

      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Fases do cliente atualizadas",
        life: 3000,
      });

      fecharDialog();
      carregarResumo();
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: err instanceof Error ? err.message : "Erro ao salvar fases",
        life: 3000,
      });
    } finally {
      setSalvando(false);
    }
  };

  return {
    toast,
    resumo,
    dialogAberto,
    clienteDialog,
    fasesDialog,
    loadingDialog,
    salvando,
    abrirDialog,
    fecharDialog,
    toggleVinculada,
    toggleConcluida,
    salvar,
  };
}
