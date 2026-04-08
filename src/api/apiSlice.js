import { createApi } from '@reduxjs/toolkit/query/react'
import { clearCredentials } from '../features/auth/authSlice'
import { mockBaseQuery } from './mockBaseQuery'

// ─── Base Query ────────────────────────────────────────────────────────────────
// 개발 중: mockBaseQuery 사용 (src/mocks/ 데이터 반환, 500ms 지연 시뮬레이션)
// 백엔드 연결 시: realBaseQuery(fetchBaseQuery + credentials + CSRF)로 교체

// ─── Silent Refresh Wrapper ────────────────────────────────────────────────────
// 401 수신 시 /auth/refresh를 호출해 토큰을 갱신하고 원래 요청을 1회 재시도합니다.
// Loop Guard: /auth/refresh 자체가 401이면 즉시 로그아웃하여 무한 루프를 방지합니다.
const withReauth = (baseQuery) => async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error?.status !== 401) {
    return result
  }

  const requestUrl = typeof args === 'string' ? args : args?.url ?? ''
  const isRefreshRequest = requestUrl.includes('/auth/refresh')

  if (isRefreshRequest) {
    // refresh 요청 자체가 실패 → 로그아웃
    api.dispatch(clearCredentials())
    return result
  }

  // access_token 만료 → refresh 시도
  const refreshResult = await baseQuery(
    { url: '/auth/refresh', method: 'POST' },
    api,
    extraOptions,
  )

  if (refreshResult.error) {
    // refresh 실패 → 로그아웃
    api.dispatch(clearCredentials())
    return result
  }

  // refresh 성공 → 원래 요청 재시도
  return baseQuery(args, api, extraOptions)
}

// ─── API Slice Root ────────────────────────────────────────────────────────────
// 모든 feature별 apiSlice는 이 루트에 injectEndpoints()로 주입합니다.
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: withReauth(mockBaseQuery),
  tagTypes: ['Auth', 'Product', 'Cart', 'Order', 'Point', 'Review', 'Inquiry', 'Return', 'Exchange'],
  endpoints: () => ({}),
})
