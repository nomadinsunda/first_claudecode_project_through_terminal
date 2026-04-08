import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useGetProductByIdQuery } from '../features/products/productsApiSlice'
import { isOutOfStock, clampToStock, getStockMessage } from '../features/products/productUtils'
import { PET_TYPE_LABEL, CATEGORY_LABEL } from '../features/products/productConstants'
import { addItem } from '../features/cart/cartSlice'
import { isMaxQuantityReached } from '../features/cart/cartUtils'
import ProductReviews from '../features/reviews/ProductReviews'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const { data: product, isLoading, isError } = useGetProductByIdQuery(Number(id))

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-base-content/60 mb-4">존재하지 않는 상품입니다.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>목록으로</button>
        </div>
      </div>
    )
  }

  const { name, petType, category, price, discountRate, salePrice, stock, imageUrl } = product
  const soldOut = isOutOfStock(stock)
  const stockMsg = getStockMessage(stock)
  const lowStock = stock > 0 && stock <= 5

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1))
  }
  function increment() {
    const next = quantity + 1
    const clamped = clampToStock(next, stock)
    setQuantity(clamped)
  }

  function handleAddToCart() {
    dispatch(addItem({ productId: product.id, name, salePrice, stock, quantity, imageUrl }))
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button className="btn btn-ghost btn-sm mb-6" onClick={() => navigate(-1)}>← 뒤로</button>

      <div className="flex flex-col md:flex-row gap-8">
        {/* 이미지 */}
        <div className="relative w-full md:w-80 shrink-0">
          <img src={imageUrl} alt={name} className="w-full rounded-xl object-cover aspect-square" />
          {soldOut && (
            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
              <span className="badge badge-error badge-lg text-white font-bold text-base">품절</span>
            </div>
          )}
        </div>

        {/* 정보 */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex gap-2">
            <span className="badge badge-outline">{PET_TYPE_LABEL[petType]}</span>
            <span className="badge badge-ghost">{CATEGORY_LABEL[category]}</span>
          </div>

          <h1 className="text-2xl font-bold leading-snug">{name}</h1>

          {/* 가격 */}
          <div>
            {discountRate > 0 ? (
              <div className="flex items-center gap-2">
                <span className="badge badge-error">{discountRate}%</span>
                <span className="text-base-content/40 line-through text-sm">{price.toLocaleString()}원</span>
                <span className="text-2xl font-bold text-error">{salePrice.toLocaleString()}원</span>
              </div>
            ) : (
              <span className="text-2xl font-bold">{price.toLocaleString()}원</span>
            )}
          </div>

          {lowStock && <p className="text-sm text-warning font-medium">{stockMsg}</p>}

          <div className="divider my-0" />

          {/* 수량 */}
          {!soldOut && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">수량</span>
              <div className="join">
                <button className="btn btn-outline join-item btn-sm" onClick={decrement} disabled={quantity <= 1}>−</button>
                <span className="join-item flex items-center px-4 text-sm font-medium border border-base-300">{quantity}</span>
                <button className="btn btn-outline join-item btn-sm" onClick={increment} disabled={isMaxQuantityReached(quantity) || quantity >= stock}>＋</button>
              </div>
            </div>
          )}

          {/* 합계 */}
          {!soldOut && (
            <p className="text-sm text-base-content/60">
              합계: <span className="font-bold text-base-content text-base">{(salePrice * quantity).toLocaleString()}원</span>
            </p>
          )}

          {/* 버튼 */}
          <div className="flex gap-2 mt-2">
            <button
              className={`btn btn-primary flex-1 ${addedToCart ? 'btn-success' : ''}`}
              onClick={handleAddToCart}
              disabled={soldOut}
            >
              {soldOut ? '품절' : addedToCart ? '✓ 담겼습니다' : '장바구니 담기'}
            </button>
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} />
    </div>
  )
}
