import { DocumentStatus, StatusType } from '@/types/document-status';

export function calculateDocumentStatus(
  dataValidade: string | null | undefined
): DocumentStatus {
  if (!dataValidade) {
    return {
      diasParaVencer: null,
      status: 'no_expiry',
      statusLabel: 'Sem validade',
    };
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const vencimento = new Date(dataValidade);
  vencimento.setHours(0, 0, 0, 0);

  const diffTime = vencimento.getTime() - hoje.getTime();
  const diasParaVencer = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let status: StatusType;
  let statusLabel: string;

  if (diasParaVencer < 0) {
    status = 'expired';
    statusLabel = `Vencido há ${Math.abs(diasParaVencer)} dias`;
  } else if (diasParaVencer === 0) {
    status = 'critical';
    statusLabel = 'Vence hoje';
  } else if (diasParaVencer <= 30) {
    status = 'critical';
    statusLabel = `Vence em ${diasParaVencer} dias`;
  } else if (diasParaVencer <= 90) {
    status = 'warning';
    statusLabel = `Vence em ${diasParaVencer} dias`;
  } else {
    status = 'ok';
    statusLabel = `Válido por ${diasParaVencer} dias`;
  }

  return { diasParaVencer, status, statusLabel };
}
