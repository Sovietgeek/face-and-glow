'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type CartItem = {
  id: number
  name: string
  category: string
  price: number
  durationMinutes: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  clearCart: () => void
  isInCart: (id: number) => boolean
  total: number
  totalDuration: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'fg-cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {
      // ignore corrupted cart
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // storage unavailable
    }
  }, [items, hydrated])

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]))
  }, [])

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const isInCart = useCallback((id: number) => items.some((i) => i.id === id), [items])

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      clearCart,
      isInCart,
      total: items.reduce((sum, i) => sum + i.price, 0),
      totalDuration: items.reduce((sum, i) => sum + i.durationMinutes, 0),
    }),
    [items, addItem, removeItem, clearCart, isInCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
