import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IProduct, CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  buyNowItem: CartItem | null
  addItem: (product: IProduct, qty?: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  setBuyNow: (product: IProduct, qty: number) => void
  clearBuyNow: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      buyNowItem: null,

      addItem: (product, qty = 1) => {
        const id = product._id || product.id || ''
        set((state) => {
          const existing = state.items.find((i) => (i.product._id || i.product.id) === id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                (i.product._id || i.product.id) === id
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
              isOpen: true,
            }
          }
          return {
            items: [...state.items, { product, quantity: qty }],
            isOpen: true,
          }
        })

        // Sync to DB in background (don't await)
        fetch('/api/user/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: id, quantity: qty }),
        }).catch(() => {})
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => (i.product._id || i.product.id) !== productId),
        }))

        fetch('/api/user/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        }).catch(() => {})
      },

      updateQty: (productId, qty) => {
        if (qty <= 0) {
          get().removeItem(productId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            (i.product._id || i.product.id) === productId
              ? { ...i, quantity: qty }
              : i
          ),
        }))

        fetch('/api/user/cart', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity: qty }),
        }).catch(() => {})
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      setBuyNow: (product, qty) => {
        set({ buyNowItem: { product, quantity: qty } })
      },

      clearBuyNow: () => set({ buyNowItem: null }),
    }),
    {
      name: 'mithai-cart',
      partialize: (state) => ({
        items: state.items,
        buyNowItem: state.buyNowItem,
      }),
    }
  )
)

// Derived selectors
export const useCartTotal = () =>
  useCartStore((state) =>
    state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  )

export const useCartCount = () =>
  useCartStore((state) =>
    state.items.reduce((sum, i) => sum + i.quantity, 0)
  )
