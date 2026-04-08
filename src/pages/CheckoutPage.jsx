import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { selectCartItems, clearCart } from '../features/cart/cartSlice'
import { calcCartSummary } from '../features/cart/cartUtils'
import { validatePointUse, calcMaxUsablePoints, isPointUsable } from '../features/points/pointUtils'
import { useGetMyPointsQuery } from '../features/points/pointsApiSlice'

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(selectCartItems)
  const { subtotal, shippingFee } = calcCartSummary(items)

  const { data: pointsData } = useGetMyPointsQuery()
  const pointBalance = pointsData?.balance ?? 0

  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [pointsInput, setPointsInput] = useState('')
  const [pointsError, setPointsError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const pointsToUse = Number(pointsInput) || 0
  const maxUsable = calcMaxUsablePoints(pointBalance, subtotal)
  const total = Math.max(0, subtotal + shippingFee - pointsToUse)

  if (items.length === 0) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center gap-4">
        <p className="text-base-content/60">장바구니가 비어있습니다.</p>
        <Link to="/" className="btn btn-primary">쇼핑 계속하기</Link>
      </div>
    )
  }

  function handleFormChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handlePointsChange(e) {
    const val = e.target.value.replace(/\D/g, '')
    setPointsInput(val)
    const err = val ? validatePointUse(Number(val), pointBalance, subtotal) : ''
    setPointsError(err ?? '')
  }

  function handleUseAllPoints() {
    const usable = Math.min(maxUsable, pointBalance)
    setPointsInput(String(usable))
    setPointsError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (pointsError) return
    setIsSubmitting(true)
    // 백엔드 미연결 — mock 결제 처리
    await new Promise((r) => setTimeout(r, 800))
    dispatch(clearCart())
    navigate('/orders/complete', {
      replace: true,
      state: { orderId: `ORD-${Date.now()}`, total, items },
    })
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">주문서</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 주문 상품 */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4 gap-2">
            <h2 className="font-semibold">주문 상품 ({items.length}종)</h2>
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="truncate flex-1">{item.name} × {item.quantity}</span>
                <span className="shrink-0 ml-2">{(item.salePrice * item.quantity).toLocaleString()}원</span>
              </div>
            ))}
          </div>
        </div>

        {/* 배송지 */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4 gap-3">
            <h2 className="font-semibold">배송지 정보</h2>
            <input name="name" placeholder="수령인 이름" className="input input-bordered w-full input-sm"
              value={form.name} onChange={handleFormChange} required />
            <input name="phone" placeholder="연락처 (010-0000-0000)" className="input input-bordered w-full input-sm"
              value={form.phone} onChange={handleFormChange} required />
            <input name="address" placeholder="주소" className="input input-bordered w-full input-sm"
              value={form.address} onChange={handleFormChange} required />
          </div>
        </div>

        {/* 포인트 */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4 gap-3">
            <h2 className="font-semibold">포인트 사용</h2>
            <p className="text-sm text-base-content/60">
              보유 <span className="font-bold text-base-content">{pointBalance.toLocaleString()}P</span>
              {' · '}최대 사용 <span className="font-bold">{maxUsable.toLocaleString()}P</span>
              {!isPointUsable(pointBalance) && <span className="text-error ml-1">(1,000P 이상 보유 시 사용 가능)</span>}
            </p>
            <div className="flex gap-2">
              <input
                type="text" inputMode="numeric" placeholder="0"
                className={`input input-bordered input-sm flex-1 ${pointsError ? 'input-error' : ''}`}
                value={pointsInput} onChange={handlePointsChange}
                disabled={!isPointUsable(pointBalance)}
              />
              <button type="button" className="btn btn-outline btn-sm" onClick={handleUseAllPoints}
                disabled={!isPointUsable(pointBalance)}>
                전액 사용
              </button>
            </div>
            {pointsError && <p className="text-error text-xs">{pointsError}</p>}
          </div>
        </div>

        {/* 결제 금액 */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4 gap-2">
            <h2 className="font-semibold">결제 금액</h2>
            <div className="flex justify-between text-sm"><span>상품 금액</span><span>{subtotal.toLocaleString()}원</span></div>
            <div className="flex justify-between text-sm">
              <span>배송비</span>
              <span>{shippingFee === 0 ? <span className="text-success">무료</span> : `${shippingFee.toLocaleString()}원`}</span>
            </div>
            {pointsToUse > 0 && !pointsError && (
              <div className="flex justify-between text-sm text-success">
                <span>포인트 할인</span>
                <span>−{pointsToUse.toLocaleString()}P</span>
              </div>
            )}
            <div className="divider my-1" />
            <div className="flex justify-between font-bold text-lg">
              <span>최종 결제금액</span>
              <span className="text-primary">{total.toLocaleString()}원</span>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting || !!pointsError}>
          {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : `${total.toLocaleString()}원 결제하기`}
        </button>
      </form>
    </div>
  )
}
