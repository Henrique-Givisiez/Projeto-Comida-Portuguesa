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
  // busca os itens da categoria selecionada
  const { data, isLoading, isError } = api.item.getByCategoria.useQuery(categoria);

  const items = useMemo(() => data ?? [], [data]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-44 w-full animate-pulse rounded-xl bg-zinc-100"
          />
        ))}
      </div>
    );
  }

  if (isError || items.length === 0) {
    return (
      <div
        role="status"
        className="rounded-lg border border-dashed border-zinc-300 p-6 text-center text-zinc-600"
      >
        Nenhum item encontrado para esta categoria.
      </div>
    );
  }

  return (
    <section aria-label="Itens do cardápio" className="space-y-4 p-5">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onAdd={onAddItem} />
      ))}
    </section>
  );
}
