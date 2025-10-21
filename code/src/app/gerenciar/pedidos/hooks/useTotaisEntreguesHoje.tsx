// src/features/pedidos/hooks/useTotaisEntreguesHoje.ts
import { api } from "~/trpc/react";
import { useMemo } from "react";

export function useTotaisEntreguesHoje(hoje: Date) {
  const { data, isLoading, error } = api.pedido.totaisPorComanda.useQuery({ data: hoje });
  return {
    rows: data?.rows ?? [],
    totalGeral: data?.totalGeral ?? 0,
    isLoading,
    error,
  };
}
