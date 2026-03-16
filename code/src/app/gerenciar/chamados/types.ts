// src/gerenciar/chamados/types.ts
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

type R = inferRouterOutputs<AppRouter>;
export type ChamadoDTO = R["chamado"]["getAll"][number];
