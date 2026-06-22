interface FormatCurrencyOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  fallback?: string;
}

export const formatCurrency = (
  value: any,
  options: FormatCurrencyOptions = {},
): string => {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    fallback = "-",
  } = options;

  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const numericValue = Number(value);

  if (isNaN(numericValue)) {
    return fallback;
  }

  return numericValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits,
    maximumFractionDigits,
  });
};
