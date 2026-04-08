import { apiSlice } from '../../api/apiSlice'

export const pointsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 포인트 잔액 및 적립/사용 내역 조회
    getMyPoints: builder.query({
      query: ({ page = 0, size = 20 } = {}) => `/points/me?page=${page}&size=${size}`,
      providesTags: [{ type: 'Point', id: 'BALANCE' }],
    }),
  }),
})

export const { useGetMyPointsQuery } = pointsApiSlice
