// src/app/_headless/CardapioHeadless.tsx
"use client";
import { useCardapioController } from "../_controllers/useCardapioController";

type Props = {
  defaultCategoria?: any;
  children: (ctrl: ReturnType<typeof useCardapioController>) => React.ReactNode;
};

export default function CardapioHeadless({ defaultCategoria, children }: Props) {
  const ctrl = useCardapioController(defaultCategoria);
  return <>{children(ctrl)}</>;
}
