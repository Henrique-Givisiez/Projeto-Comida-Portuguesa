// app/gerenciar/pedidos/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { NavBar } from "~/app/_components/navbar";
import { api } from "~/trpc/react";
import { StatusPedido, type Pedido } from "@prisma/client";
import {
  Tabs, TabsList, TabsTrigger, TabsContent,
} from "~/components/ui/tabs";
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "~/components/ui/dialog";
import { Eye, Clock, ChevronDown, Power } from "lucide-react";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { RSC_PREFETCH_SUFFIX } from "next/dist/lib/constants";

// Tipagem correta do output do router:
type R = inferRouterOutputs<AppRouter>;
type PedidoDTO = R["pedido"]["getByParam"][number];

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function timeSince(dateIso: string | Date) {
  const base = typeof dateIso === "string" ? new Date(dateIso) : dateIso;
  const diffMs = Date.now() - base.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "agora mesmo";
  if (mins < 60) return `há cerca de ${mins} min`;
  const h = Math.floor(mins / 60);
  return `há cerca de ${h} ${h === 1 ? "hora" : "horas"}`;
}
function StatusPill({ status }: { status: StatusPedido }) {
  if (status === "EM_ANDAMENTO")
    return <Badge className="bg-amber-500/20 text-amber-700">Em Andamento</Badge>;
  if (status === "ENTREGUE")
    return <Badge className="bg-emerald-500/20 text-emerald-700">Entregue</Badge>;
  return <Badge className="bg-rose-500/20 text-rose-700">Cancelado</Badge>;
}

// Anote o tipo do parâmetro:
function totalPedido(p: PedidoDTO): number {
  return p.itens.reduce((acc: number, it: PedidoDTO["itens"][number]) => {
    return acc + it.quantidade * it.item.preco;
  }, 0);
}

export default function PedidosPage() {
  const [active, setActive] = useState<StatusPedido>("EM_ANDAMENTO");

  // Busca todos os pedidos de HOJE (router já ordena asc)
  // dentro de PedidosPage()
  const hoje = useMemo(() => new Date(), []); // mesma instância enquanto o componente vive

  const {
    data: pedidos = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = api.pedido.getByParam.useQuery(
    { dataCriacao: hoje },
    {
      refetchOnMount: "always",
      refetchOnWindowFocus: false,
      staleTime: 0,
      networkMode: "always",
    }
  );

  useEffect(() => {
    if (error) {
      // error já é tipado pelo hook
      console.error("[tRPC] erro getByParam:", error);
    }
  }, [error]);

  useEffect(() => {
    // pedidos já é PedidoDTO[] por causa do fallback = []
    console.log("[tRPC] sucesso getByParam:", pedidos.length);
  }, [pedidos]);
  
  const utils = api.useUtils();
  const updateStatus = api.pedido.update.useMutation({
    onSuccess: async () => {
      await utils.pedido.getByParam.invalidate({ dataCriacao: new Date() });
    },
  });


  // 2) Tipar o agrupamento explicitamente
  const grouped = useMemo<Record<StatusPedido, PedidoDTO[]>>(() => {
    return {
      EM_ANDAMENTO: pedidos.filter((p) => p.status === "EM_ANDAMENTO"),
      ENTREGUE: pedidos.filter((p) => p.status === "ENTREGUE"),
      CANCELADO: pedidos.filter((p) => p.status === "CANCELADO"),
    };
  }, [pedidos]);

  const canClose = (grouped.EM_ANDAMENTO.length ?? 0) === 0;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <NavBar />

      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6">
        <Tabs value={active} onValueChange={(v) => setActive(v as StatusPedido)}>
          <TabsList className="bg-transparent p-0 gap-4">
            <TabsTrigger value="EM_ANDAMENTO" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white cursor-pointer">
              Em Andamento
            </TabsTrigger>
            <TabsTrigger value="ENTREGUE" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white cursor-pointer">
              Entregues
            </TabsTrigger>
            <TabsTrigger value="CANCELADO" className="data-[state=active]:bg-rose-600 data-[state=active]:text-white cursor-pointer">
              Cancelados
            </TabsTrigger>
          </TabsList>

          <TabsContent value={active} className="mt-6">
            {isLoading ? (
              <div className="rounded-lg border border-dashed p-10 text-center text-neutral-500">
                Carregando pedidos...
              </div>
            ) : grouped[active].length === 0 ? (
              <div className="rounded-lg border border-dashed p-10 text-center text-neutral-500">
                Nenhum pedido aqui.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {grouped[active].map((p) => (
                  <OrderCard
                    key={p.id}
                    order={p}
                    onChangeStatus={(next) =>
                      updateStatus.mutate({ id: p.id, status: next })
                    }
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// -------------------- Card --------------------
function OrderCard({
  order,
  onChangeStatus,
}: {
  order: PedidoDTO;
  onChangeStatus: (next: StatusPedido) => void;
}) {
  const [open, setOpen] = useState(false);
  const total = totalPedido(order);

  return (
    <Card className="overflow-hidden border-neutral-200 bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold">
          Mesa {order.comanda.numeroMesa}
        </CardTitle>
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
            <DropdownMenuItem onClick={() => onChangeStatus("EM_ANDAMENTO")}>
              Em Andamento
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeStatus("ENTREGUE")}>
              Entregue
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeStatus("CANCELADO")}>
              Cancelado
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>

      <Dialog open={open} onOpenChange={setOpen}>
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
                  {it.observacao && (
                    <div className="text-sm text-neutral-500">Obs: {it.observacao}</div>
                  )}
                </div>
                <div className="font-medium">
                  {formatBRL(it.quantidade * it.item.preco)}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
