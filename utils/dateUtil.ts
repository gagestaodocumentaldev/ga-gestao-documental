export function formatDate(date?: string | null) {
  if (!date) return "";

  const [year, month, day] = date.slice(0, 10).split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("pt-BR");
}

export function formatDateTime(date?: string | null) {
  if (!date) return "";

  return new Date(date.replace(" ", "T")).toLocaleString("pt-BR");
}
