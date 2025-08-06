import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


const createChamadoInput = z.object({
  comandaId: z.string().uuid(),
});

const updateChamadoInput = z.object({
  id: z.string().uuid(),
  finalizado: z.boolean().optional(),
});

export const chamadoRouter = createTRPCRouter({
  create: publicProcedure
    .input(createChamadoInput)
    .mutation(async ({ input }) => {
      const chamado_existe = await db.chamado.findFirst({
        where: {
            comandaId: input.comandaId,
            finalizado: false,
        },
      });

      if (chamado_existe) {
        throw new Error("Chamado já existe");
      }
      
      const chamadoCriado = await db.chamado.create({
        data: {
            comandaId: input.comandaId,
        }
      });

      return chamadoCriado;
    }),

  getAll: publicProcedure
    .query(async () => {
      const chamados = await db.chamado.findMany({
        where: {
          finalizado: false,
        },
        orderBy: {
          dataChamado: "desc",
        },
      });

      return chamados;
    }),
    

  update: publicProcedure
    .input(updateChamadoInput)
    .mutation(async ({ input }) => {
      const existing = await db.chamado.findUnique({ where: { id: input.id } });
      if (!existing) throw new Error("Chamado não encontrado.");

      const { id, ...data } = input;
      return db.chamado.update({
        where: { id },
        data,
      });
    }),

  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const chamado = await db.chamado.findUnique({
        where: { id: input },
      });

      if (!chamado) {
        throw new Error("Chamado não encontrado.");
      }

      const chamadoDeletado = await db.chamado.delete({
        where: { id: input },
      });

      return chamadoDeletado;
    }),

  });
