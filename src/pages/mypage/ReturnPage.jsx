import { useState } from 'react'
import { useGetOrdersQuery } from '../../features/orders/ordersApiSlice'
import { useCreateReturnMutation, useCreateExchangeMutation } from '../../features/cs/csApiSlice'
import { ORDER_STATUS } from '../../features/orders/orderConstants'
import { RETURN_REASON, RETURN_REASON_LABEL } from '../../features/cs/csConstants'
import { isReturnEligible, isExchangeEligible } from '../../features/cs/csUtils'
import { CATEGORY } from '../../features/products/productConstants'

const REQUEST_TYPE = { RETURN: 'RETURN', EXCHANGE: 'EXCHANGE' }

export default function ReturnPage() {
  const { data: ordersData, isLoading } = useGetOrdersQuery()
  const [createReturn, { isLoading: isReturning }] = useCreateReturnMutation()
  const [createExchange, { isLoading: isExchanging }] = useCreateExchangeMutation()

  const [type, setType]           = useState(REQUEST_TYPE.RETURN)
  const [orderId, setOrderId]     = useState('')
  const [reason, setReason]       = useState('')
  const [isOpened, setIsOpened]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isSubmitting = isReturning || isExchanging

  // 반품/교환 신청 가능한 주문 (배송완료)
  const eligibleOrders = (ordersData?.content ?? []).filter((o) => o.status === ORDER_STATUS.DELIVERED)
  const selectedOrder = eligibleOrders.find((o) => o.id === orderId)

  // 대표 카테고리 (첫 번째 상품 기준 — 실제 구현 시 아이템별 선택)
  const MOCK_CATEGORY = CATEGORY.FOOD

  const eligibility = selectedOrder && reason
    ? type === REQUEST_TYPE.RETURN
      ? isReturnEligible({ receivedAt: selectedOrder.deliveredAt, category: MOCK_CATEGORY, reason, isOpened })
      : isExchangeEligible({ receivedAt: selectedOrder.deliveredAt })
    : null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!eligibility?.eligible) return
    const body = { orderId, reason }
    if (type === REQUEST_TYPE.RETURN) {
      await createReturn(body).unwrap()
    } else {
      await createExchange(body).unwrap()
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="text-4xl">📦</div>
        <p className="text-lg font-bold">{type === REQUEST_TYPE.RETURN ? '반품' : '교환'} 신청이 완료되었습니다.</p>
        <p className="text-sm text-base-content/60">1:1 문의를 통해 진행 상황을 안내해드립니다.</p>
        <button className="btn btn-primary btn-sm mt-2" onClick={() => setSubmitted(false)}>새 신청</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">반품/교환 신청</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* 유형 선택 */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4 gap-3">
            <p className="font-semibold text-sm">신청 유형</p>
            <div className="flex gap-3">
              {Object.entries(REQUEST_TYPE).map(([, val]) => (
                <label key={val} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" className="radio radio-primary radio-sm"
                    checked={type === val} onChange={() => setType(val)} />
                  <span className="text-sm">{val === REQUEST_TYPE.RETURN ? '반품' : '교환'}</span>
                </label>
              ))}
            </div>
            {type === REQUEST_TYPE.EXCHANGE && (
              <p className="text-xs text-base-content/50">교환은 동일 상품(색상/사이즈 변경) 한정입니다.</p>
            )}
          </div>
        </div>

        {/* 주문 선택 */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4 gap-3">
            <p className="font-semibold text-sm">주문 선택 <span className="text-error">*</span></p>
            {isLoading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : eligibleOrders.length === 0 ? (
              <p className="text-sm text-base-content/60">신청 가능한 배송완료 주문이 없습니다.</p>
            ) : (
              <select className="select select-bordered select-sm w-full"
                value={orderId} onChange={(e) => setOrderId(e.target.value)} required>
                <option value="">주문을 선택해주세요</option>
                {eligibleOrders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} · {new Date(o.deliveredAt).toLocaleDateString('ko-KR')} 배송완료
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* 사유 */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4 gap-3">
            <p className="font-semibold text-sm">사유 <span className="text-error">*</span></p>
            <select className="select select-bordered select-sm w-full"
              value={reason} onChange={(e) => setReason(e.target.value)} required>
              <option value="">사유를 선택해주세요</option>
              {Object.entries(RETURN_REASON_LABEL).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>

            {reason === RETURN_REASON.CHANGE_OF_MIND && (
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="checkbox" className="checkbox checkbox-sm"
                  checked={isOpened} onChange={(e) => setIsOpened(e.target.checked)} />
                상품 개봉 여부
              </label>
            )}
          </div>
        </div>

        {/* 유효성 결과 */}
        {eligibility && (
          <div role="alert" className={`alert ${eligibility.eligible ? 'alert-success' : 'alert-error'} text-sm`}>
            {eligibility.eligible
              ? `${type === REQUEST_TYPE.RETURN ? '반품' : '교환'} 신청이 가능합니다.`
              : eligibility.reason}
          </div>
        )}

        <button type="submit" className="btn btn-primary w-full"
          disabled={!eligibility?.eligible || isSubmitting}>
          {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : '신청하기'}
        </button>
      </form>
    </div>
  )
}
