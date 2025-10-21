// src/gerenciar/pedidos/types.ts
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import type { StatusPedido } from "@prisma/client";

type R = inferRouterOutputs<AppRouter>;
export type PedidoDTO = R["pedido"]["getByParam"][number];

export type GroupedPedidos = Record<StatusPedido, PedidoDTO[]>;
