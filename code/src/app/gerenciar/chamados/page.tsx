"use client";

import { NavBar } from "~/app/_components/navbar";
import { ChamadoCard } from "./components/ChamadoCard";
import { useChamados } from "./hooks/useChamados";

export default function ChamadosPage() {
  const { chamados, isLoading, finalizarChamado } = useChamados();

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">

        {isLoading && (
          <div>Carregando chamados...</div>
        )}

        {!isLoading && chamados.length === 0 && (
          <div className="text-neutral-500">
            Nenhum chamado ativo.
          </div>
        )}

        {!isLoading && chamados.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {chamados.map((chamado) => (
              <ChamadoCard
                key={chamado.id}
                chamado={chamado}
                onFinalizar={() =>
                  finalizarChamado.mutate({
                    id: chamado.id,
                    comandaId: chamado.comanda.id,
                    finalizado: true,
                  })
                }
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}