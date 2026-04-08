import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { addItem } from '../cart/cartSlice'
import { isOutOfStock, getStockMessage } from './productUtils'
import { CATEGORY_LABEL, PET_TYPE_LABEL } from './productConstants'

export default function ProductCard({ product }) {
  const dispatch = useDispatch()
  const { productId, id, name, petType, category, price, discountRate, salePrice, stock, imageUrl } = product
  const pid = productId ?? id
  const soldOut = isOutOfStock(stock)
  const stockMsg = getStockMessage(stock)
  const lowStock = stock > 0 && stock <= 5

  function handleAddToCart() {
    dispatch(addItem({ productId: pid, name, salePrice, stock, quantity: 1, imageUrl }))
  }

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-shadow">
      {/* 상품 이미지 — 클릭 시 상세 페이지 이동 */}
      <Link to={`/products/${pid}`}>
      <figure className="relative">
        <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
        {soldOut && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="badge badge-error badge-lg text-white font-bold">품절</span>
          </div>
        )}
        {discountRate > 0 && !soldOut && (
          <span className="badge badge-error absolute top-2 right-2">{discountRate}%</span>
        )}
      </figure>
      </Link>

      <div className="card-body p-4 gap-1">
        {/* 대분류·중분류 배지 */}
        <div className="flex gap-1 flex-wrap">
          <span className="badge badge-outline badge-sm">{PET_TYPE_LABEL[petType]}</span>
          <span className="badge badge-ghost badge-sm">{CATEGORY_LABEL[category]}</span>
        </div>

        {/* 상품명 — 클릭 시 상세 페이지 이동 */}
        <Link to={`/products/${pid}`} className="hover:underline">
          <p className="font-medium text-sm leading-snug line-clamp-2 mt-1">{name}</p>
        </Link>

        {/* 가격 */}
        <div className="mt-1">
          {discountRate > 0 ? (
            <>
              <span className="text-xs text-base-content/40 line-through mr-1">
                {price.toLocaleString()}원
              </span>
              <span className="font-bold text-error">{salePrice.toLocaleString()}원</span>
            </>
          ) : (
            <span className="font-bold">{price.toLocaleString()}원</span>
          )}
        </div>

        {/* 재고 부족 안내 */}
        {lowStock && (
          <p className="text-xs text-warning font-medium">{stockMsg}</p>
        )}

        {/* 장바구니 담기 */}
        <div className="card-actions mt-2">
          <button
            className="btn btn-primary btn-sm w-full"
            onClick={handleAddToCart}
            disabled={soldOut}
          >
            {soldOut ? '품절' : '장바구니 담기'}
          </button>
        </div>
      </div>
    </div>
  )
}
