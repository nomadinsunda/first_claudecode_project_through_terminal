import { apiSlice } from '../../api/apiSlice'
import { hydrateFromServer } from './cartSlice'

export const cartApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 로그인 사용자의 서버 장바구니 조회
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),

    // 상품 추가
    addCartItem: builder.mutation({
      query: (body) => ({ url: '/cart/items', method: 'POST', body }),
      invalidatesTags: ['Cart'],
    }),

    // 수량 변경
    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }) => ({
        url: `/cart/items/${itemId}`,
        method: 'PATCH',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),

    // 항목 삭제
    removeCartItem: builder.mutation({
      query: (itemId) => ({ url: `/cart/items/${itemId}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),

    /**
     * 로그인 시 localStorage 장바구니를 서버와 병합합니다.
     * 응답으로 병합된 서버 장바구니를 반환하며, hydrateFromServer를 dispatch합니다.
     */
    syncCart: builder.mutation({
      query: (localItems) => ({ url: '/cart/sync', method: 'POST', body: { items: localItems } }),
      invalidatesTags: ['Cart'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(hydrateFromServer(data.items))
        } catch {}
      },
    }),
  }),
})

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useSyncCartMutation,
} = cartApiSlice
