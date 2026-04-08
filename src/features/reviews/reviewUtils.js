import { REVIEW_ELIGIBLE_DAYS, REVIEW_POINTS } from './reviewConstants'

/**
 * 리뷰 작성 가능 여부를 반환합니다.
 * 배송완료 후 30일 이내인 경우에만 true를 반환합니다.
 *
 * @param {string | Date} deliveredAt - 배송완료 시각
 * @returns {boolean}
 */
export function isReviewEligible(deliveredAt) {
  const deliveredDate = new Date(deliveredAt)
  const now = new Date()
  const diffMs = now - deliveredDate
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays <= REVIEW_ELIGIBLE_DAYS
}

/**
 * 리뷰에 지급될 포인트를 반환합니다.
 * 사진/영상이 포함된 경우 1,000P, 텍스트만이면 500P.
 *
 * @param {boolean} hasMedia - 사진 또는 영상 첨부 여부
 * @returns {number}
 */
export function getReviewPoints(hasMedia) {
  return hasMedia ? REVIEW_POINTS.MEDIA : REVIEW_POINTS.TEXT
}
