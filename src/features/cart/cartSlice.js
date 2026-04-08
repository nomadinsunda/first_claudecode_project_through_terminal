import { createSlice } from '@reduxjs/toolkit'
import { CART_STORAGE_KEY, MAX_QUANTITY_PER_ITEM, MAX_CART_KINDS } from './cartConstants'

// 비로그인 상태의 장바구니를 localStorage에서 불러옵니다.
function loadCartFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// item shape: { productId, name, salePrice, stock, quantity, imageUrl }
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
  },
  reducers: {
    /**
     * 상품을 장바구니에 추가합니다.
     * 이미 존재하는 상품은 수량을 증가시키되 최대 10개를 초과하지 않습니다.
     * 장바구니 종류가 20종에 도달하면 추가를 무시합니다.
     */
    addItem(state, action) {
      const incoming = action.payload
      const existing = state.items.find((i) => i.productId === incoming.productId)

      if (existing) {
        existing.quantity = Math.min(existing.quantity + (incoming.quantity ?? 1), MAX_QUANTITY_PER_ITEM)
        return
      }

      if (state.items.length >= MAX_CART_KINDS) return

      state.items.push({ ...incoming, quantity: incoming.quantity ?? 1 })
    },

    /**
     * 특정 상품의 수량을 변경합니다.
     * 수량이 1 미만이 되면 해당 항목을 제거합니다.
     */
    updateQuantity(state, action) {
      const { productId, quantity } = action.payload
      const item = state.items.find((i) => i.productId === productId)
      if (!item) return

      if (quantity < 1) {
        state.items = state.items.filter((i) => i.productId !== productId)
        return
      }
      item.quantity = Math.min(quantity, MAX_QUANTITY_PER_ITEM)
    },

    removeItem(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload)
    },

    clearCart(state) {
      state.items = []
    },

    /**
     * 로그인 시 서버 장바구니를 로컬 상태에 반영하고 localStorage를 비웁니다.
     * 서버 병합(POST /cart/sync) 응답 후 호출합니다.
     */
    hydrateFromServer(state, action) {
      state.items = action.payload
      localStorage.removeItem(CART_STORAGE_KEY)
    },
  },
})

export const { addItem, updateQuantity, removeItem, clearCart, hydrateFromServer } = cartSlice.actions
export default cartSlice.reducer

// Selectors
export const selectCartItems = (state) => state.cart.items
export const selectCartKindCount = (state) => state.cart.items.length
