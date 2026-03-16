"use client";

import { api } from "~/trpc/react";

export function useChamados() {
  const utils = api.useUtils();

  const chamados = api.chamado.getAll.useQuery();

  const finalizarChamado = api.chamado.update.useMutation({
    onSuccess: async () => {
      await utils.chamado.getAll.invalidate();
    },
  });

  return {
    chamados: chamados.data ?? [],
    isLoading: chamados.isLoading,
    finalizarChamado,
  };
}