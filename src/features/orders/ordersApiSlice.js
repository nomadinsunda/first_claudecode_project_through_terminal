import { apiSlice } from '../../api/apiSlice'

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 내 주문 목록 조회
    getOrders: builder.query({
      query: ({ page = 0, size = 10 } = {}) => `/orders?page=${page}&size=${size}`,
      providesTags: (result) =>
        result?.content
          ? [
              ...result.content.map(({ id }) => ({ type: 'Order', id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    // 주문 단건 조회
    getOrderById: builder.query({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
    }),

    /**
     * 주문 취소 — '결제완료' 상태에서만 허용 (전액 취소).
     * 포인트 복원 및 환불은 서버에서 처리합니다.
     */
    cancelOrder: builder.mutation({
      query: (orderId) => ({ url: `/orders/${orderId}/cancel`, method: 'POST' }),
      invalidatesTags: (result, error, orderId) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'LIST' },
        { type: 'Point', id: 'BALANCE' },
      ],
    }),
  }),
})

export const { useGetOrdersQuery, useGetOrderByIdQuery, useCancelOrderMutation } = ordersApiSlice
