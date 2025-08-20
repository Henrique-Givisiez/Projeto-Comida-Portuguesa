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
      className={`
        flex w-full flex-col overflow-hidden rounded-xl bg-white
        shadow-sm ring-1 ring-zinc-200/70
        md:flex-row md:items-stretch md:gap-4
      `}
      aria-labelledby={`item-${item.id}-title`}
    >
      {/* Imagem */}
      <div className="relative h-40 w-full flex-shrink-0 md:h-44 md:w-56">
        <Image
          src={item.imageURL}
          alt={item.nome}
          fill
          className="object-cover"
          // no mobile, imagem usa a largura total do card
          sizes="(max-width: 768px) 100vw, 220px"
          priority={false}
        />
      </div>

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-3">
        <h3
          id={`item-${item.id}-title`}
          className="font-serif text-lg text-zinc-900 md:text-2xl"
        >
          {item.nome}
        </h3>

        <p
          className="line-clamp-2 text-sm leading-relaxed text-zinc-700 md:line-clamp-none"
          title={item.descricao}
        >
          {item.descricao}
        </p>

        {/* Preço + ação */}
        <div className="mt-2 flex items-center gap-3 md:mt-auto md:justify-end">
          <span
            className="text-base font-semibold tracking-tight text-[#0600B2] md:text-lg"
            aria-label={`Preço ${formatPriceBRL(item.preco)}`}
          >
            {formatPriceBRL(item.preco)}
          </span>

          <button
            type="button"
            onClick={() => onAdd?.(item)}
            className={`
              cursor-pointer ml-auto rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-black
              transition hover:bg-amber-600 focus:outline-none
              focus-visible:ring-2 focus-visible:ring-amber-600/70 active:bg-amber-700
              md:ml-0
            `}
            aria-label={`Adicionar ${item.nome}`}
          >
            + Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}
