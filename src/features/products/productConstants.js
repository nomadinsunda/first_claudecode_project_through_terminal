// 대분류 — petType 필드와 동일한 개념으로 통일
export const PET_TYPE = {
  DOG: 'DOG',
  CAT: 'CAT',
  COMMON: 'COMMON',
}

export const PET_TYPE_LABEL = {
  [PET_TYPE.DOG]: '강아지',
  [PET_TYPE.CAT]: '고양이',
  [PET_TYPE.COMMON]: '공용',
}

// 중분류
export const CATEGORY = {
  FOOD: 'FOOD',
  SNACK: 'SNACK',
  SUPPLEMENT: 'SUPPLEMENT',
  TOY: 'TOY',
  CLOTHING: 'CLOTHING',
  HYGIENE: 'HYGIENE',
}

export const CATEGORY_LABEL = {
  [CATEGORY.FOOD]: '사료',
  [CATEGORY.SNACK]: '간식',
  [CATEGORY.SUPPLEMENT]: '영양제',
  [CATEGORY.TOY]: '장난감',
  [CATEGORY.CLOTHING]: '의류',
  [CATEGORY.HYGIENE]: '위생용품',
}
