import {
  SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  MAX_QUANTITY_PER_ITEM,
  MAX_CART_KINDS,
} from './cartConstants'

/**
 * 할인 적용 후 실결제 금액(subtotal) 기준으로 배송비를 계산합니다.
 * 30,000원 이상이면 무료, 미만이면 3,000원.
 *
 * @param {number} subtotal - 할인가 기준 상품 합계
 * @returns {number}
 */
export function calcShippingFee(subtotal) {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}

/**
 * 장바구니 요약(소계, 배송비, 총액)을 계산합니다.
 * 포인트는 배송비에 적용되지 않으므로 배송비는 상품 합계만으로 결정합니다.
 *
 * @param {Array<{ salePrice: number, quantity: number }>} items
 * @returns {{ subtotal: number, shippingFee: number, total: number }}
 */
export function calcCartSummary(items) {
  const subtotal = items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0)
  const shippingFee = calcShippingFee(subtotal)
  return { subtotal, shippingFee, total: subtotal + shippingFee }
}

/**
 * 동일 상품 최대 수량(10개)에 도달했는지 확인합니다.
 *
 * @param {number} quantity
 * @returns {boolean}
 */
export function isMaxQuantityReached(quantity) {
  return quantity >= MAX_QUANTITY_PER_ITEM
}

/**
 * 장바구니 최대 종류(20종)에 도달했는지 확인합니다.
 *
 * @param {number} kindCount - 현재 장바구니 상품 종류 수
 * @returns {boolean}
 */
export function isMaxKindsReached(kindCount) {
  return kindCount >= MAX_CART_KINDS
}
