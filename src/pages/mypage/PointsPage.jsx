import { useGetMyPointsQuery } from '../../features/points/pointsApiSlice'
import { POINT_MIN_USE, POINT_MAX_USE_RATIO, POINT_EXPIRY_DAYS } from '../../features/points/pointConstants'

export default function PointsPage() {
  const { data, isLoading, isError } = useGetMyPointsQuery()

  const balance = data?.balance ?? 0
  const history = data?.content ?? []

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (isError) {
    return <p className="text-error py-12 text-center">포인트 정보를 불러오지 못했습니다.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">포인트 내역</h2>

      {/* 잔액 카드 */}
      <div className="card bg-primary text-primary-content shadow-sm">
        <div className="card-body p-5">
          <p className="text-sm opacity-80">보유 포인트</p>
          <p className="text-4xl font-bold">{balance.toLocaleString()} P</p>
          <p className="text-xs opacity-70 mt-1">
            최소 {POINT_MIN_USE.toLocaleString()}P부터 사용 · 결제금액의 최대 {POINT_MAX_USE_RATIO * 100}% · 적립 후 {POINT_EXPIRY_DAYS}일 유효
          </p>
        </div>
      </div>

      {/* 내역 */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4 gap-0">
          <h3 className="font-semibold mb-3">적립/사용 내역</h3>
          {history.length === 0 ? (
            <p className="text-base-content/60 py-8 text-center text-sm">내역이 없습니다.</p>
          ) : (
            <ul className="divide-y divide-base-200">
              {history.map((h) => (
                <li key={h.id} className="flex justify-between items-center py-3">
                  <div>
                    <p className="text-sm">{h.description}</p>
                    <p className="text-xs text-base-content/50">{new Date(h.createdAt).toLocaleDateString('ko-KR')}</p>
                  </div>
                  <span className={`font-bold text-sm ${h.amount > 0 ? 'text-success' : 'text-error'}`}>
                    {h.amount > 0 ? '+' : ''}{h.amount.toLocaleString()}P
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
