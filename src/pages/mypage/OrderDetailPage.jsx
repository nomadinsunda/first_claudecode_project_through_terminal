import { useParams, Link, useNavigate } from 'react-router-dom'
import { useGetOrderByIdQuery, useCancelOrderMutation } from '../../features/orders/ordersApiSlice'
import { ORDER_STATUS_LABEL } from '../../features/orders/orderConstants'
import { isCancellable, getRefundMessage } from '../../features/orders/orderUtils'

const STATUS_BADGE = {
  PENDING_PAYMENT: 'badge-warning',
  PAID:            'badge-info',
  PREPARING:       'badge-info',
  SHIPPING:        'badge-primary',
  DELIVERED:       'badge-success',
  PAYMENT_FAILED:  'badge-error',
  CANCELLED:       'badge-ghost',
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: order, isLoading, isError } = useGetOrderByIdQuery(id)
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation()

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="text-center py-16">
        <p className="text-base-content/60 mb-4">주문을 찾을 수 없습니다.</p>
        <Link to="/mypage/orders" className="btn btn-primary btn-sm">주문 내역으로</Link>
      </div>
    )
  }

  const cancellable = isCancellable(order.status)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>←</button>
        <h2 className="text-xl font-bold">주문 상세</h2>
      </div>

      {/* 상태 */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4 flex-row justify-between items-center">
          <div>
            <p className="font-mono text-xs text-base-content/50">{order.id}</p>
            <p className="text-xs text-base-content/50">{new Date(order.createdAt).toLocaleString('ko-KR')}</p>
          </div>
          <span className={`badge badge-lg ${STATUS_BADGE[order.status]}`}>
            {ORDER_STATUS_LABEL[order.status]}
          </span>
        </div>
      </div>

      {/* 상품 */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4 gap-3">
          <h3 className="font-semibold">주문 상품</h3>
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <img src={item.imageUrl} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-base-content/60">{item.quantity}개 · {item.salePrice.toLocaleString()}원</p>
              </div>
              {order.status === 'DELIVERED' && (
                <Link
                  to={`/mypage/reviews/write?orderId=${order.id}&productId=${item.productId}&productName=${encodeURIComponent(item.name)}&deliveredAt=${order.deliveredAt}`}
                  className="btn btn-outline btn-xs shrink-0"
                >
                  리뷰 작성
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 배송지 */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4 gap-1">
          <h3 className="font-semibold mb-1">배송지</h3>
          <p className="text-sm">{order.recipient.name} · {order.recipient.phone}</p>
          <p className="text-sm text-base-content/70">{order.recipient.address}</p>
        </div>
      </div>

      {/* 결제 금액 */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4 gap-2">
          <h3 className="font-semibold">결제 금액</h3>
          <div className="flex justify-between text-sm"><span>상품 금액</span><span>{order.subtotal.toLocaleString()}원</span></div>
          <div className="flex justify-between text-sm">
            <span>배송비</span>
            <span>{order.shippingFee === 0 ? <span className="text-success">무료</span> : `${order.shippingFee.toLocaleString()}원`}</span>
          </div>
          {order.pointsUsed > 0 && (
            <div className="flex justify-between text-sm text-success">
              <span>포인트 할인</span>
              <span>−{order.pointsUsed.toLocaleString()}P</span>
            </div>
          )}
          <div className="divider my-1" />
          <div className="flex justify-between font-bold">
            <span>최종 결제금액</span>
            <span className="text-primary">{order.total.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 취소 */}
      {cancellable && (
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body p-4 gap-2">
            <p className="text-sm text-base-content/70">{getRefundMessage(order)}</p>
            <button
              className="btn btn-error btn-outline btn-sm w-fit"
              onClick={() => cancelOrder(order.id)}
              disabled={isCancelling}
            >
              {isCancelling ? <span className="loading loading-spinner loading-xs" /> : '주문 취소 신청'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
