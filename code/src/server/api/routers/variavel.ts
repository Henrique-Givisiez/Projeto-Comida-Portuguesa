import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { Prisma } from "@prisma/client";
import { hash, compare } from "bcryptjs";

export interface VariavelType {
    id: string;
    chave: string;
    valor: string;
}

const createVariavelInput = z.object({
  chave: z.string().min(1),
  valor: z.string().min(1),
});

const updateVariavelInput = z.object({
  id: z.string(),
  chave: z.string().optional(),
  valor: z.string().optional(),
});

const verificarVariavelInput = z.object({
    chave: z.string().min(1),
    valor: z.string().min(1),
});

export const variavelRouter = createTRPCRouter({
  create: publicProcedure
    .input(createVariavelInput)
    .mutation(async ({ input }) => {
      const variavel_existe = await db.variavel.findFirst({
        where: {
          chave: input.chave
        },
      });

      if (variavel_existe) {
        throw new Error("Variável já existe");
      }

      const hash_valor = await hash(input.valor, 10);

      const variavelCriada = await db.variavel.create({
        data: {
          chave: input.chave,
          valor: hash_valor,
        }
      });

      return variavelCriada;
    }),
    
    verificar: publicProcedure
    .input(verificarVariavelInput)
    .query(async ({ input }) => {

      const variavel = await db.variavel.findUnique({
        where: { chave: input.chave },
      });

      if (!variavel) {
        throw new Error("Variável não configurada.");
      }

      const valorConfere = await compare(input.valor, variavel.valor);
      return valorConfere;
    }),


  update: publicProcedure
    .input(updateVariavelInput)
    .mutation(async ({ input }) => {
      const existing = await db.variavel.findUnique({ where: { id: input.id } });
      if (!existing) throw new Error("Variável não encontrada.");

      const updateData: Prisma.VariavelUpdateInput = {};
      if (input.chave != null) updateData.chave = input.chave;
      if (input.valor != null) updateData.valor = input.valor;

      return db.variavel.update({
        where: { id: input.id },
        data: updateData,
      });
    }),

  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const variavel = await db.variavel.findUnique({
        where: { id: input },
      });

      if (!variavel) {
        throw new Error("Variável não encontrada.");
      }

      const variavelDeletada = await db.variavel.delete({
        where: { id: input },
      });

      return variavelDeletada;
    }),

  });
