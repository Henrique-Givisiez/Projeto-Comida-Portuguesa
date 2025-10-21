// src/gerenciar/pedidos/utils/format.ts
export function formatBRL(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function timeSince(date: string | Date) {
  const base = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - base.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "agora mesmo";
  if (mins < 60) return `há cerca de ${mins} min`;
  const h = Math.floor(mins / 60);
  return `há cerca de ${h} ${h === 1 ? "hora" : "horas"}`;
}
