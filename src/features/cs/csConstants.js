import { CATEGORY } from '../products/productConstants'

// 수령일로부터 반품/교환 신청 가능 기간 (전자상거래법 기준)
export const RETURN_ELIGIBLE_DAYS = 7
export const EXCHANGE_ELIGIBLE_DAYS = 7

// 개봉 시 단순 변심 반품이 불가한 식품류 카테고리
export const NON_RETURNABLE_CATEGORIES = [
  CATEGORY.FOOD,
  CATEGORY.SNACK,
  CATEGORY.SUPPLEMENT,
]

export const RETURN_REASON = {
  CHANGE_OF_MIND: 'CHANGE_OF_MIND', // 단순 변심
  DEFECT: 'DEFECT',                 // 상품 결함
  WRONG_ITEM: 'WRONG_ITEM',         // 오배송
}

export const RETURN_REASON_LABEL = {
  [RETURN_REASON.CHANGE_OF_MIND]: '단순 변심',
  [RETURN_REASON.DEFECT]: '상품 결함',
  [RETURN_REASON.WRONG_ITEM]: '오배송',
}
