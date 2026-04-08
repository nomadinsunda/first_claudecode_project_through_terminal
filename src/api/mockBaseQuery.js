/**
 * mockBaseQuery
 *
 * fetch 대신 src/mocks/ 데이터를 반환하는 커스텀 RTK Query baseQuery입니다.
 * 백엔드 연결 시 apiSlice.js에서 realBaseQuery로 교체하면 됩니다.
 *
 * - 500ms 지연으로 네트워크 레이턴시 시뮬레이션
 * - 가변 상태(orders, reviews, inquiries)는 모듈 레벨 변수로 관리
 *   → RTK Query의 invalidatesTags → refetch 흐름이 실제와 동일하게 동작
 */
import { mockProducts } from '../mocks/products'
import { petLandingData } from '../config/landing'
import { mockOrders as initialOrders } from '../mocks/orders'
import { mockReviews as initialReviews } from '../mocks/reviews'
import { MOCK_POINT_BALANCE, mockPointHistory } from '../mocks/points'
import { MOCK_USER } from '../mocks/user'
import { mockInquiries as initialInquiries } from '../mocks/inquiries'
import { mockFaqs } from '../mocks/faqs'
import { mockNews } from '../mocks/news'

const DELAY_MS = 500

// ── 가변 mock 상태 ──────────────────────────────────────────────────────────
let orders    = [...initialOrders]
let reviews   = initialReviews.map(r => ({ ...r }))
let inquiries = initialInquiries.map(i => ({ ...i }))

// ── 유틸 ────────────────────────────────────────────────────────────────────
function paginate(array, page = 0, size = 20) {
  const start = page * size
  return {
    content:       array.slice(start, start + size),
    totalElements: array.length,
    totalPages:    Math.ceil(array.length / size),
    number:        page,
    size,
  }
}

class MockError {
  constructor(status, message) {
    this.status  = status
    this.message = message
  }
}

// ── 라우터 ──────────────────────────────────────────────────────────────────
function handleRequest(url = '', method = 'GET', body) {
  const [path, queryString] = url.split('?')
  const seg   = path.split('/').filter(Boolean)  // ['products', '1', 'reviews']
  const query = Object.fromEntries(new URLSearchParams(queryString ?? ''))
  const page  = Number(query.page  ?? 0)
  const size  = Number(query.size  ?? 20)

  // ── /auth ──
  if (seg[0] === 'auth') {
    if (seg[1] === 'me' || seg[1] === 'refresh')  return MOCK_USER
    if (seg[1] === 'login')                        return MOCK_USER
    if (seg[1] === 'logout')                       return {}
  }

  // ── /landing ──
  if (seg[0] === 'landing') {
    return {
      ...petLandingData,
      themeSections: petLandingData.themeSections.map(section => ({
        ...section,
        products: section.productIds
          .map(id => mockProducts.find(p => p.id === id))
          .filter(Boolean),
      })),
    }
  }

  // ── /products ──
  if (seg[0] === 'products') {
    // GET /products/:id/reviews
    if (seg[2] === 'reviews') {
      const pid = Number(seg[1])
      return paginate(reviews.filter(r => r.productId === pid), page, size)
    }
    // GET /products/:id
    if (seg[1]) {
      const product = mockProducts.find(p => p.id === Number(seg[1]))
      if (!product) throw new MockError(404, '상품을 찾을 수 없습니다.')
      return product
    }
    // GET /products
    let list = [...mockProducts]
    if (query.petType)  list = list.filter(p => p.petType  === query.petType)
    if (query.category) list = list.filter(p => p.category === query.category)
    return paginate(list, page, size)
  }

  // ── /orders ──
  if (seg[0] === 'orders') {
    // POST /orders/:id/cancel
    if (seg[2] === 'cancel' && method === 'POST') {
      const exists = orders.some(o => o.id === seg[1])
      if (!exists) throw new MockError(404, '주문을 찾을 수 없습니다.')
      orders = orders.map(o => o.id === seg[1] ? { ...o, status: 'CANCELLED' } : o)
      return orders.find(o => o.id === seg[1])
    }
    // GET /orders/:id
    if (seg[1]) {
      const order = orders.find(o => o.id === seg[1])
      if (!order) throw new MockError(404, '주문을 찾을 수 없습니다.')
      return order
    }
    // GET /orders
    return paginate(orders, page, size)
  }

  // ── /points ──
  if (seg[0] === 'points' && seg[1] === 'me') {
    return { balance: MOCK_POINT_BALANCE, ...paginate(mockPointHistory, page, size) }
  }

  // ── /reviews ──
  if (seg[0] === 'reviews') {
    // POST /reviews/:id/helpful
    if (seg[2] === 'helpful' && method === 'POST') {
      const review = reviews.find(r => r.id === Number(seg[1]))
      if (!review) throw new MockError(404, '리뷰를 찾을 수 없습니다.')
      reviews = reviews.map(r =>
        r.id === Number(seg[1]) ? { ...r, helpfulCount: (r.helpfulCount ?? 0) + 1 } : r
      )
      return { helpfulCount: reviews.find(r => r.id === Number(seg[1])).helpfulCount }
    }
    if (method === 'POST') {
      const created = { id: Date.now(), createdAt: new Date().toISOString(), ...body }
      reviews = [created, ...reviews]
      return created
    }
    if (method === 'PATCH') {
      reviews = reviews.map(r => r.id === Number(seg[1]) ? { ...r, ...body } : r)
      return reviews.find(r => r.id === Number(seg[1]))
    }
    if (method === 'DELETE') {
      reviews = reviews.filter(r => r.id !== Number(seg[1]))
      return {}
    }
  }

  // ── /cart ──
  if (seg[0] === 'cart') {
    if (seg[1] === 'sync' && method === 'POST') return { items: body?.items ?? [] }
    if (seg[1] === 'items') {
      if (method === 'POST')   return { ...body }
      if (method === 'PATCH')  return { ...body }
      if (method === 'DELETE') return {}
    }
    return { items: [] }
  }

  // ── /cs ──
  if (seg[0] === 'cs') {
    if (seg[1] === 'inquiries') {
      if (method === 'GET' && seg[2]) {
        const inq = inquiries.find(i => i.id === seg[2])
        if (!inq) throw new MockError(404, '문의를 찾을 수 없습니다.')
        return inq
      }
      if (method === 'GET') return paginate(inquiries, page, size)
      if (method === 'POST') {
        const created = { id: `INQ-${Date.now()}`, createdAt: new Date().toISOString(), status: 'PENDING', ...body }
        inquiries = [created, ...inquiries]
        return created
      }
    }
    if (seg[1] === 'faqs' && method === 'GET') {
      let list = [...mockFaqs]
      if (query.category && query.category !== '전체') list = list.filter(f => f.category === query.category)
      if (query.q) {
        const q = query.q.toLowerCase()
        list = list.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
      }
      return paginate(list, page, size)
    }
    if (seg[1] === 'news' && method === 'GET') {
      let list = [...mockNews]
      if (query.category && query.category !== '전체') list = list.filter(n => n.category === query.category)
      return paginate(list, page, size)
    }
    if (seg[1] === 'voice' && method === 'POST') {
      return { id: `VOC-${Date.now()}`, createdAt: new Date().toISOString(), status: 'PENDING', ...body }
    }
    if (seg[1] === 'returns'   && method === 'POST') return { id: Date.now(), ...body }
    if (seg[1] === 'exchanges' && method === 'POST') return { id: Date.now(), ...body }
  }

  throw new MockError(404, `Unknown endpoint: ${method} ${url}`)
}

// ── baseQuery 본체 ──────────────────────────────────────────────────────────
export const mockBaseQuery = async (args) => {
  await new Promise(resolve => setTimeout(resolve, DELAY_MS))

  const { url, method = 'GET', body } =
    typeof args === 'string' ? { url: args } : args

  try {
    const data = handleRequest(url, method, body)
    return { data }
  } catch (err) {
    return {
      error: {
        status: err instanceof MockError ? err.status : 500,
        data:   { message: err.message ?? 'Mock server error' },
      },
    }
  }
}
