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
  status: z.enum(["EM_ANDAMENTO", "ENTREGUE", "CANCELADO"]).optional(),
  dataCriacao: z.date().optional(),
})

const getByIdInput = z.object({
  id: z.string().min(1),
});

const updatePedidoInput = z.object({
  id: z.string().min(1),
  status: z.enum(["EM_ANDAMENTO", "ENTREGUE", "CANCELADO"]).optional(),
  comandaId: z.string().optional(),
});

const removeItemInput = z.object({
  pedidoItemId: z.string().min(1),
});

const totaisInput = z.object({
  data: z.date().optional(), // default: hoje
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
      });

      return deleted;
    }),

  removeItem: publicProcedure
    .input(removeItemInput)
    .mutation(async ({ input }) => {
      // 1) descobre o pedido do item e valida status
      const item = await db.pedidoItem.findUnique({
        where: { id: input.pedidoItemId },
        include: { pedido: true },
      });

      if (!item) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Item não encontrado." });
      }
      if (item.pedido.status !== "EM_ANDAMENTO") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Só é possível remover itens de pedidos EM_ANDAMENTO.",
        });
      }

      // 2) apaga o item
      await db.pedidoItem.delete({ where: { id: input.pedidoItemId } });

      // 3) retorna o pedido atualizado (incluindo itens)
      const pedidoAtualizado = await db.pedido.findUnique({
        where: { id: item.pedidoId },
        include: {
          comanda: { select: { id: true, numeroMesa: true, nomeCliente: true } },
          itens: {
            include: { item: { select: { id: true, nome: true, preco: true } } },
            orderBy: { dataCriacao: "asc" },
          },
        },
      });

      return pedidoAtualizado;
    }),

  totaisPorComanda: publicProcedure
    .input(totaisInput)
    .query(async ({ input }) => {
      // calcula 00:00→23:59 local
      const base = input.data ?? new Date();
      const start = new Date(base); start.setHours(0,0,0,0);
      const end = new Date(base);   end.setHours(23,59,59,999);

      // busca pedidos ENTREGUE do dia com itens
      const pedidos = await db.pedido.findMany({
        where: {
          status: "ENTREGUE",
          dataCriacao: { gte: start, lte: end },
        },
        include: {
          comanda: { select: { id: true, numeroMesa: true, nomeCliente: true } },
          itens: {
            include: { item: { select: { id: true, nome: true, preco: true } } },
          },
        },
        orderBy: { dataCriacao: "asc" },
      });

      // agrega por comanda
      const map = new Map<string, {
        comandaId: string; numeroMesa: number; nomeCliente: string; total: number;
      }>();

      for (const p of pedidos) {
        const parcial = p.itens.reduce((acc, it) => acc + it.quantidade * it.item.preco, 0);
        const k = p.comanda.id;
        const prev = map.get(k);
        if (prev) prev.total += parcial;
        else map.set(k, {
          comandaId: k,
          numeroMesa: p.comanda.numeroMesa,
          nomeCliente: p.comanda.nomeCliente,
          total: parcial,
        });
      }

      const rows = Array.from(map.values()).sort((a, b) => a.numeroMesa - b.numeroMesa);
      const totalGeral = rows.reduce((acc, r) => acc + r.total, 0);

      return { rows, totalGeral };
    }),
});
