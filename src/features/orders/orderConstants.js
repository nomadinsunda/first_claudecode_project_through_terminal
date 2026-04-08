// 결제대기 → 결제완료 → 배송준비 → 배송중 → 배송완료
//                ↓ (PG 실패)
//             결제실패
export const ORDER_STATUS = {
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  PAID: 'PAID',
  PREPARING: 'PREPARING',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  CANCELLED: 'CANCELLED',
}

export const ORDER_STATUS_LABEL = {
  [ORDER_STATUS.PENDING_PAYMENT]: '결제대기',
  [ORDER_STATUS.PAID]: '결제완료',
  [ORDER_STATUS.PREPARING]: '배송준비',
  [ORDER_STATUS.SHIPPING]: '배송중',
  [ORDER_STATUS.DELIVERED]: '배송완료',
  [ORDER_STATUS.PAYMENT_FAILED]: '결제실패',
  [ORDER_STATUS.CANCELLED]: '취소완료',
}

// 환불 소요 기간 (영업일)
export const REFUND_BUSINESS_DAYS_MIN = 3
export const REFUND_BUSINESS_DAYS_MAX = 5
