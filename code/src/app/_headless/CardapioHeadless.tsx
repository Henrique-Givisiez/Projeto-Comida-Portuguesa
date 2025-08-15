// src/app/_headless/CardapioHeadless.tsx
"use client";
import { useCardapioController } from "../_controllers/useCardapioController";
import type { Categoria } from "@prisma/client";
type Props = {
  defaultCategoria?: Categoria;
  children: (ctrl: ReturnType<typeof useCardapioController>) => React.ReactNode;
};

export default function CardapioHeadless({ defaultCategoria = "ENTRADAS", children }: Props) {
  const ctrl = useCardapioController(defaultCategoria);
  return <>{children(ctrl)}</>;
}
