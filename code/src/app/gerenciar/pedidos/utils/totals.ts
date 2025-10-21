// src/gerenciar/pedidos/utils/totals.ts
import type { PedidoDTO } from "../types";

export function totalPedido(p: PedidoDTO): number {
  return p.itens.reduce((acc: number, it: PedidoDTO["itens"][number]) => {
    return acc + it.quantidade * it.item.preco;
  }, 0);
}
