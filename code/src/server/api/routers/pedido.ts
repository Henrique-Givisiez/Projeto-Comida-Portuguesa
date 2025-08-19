// src/server/api/routers/pedido.ts
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

const createPedidoInput = z.object({
  comandaId: z.string().min(1),
  itens: z.array(z.object({
    itemId: z.string(),
    quantidade: z.number().int().min(1),
    observacao: z.string().optional(),
  })),
});

const getByParamInput = z.object({
  numeroMesa: z.number().int().optional(),
  status: z.enum(["EM_ANDAMENTO", "ENTREGUE", "CANCELADO", "FINALIZADO"]).optional(),
  dataCriacao: z.date().optional(),
})

const getByIdInput = z.object({
  id: z.string().min(1),
});

const updatePedidoInput = z.object({
  id: z.string().min(1),
  status: z.enum(["EM_ANDAMENTO", "ENTREGUE", "CANCELADO", "FINALIZADO"]).optional(),
  comandaId: z.string().optional(),
});

export const pedidoRouter = createTRPCRouter({
  create: publicProcedure
    .input(createPedidoInput)
    .mutation(async ({ input }) => {
      const pedido = await db.pedido.create({
        data: {
          comandaId: input.comandaId,
          itens: {
            create: input.itens.map((i) => ({
              itemId: i.itemId,
              quantidade: i.quantidade,
              observacao: i.observacao ?? ""
            })),
          },
          status: "EM_ANDAMENTO",
        },
        include: { itens: true },
      });
      return pedido;
    }),

  getByParam: publicProcedure
    .input(getByParamInput)
    .query(async ({ input }) => {
      let dateFilter: Prisma.DateTimeFilter | undefined;
      if (input.dataCriacao) {
        const start = new Date(input.dataCriacao);
        start.setHours(0, 0, 0, 0);
        const end = new Date(input.dataCriacao);
        end.setHours(23, 59, 59, 999);
        dateFilter = { gte: start, lte: end };
      }

      const where: Prisma.PedidoWhereInput = {
        ...(input.status && { status: input.status }),
        ...(dateFilter && { dataCriacao: dateFilter }),
        ...(input.numeroMesa !== undefined && {
          comanda: { numeroMesa: input.numeroMesa },
        }),
      };

      const pedidos = await db.pedido.findMany({
        where,
        orderBy: { dataCriacao: "asc" },
        include: {
          comanda: { select: { id: true, numeroMesa: true, nomeCliente: true } },
          itens: {
            include: {
              item: { select: { id: true, nome: true, preco: true } },
            },
          },
        },
      });

      return pedidos;
  }),

  getByID: publicProcedure
    .input(getByIdInput)
    .query(async ({ input }) => {
      const pedido = await db.pedido.findUnique({
        where: { id: input.id },
        include: {
          comanda: { select: { id: true, numeroMesa: true, nomeCliente: true } },
          itens: {
            include: {
              item: { select: { id: true, nome: true, preco: true } },
            },
          },
        },
      });

      if (!pedido) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Pedido não encontrado." });
      }

      return pedido;
    }),
    
  update: publicProcedure
    .input(updatePedidoInput)
    .mutation(async ({ input }) => {
      return await db.$transaction(async (tx) => {
        // 1) Atualiza campos simples do Pedido
        const dataPedido: Prisma.PedidoUpdateInput = {
          ...(input.status && { status: input.status }),
          ...(input.comandaId && { comanda: { connect: { id: input.comandaId } } }),
        };

        // 2) Executa update do Pedido com as operações nos itens
        const pedidoAtualizado = await tx.pedido.update({
          where: { id: input.id },
          data: {
            ...dataPedido,
          },
          include: {
            comanda: { select: { id: true, numeroMesa: true, nomeCliente: true } },
            itens: {
              include: {
                item: { select: { id: true, nome: true, preco: true } },
              },
            },
          },
        });
        return pedidoAtualizado;
      });
    }),

  delete: publicProcedure
    .input(getByIdInput)
    .mutation(async ({ input }) => {
      const deleted = await db.$transaction(async (tx) => {
        await tx.pedidoItem.deleteMany({ where: { pedidoId: input.id } });

        // Excluir o pedido e retornar com alguns dados úteis
        const pedido = await tx.pedido.delete({
          where: { id: input.id },
          include: {
            comanda: { select: { id: true, numeroMesa: true, nomeCliente: true } },
          },
        });

        return pedido;
      }).catch((err) => {
        if (err?.code === "P2025") {
          throw new TRPCError({ code: "NOT_FOUND", message: "Pedido não encontrado." });
        }
        throw err;
      });

      return deleted;
    }),
});
