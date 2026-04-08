import { apiSlice } from '../../api/apiSlice'

export const reviewsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 특정 상품의 리뷰 목록 조회
    getProductReviews: builder.query({
      query: ({ productId, page = 0, size = 10 }) =>
        `/products/${productId}/reviews?page=${page}&size=${size}`,
      providesTags: (result, error, { productId }) => [{ type: 'Review', id: `PRODUCT_${productId}` }],
    }),

    /**
     * 리뷰 작성 — 배송완료 후 30일 이내 실구매자만 가능 (1주문 1회).
     * 포인트는 관리자 승인 후 지급됩니다.
     */
    createReview: builder.mutation({
      query: (body) => ({ url: '/reviews', method: 'POST', body }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Review', id: `PRODUCT_${productId}` },
      ],
    }),

    // 리뷰 수정 — 작성자 본인만 가능
    updateReview: builder.mutation({
      query: ({ reviewId, ...body }) => ({
        url: `/reviews/${reviewId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: 'Review', id: `PRODUCT_${productId}` },
      ],
    }),

    /**
     * 리뷰 삭제 — 작성자 본인만 가능.
     * 지급된 포인트 회수는 서버에서 처리합니다.
     */
    deleteReview: builder.mutation({
      query: (reviewId) => ({ url: `/reviews/${reviewId}`, method: 'DELETE' }),
      invalidatesTags: (result, error, reviewId, { productId } = {}) =>
        productId
          ? [{ type: 'Review', id: `PRODUCT_${productId}` }]
          : [{ type: 'Review', id: 'LIST' }],
    }),

    // 리뷰 도움이 돼요
    markHelpful: builder.mutation({
      query: (reviewId) => ({ url: `/reviews/${reviewId}/helpful`, method: 'POST' }),
    }),
  }),
})

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useMarkHelpfulMutation,
} = reviewsApiSlice
