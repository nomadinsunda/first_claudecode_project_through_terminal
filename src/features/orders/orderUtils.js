import {
  ORDER_STATUS,
  REFUND_BUSINESS_DAYS_MIN,
  REFUND_BUSINESS_DAYS_MAX,
} from './orderConstants'

/**
 * 주문 취소 가능 여부를 반환합니다.
 * '결제완료' 상태에서만 즉시 취소 가능합니다.
 *
 * @param {string} status - ORDER_STATUS 값
 * @returns {boolean}
 */
export function isCancellable(status) {
  return status === ORDER_STATUS.PAID
}

/**
 * 취소 후 환불 안내 문구를 반환합니다.
 * 포인트 사용 내역이 있으면 포인트 복원 안내를 포함합니다.
 *
 * @param {{ pointsUsed: number }} order
 * @returns {string}
 */
export function getRefundMessage({ pointsUsed }) {
  const base = `취소 확정 후 영업일 기준 ${REFUND_BUSINESS_DAYS_MIN}~${REFUND_BUSINESS_DAYS_MAX}일 이내 원결제 수단으로 환불됩니다.`
  if (pointsUsed > 0) {
    return `${base} 사용하신 ${pointsUsed.toLocaleString()}P는 즉시 복원됩니다.`
  }
  return base
}
