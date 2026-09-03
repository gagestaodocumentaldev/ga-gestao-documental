"use client";

import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";

import { pesquisarClientes } from "@/services/cliente-service";
import { pesquisarFases } from "@/services/fase-service";
import {
  atualizarStatusFaseCliente,
  desvincularFaseCliente,
  pesquisarClientesFases,
  vincularFaseCliente,
} from "@/services/cliente-fase-service";
import { ClienteForm } from "@/services/cliente-service";
import { Fase } from "@/types/entidades-banco/fase";
import { ClienteFase } from "@/types/entidades-banco/clienteFase";

export interface FaseAcompanhamento extends Fase {
  associada: boolean;
  concluida: boolean;
  concluido_em?: string | null;
}

export function useAcompanhamentoFases() {
  const toast = useRef<Toast>(null);

  const [clientes, setClientes] = useState<ClienteForm[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<string>("");
  const [todasFases, setTodasFases] = useState<Fase[]>([]);
  const [clientesFases, setClientesFases] = useState<ClienteFase[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(true);
  const [loadingFases, setLoadingFases] = useState(true);
  const [loadingVinculos, setLoadingVinculos] = useState(false);

  useEffect(() => {
    pesquisarClientes()
      .then(setClientes)
      .catch((err) => {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: err instanceof Error ? err.message : "Erro ao buscar clientes",
          life: 3000,
        });
      })
      .finally(() => setLoadingClientes(false));
  }, []);

  useEffect(() => {
    pesquisarFases()
      .then(setTodasFases)
      .catch((err) => {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: err instanceof Error ? err.message : "Erro ao buscar fases",
          life: 3000,
        });
      })
      .finally(() => setLoadingFases(false));
  }, []);

  useEffect(() => {
    if (!clienteSelecionado) return;

    pesquisarClientesFases(clienteSelecionado)
      .then(setClientesFases)
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
      .finally(() => setLoadingVinculos(false));
  }, [clienteSelecionado]);

  const fasesAcompanhamento: FaseAcompanhamento[] = todasFases.map((fase) => {
    const vinculo = clientesFases.find((cf) => cf.fase_id === fase.id);
    return {
      ...fase,
      associada: !!vinculo,
      concluida: vinculo?.concluido ?? false,
      concluido_em: vinculo?.concluido_em ?? null,
    };
  });

  const totalAssociadas = fasesAcompanhamento.filter((f) => f.associada).length;
  const totalConcluidas = fasesAcompanhamento.filter(
    (f) => f.associada && f.concluida,
  ).length;
  const progresso =
    totalAssociadas > 0
      ? Math.round((totalConcluidas / totalAssociadas) * 100)
      : 0;

  const selecionarCliente = (clientId: string) => {
    setClienteSelecionado(clientId);
    setLoadingVinculos(!!clientId);
    if (!clientId) setClientesFases([]);
  };

  const toggleAssociacao = async (fase: FaseAcompanhamento) => {
    if (!clienteSelecionado) return;

    try {
      if (fase.associada) {
        await desvincularFaseCliente(clienteSelecionado, fase.id);
      } else {
        await vincularFaseCliente(clienteSelecionado, fase.id);
      }
      await pesquisarClientesFases(clienteSelecionado).then(setClientesFases);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: err instanceof Error ? err.message : "Erro ao alterar vínculo",
        life: 3000,
      });
    }
  };

  const toggleConclusao = async (fase: FaseAcompanhamento) => {
    if (!clienteSelecionado || !fase.associada) return;

    try {
      await atualizarStatusFaseCliente(
        clienteSelecionado,
        fase.id,
        !fase.concluida,
      );
      await pesquisarClientesFases(clienteSelecionado).then(setClientesFases);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail:
          err instanceof Error ? err.message : "Erro ao alterar status da fase",
        life: 3000,
      });
    }
  };

  return {
    toast,
    clientes,
    clienteSelecionado,
    fasesAcompanhamento,
    progresso,
    totalAssociadas,
    totalConcluidas,
    loadingClientes,
    loadingFases,
    loadingVinculos,
    selecionarCliente,
    toggleAssociacao,
    toggleConclusao,
  };
}
