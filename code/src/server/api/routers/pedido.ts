// src/server/api/routers/pedido.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

const createPedidoInput = z.object({
  comandaId: z.string().min(1), // ou obrigatório se já existir
  itens: z.array(z.object({
    itemId: z.string(),
    quantidade: z.number().int().min(1),
    observacao: z.string().optional(),
    subtotal: z.number().positive(), // opcional: pode calcular no servidor também
  })),
  total: z.number().positive(),
});

export const pedidoRouter = createTRPCRouter({
  create: publicProcedure
    .input(createPedidoInput)
    .mutation(async ({ input }) => {
      // calcule total no servidor se preferir, buscando preços atuais
      // crie Pedido e PedidoItem(s)
      const pedido = await db.pedido.create({
        data: {
          comandaId: input.comandaId ?? null,
        //   total: input.total,
          itens: {
            create: input.itens.map((i) => ({
              itemId: i.itemId,
              quantidade: i.quantidade,
              observacao: i.observacao ?? "",
              subtotal: i.subtotal,
            })),
          },
          status: "EM_ANDAMENTO",
        },
        include: { itens: true },
      });
      return pedido;
    }),
});
