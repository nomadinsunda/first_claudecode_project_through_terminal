import {
  RETURN_ELIGIBLE_DAYS,
  EXCHANGE_ELIGIBLE_DAYS,
  NON_RETURNABLE_CATEGORIES,
  RETURN_REASON,
} from './csConstants'

/**
 * 수령일로부터 경과 일수를 계산합니다.
 *
 * @param {string | Date} receivedAt
 * @returns {number}
 */
function daysSinceReceived(receivedAt) {
  return (new Date() - new Date(receivedAt)) / (1000 * 60 * 60 * 24)
}

/**
 * 반품 신청 가능 여부를 반환합니다.
 *
 * - 단순 변심: 수령일로부터 7일 이내 + 식품류 개봉 시 불가
 * - 결함/오배송: 기간 제한 없이 가능
 *
 * @param {{ receivedAt: string|Date, category: string, reason: string, isOpened?: boolean }} params
 * @returns {{ eligible: boolean, reason: string }}
 */
export function isReturnEligible({ receivedAt, category, reason, isOpened = false }) {
  const isSellerFault =
    reason === RETURN_REASON.DEFECT || reason === RETURN_REASON.WRONG_ITEM

  // 결함/오배송은 기간 제한 없이 허용
  if (isSellerFault) {
    return { eligible: true, reason: '' }
  }

  // 단순 변심: 식품류 개봉 시 불가
  if (NON_RETURNABLE_CATEGORIES.includes(category) && isOpened) {
    return { eligible: false, reason: '식품류(사료/간식/영양제)는 개봉 후 단순 변심 반품이 불가합니다.' }
  }

  // 단순 변심: 수령일로부터 7일 이내
  if (daysSinceReceived(receivedAt) > RETURN_ELIGIBLE_DAYS) {
    return { eligible: false, reason: `반품은 수령일로부터 ${RETURN_ELIGIBLE_DAYS}일 이내에 신청 가능합니다.` }
  }

  return { eligible: true, reason: '' }
}

/**
 * 교환 신청 가능 여부를 반환합니다.
 * 동일 상품(색상/사이즈 변경) 한정, 수령일로부터 7일 이내.
 *
 * @param {{ receivedAt: string|Date }} params
 * @returns {{ eligible: boolean, reason: string }}
 */
export function isExchangeEligible({ receivedAt }) {
  if (daysSinceReceived(receivedAt) > EXCHANGE_ELIGIBLE_DAYS) {
    return {
      eligible: false,
      reason: `교환은 수령일로부터 ${EXCHANGE_ELIGIBLE_DAYS}일 이내에 신청 가능합니다.`,
    }
  }
  return { eligible: true, reason: '' }
}
