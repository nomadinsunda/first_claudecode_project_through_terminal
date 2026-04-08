import { useLocation, Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function OrderCompletePage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  // state 없이 직접 접근 시 홈으로
  useEffect(() => {
    if (!state?.orderId) navigate('/', { replace: true })
  }, [state, navigate])

  if (!state?.orderId) return null

  const { orderId, total } = state

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="card bg-base-100 shadow-md w-full max-w-sm text-center">
        <div className="card-body items-center gap-4 p-8">
          <div className="text-5xl">✅</div>
          <h1 className="text-2xl font-bold">주문 완료!</h1>
          <p className="text-base-content/60 text-sm">주문이 성공적으로 접수되었습니다.</p>

          <div className="bg-base-200 rounded-xl w-full p-4 flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <span className="text-base-content/60">주문번호</span>
              <span className="font-mono font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/60">결제금액</span>
              <span className="font-bold text-primary">{total.toLocaleString()}원</span>
            </div>
          </div>

          <div className="flex flex-col w-full gap-2 mt-2">
            <Link to="/mypage/orders" className="btn btn-primary w-full">주문 내역 보기</Link>
            <Link to="/" className="btn btn-ghost w-full">쇼핑 계속하기</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
