// src/app/_controllers/useCartController.tsx
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type CartEntry } from "../cardapio/_components/cartItem";

type CartState = {
  entries: CartEntry[];
  addItem: (item: Omit<CartEntry, "quantidade" | "observacao">) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  remove: (id: string) => void;
  setObservacao: (id: string, obs: string) => void;
  clear: () => void;
};

export const useCartController = create<CartState>()(
  persist(
    (set, _ ) => ({
      entries: [],
      addItem: (item) =>
        set((state) => {
            let found = false;

            const updated = state.entries.map((e) => {
            if (e.id === item.id) {
                found = true;
                return { ...e, quantidade: e.quantidade + 1 };
            }
            return e;
            });

            return {
            entries: found
                ? updated
                : [...state.entries, { ...item, quantidade: 1 }],
            };
        }),
      increase: (id) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, quantidade: e.quantidade + 1 } : e
          ),
        })),
      decrease: (id) =>
        set((state) => ({
          entries: state.entries
            .map((e) =>
              e.id === id ? { ...e, quantidade: e.quantidade - 1 } : e
            )
            .filter((e) => e.quantidade > 0),
        })),
      remove: (id) =>
        set((state) => ({ entries: state.entries.filter((e) => e.id !== id) })),
      setObservacao: (id, obs) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, observacao: obs } : e
          ),
        })),
      clear: () => set({ entries: [] }),
    }),
    {
      name: "cpc-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
