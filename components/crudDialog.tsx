"use client";

import { ReactNode } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

interface CrudDialogProps {
  visible: boolean;
  titulo: string;
  onHide: () => void;
  onSalvar: () => void;
  salvando: boolean;
  largura?: string;
  children: ReactNode;
  footerExtra?: ReactNode;
}

export default function CrudDialog({
  visible,
  titulo,
  onHide,
  onSalvar,
  salvando,
  largura,
  children,
  footerExtra,
}: CrudDialogProps) {
  const footer = (
    <>
      <div className="flex gap-2">
        {footerExtra}
        <Button
          label="Cancelar"
          icon="pi pi-times"
          text
          onClick={onHide}
          disabled={salvando}
        />
      </div>
      <Button
        label="Salvar"
        icon="pi pi-check"
        text
        onClick={onSalvar}
        loading={salvando}
      />
    </>
  );

  return (
    <Dialog
      visible={visible}
      style={{ width: largura ?? "50%" }}
      breakpoints={{ "768px": "90vw" }}
      header={titulo}
      modal
      className="p-fluid"
      footer={footer}
      onHide={onHide}
    >
      {children}
    </Dialog>
  );
}
