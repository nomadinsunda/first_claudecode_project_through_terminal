import { useState } from 'react'
import { PET_TYPE, PET_TYPE_LABEL, CATEGORY, CATEGORY_LABEL } from '../features/products/productConstants'
import ProductCard from '../features/products/ProductCard'
import { useGetProductsQuery } from '../features/products/productsApiSlice'

const PET_TYPE_TABS = [
  { value: '', label: '전체' },
  { value: PET_TYPE.DOG, label: PET_TYPE_LABEL[PET_TYPE.DOG] },
  { value: PET_TYPE.CAT, label: PET_TYPE_LABEL[PET_TYPE.CAT] },
  { value: PET_TYPE.COMMON, label: PET_TYPE_LABEL[PET_TYPE.COMMON] },
]

const CATEGORY_FILTERS = [
  { value: '', label: '전체' },
  ...Object.entries(CATEGORY_LABEL).map(([value, label]) => ({ value, label })),
]

export default function ProductListPage() {
  const [selectedPetType, setSelectedPetType] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const { data, isLoading, isError } = useGetProductsQuery({
    petType: selectedPetType || undefined,
    category: selectedCategory || undefined,
  })

  const products = data?.content ?? []
  const totalElements = data?.totalElements ?? 0

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">상품 목록</h1>

      {/* 대분류 탭 */}
      <div role="tablist" className="tabs tabs-border mb-4">
        {PET_TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            className={`tab ${selectedPetType === tab.value ? 'tab-active font-semibold' : ''}`}
            onClick={() => {
              setSelectedPetType(tab.value)
              setSelectedCategory('')
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 중분류 필터 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat.value}
            className={`btn btn-sm ${selectedCategory === cat.value ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 결과 수 */}
      {!isLoading && !isError && (
        <p className="text-sm text-base-content/60 mb-4">
          총 <span className="font-semibold text-base-content">{totalElements}</span>개 상품
        </p>
      )}

      {/* 상품 그리드 */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-24 text-base-content/40">
          <p className="text-lg">상품을 불러오지 못했습니다.</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-base-content/40">
          <p className="text-lg">해당하는 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
