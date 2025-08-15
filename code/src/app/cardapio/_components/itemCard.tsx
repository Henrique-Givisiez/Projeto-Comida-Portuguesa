// src/app/cardapio/_components/itemCard.tsx
"use client";

import Image from "next/image";

export type ItemDTO = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  imageURL: string;
};

type ItemCardProps = {
  item: ItemDTO;
  onAdd?: (item: ItemDTO) => void;
};

function formatPriceBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}


export default function ItemCard({ item, onAdd }: ItemCardProps) {
  return (
    <article
      className={`flex w-full items-stretch gap-4 rounded-xl bg-white shadow-sm ring-1 ring-zinc-200/70`}
      aria-labelledby={`item-${item.id}-title`}
    >
      {/* Imagem */}
      <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-l-xl md:h-44 md:w-56">
        <Image
          src={item.imageURL}
          alt={item.nome}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 160px, 220px"
          priority={false}
        />
      </div>

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3">
        <h3
          id={`item-${item.id}-title`}
          className="text-2xl font-serif text-zinc-900"
        >
          {item.nome}
        </h3>

        <p
          className="line-clamp-3 text-sm leading-relaxed text-zinc-700 md:line-clamp-none"
          title={item.descricao}
        >
          {item.descricao}
        </p>

        {/* Preço + ação */}
        <div className="mt-auto flex items-center justify-end gap-3">
          <span
            className="text-base font-semibold tracking-tight text-[#0600B2] md:text-lg"
            aria-label={`Preço ${formatPriceBRL(item.preco)}`}
          >
            {formatPriceBRL(item.preco)}
          </span>

          <button
            type="button"
            onClick={() => onAdd?.(item)}
            className="cursor-pointer inline-flex items-center rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/70 active:bg-amber-700"
            aria-label={`Adicionar ${item.nome}`}
          >
            + Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}
