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
import { FaseSelecaoState } from "@/app/(main)/acompanhamento-fases/_components/dialog-selecionar-fases";

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

function montarFasesSelecao(
  fases: Fase[],
  vinculos: ClienteFase[],
): FaseSelecaoState[] {
  const vinculosPorFase = new Map(vinculos.map((cf) => [cf.fase_id, cf]));

  return fases.map((fase) => ({
    id: fase.id,
    descricao: fase.descricao,
    consultoria: fase.consultoria,
    treinamento: fase.treinamento,
    associada: vinculosPorFase.has(fase.id),
  }));
}

function buildFasePayload(
  fase_id: string,
  associada: boolean,
  concluida: boolean,
  concluido_em?: string | null,
): FaseClientePayload {
  return {
    fase_id,
    associada,
    concluido: concluida,
    concluido_em: concluida ? (concluido_em ?? new Date().toISOString()) : null,
  };
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
  const [dialogSelecaoAberto, setDialogSelecaoAberto] = useState(false);
  const [fasesSelecao, setFasesSelecao] = useState<FaseSelecaoState[]>([]);
  const [loadingSelecao, setLoadingSelecao] = useState(false);
  const [salvandoSelecao, setSalvandoSelecao] = useState(false);

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
        setFasesSelecao(montarFasesSelecao(fases, vinculos));
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
      .finally(() => {
        setLoadingDialog(false);
        setLoadingSelecao(false);
      });
  }, [clienteDialog]);

  const abrirDialog = (cliente: ClienteFaseResumo) => {
    setClienteDialog(cliente);
    setFasesDialog([]);
    setFasesSelecao([]);
    setLoadingDialog(true);
    setLoadingSelecao(true);
    setDialogAberto(true);
  };

  const fecharDialog = () => {
    setDialogAberto(false);
    setClienteDialog(null);
    setFasesDialog([]);
    setFasesSelecao([]);
  };

  const abrirSelecaoFases = () => {
    setDialogSelecaoAberto(true);
  };

  const fecharSelecaoFases = () => {
    if (salvandoSelecao) return;
    setDialogSelecaoAberto(false);
  };

  const toggleSelecaoFase = (faseId: string) => {
    setFasesSelecao((prev) =>
      prev.map((fase) =>
        fase.id === faseId ? { ...fase, associada: !fase.associada } : fase,
      ),
    );
  };

  const salvarSelecaoFases = async () => {
    if (!clienteDialog) return;

    setSalvandoSelecao(true);
    try {
      const conclusaoPorFase = new Map(
        fasesDialog.map((fase) => [fase.id, { concluida: fase.concluida, concluido_em: fase.concluido_em }]),
      );

      const payload: FaseClientePayload[] = fasesSelecao.map((fase) => {
        const conclusao = conclusaoPorFase.get(fase.id);
        return buildFasePayload(
          fase.id,
          fase.associada,
          conclusao?.concluida ?? false,
          conclusao?.concluido_em,
        );
      });

      await salvarFasesCliente(clienteDialog.id, payload);

      const [fasesAtualizadas, vinculosAtualizados] = await Promise.all([
        pesquisarFases(),
        pesquisarClientesFases(clienteDialog.id),
      ]);

      setFasesDialog(montarFasesDialog(fasesAtualizadas, vinculosAtualizados));
      setFasesSelecao(montarFasesSelecao(fasesAtualizadas, vinculosAtualizados));

      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Fases do cliente atualizadas",
        life: 3000,
      });

      setDialogSelecaoAberto(false);
      carregarResumo();
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail:
          err instanceof Error
            ? err.message
            : "Erro ao salvar seleção de fases",
        life: 3000,
      });
    } finally {
      setSalvandoSelecao(false);
    }
  };

  const alterarDataConclusao = (faseId: string, data: Date | null) => {
    setFasesDialog((prev) =>
      prev.map((fase) =>
        fase.id === faseId && fase.associada
          ? {
              ...fase,
              concluida: !!data,
              concluido_em: data ? data.toISOString() : null,
            }
          : fase,
      ),
    );
  };

  const salvar = async () => {
    if (!clienteDialog) return;

    setSalvando(true);
    try {
      const payload: FaseClientePayload[] = fasesDialog.map((fase) =>
        buildFasePayload(
          fase.id,
          fase.associada,
          fase.concluida,
          fase.concluido_em,
        ),
      );

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
    dialogSelecaoAberto,
    fasesSelecao,
    loadingSelecao,
    salvandoSelecao,
    abrirDialog,
    fecharDialog,
    alterarDataConclusao,
    salvar,
    abrirSelecaoFases,
    fecharSelecaoFases,
    salvarSelecaoFases,
    toggleSelecaoFase,
  };
}
