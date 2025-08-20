// src/app/cardapio/_components/Layouts/CardapioMobile.tsx
"use client";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "../../../_components/dialog";
import { Beef, BottleWine, Fish, HandPlatter, House, IceCreamBowl, Soup, ShoppingCart, CircleCheck } from "lucide-react";
import CardapioHeadless from "../../../_headless/CardapioHeadless";
import Button from "../../../_components/button";
import { ItemsList } from "../itemList";
import { CartItem } from "../cartItem";
import { useState } from "react";
import { useParams } from "next/navigation";

const CATEGORIES = [
  { key: "ENTRADAS", label: "Entradas", icon: Soup },
  { key: "PRATOS_CASA", label: "Pratos da Casa", icon: House },
  { key: "PEIXES", label: "Peixes", icon: Fish },
  { key: "CARNES", label: "Carnes", icon: Beef },
  { key: "BEBIDAS", label: "Bebidas", icon: BottleWine },
  { key: "SOBREMESAS", label: "Sobremesas", icon: IceCreamBowl },
] as const;

export default function CardapioMobile() {
  const [cartOpen, setCartOpen] = useState(false);
  const params = useParams<{ comandaID: string }>();
  const comandaId = params.comandaID;

  return (
    <CardapioHeadless>
      {(ctrl) => (
        <div className="flex h-dvh min-h-screen flex-col bg-[#F5F5F5]">
          {/* Categorias (chips horizontais) */}
          <nav className="sticky z-10 border-b bg-[rgba(255,227,212,0.92)] px-3 py-2 backdrop-blur">
            <div className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto py-1">
              {CATEGORIES.map(({ key, label, icon: Icon }) => {
                const active = ctrl.categoriaSelecionada === key;
                return (
                  <button
                    key={key}
                    onClick={() => ctrl.handleFilterCategory(key)}
                    className={[
                      "snap-start inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-2 text-sm",
                      active
                        ? "border-transparent bg-[#FAA405] text-white"
                        : "bg-white hover:bg-[#fff3e0]",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                  
                );
              })}
              <button
                className="bg-white hover:bg-[#fff3e0] snap-start inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-2 text-sm"
                onClick={() => ctrl.handleCallGarcom(comandaId)}
                title="Chamar garçom"
              >
                <HandPlatter className="mr-2 h-4 w-4" />
                Chamar Garçom
            </button>
            </div>
          </nav>

          {/* Conteúdo principal (lista de itens) */}
          <main className="relative flex-1 overflow-y-auto px-3 pb-28 pt-3">
            <ItemsList
              categoria={ctrl.categoriaSelecionada}
              onAddItem={ctrl.handleAddToCart}
            />
          </main>

          {/* Rodapé com botão do carrinho */}
          <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
            {/* gradiente para leitura do total */}
            <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-[rgba(245,245,245,1)] to-transparent" />
            <div className="pointer-events-auto border-t bg-white/95 p-3 backdrop-blur">
              <Dialog open={cartOpen} onOpenChange={setCartOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="checkout"
                    size="lg"
                    className="flex w-full items-center justify-center gap-3"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Meu Pedido
                    <span className="rounded-full bg-white/30 px-2 py-0.5 text-xs font-bold">
                      {ctrl.carrinho.length}
                    </span>
                    <span className="ml-auto font-bold tabular-nums">
                      R$ {ctrl.total.toFixed(2)}
                    </span>
                  </Button>
                </DialogTrigger>

                {/* Drawer do carrinho */}
                <DialogContent
                  className="fixed inset-x-0 bottom-0 z-50
                              w-full max-h-[85dvh]
                              rounded-t-2xl bg-white p-0 shadow-2xl
                              overflow-hidden
                              flex flex-col"
                >
                   <DialogHeader className="flex-none border-b bg-white px-4 py-3">
                      <DialogTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Meu Pedido
                      </DialogTitle>
                    </DialogHeader>

                {/* ÁREA ROLÁVEL (única!) */}
                <div
                  className="
                    flex-1 min-h-0
                    overflow-y-auto
                    px-4 py-3
                    overscroll-contain
                    touch-pan-y
                    [-webkit-overflow-scrolling:touch]
                    [scrollbar-gutter:stable]
                  "
                >
                  {ctrl.carrinho.length === 0 ? (
                    <p className="py-8 text-center text-sm text-gray-500">
                      Seu carrinho está vazio.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {ctrl.carrinho.map((entry) => (
                        <CartItem
                          key={entry.id}
                          entry={entry}
                          onIncrease={() => ctrl.increaseQty(entry.id)}
                          onDecrease={() => ctrl.decreaseQty(entry.id)}
                          onRemove={() => ctrl.removeItem(entry.id)}
                        />
                      ))}
                    </ul>
                  )}
                </div>

                {/* Footer (fixo por estar fora da área rolável) */}
                <div className="flex-none space-y-3 border-t bg-white px-4 py-3">
                  <div className="flex items-center justify-between text-base font-semibold">
                    <span>Total</span>
                    <span className="tabular-nums text-[#0600B2]">
                      R$ {ctrl.total.toFixed(2)}
                    </span>
                  </div>
                  <Button
                    variant="checkout"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      setCartOpen(false);
                      ctrl.router.push(`/checkout/${comandaId}`);
                    }}
                  >
                    <CircleCheck className="mr-2 h-5 w-5" />
                    Finalizar Pedido
                  </Button>
                </div>
              </DialogContent>
              </Dialog>
            </div>
          </footer>
        </div>
      )}
    </CardapioHeadless>
  );
}
