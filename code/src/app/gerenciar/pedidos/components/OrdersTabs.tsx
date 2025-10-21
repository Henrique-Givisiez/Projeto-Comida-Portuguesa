// src/gerenciar/pedidos/components/OrdersTabs.tsx
"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import { OrderCard } from "./OrderCard";
import type { GroupedPedidos } from "../types";
import type { StatusPedido } from "@prisma/client";

export function OrdersTabs({
  active,
  onChange,
  grouped,
  onChangeStatus,
  onRemoveItem,
  isLoading,
}: {
  active: StatusPedido;
  onChange: (t: StatusPedido) => void;
  grouped: GroupedPedidos;
  onChangeStatus: (id: string, next: StatusPedido) => void;
  onRemoveItem: (pedidoItemId: string) => void;
  isLoading: boolean;
}) {
  return (
    <Tabs value={active} onValueChange={(v) => onChange(v as StatusPedido)}>
      <TabsList className="bg-transparent p-0">
        <TabsTrigger value="EM_ANDAMENTO" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
          Em Andamento
        </TabsTrigger>
        <TabsTrigger value="ENTREGUE" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
          Entregues
        </TabsTrigger>
        <TabsTrigger value="CANCELADO" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white">
          Cancelados
        </TabsTrigger>
      </TabsList>

      <TabsContent value={active} className="mt-6">
        {isLoading ? (
          <div className="rounded-lg border border-dashed p-10 text-center text-neutral-500">Carregando pedidos...</div>
        ) : grouped[active].length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center text-neutral-500">Nenhum pedido aqui.</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {grouped[active].map((p) => (
              <OrderCard key={p.id} order={p} onChangeStatus={(next) => onChangeStatus(p.id, next)} onRemoveItem={onRemoveItem} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
