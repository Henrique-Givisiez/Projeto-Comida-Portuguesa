//src/app/cardapio/_components/Layouts/CardapioDesktop.tsx
import { Beef, BottleWine, Fish, HandPlatter, House, IceCreamBowl, Soup, ShoppingCart, CircleCheck } from "lucide-react";
import CardapioHeadless from "../../../_headless/CardapioHeadless";
import Button from "../../../_components/button";
import { ItemsList } from "../itemList";
import { CartItem } from "../cartItem";
import Sidebar from "../sidebar";
import Image from "next/image";

export default function CardapioDesktop() {
    return (
      <CardapioHeadless>
        {(ctrl) => (
              <div className="flex bg-[#F5F5F5]">
                <Sidebar
                    size="lg"
                    className="bg-gray-50 relative flex flex-col h-screen"
                    style={{ backgroundColor: "rgba(255, 227, 212)" }}
                    >
                      {/* Header fixo (logo) */}
                    <div className="sticky top-0 z-10 bg-[rgba(255,227,212)]">
                        <Image src="/Logo.png" alt="Logo Comida Portuguesa com Certeza" width={300} height={60} className="h-auto w-full" />
                    </div>
        
                        <nav className="flex-1 min-h-0 overflow-y-auto px-0 py-2 flex flex-col gap-2">
                            <Button 
                              variant="restaurant"
                              size="md" 
                              className={`flex justify-start w-full h-14 text-md hover:bg-[#FAA405] transition-colors duration-300 ease-in-out
                              ${ctrl.categoriaSelecionada === "ENTRADAS" ? "bg-[#FAA405]" : "bg-transparent"}`} 
                              onClick={() => ctrl.handleFilterCategory("ENTRADAS")}
                              >
                              <Soup className="mr-4" /> Entradas
                            </Button>
                            <Button 
                              variant="restaurant" 
                              size="md" 
                              className={`flex justify-start w-full h-14 text-md hover:bg-[#FAA405] transition-colors duration-300 ease-in-out
                              ${ctrl.categoriaSelecionada === "PRATOS_CASA" ? "bg-[#FAA405]" : "bg-transparent"}`}
                              onClick={() => ctrl.handleFilterCategory("PRATOS_CASA")}
                              >
                              <House className="mr-4" /> Pratos da Casa
                            </Button>
                            <Button 
                              variant="restaurant" 
                              size="md" 
                              className={`flex justify-start w-full h-14 text-md hover:bg-[#FAA405] transition-colors duration-300 ease-in-out
                              ${ctrl.categoriaSelecionada === "PEIXES" ? "bg-[#FAA405]" : "bg-transparent"}`}
                              onClick={() => ctrl.handleFilterCategory("PEIXES")}
                               >
                              <Fish className="mr-4" /> Peixes
                            </Button>
                            <Button 
                              variant="restaurant" 
                              size="md" 
                              className={`flex justify-start w-full h-14 text-md hover:bg-[#FAA405] transition-colors duration-300 ease-in-out
                              ${ctrl.categoriaSelecionada === "CARNES" ? "bg-[#FAA405]" : "bg-transparent"}`}
                              onClick={() => ctrl.handleFilterCategory("CARNES")}
                            >
                              <Beef className="mr-4" /> Carnes
                            </Button>
                            <Button 
                              variant="restaurant" 
                              size="md" 
                              className={`flex justify-start w-full h-14 text-md hover:bg-[#FAA405] transition-colors duration-300 ease-in-out
                              ${ctrl.categoriaSelecionada === "BEBIDAS" ? "bg-[#FAA405]" : "bg-transparent"}`}
                              onClick={() => ctrl.handleFilterCategory("BEBIDAS")}
                            >
                              <BottleWine className="mr-4" /> Bebidas
                            </Button>
                            <Button 
                                variant="restaurant" 
                                size="md" 
                                className={`flex justify-start w-full h-14 text-md hover:bg-[#FAA405] transition-colors duration-300 ease-in-out
                                ${ctrl.categoriaSelecionada === "SOBREMESAS" ? "bg-[#FAA405]" : "bg-transparent"}`}
                                onClick={() => ctrl.handleFilterCategory("SOBREMESAS")}
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
                          onClick={ctrl.handleCallGarcom}
                        >
                          <HandPlatter className="mr-4" /> Chamar Garçom
                        </Button>
                    </div>
                </Sidebar>
                  <ItemsList categoria={ctrl.categoriaSelecionada} onAddItem={ctrl.handleAddToCart}/>
                {/* Sidebar do carrinho */}
                {ctrl.carrinho.length > 0 && (
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
        
                        {ctrl.carrinho.map((entry) => (
                          <CartItem
                            key={entry.id}
                            entry={entry}
                            onIncrease={() => ctrl.increaseQty(entry.id)}
                            onDecrease={() => ctrl.decreaseQty(entry.id)}
                            onRemove={() => ctrl.removeItem(entry.id)}
                          />
                        ))}
                    </div>
        
                    {/* Total */}
                    <div className="sticky bottom-0 left-0 right-0 border-t py-4 space-y-3 bg-white">
                      <div className="flex items-center justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span className="tabular-nums text-[#0600B2]">R$ {ctrl.total.toFixed(2)}</span>
                      </div>
                      <Button
                        variant="checkout"
                        size="xl"
                        className="w-full h-12 text-md font-bold"
                        onClick={() => ctrl.router.push('/checkout') }
                      >
                        <CircleCheck className="mr-4 w-8 h-8" />
                        Finalizar Pedido
                      </Button>
                    </div>
                  </Sidebar>
                )}
              </div>
        )}
      </CardapioHeadless>
    );
}