import { PET_TYPE, CATEGORY } from '../features/products/productConstants'
import { calcSalePrice } from '../features/products/productUtils'

const raw = [
  // 강아지
  { id: 1,  name: '오리&연어 그레인프리 사료 2kg',    petType: PET_TYPE.DOG, category: CATEGORY.FOOD,       price: 35_000, discountRate: 10, stock: 50 },
  { id: 2,  name: '소고기 져키 간식 100g',            petType: PET_TYPE.DOG, category: CATEGORY.SNACK,      price: 8_900,  discountRate: 0,  stock: 120 },
  { id: 3,  name: '관절 건강 오메가3 영양제 60정',    petType: PET_TYPE.DOG, category: CATEGORY.SUPPLEMENT, price: 24_000, discountRate: 15, stock: 30 },
  { id: 4,  name: '로프 터그 장난감',                 petType: PET_TYPE.DOG, category: CATEGORY.TOY,        price: 12_000, discountRate: 0,  stock: 75 },
  { id: 5,  name: '강아지 레인코트 (S/M/L)',          petType: PET_TYPE.DOG, category: CATEGORY.CLOTHING,   price: 19_900, discountRate: 20, stock: 0 },
  { id: 6,  name: '귀 세정 물티슈 100매',             petType: PET_TYPE.DOG, category: CATEGORY.HYGIENE,    price: 6_500,  discountRate: 0,  stock: 200 },
  // 고양이
  { id: 7,  name: '연어&참치 그레인프리 캣푸드 1.5kg',petType: PET_TYPE.CAT, category: CATEGORY.FOOD,       price: 29_000, discountRate: 5,  stock: 60 },
  { id: 8,  name: '동결건조 닭가슴살 간식 50g',       petType: PET_TYPE.CAT, category: CATEGORY.SNACK,      price: 11_000, discountRate: 0,  stock: 85 },
  { id: 9,  name: '헤어볼 케어 영양제 30정',          petType: PET_TYPE.CAT, category: CATEGORY.SUPPLEMENT, price: 18_000, discountRate: 10, stock: 3 },
  { id: 10, name: '깃털 낚싯대 장난감',               petType: PET_TYPE.CAT, category: CATEGORY.TOY,        price: 7_500,  discountRate: 0,  stock: 90 },
  { id: 11, name: '캣 넥 워머 (S)',                   petType: PET_TYPE.CAT, category: CATEGORY.CLOTHING,   price: 14_000, discountRate: 30, stock: 0 },
  { id: 12, name: '두부 모래 6L',                     petType: PET_TYPE.CAT, category: CATEGORY.HYGIENE,    price: 13_500, discountRate: 0,  stock: 150 },
  // 공용
  { id: 13, name: '프리미엄 자동 급수기 2L',          petType: PET_TYPE.COMMON, category: CATEGORY.HYGIENE, price: 32_000, discountRate: 12, stock: 40 },
  { id: 14, name: '항균 스테인리스 식기 세트',        petType: PET_TYPE.COMMON, category: CATEGORY.HYGIENE, price: 15_900, discountRate: 0,  stock: 55 },
  { id: 15, name: '공용 캐리어 백 (M)',               petType: PET_TYPE.COMMON, category: CATEGORY.CLOTHING,price: 45_000, discountRate: 10, stock: 20 },
  { id: 16, name: '멀티 비타민 영양제 90정',          petType: PET_TYPE.COMMON, category: CATEGORY.SUPPLEMENT, price: 27_000, discountRate: 0, stock: 70 },
]

export const mockProducts = raw.map((p) => ({
  ...p,
  salePrice: calcSalePrice(p.price, p.discountRate),
  imageUrl: `https://placehold.co/300x300/f3f4f6/9ca3af?text=${encodeURIComponent(p.id + '')}`,
}))
