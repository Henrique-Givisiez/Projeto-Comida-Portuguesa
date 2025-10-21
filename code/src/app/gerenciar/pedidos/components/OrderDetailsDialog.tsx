// src/gerenciar/pedidos/components/OrderDetailsDialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import type { PedidoDTO } from "../types";
import { formatBRL } from "../utils/format";
import { totalPedido } from "../utils/totals";
import { timeSince } from "../utils/format";

export function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  order: PedidoDTO;
}) {
  const total = totalPedido(order);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pedido — Mesa {order.comanda.numeroMesa}</DialogTitle>
          <DialogDescription>
            Criado {timeSince(order.dataCriacao)} • Total {formatBRL(total)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {order.itens.map((it) => (
            <div key={it.id} className="flex items-start justify-between rounded-lg border p-3">
              <div>
                <div className="font-medium">
                  {it.quantidade}× {it.item.nome}
                </div>
                {it.observacao && <div className="text-sm text-neutral-500">Obs: {it.observacao}</div>}
              </div>
              <div className="font-medium">{formatBRL(it.quantidade * it.item.preco)}</div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
