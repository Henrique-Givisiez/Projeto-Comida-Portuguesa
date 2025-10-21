// src/app/gerenciar/pedidos/page.tsx
"use client";

import { useState } from "react";
import { NavBar } from "~/app/_components/navbar";
import { StatusPedido } from "@prisma/client";
import { OrdersHeader } from "./components/OrdersHeader";
import { OrdersTabs } from "./components/OrdersTabs";
import { useStableToday } from "./hooks/useStableToday";
import { usePedidosHoje } from "./hooks/usePedidosHoje";

export default function PedidosPage() {
  const [active, setActive] = useState<StatusPedido>("EM_ANDAMENTO");
  const hoje = useStableToday();
  const { grouped, isLoading, setStatus } = usePedidosHoje(hoje);

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <NavBar />
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6">
        <OrdersHeader />
        <OrdersTabs
          active={active}
          onChange={setActive}
          grouped={grouped}
          isLoading={isLoading}
          onChangeStatus={setStatus}
        />
      </div>
    </div>
  );
}
