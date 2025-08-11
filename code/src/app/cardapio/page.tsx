'use client'
import { Beef, BottleWine, Fish, HandPlatter, House, IceCreamBowl, Soup } from "lucide-react";
import { useState, useEffect } from "react";
import { ItemsList } from "./_components/itemList";
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

export default function CategoriasSidebar() {
    // Categoria inicial padrão
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<Categoria>("ENTRADAS");

    // Query do tRPC já executa com a categoria selecionada
    const { data: itens, isFetching, isError } = api.item.getByCategoria.useQuery(categoriaSelecionada);

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
          <ItemsList categoria={categoriaSelecionada}/>
        {/* <Sidebar
            size="lg"
            className="bg-gray-50 relative flex flex-col h-screen"
            style={{ backgroundColor: "rgba(255, 227, 212)" }}
            >
            <div>
            </div>
        </Sidebar> */}
      </div>
    );
}
