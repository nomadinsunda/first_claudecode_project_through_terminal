// points.md: 최소 1,000P · 최대 50% · 유효기간 1년 · 배송비 적용 불가
export const MOCK_POINT_BALANCE = 3_500

export const mockPointHistory = [
  { id: 1, description: '리뷰 작성 보상 (사진 포함)', amount:  1_000, type: 'EARN', createdAt: '2026-03-14T10:00:00' },
  { id: 2, description: '리뷰 작성 보상 (일반)',       amount:    500, type: 'EARN', createdAt: '2026-02-20T14:30:00' },
  { id: 3, description: 'ORD-2026-0002 결제 사용',    amount: -1_000, type: 'USE',  createdAt: '2026-04-01T09:30:00' },
  { id: 4, description: '이벤트 적립',                 amount:  3_000, type: 'EARN', createdAt: '2026-01-01T00:00:00' },
]
