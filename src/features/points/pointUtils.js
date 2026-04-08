import { POINT_MIN_USE, POINT_MAX_USE_RATIO } from './pointConstants'

/**
 * 특정 주문에서 사용 가능한 최대 포인트를 계산합니다.
 * min(보유 포인트, floor(상품 합계 × 50%))
 * 포인트는 배송비에 적용되지 않으므로 subtotal(상품 합계)만 기준으로 합니다.
 *
 * @param {number} balance - 보유 포인트
 * @param {number} subtotal - 상품 합계 (배송비 제외)
 * @returns {number}
 */
export function calcMaxUsablePoints(balance, subtotal) {
  return Math.min(balance, Math.floor(subtotal * POINT_MAX_USE_RATIO))
}

/**
 * 포인트 사용 가능 여부를 반환합니다 (최소 1,000P 이상 보유 시).
 *
 * @param {number} balance
 * @returns {boolean}
 */
export function isPointUsable(balance) {
  return balance >= POINT_MIN_USE
}

/**
 * 포인트 사용 값의 유효성을 검사하고 오류 메시지를 반환합니다.
 * 유효하면 null을 반환합니다.
 *
 * @param {number} pointsToUse
 * @param {number} balance
 * @param {number} subtotal
 * @returns {string | null}
 */
export function validatePointUse(pointsToUse, balance, subtotal) {
  if (pointsToUse < POINT_MIN_USE) {
    return `포인트는 최소 ${POINT_MIN_USE.toLocaleString()}P 이상 사용해야 합니다.`
  }
  if (pointsToUse > balance) {
    return '보유 포인트가 부족합니다.'
  }
  const max = calcMaxUsablePoints(balance, subtotal)
  if (pointsToUse > max) {
    return `결제금액의 50%를 초과하여 사용할 수 없습니다. (최대 ${max.toLocaleString()}P)`
  }
  return null
}
