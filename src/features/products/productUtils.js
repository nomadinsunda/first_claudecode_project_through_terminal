/**
 * 할인가를 계산합니다.
 * salePrice = price × (1 - discountRate / 100), 원 단위 절사
 *
 * @param {number} price - 정가
 * @param {number} discountRate - 할인율 (0~100)
 * @returns {number}
 */
export function calcSalePrice(price, discountRate) {
  return Math.floor(price * (1 - discountRate / 100))
}

/**
 * 품절 여부를 반환합니다.
 *
 * @param {number} stock
 * @returns {boolean}
 */
export function isOutOfStock(stock) {
  return stock === 0
}

/**
 * 요청 수량을 현재 재고 이하로 제한하여 반환합니다.
 * 반환값이 requestedQty보다 작으면 재고 부족 상태입니다.
 *
 * @param {number} requestedQty - 사용자가 요청한 수량
 * @param {number} stock - 현재 재고
 * @returns {number} 조정된 수량
 */
export function clampToStock(requestedQty, stock) {
  return Math.min(requestedQty, stock)
}

/**
 * 재고 부족 안내 문자열을 반환합니다.
 * stock이 0이면 빈 문자열을 반환합니다 (품절 배지는 별도 처리).
 *
 * @param {number} stock
 * @returns {string}
 */
export function getStockMessage(stock) {
  if (stock <= 0) return ''
  return `재고 ${stock}개 남음`
}
