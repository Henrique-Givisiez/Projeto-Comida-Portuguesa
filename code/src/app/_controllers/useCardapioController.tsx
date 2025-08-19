// src/app/_controllers/useCardapioController.tsx
"use client";
import { type ItemDTO } from "../cardapio/_components/itemCard";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { useCartController } from "./useCartController";

type Categoria =
  | "ENTRADAS"
  | "PRATOS_CASA"
  | "PEIXES"
  | "CARNES"
  | "BEBIDAS"
  | "SOBREMESAS";

export function useCardapioController(defaultCategoria: Categoria = "ENTRADAS") {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria>(defaultCategoria);

  const entries = useCartController((s) => s.entries);
  const addItem = useCartController((s) => s.addItem);
  const increase = useCartController((s) => s.increase);
  const decrease = useCartController((s) => s.decrease);
  const remove = useCartController((s) => s.remove);

  const router = useRouter();

  const { data: itens } = api.item.getByCategoria.useQuery(categoriaSelecionada);

  useEffect(() => {
    if (itens) {
      console.log(`Itens da categoria ${categoriaSelecionada}:`, itens);
    } else {
      console.log(categoriaSelecionada);
    }
  }, [itens, categoriaSelecionada]);

  const handleCallGarcom = () => {
    toast.success("Garçom chamado com sucesso!");
  };

  const handleFilterCategory = (categoria: Categoria) => {
    setCategoriaSelecionada(categoria);
  };

  const handleAddToCart = (item: ItemDTO) => {
    addItem({ id: item.id, nome: item.nome, preco: item.preco });
  };

  const total = useMemo(
    () => entries.reduce((acc, e) => acc + e.preco * e.quantidade, 0),
    [entries]
  );

  return {
    // estado
    categoriaSelecionada,
    itens: itens ?? [],
    carrinho: entries,
    total,
    // ações
    setCategoriaSelecionada,
    handleCallGarcom,
    handleFilterCategory,
    handleAddToCart,
    increaseQty: increase,
    decreaseQty: decrease,
    removeItem: remove,
    // navegação
    router,
  };
}
