"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, HandPlatter, ShoppingCart} from "lucide-react";
import React from "react";
import { EncerrarAtendimento } from "~/components/encerrarAtendimento";

export function NavBar() {
  const pathname = usePathname();
  
  const menuItems = [
    { name: "Chamados", href: "/gerenciar/chamados", icon: HandPlatter },
    { name: "Cardápio", href: "/gerenciar/cardapio", icon: FileText },
    { name: "Pedidos", href: "/gerenciar/pedidos", icon: ShoppingCart },
  ];

  return (
    <main>
      <div className="bg-white relative z-50 flex h-20 w-full items-center justify-between md:w-auto border-b border-gray-300/50 px-4 shadow-sm">
        <ul className="flex flex-row gap-10 text-xl font-medium">
          {menuItems.map((item, index) => (
            <li key={index} className="relative">
             <Link
                href={item.href}
                className={`
                    flex items-center px-3 py-3 rounded-lg transition-colors
                    font-normal
                    ${
                    pathname === item.href
                        ? "bg-[#FAA405] text-[#001332] shadow-md" // ativo
                        : "text-[#001332] hover:bg-[#FAA405]" // normal
                    }
                `}
                >
                <item.icon className="mr-2 w-5 h-5" />
                {item.name}
                </Link>
            </li>
          ))}
        </ul>
        <EncerrarAtendimento />
      </div>
    </main>
  );
}