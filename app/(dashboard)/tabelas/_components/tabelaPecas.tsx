"use client";

import { useState, useRef, useEffect } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

import TabelaGenerica from "../../../../components/tabelaGenerica";
import { formatCurrency } from "@/utils/numberUtil";
import { Peca } from "@/types/peca";

interface ClientTabelaPecasProps {
  pecas: Peca[];
  titulo: string;
}

export default function ClientTabelaPecas({
  pecas,
  titulo,
}: ClientTabelaPecasProps) {
  // Molde de um objeto vazio para resetar o formulário
  const pecaVazia: Peca = {
    id: "",
    codigo: "",
    descricao: "",
    marca: "",
    estoque: 0,
    preco_custo: 0,
    preco_venda: 0,
  };

  // Estados locais
  const [listaPecas, setListaPecas] = useState<Peca[]>([]);
  const [peca, setPeca] = useState<Peca>(pecaVazia);
  const [submetido, setSubmetido] = useState(false);

  // Visibilidade dos Modais
  const [dialogPeca, setDialogPeca] = useState(false);
  const [dialogDeletarPeca, setDialogDeletarPeca] = useState(false);

  // Referências para componentes do PrimeReact
  const toast = useRef<Toast>(null);

  // Sincroniza a prop inicial com o estado local
  useEffect(() => {
    setListaPecas(pecas);
  }, [pecas]);

  // --- FUNÇÕES DE CONTROLE DOS DIALOGS ---
  const abrirNovo = () => {
    setPeca(pecaVazia);
    setSubmetido(false);
    setDialogPeca(true);
  };

  const esconderDialog = () => {
    setSubmetido(false);
    setDialogPeca(false);
  };

  const editarPeca = (item: Peca) => {
    setPeca({ ...item });
    setDialogPeca(true);
  };

  const confirmarDeletarPeca = (item: Peca) => {
    setPeca(item);
    setDialogDeletarPeca(true);
  };

  // --- PERSISTÊNCIA DOS DADOS (CRUD) ---
  const salvarPeca = () => {
    setSubmetido(true);

    // Validação simples: campo obrigatório preenchido
    if (peca.descricao?.trim() && peca.codigo?.trim()) {
      let _pecas = [...listaPecas];
      let _peca = { ...peca };

      if (peca.id) {
        // Modo Edição
        const index = _pecas.findIndex((val) => val.id === peca.id);
        _pecas[index] = _peca;
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Peça Atualizada",
          life: 3000,
        });
      } else {
        // Modo Criação (Gerando um ID provisório se necessário)
        _peca.id = Math.random().toString(36).substr(2, 9);
        _pecas.push(_peca);
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Peça Criada",
          life: 3000,
        });
      }

      setListaPecas(_pecas);
      setDialogPeca(false);
      setPeca(pecaVazia);
    }
  };

  const deletarPeca = () => {
    let _pecas = listaPecas.filter((val) => val.id !== peca.id);
    setListaPecas(_pecas);
    setDialogDeletarPeca(false);
    setPeca(pecaVazia);
    toast.current?.show({
      severity: "success",
      summary: "Sucesso",
      detail: "Peça Excluída",
      life: 3000,
    });
  };

  // --- ATUALIZAÇÃO DOS INPUTS NO STATE ---
  const onInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: string,
  ) => {
    const val = e.target.value || "";
    setPeca((prev) => ({ ...prev, [name]: val }));
  };

  const onInputNumberChange = (val: number | null, name: string) => {
    setPeca((prev) => ({ ...prev, [name]: val || 0 }));
  };

  // --- TEMPLATES VISUAIS (TOOLBARS E AÇÕES) ---
  const colunaAcoesTemplate = (rowData: Peca) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        onClick={() => editarPeca(rowData)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        severity="warning"
        onClick={() => confirmarDeletarPeca(rowData)}
      />
    </div>
  );

  // --- FOOTERS DOS MODAIS ---
  const rodapeDialogPeca = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        text
        onClick={esconderDialog}
      />
      <Button label="Salvar" icon="pi pi-check" text onClick={salvarPeca} />
    </>
  );

  const rodapeDeletarPeca = (
    <>
      <Button
        label="Não"
        icon="pi pi-times"
        text
        onClick={() => setDialogDeletarPeca(false)}
      />
      <Button label="Sim" icon="pi pi-check" text onClick={deletarPeca} />
    </>
  );

  return (
    <>
      <Toast ref={toast} />

      <TabelaGenerica
        value={listaPecas}
        titulo={titulo}
        headerActions={
          <Button
            label="Novo"
            icon="pi pi-plus"
            severity="success"
            onClick={abrirNovo}
          />
        }
      >
        {/* Colunas do seu layout */}
        <Column field="codigo" header="Código" sortable />
        <Column field="descricao" header="Descrição" sortable />
        <Column field="marca" header="Marca" sortable />
        <Column field="estoque" header="Estoque" sortable />
        <Column
          header="Preço custo"
          sortable
          body={(row) => formatCurrency(row.preco_custo)}
        />
        <Column
          header="Preço venda"
          sortable
          body={(row) => formatCurrency(row.preco_venda)}
        />

        {/* Coluna Customizada de Ações (Editar/Excluir) */}
        <Column
          header="Ações"
          body={colunaAcoesTemplate}
          exportable={false}
          style={{ minWidth: "12rem" }}
        ></Column>
      </TabelaGenerica>

      {/* --- DIALOG DE FORMULÁRIO (CRIAR / EDITAR) --- */}
      <Dialog
        visible={dialogPeca}
        style={{ width: "450px" }}
        header="Detalhes da Peça"
        modal
        className="p-fluid"
        footer={rodapeDialogPeca}
        onHide={esconderDialog}
      >
        <div className="field mb-3">
          <label htmlFor="codigo" className="font-bold">
            Código
          </label>
          <InputText
            id="codigo"
            value={peca.codigo}
            onChange={(e) => onInputChange(e, "codigo")}
            required
            autoFocus
            className={classNames({ "p-invalid": submetido && !peca.codigo })}
          />
          {submetido && !peca.codigo && (
            <small className="p-error">Código é obrigatório.</small>
          )}
        </div>

        <div className="field mb-3">
          <label htmlFor="descricao" className="font-bold">
            Descrição
          </label>
          <InputText
            id="descricao"
            value={peca.descricao}
            onChange={(e) => onInputChange(e, "descricao")}
            required
            className={classNames({
              "p-invalid": submetido && !peca.descricao,
            })}
          />
          {submetido && !peca.descricao && (
            <small className="p-error">Descrição é obrigatória.</small>
          )}
        </div>

        <div className="field mb-3">
          <label htmlFor="marca" className="font-bold">
            Marca
          </label>
          <InputText
            id="marca"
            value={peca.marca}
            onChange={(e) => onInputChange(e, "marca")}
          />
        </div>

        <div className="formgrid grid">
          <div className="field col mb-3">
            <label htmlFor="estoque" className="font-bold">
              Estoque
            </label>
            <InputNumber
              id="estoque"
              value={peca.estoque}
              onValueChange={(e) => onInputNumberChange(e.value, "estoque")}
            />
          </div>
        </div>

        <div className="formgrid grid gap-2">
          <div className="field col mb-3">
            <label htmlFor="preco_custo" className="font-bold">
              Preço Custo
            </label>
            <InputNumber
              id="preco_custo"
              value={peca.preco_custo}
              onValueChange={(e) => onInputNumberChange(e.value, "preco_custo")}
              mode="currency"
              currency="BRL"
              locale="pt-BR"
            />
          </div>
          <div className="field col mb-3">
            <label htmlFor="preco_venda" className="font-bold">
              Preço Venda
            </label>
            <InputNumber
              id="preco_venda"
              value={peca.preco_venda}
              onValueChange={(e) => onInputNumberChange(e.value, "preco_venda")}
              mode="currency"
              currency="BRL"
              locale="pt-BR"
            />
          </div>
        </div>
      </Dialog>

      {/* --- DIALOG DE CONFIRMAÇÃO UNITÁRIA --- */}
      <Dialog
        visible={dialogDeletarPeca}
        style={{ width: "450px" }}
        header="Confirmar Exclusão"
        modal
        footer={rodapeDeletarPeca}
        onHide={() => setDialogDeletarPeca(false)}
      >
        <div className="flex align-items-center justify-content-center gap-3">
          <i className="pi pi-exclamation-triangle text-amber-500 text-4xl" />
          {peca && (
            <span>
              Tem certeza que deseja excluir a peça <b>{peca.descricao}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </>
  );
}
