import { Link } from 'react-router-dom'
import { useGetOrdersQuery, useCancelOrderMutation } from '../../features/orders/ordersApiSlice'
import { ORDER_STATUS_LABEL } from '../../features/orders/orderConstants'
import { isCancellable } from '../../features/orders/orderUtils'

const STATUS_BADGE = {
  PENDING_PAYMENT: 'badge-warning',
  PAID:            'badge-info',
  PREPARING:       'badge-info',
  SHIPPING:        'badge-primary',
  DELIVERED:       'badge-success',
  PAYMENT_FAILED:  'badge-error',
  CANCELLED:       'badge-ghost',
}

export default function OrderListPage() {
  const { data, isLoading, isError } = useGetOrdersQuery()
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation()

  const orders = data?.content ?? []

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (isError) {
    return <p className="text-error py-12 text-center">주문 내역을 불러오지 못했습니다.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">주문 내역</h2>

      {orders.length === 0 ? (
        <p className="text-base-content/60 py-12 text-center">주문 내역이 없습니다.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="card bg-base-100 shadow-sm">
            <div className="card-body p-4 gap-3">
              {/* 헤더 */}
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <p className="font-mono text-xs text-base-content/50">{order.id}</p>
                  <p className="text-xs text-base-content/50">{new Date(order.createdAt).toLocaleDateString('ko-KR')}</p>
                </div>
                <span className={`badge ${STATUS_BADGE[order.status]}`}>
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
              </div>

              {/* 상품 목록 */}
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.name}</p>
                    <p className="text-xs text-base-content/60">{item.quantity}개 · {item.salePrice.toLocaleString()}원</p>
                  </div>
                </div>
              ))}

              {/* 합계 & 버튼 */}
              <div className="flex justify-between items-center pt-1 border-t border-base-200">
                <span className="font-bold">{order.total.toLocaleString()}원</span>
                <div className="flex gap-2">
                  {isCancellable(order.status) && (
                    <button
                      className="btn btn-outline btn-xs btn-error"
                      onClick={() => cancelOrder(order.id)}
                      disabled={isCancelling}
                    >
                      주문 취소
                    </button>
                  )}
                  <Link to={`/mypage/orders/${order.id}`} className="btn btn-outline btn-xs">상세보기</Link>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
