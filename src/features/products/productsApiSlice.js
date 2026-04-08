import { apiSlice } from '../../api/apiSlice'

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * 상품 목록 조회
     * @param {{ petType?: string, category?: string, page?: number, size?: number }} params
     */
    getProducts: builder.query({
      query: ({ petType, category, page = 0, size = 20 } = {}) => {
        const params = new URLSearchParams({ page, size })
        if (petType) params.set('petType', petType)
        if (category) params.set('category', category)
        return `/products?${params}`
      },
      providesTags: (result) =>
        result?.content
          ? [
              ...result.content.map(({ id }) => ({ type: 'Product', id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    /**
     * 상품 단건 조회
     * @param {number|string} productId
     */
    getProductById: builder.query({
      query: (productId) => `/products/${productId}`,
      providesTags: (result, error, productId) => [{ type: 'Product', id: productId }],
    }),
  }),
})

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApiSlice
