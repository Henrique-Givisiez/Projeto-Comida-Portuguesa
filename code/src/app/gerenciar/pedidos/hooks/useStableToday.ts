// src/gerenciar/pedidos/hooks/useStableToday.ts
import { useMemo } from "react";
export function useStableToday() {
  return useMemo(() => new Date(), []);
}
