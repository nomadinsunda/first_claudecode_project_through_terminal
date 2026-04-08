import { ORDER_STATUS } from '../features/orders/orderConstants'

export const mockOrders = [
  {
    id: 'ORD-2026-0001',
    createdAt: '2026-03-10T10:00:00',
    status: ORDER_STATUS.DELIVERED,
    deliveredAt: '2026-03-13T14:00:00',
    recipient: { name: '홍길동', phone: '010-1234-5678', address: '서울시 강남구 테헤란로 123' },
    items: [
      { productId: 1, name: '오리&연어 그레인프리 사료 2kg', quantity: 1, salePrice: 31_500, imageUrl: 'https://placehold.co/80x80/f3f4f6/9ca3af?text=1' },
    ],
    subtotal: 31_500,
    shippingFee: 0,
    pointsUsed: 0,
    total: 31_500,
  },
  {
    id: 'ORD-2026-0002',
    createdAt: '2026-04-01T09:30:00',
    status: ORDER_STATUS.PAID,
    deliveredAt: null,
    recipient: { name: '홍길동', phone: '010-1234-5678', address: '서울시 강남구 테헤란로 123' },
    items: [
      { productId: 8,  name: '동결건조 닭가슴살 간식 50g', quantity: 2, salePrice: 11_000, imageUrl: 'https://placehold.co/80x80/f3f4f6/9ca3af?text=8' },
      { productId: 10, name: '깃털 낚싯대 장난감',          quantity: 1, salePrice: 7_500,  imageUrl: 'https://placehold.co/80x80/f3f4f6/9ca3af?text=10' },
    ],
    subtotal: 29_500,
    shippingFee: 3_000,
    pointsUsed: 1_000,
    total: 31_500,
  },
]

