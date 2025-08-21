import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export interface ItemType {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    imageURL: string;
    categoria: string;
    disponivel: boolean;
}

const createItemInput = z.object({
  nome: z.string().min(1),
  descricao: z.string().min(1),
  preco: z.number().positive(),
  imageURL: z.string().url(),
  categoria: z.enum(["ENTRADAS", "PRATOS_CASA", "PEIXES", "CARNES", "BEBIDAS", "SOBREMESAS"]),
  disponivel: z.boolean().optional(),
});

const updateItemInput = z.object({
  id: z.string(),
  nome: z.string().optional(),
  descricao: z.string().optional(),
  preco: z.number().positive().optional(),
  imageURL: z.string().url().optional(),
  categoria: z.enum(["ENTRADAS", "PRATOS_CASA", "PEIXES", "CARNES", "BEBIDAS", "SOBREMESAS"]).optional(),
  disponivel: z.boolean().optional(),
});

export const itemRouter = createTRPCRouter({
  create: publicProcedure
    .input(createItemInput)
    .mutation(async ({ input }) => {
      const itemCriado = await db.item.create({
        data: {
          nome: input.nome,
          descricao: input.descricao,
          preco: input.preco,
          imageURL: input.imageURL,
          categoria: input.categoria,
          disponivel: input.disponivel ?? true,
        }
      });

      return itemCriado;
    }),
    
  getByCategoria: publicProcedure
  .input(z.enum(["ENTRADAS", "PRATOS_CASA", "PEIXES", "CARNES", "BEBIDAS", "SOBREMESAS"]))
  .query(async ({ input }) => {
    const items = await db.item.findMany({
      where: { categoria: input },
    });
    if (items.length === 0) {
      throw new Error("Nenhum item encontrado.");
    }
    return items;
  }),

  getByID: publicProcedure
  .input(z.string())
  .query(async ({ input }) => {
    const item = await db.item.findUnique({
      where: { id: input },
    });
    if (!item) {
      throw new Error("Item não encontrado.");
    }
    return item;
  }),

  getAll: publicProcedure
  .query(async () => {
    const items = await db.item.findMany();
    if (items.length === 0) {
      throw new Error("Item não encontrado.");
    }
    return items;
  }),

  update: publicProcedure
  .input(updateItemInput)
  .mutation(async ({ input }) => {
    const existing = await db.item.findUnique({ where: { id: input.id } });
    if (!existing) throw new Error("Item não encontrado.");

    const { id, ...data} = input;
    return db.item.update({
      where: { id },
      data, 
    });
  }),

  delete: publicProcedure
  .input(z.string())
  .mutation(async ({ input }) => {
    const item = await db.item.findUnique({
      where: { id: input },
    });

    if (!item) {
      throw new Error("Item não encontrado.");
    }

    const itemDeletado = await db.item.delete({
      where: { id: input },
    });

    return itemDeletado;
  }),
});
