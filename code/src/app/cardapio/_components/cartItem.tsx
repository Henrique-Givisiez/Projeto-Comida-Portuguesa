// src/app/cardapio/_components/cartItem.tsx
import { Minus, Plus, Trash2 } from "lucide-react";

export type CartEntry = {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
  observacao?: string;
};


type CartItemProps = {
  entry: CartEntry;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

export function CartItem({ entry, onIncrease, onDecrease, onRemove }: CartItemProps) {
  const subtotal = entry.preco * entry.quantidade;

  return (
    <div className="rounded-xl bg-blue-50/80 p-4 shadow-sm">
      {/* Topo: título + lixeira */}
      <div className="mb-3 flex items-start justify-between">
        <h2 className="max-w-[75%] truncate text-[15px] font-medium text-gray-900">
          {entry.nome}
        </h2>

        <button
          onClick={onRemove}
          className="cursor-pointer ml-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-red-600 hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-400"
          aria-label="Remover item"
          title="Remover item"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Base: quantidade à esquerda + preço à direita */}
      <div className="flex items-center justify-between">
        {/* Controles de quantidade */}
        <div className="inline-flex items-center gap-2">
          <button
            onClick={onDecrease}
            className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Diminuir quantidade"
            title="Diminuir quantidade"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="w-6 text-center font-medium tabular-nums">
            {entry.quantidade}
          </span>

          <button
            onClick={onIncrease}
            className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Aumentar quantidade"
            title="Aumentar quantidade"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Preço (subtotal) */}
        <div className="text-right">
          <span className="text-[17px] font-semibold text-[#0600B2]">
            R$ {subtotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
