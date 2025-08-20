import { comandaRouter } from "./routers/comanda";
import { variavelRouter } from "./routers/variavel";
import { itemRouter } from "./routers/item";
import { pedidoRouter } from "./routers/pedido";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { chamadoRouter } from "./routers/chamado";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  comanda: comandaRouter,
  variavel: variavelRouter,
  item: itemRouter,
  pedido: pedidoRouter,
  chamado: chamadoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
