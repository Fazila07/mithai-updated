import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { IProduct } from '@/types'

interface WishlistState {
  items: IProduct[]
  toggle: (product: IProduct) => void
  isWishlisted: (productId: string) => boolean
  remove: (productId: string) => void
  clear: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) => {
        const id = product._id || product.id || ''
        const exists = get().items.find((p) => (p._id || p.id) === id)

        if (exists) {
          set((state) => ({
            items: state.items.filter((p) => (p._id || p.id) !== id),
          }))
        } else {
          set((state) => ({
            items: [...state.items, product],
          }))
        }

        // Sync to DB (toggle endpoint)
        fetch('/api/user/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: id }),
        }).catch(() => {})
      },

      isWishlisted: (productId) => {
        return get().items.some((p) => (p._id || p.id) === productId)
      },

      remove: (productId) => {
        set((state) => ({
          items: state.items.filter((p) => (p._id || p.id) !== productId),
        }))

        fetch('/api/user/wishlist', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        }).catch(() => {})
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: 'mithai-wishlist',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
