'use client'
import { Beef, BottleWine, Fish, HandPlatter, House, IceCreamBowl, Soup } from "lucide-react";
import Sidebar from "./_components/sidebar";
import Button from "../_components/button";
import { api } from '~/utils/api';
import { useState, useEffect } from "react";

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
        <Sidebar
            position="right"
            size="lg"
            className="bg-gray-50 relative" // ✅ relative para posicionamento absoluto interno
            style={{ backgroundColor: "rgba(255, 227, 212, 0.86)" }}
        >
            {/* Conteúdo rolável */}
            <div className="flex flex-col h-full overflow-y-auto"> 
                <img src="Logo.png" alt="Logo" className="w-full" />

                <nav className="flex flex-col gap-2 w-full">
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
            </div>

            {/* Botão fixo no rodapé */}
            <div className="absolute bottom-3 left-0 w-full p-5">
                <Button
                  variant="restaurant"
                  size="md"
                  className="flex justify-start w-full h-14 text-md"
                >
                  <HandPlatter className="mr-4" /> Chamar Garçom
                </Button>
            </div>
        </Sidebar>
        
    );
}
