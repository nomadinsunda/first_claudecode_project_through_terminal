import { CART_STORAGE_KEY } from './cartConstants'

/**
 * 비로그인 상태의 장바구니 변경을 localStorage에 동기화합니다.
 * hydrateFromServer 액션이 dispatch되면 localStorage를 비우므로 별도 처리가 필요 없습니다.
 */
export const cartPersistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action)

  if (action.type?.startsWith('cart/') && action.type !== 'cart/hydrateFromServer') {
    const { items } = store.getState().cart
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }

  return result
}
