// src/gerenciar/pedidos/components/OrderDetailsDialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import type { PedidoDTO } from "../types";
import { formatBRL, timeSince } from "../utils/format";
import { totalPedido } from "../utils/totals";

export function OrderDetailsDialog({
  open,
  onOpenChange,
  order,
  onRemoveItem, // ⬅ novo prop
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  order: PedidoDTO;
  onRemoveItem: (pedidoItemId: string) => void;
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
              <div className="pr-3">
                <div className="font-medium">
                  {it.quantidade}× {it.item.nome}
                </div>
                {it.observacao && (
                  <div className="text-sm text-neutral-500">Obs: {it.observacao}</div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="font-medium">{formatBRL(it.quantidade * it.item.preco)}</div>

                {/* Botão Excluir com confirmação */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon" aria-label="Excluir item">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir item?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação remove o item deste pedido. Não é possível desfazer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onRemoveItem(it.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Remover
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
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
