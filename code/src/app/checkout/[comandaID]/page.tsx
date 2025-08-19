// src/app/checkout/page.tsx
"use client";

import { useCartController } from "../../_controllers/useCartController";
import { ArrowLeft } from "lucide-react";

import { useRouter, useParams } from "next/navigation";
import { Textarea } from "../../_components/TextArea";
import Button from "../../_components/button";
import { api } from "~/utils/api";
import { useMemo } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();

  const entries = useCartController((s) => s.entries);
  const setObs = useCartController((s) => s.setObservacao);
  const clear = useCartController((s) => s.clear);

  const total = useMemo(
    () => entries.reduce((acc, e) => acc + e.preco * e.quantidade, 0),
    [entries]
  );

  const params = useParams<{ comandaID: string }>();
  const comandaId = params?.comandaID;
  
  const { data: comanda } = api.comanda.getByID.useQuery(comandaId);

  const clienteNome = comanda?.nomeCliente ?? "Cliente";
  const numeroMesa = comanda?.numeroMesa ?? 0;

  const createPedido = api.pedido.create.useMutation({
    onSuccess: () => {
      toast.success("Pedido enviado!");
      clear();
      router.push("/cardapio/" + comandaId);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Falha ao enviar o pedido.");
    },
  });

  const handleSendOrder = () => {
    if (entries.length === 0) {
      toast.error("Carrinho vazio.");
      return;
    }

    createPedido.mutate({
      comandaId: comandaId,
      itens: entries.map((e) => ({
        itemId: e.id,
        quantidade: e.quantidade,
        observacao: e.observacao ?? "",
      })),
    });
  };

  const formatBRL = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="max-w-xl mx-auto px-4 py-6 space-y-4">
        {/* Voltar */}
        <button
          onClick={() => router.push(`/cardapio/${comandaId}`)}
          className="text-md cursor-pointer text-[#6C7D93] hover:underline inline-flex items-center gap-1"
        >
          <span className=""><ArrowLeft/></span>Voltar
        </button>

        {/* Header do restaurante */}
        <div className="rounded-xl bg-[#001332] text-white px-5 py-4 shadow-sm">
          <h1 className="text-center text-sm sm:text-base font-bold">
            Comida Portuguesa Com Certeza
          </h1>

          <div className="mt-3 grid grid-cols-2 text-xs sm:text-sm gap-2">
            <div className="flex flex-col">
              <span className="opacity-70">Cliente:</span>
              <span className="font-bold">{clienteNome}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="opacity-70">Mesa:</span>
              <span className="font-bold">{numeroMesa}</span>
            </div>
          </div>
        </div>

        {/* Seção: Itens do Pedido */}
        <section className="space-y-3">
          <h2 className="text-md font-semibold tracking-wide">
            Itens do Pedido
          </h2>

          {entries.map((e) => (
            <div
              key={e.id}
              className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 pr-3">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {e.nome}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Qtd: {e.quantidade}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatBRL(e.preco * e.quantidade)}
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <Textarea
                  placeholder="Observações"
                  value={e.observacao ?? ""}
                  onChange={(ev) => setObs(e.id, ev.target.value)}
                  className="min-h-[64px] border-gray-200 text-sm"
                />
              </div>
            </div>
          ))}

          {/* Barra de Total */}
          <div className="rounded-lg border-2 border-[#FAA405] bg-white px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">
              Total do Pedido
            </span>
            <span className="text-base sm:text-lg font-extrabold text-[#FAA405]">
              {formatBRL(total)}
            </span>
          </div>
        </section>

        {/* Botão Enviar Pedido */}
        <div className="pt-1">
          <Button
            variant="restaurant"
            size="md"
            className="w-full h-11 text-sm sm:text-base font-bold rounded-lg hover:brightness-95 text-[#001332] shadow-md"
            onClick={handleSendOrder}
            disabled={entries.length === 0 || createPedido.isPending}
          >
            Enviar Pedido
          </Button>
        </div>
      </div>
    </div>
  );
}
