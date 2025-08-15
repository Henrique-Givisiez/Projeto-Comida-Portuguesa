//src/app/_controllers/useCardapioController.tsx
'use client'
import { type CartEntry } from "../cardapio/_components/cartItem";
import { type ItemDTO } from "../cardapio/_components/itemCard";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { api } from '~/utils/api';
import { toast } from "sonner";

type Categoria =
  | "ENTRADAS"
  | "PRATOS_CASA"
  | "PEIXES"
  | "CARNES"
  | "BEBIDAS"
  | "SOBREMESAS";

export function useCardapioController(defaultCategoria: Categoria = "ENTRADAS") {
        // Categoria inicial padrão
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria>(defaultCategoria);
    const [carrinho, setCarrinho] = useState<CartEntry[]>([]);

    const router = useRouter();
    
    // Query do tRPC já executa com a categoria selecionada
    const { data: itens } = api.item.getByCategoria.useQuery(categoriaSelecionada);

    // Sempre que os itens mudarem, mostramos no console
    useEffect(() => {
        if (itens) {
        console.log(`Itens da categoria ${categoriaSelecionada}:`, itens);
        } else {
            console.log(categoriaSelecionada);
        }
    }, [itens, categoriaSelecionada]);

    const handleCallGarcom = () => {
      toast.success("Garçom chamado com sucesso!");
    }
    const handleFilterCategory = (categoria: Categoria) => {
        setCategoriaSelecionada(categoria);
    };

    const handleAddToCart = (item: ItemDTO) => {
      setCarrinho((prev) => {
        const idx = prev.findIndex((e) => e.id === item.id);
        // 1) Se já existe no carrinho: atualiza a quantidade (usando o array retornado pelo map)
        if (idx !== -1) {
          return prev.map((e, i) =>
            i === idx ? { ...e, quantidade: e.quantidade + 1 } : e
          );
        }

        // 2) Se é novo: monta um CartEntry e adiciona
        const entry: CartEntry = {
          id: item.id,
          nome: item.nome,
          preco: item.preco,
          quantidade: 1,
        };

        return [...prev, entry];
      })
    };

    // Aumentar/diminuir/remover
    const increaseQty = (id: string) => {
      setCarrinho((prev) =>
        prev.map((e) => (e.id === id ? { ...e, quantidade: e.quantidade + 1 } : e))
      );
    };

    const decreaseQty = (id: string) => {
      setCarrinho((prev) =>
        prev
          .map((e) => (e.id === id ? { ...e, quantidade: e.quantidade - 1 } : e))
          .filter((e) => e.quantidade > 0) // remove se chegar a 0
      );
    };

    const removeItem = (id: string) => {
      setCarrinho((prev) => prev.filter((e) => e.id !== id));
    };

    const total = useMemo(
        () => carrinho.reduce((acc, e) => acc + e.preco * e.quantidade, 0),
        [carrinho]
    );


    return {
        //estado
        categoriaSelecionada,
        itens: itens ?? [],
        carrinho,
        total,
        //ações
        setCategoriaSelecionada,
        setCarrinho,
        handleCallGarcom,
        handleFilterCategory,
        handleAddToCart,
        increaseQty,
        decreaseQty,
        removeItem,
        //navegacao
        router,
    }
}