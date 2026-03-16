// src/gerenciar/pedidos/hooks/usePedidosHoje.ts
import { useMemo } from "react";
import { api } from "~/trpc/react";
import type { GroupedPedidos } from "../types";
import type { StatusPedido } from "@prisma/client";

export function usePedidosHoje(hoje: Date) {
  const { data: pedidos = [], isLoading, error, refetch, isFetching } =
    api.pedido.getByParam.useQuery(
      { dataCriacao: hoje },
      {
        refetchOnMount: "always",
        refetchOnWindowFocus: false,
        staleTime: 0,
        networkMode: "always",
      }
    );

  const grouped = useMemo<GroupedPedidos>(() => {
    const base: GroupedPedidos = {
      EM_ANDAMENTO: [],
      ENTREGUE: [],
      CANCELADO: [],
    };
    for (const p of pedidos) base[p.status].push(p);
    return base;
  }, [pedidos]);

  const canClose = grouped.EM_ANDAMENTO.length === 0;

  const utils = api.useUtils();

  const updateStatus = api.pedido.update.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.pedido.getByParam.invalidate({ dataCriacao: hoje }),
        utils.pedido.getByParam.invalidate({ dataCriacao: hoje, status: "ENTREGUE" }),
        utils.pedido.totaisPorComanda.invalidate?.({ data: hoje }),
      ]);
    },
  });

  const removeItemMut = api.pedido.removeItem.useMutation({
    onSuccess: async () => {
      await utils.pedido.getByParam.invalidate({ dataCriacao: hoje });
    },
  });

  function setStatus(pedidoId: string, status: StatusPedido) {
    updateStatus.mutate({ id: pedidoId, status });
  }

  function removeItem(pedidoItemId: string) {
    removeItemMut.mutate({ pedidoItemId });
  }

  return { pedidos, grouped, canClose, isLoading, isFetching, error, refetch, setStatus, removeItem};
}
