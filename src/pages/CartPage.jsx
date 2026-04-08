import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { selectCartItems, updateQuantity, removeItem } from '../features/cart/cartSlice'
import { calcCartSummary, isMaxQuantityReached } from '../features/cart/cartUtils'
import { clampToStock } from '../features/products/productUtils'

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const { subtotal, shippingFee, total } = calcCartSummary(items)

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center gap-4">
        <p className="text-lg text-base-content/60">장바구니가 비어있습니다.</p>
        <Link to="/" className="btn btn-primary">쇼핑 계속하기</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">장바구니</h1>

      <div className="flex flex-col gap-3 mb-6">
        {items.map((item) => (
          <div key={item.productId} className="card bg-base-100 shadow-sm">
            <div className="card-body flex-row items-center gap-4 p-4">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />

              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.name}</p>
                <p className="text-primary font-bold mt-1">{item.salePrice.toLocaleString()}원</p>
              </div>

              {/* 수량 조절 */}
              <div className="join shrink-0">
                <button
                  className="btn btn-outline btn-xs join-item"
                  onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
                >−</button>
                <span className="join-item flex items-center px-3 text-sm border border-base-300">{item.quantity}</span>
                <button
                  className="btn btn-outline btn-xs join-item"
                  onClick={() => {
                    const next = clampToStock(item.quantity + 1, item.stock)
                    if (!isMaxQuantityReached(item.quantity)) {
                      dispatch(updateQuantity({ productId: item.productId, quantity: next }))
                    }
                  }}
                  disabled={isMaxQuantityReached(item.quantity) || item.quantity >= item.stock}
                >＋</button>
              </div>

              <p className="text-sm font-bold w-20 text-right shrink-0">
                {(item.salePrice * item.quantity).toLocaleString()}원
              </p>

              <button
                className="btn btn-ghost btn-xs text-error shrink-0"
                onClick={() => dispatch(removeItem(item.productId))}
              >✕</button>
            </div>
          </div>
        ))}
      </div>

      {/* 주문 요약 */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body gap-2 p-4">
          <div className="flex justify-between text-sm">
            <span>상품 금액</span>
            <span>{subtotal.toLocaleString()}원</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>배송비</span>
            <span>{shippingFee === 0 ? <span className="text-success">무료</span> : `${shippingFee.toLocaleString()}원`}</span>
          </div>
          {shippingFee > 0 && (
            <p className="text-xs text-base-content/50">
              {(30_000 - subtotal).toLocaleString()}원 더 담으면 무료배송
            </p>
          )}
          <div className="divider my-1" />
          <div className="flex justify-between font-bold text-lg">
            <span>총 결제금액</span>
            <span className="text-primary">{total.toLocaleString()}원</span>
          </div>

          <button className="btn btn-primary w-full mt-2" onClick={() => navigate('/checkout')}>
            주문하기 ({items.length}종)
          </button>
        </div>
      </div>
    </div>
  )
}
