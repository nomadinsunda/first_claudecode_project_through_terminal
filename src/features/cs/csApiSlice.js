import { apiSlice } from '../../api/apiSlice'

export const csApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 내 1:1 문의 목록 조회
    getMyInquiries: builder.query({
      query: ({ page = 0, size = 10 } = {}) => `/cs/inquiries?page=${page}&size=${size}`,
      providesTags: [{ type: 'Inquiry', id: 'LIST' }],
    }),

    // 1:1 문의 등록
    createInquiry: builder.mutation({
      query: (body) => ({ url: '/cs/inquiries', method: 'POST', body }),
      invalidatesTags: [{ type: 'Inquiry', id: 'LIST' }],
    }),

    /**
     * 반품 신청
     * reason: CHANGE_OF_MIND | DEFECT | WRONG_ITEM
     * 결함/오배송이면 서버가 왕복 배송비를 판매자 부담으로 처리합니다.
     */
    createReturn: builder.mutation({
      query: (body) => ({ url: '/cs/returns', method: 'POST', body }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Return', id: 'LIST' },
      ],
    }),

    // 교환 신청 — 동일 상품(색상/사이즈 변경) 한정
    createExchange: builder.mutation({
      query: (body) => ({ url: '/cs/exchanges', method: 'POST', body }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Exchange', id: 'LIST' },
      ],
    }),

    // 자주 묻는 질문 목록 (카테고리 필터, 키워드 검색 지원)
    getFaqs: builder.query({
      query: ({ category = '전체', q = '', page = 0, size = 20 } = {}) => {
        const params = new URLSearchParams({ page, size })
        if (category !== '전체') params.set('category', category)
        if (q) params.set('q', q)
        return `/cs/faqs?${params}`
      },
    }),

    // 펫마켓소식 (공지·이벤트·보도자료)
    getNews: builder.query({
      query: ({ category = '전체', page = 0, size = 20 } = {}) => {
        const params = new URLSearchParams({ page, size })
        if (category !== '전체') params.set('category', category)
        return `/cs/news?${params}`
      },
    }),

    // 고객의 소리 — 일반 VOC 피드백 제출
    submitVoice: builder.mutation({
      query: (body) => ({ url: '/cs/voice', method: 'POST', body }),
    }),
  }),
})

export const {
  useGetMyInquiriesQuery,
  useCreateInquiryMutation,
  useCreateReturnMutation,
  useCreateExchangeMutation,
  useGetFaqsQuery,
  useGetNewsQuery,
  useSubmitVoiceMutation,
} = csApiSlice
