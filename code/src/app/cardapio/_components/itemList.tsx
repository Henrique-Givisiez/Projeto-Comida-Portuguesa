// src/app/_components/ItemsList.tsx
"use client";

import { useMemo } from "react";
import ItemCard, { type ItemDTO } from "./itemCard";
import { api } from "~/utils/api"; // tRPC do T3
import type { Categoria } from "@prisma/client";

type ItemsListProps = {
  categoria: Categoria;
  onAddItem?: (item: ItemDTO) => void;
  initialItems?: ItemDTO[];
};

export function ItemsList({ categoria, onAddItem }: ItemsListProps) {
  const { data, isLoading, isFetching, isError } =
    api.item.getByCategoria.useQuery(categoria, {
      // mantém dados anteriores enquanto busca os novos (troca de categoria suave)
      placeholderData: (prev) => prev, // v4
      // em v5 use: placeholderData: keepPreviousData
    });

  const items = useMemo(() => data ?? [], [data]);

  // 1) Skeleton no primeiro load OU durante refetch (quando ainda não há data)
  if (isLoading || (isFetching && !data)) {
    return (
      <div className="space-y-3 p-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-44 w-full animate-pulse rounded-xl bg-zinc-100" />
        ))}
      </div>
    );
  }

  // 2) Erro "real"
  if (isError) {
    return (
      <div role="status" className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-zinc-600">
        Ocorreu um erro ao carregar os itens.
      </div>
    );
  }

  // 3) Lista vazia (não tratar como erro)
  if (items.length === 0) {
    return (
      <div role="status" className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-zinc-600">
        Nenhum item encontrado para esta categoria.
      </div>
    );
  }

  // 4) Conteúdo
  return (
    <section aria-label="Itens do cardápio" className="space-y-4 p-5">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onAdd={onAddItem} />
      ))}
    </section>
  );
}
