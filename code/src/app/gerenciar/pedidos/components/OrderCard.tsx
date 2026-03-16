// src/gerenciar/pedidos/components/OrderCard.tsx
"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";
import { Eye, Clock, ChevronDown } from "lucide-react";
import type { PedidoDTO } from "../types";
import type { StatusPedido } from "@prisma/client";
import { formatBRL, timeSince } from "../utils/format";
import { totalPedido } from "../utils/totals";
import { OrderDetailsDialog } from "./OrderDetailsDialog";

function StatusPill({ status }: { status: StatusPedido }) {
  if (status === "EM_ANDAMENTO") return <Badge className="bg-amber-500/20 text-amber-700">Em Andamento</Badge>;
  if (status === "ENTREGUE") return <Badge className="bg-emerald-500/20 text-emerald-700">Entregue</Badge>;
  return <Badge className="bg-rose-500/20 text-rose-700">Cancelado</Badge>;
}

export function OrderCard({
  order,
  onChangeStatus,
  onRemoveItem,
}: {
  order: PedidoDTO;
  onChangeStatus: (next: StatusPedido) => void;
  onRemoveItem: (pedidoItemId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const total = totalPedido(order);

  return (
    <Card className="overflow-hidden border-neutral-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold">Mesa {order.comanda.numeroMesa}</CardTitle>
        <StatusPill status={order.status} />
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Clock className="h-4 w-4" />
          <span>{timeSince(order.dataCriacao)}</span>
        </div>
        <div className="pt-1 text-xl font-semibold">{formatBRL(total)}</div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <Button variant="outline" className="gap-2" onClick={() => setOpen(true)}>
          <Eye className="h-4 w-4" />
          Ver Detalhes
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="gap-2">
              Status
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onChangeStatus("EM_ANDAMENTO")}>Em Andamento</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeStatus("ENTREGUE")}>Entregue</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeStatus("CANCELADO")}>Cancelado</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>

      <OrderDetailsDialog open={open} onOpenChange={setOpen} order={order} onRemoveItem={onRemoveItem} />
    </Card>
  );
}
