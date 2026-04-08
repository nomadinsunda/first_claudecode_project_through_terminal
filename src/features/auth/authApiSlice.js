import { apiSlice } from '../../api/apiSlice'
import { setCredentials, clearCredentials } from './authSlice'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 앱 초기화 시 인증 상태 확인 — AuthInitializer에서 사용
    getMe: builder.query({
      query: () => '/auth/me',
      providesTags: ['Auth'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
        } catch {
          dispatch(clearCredentials())
        }
      },
    }),

    // 이메일/비밀번호 로그인 — 서버가 HttpOnly 쿠키를 설정
    login: builder.mutation({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setCredentials(data))
        } catch {}
      },
    }),

    // 로그아웃 — 서버 세션 + 쿠키 만료 후 로컬 상태 초기화
    logout: builder.mutation({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['Auth'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          dispatch(clearCredentials())
        }
      },
    }),
  }),
})

export const { useGetMeQuery, useLogoutMutation, useLoginMutation } = authApiSlice
