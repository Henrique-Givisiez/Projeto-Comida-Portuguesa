// src/server/api/routers/chamado.ts
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

const createChamadoInput = z.object({
  comandaId: z.string().min(1),
});

const updateChamadoInput = z.object({
  id: z.string().min(1),
  comandaId: z.string().min(1),
  finalizado: z.boolean(),
});

export const chamadoRouter = createTRPCRouter({
  create: publicProcedure
    .input(createChamadoInput)
    .mutation(async ({ input }) => {
      const chamado = await db.chamado.create({
        data: {
          comandaId: input.comandaId,
        },
      });
      return chamado;
    }),

  update: publicProcedure
    .input(updateChamadoInput)
    .mutation(async ({ input }) => {
        const existing = await db.chamado.findUnique({ where: { id: input.id } });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Chamado inexistente." });

        const updateData: Prisma.ChamadoUpdateInput = {};
        if (input.finalizado != null) { 
            updateData.finalizado = input.finalizado
        } else {
            console.log(input);
            throw new TRPCError({ code: "BAD_REQUEST", message: "Finalização do chamado não informada." });
        }

        const chamado = await db.chamado.update({
            where: { id: input.id },
            data: updateData,
      });
      return chamado;
    }),

  deleteAll: publicProcedure
    .mutation(async () => {
      await db.chamado.deleteMany();
    }),
});
