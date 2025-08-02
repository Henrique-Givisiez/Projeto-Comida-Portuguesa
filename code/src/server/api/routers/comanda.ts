import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { Prisma } from "@prisma/client";

export interface ComandaType {
    id: string;
    nomeCliente: string;
    dataCriacao: Date;
    numeroMesa: number;
    finalizada: boolean;
}

const createComandaInput = z.object({
  nomeCliente: z.string().min(1),
  numeroMesa: z.number().min(1),
});

const updateComandaInput = z.object({
  id: z.string(),
  nomeCliente: z.string().optional(),
  numeroMesa: z.number().min(1).optional(),
  finalizada: z.boolean().optional(),
});

const getComanadaByParamInput = z.object({
  nomeCliente: z.string().optional(),
  numeroMesa: z.number().optional(),
});

export const comandaRouter = createTRPCRouter({
  create: publicProcedure
    .input(createComandaInput)
    .mutation(async ({ input }) => {
      const comanda_existe = await db.comanda.findFirst({
        where: {
          nomeCliente: input.nomeCliente,
          numeroMesa: input.numeroMesa,
          finalizada: false,
        },
      });

      if (comanda_existe) {
        throw new Error("Comanda já existe");
      }
      
      const comandaCriada = await db.comanda.create({
        data: {
          nomeCliente: input.nomeCliente,
          numeroMesa: input.numeroMesa,
        }
      });

      return comandaCriada;
    }),

  getAll: publicProcedure
    .query(async () => {
      const comandas = await db.comanda.findMany({
        where: {
          finalizada: false,
        },
        orderBy: {
          dataCriacao: "desc",
        },
      });

      return comandas;
    }),
    
    getByParam: publicProcedure
      .input(getComanadaByParamInput)
      .query(async ({ input }) => {
        const { nomeCliente, numeroMesa } = input;

        const where: Prisma.ComandaWhereInput = {
          finalizada: false,
        };
        if (nomeCliente) {
          where.nomeCliente = nomeCliente;
        }
        if (numeroMesa != undefined) {
          where.numeroMesa = numeroMesa;
        }

        const comandas = await db.comanda.findMany({
          where: {
            ...where,
            finalizada: false,
          },
          orderBy: {
            dataCriacao: "desc",
          },
        });
        if (comandas.length === 0) {
          throw new Error("Nenhuma comanda encontrada.");
        }
      return comandas;
      }),

  update: publicProcedure
    .input(updateComandaInput)
    .mutation(async ({ input }) => {
      const existing = await db.comanda.findUnique({ where: { id: input.id } });
      if (!existing) throw new Error("Comanda não encontrada.");

      const updateData: Prisma.ComandaUpdateInput = {};
      if (input.nomeCliente    != null) updateData.nomeCliente  = input.nomeCliente;
      if (input.numeroMesa     != null) updateData.numeroMesa   = input.numeroMesa;
      if (input.finalizada     != null) updateData.finalizada   = input.finalizada;

      return db.comanda.update({
        where: { id: input.id },
        data: updateData,
      });
    }),

  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const comanda = await db.comanda.findUnique({
        where: { id: input },
      });

      if (!comanda) {
        throw new Error("Comanda não encontrada.");
      }

      const comandaDeletada = await db.comanda.delete({
        where: { id: input },
      });

      return comandaDeletada;
    }),

  });
