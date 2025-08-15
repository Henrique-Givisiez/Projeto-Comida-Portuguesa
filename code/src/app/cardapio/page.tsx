'use client'
import { Beef, BottleWine, Fish, HandPlatter, House, IceCreamBowl, Soup, ShoppingCart } from "lucide-react";
import { ItemsList } from "./_components/itemList";
import { type ItemDTO } from "./_components/itemCard";
import { CartItem , type CartEntry } from "./_components/cartItem";
import { useState, useEffect } from "react";
import Sidebar from "./_components/sidebar";
import Button from "../_components/button";
import { api } from '~/utils/api';

type Categoria =
  | "ENTRADAS"
  | "PRATOS_CASA"
  | "PEIXES"
  | "CARNES"
  | "BEBIDAS"
  | "SOBREMESAS";

export default function Cardapio() {
    // Categoria inicial padrão
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria>("ENTRADAS");
    const [carrinho, setCarrinho] = useState<CartEntry[]>([]);

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

    const total = carrinho.reduce((acc, e) => acc + e.preco * e.quantidade, 0);

    return (
      <div className="flex bg-[#F5F5F5]">
        <Sidebar
            size="lg"
            className="bg-gray-50 relative flex flex-col h-screen"
            style={{ backgroundColor: "rgba(255, 227, 212)" }}
            >
              {/* Header fixo (logo) */}
            <div className="sticky top-0 z-10 bg-[rgba(255,227,212)]">
                <img src="Logo.png" alt="Logo Comida Portuguesa com Certeza" className="w-full" />
            </div>

                <nav className="flex-1 min-h-0 overflow-y-auto px-0 py-2 flex flex-col gap-2">
                    <Button 
                      variant="restaurant"
                      size="md" 
                      className={`flex justify-start w-full h-14 text-md hover:bg-[#FAA405] transition-colors duration-300 ease-in-out
                      ${categoriaSelecionada === "ENTRADAS" ? "bg-[#FAA405]" : "bg-transparent"}`} 
                      onClick={() => handleFilterCategory("ENTRADAS")}
                      >
                      <Soup className="mr-4" /> Entradas
                    </Button>
                    <Button 
                      variant="restaurant" 
                      size="md" 
                      className={`flex justify-start w-full h-14 text-md hover:bg-[#FAA405] transition-colors duration-300 ease-in-out
                      ${categoriaSelecionada === "PRATOS_CASA" ? "bg-[#FAA405]" : "bg-transparent"}`}
                      onClick={() => handleFilterCategory("PRATOS_CASA")}
                      >
                      <House className="mr-4" /> Pratos da Casa
                    </Button>
                    <Button 
                      variant="restaurant" 
                      size="md" 
                      className={`flex justify-start w-full h-14 text-md hover:bg-[#FAA405] transition-colors duration-300 ease-in-out
                      ${categoriaSelecionada === "PEIXES" ? "bg-[#FAA405]" : "bg-transparent"}`}
                      onClick={() => handleFilterCategory("PEIXES")}
                       >
                      <Fish className="mr-4" /> Peixes
                    </Button>
                    <Button 
                      variant="restaurant" 
                      size="md" 
                      className={`flex justify-start w-full h-14 text-md hover:bg-[#FAA405] transition-colors duration-300 ease-in-out
                      ${categoriaSelecionada === "CARNES" ? "bg-[#FAA405]" : "bg-transparent"}`}
                      onClick={() => handleFilterCategory("CARNES")}
                    >
                      <Beef className="mr-4" /> Carnes
                    </Button>
                    <Button 
                      variant="restaurant" 
                      size="md" 
                      className={`flex justify-start w-full h-14 text-md hover:bg-[#FAA405] transition-colors duration-300 ease-in-out
                      ${categoriaSelecionada === "BEBIDAS" ? "bg-[#FAA405]" : "bg-transparent"}`}
                      onClick={() => handleFilterCategory("BEBIDAS")}
                    >
                      <BottleWine className="mr-4" /> Bebidas
                    </Button>
                    <Button 
                        variant="restaurant" 
                        size="md" 
                        className={`flex justify-start w-full h-14 text-md hover:bg-[#FAA405] transition-colors duration-300 ease-in-out
                        ${categoriaSelecionada === "SOBREMESAS" ? "bg-[#FAA405]" : "bg-transparent"}`}
                        onClick={() => handleFilterCategory("SOBREMESAS")}
                    >
                        <IceCreamBowl className="mr-4" /> Sobremesas
                    </Button>
                </nav>

            {/* Botão fixo no rodapé */}
            <div className="sticky bottom-0 left-0 w-full p-5 bg-[rgba(255,227,212,0.86)] relative
          before:content-[''] before:pointer-events-none
          before:absolute before:inset-x-0 before:-top-px before:h-4
          before:bg-gradient-to-t
          before:from-[rgba(255,227,212,0.86)]
          before:to-transparent">
                <Button
                  variant="restaurant"
                  size="md"
                  className="flex justify-start w-full h-14 text-md"
                >
                  <HandPlatter className="mr-4" /> Chamar Garçom
                </Button>
            </div>
        </Sidebar>
          <ItemsList categoria={categoriaSelecionada} onAddItem={handleAddToCart}/>
        {/* Sidebar do carrinho */}
        {carrinho.length > 0 && (
          <Sidebar size="lg" className="px-5 flex flex-col">
            {/* Header (fixo, fora da área rolável) */}
            <div
              className="bg-white sticky top-0 z-10 flex items-center justify-center h-12 sm:h-16 md:h-20 border-b"
              style={{ borderColor: "rgba(0,0,0,0.17)" }}
            >
              <ShoppingCart className="mr-4 w-8 h-8" />
              <h1 className="text-3xl font-serif">Meu Pedido</h1>
            </div>

            {/* Lista rolável */}
            <div className="relative flex-1 min-h-0 overflow-y-auto py-3 space-y-4">
              {/* Fader no topo para sumir suavemente ao passar sob o header */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white to-transparent" />

              {/* Fader no rodapé da lista para suavizar antes do total */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white to-transparent" />

                {carrinho.map((entry) => (
                  <CartItem
                    key={entry.id}
                    entry={entry}
                    onIncrease={() => increaseQty(entry.id)}
                    onDecrease={() => decreaseQty(entry.id)}
                    onRemove={() => removeItem(entry.id)}
                  />
                ))}
            </div>

            {/* Total */}
            <div className="sticky bottom-0 left-0 right-0 border-t py-4 space-y-3 bg-white">
              <p className="text-lg font-semibold">
                Total: <span className="tabular-nums">R$ {total.toFixed(2)}</span>
              </p>
              <Button
                variant="restaurant"
                size="md"
                className="w-full h-12 text-md"
                // onClick={() => ... navegar para checkout / enviar pedido }
              >
                Finalizar Pedido
              </Button>
            </div>
          </Sidebar>
        )}
      </div>
    );
}
