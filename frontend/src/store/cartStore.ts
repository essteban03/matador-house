"use client";

import { create } from "zustand";

export type CartItem = {
  id: string; // gameId + consola + tipoCuenta
  gameId: number;
  titulo: string;
  consola: string;
  tipoCuenta: string;
  precio: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (item: Omit<CartItem, "id" | "quantity">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  isOpen: false,
  addToCart: (item) =>
    set((state) => {
      const id = `${item.gameId}-${item.consola}-${item.tipoCuenta}`.toUpperCase();
      const existing = state.items.find((i) => i.id === id);

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + 1 } : i
          ),
          isOpen: true,
        };
      }

      return {
        items: [
          ...state.items,
          {
            ...item,
            id,
            quantity: 1,
          },
        ],
        isOpen: true,
      };
    }),
  removeFromCart: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  clearCart: () =>
    set(() => ({
      items: [],
    })),
  openCart: () =>
    set(() => ({
      isOpen: true,
    })),
  closeCart: () =>
    set(() => ({
      isOpen: false,
    })),
}));

