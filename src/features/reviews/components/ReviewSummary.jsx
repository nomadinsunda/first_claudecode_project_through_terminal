/**
 * ReviewSummary
 * - 전체 평점 + 리뷰 수
 * - 별점별 분포 프로그레스 바 (5 → 1)
 * - 포토 리뷰 가로 스크롤 썸네일
 */

function StarIcon({ filled }) {
  return (
    <svg className={`w-5 h-5 ${filled ? 'text-warning' : 'text-base-300'}`} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

export default function ReviewSummary({ reviews, onThumbnailClick }) {
  const count = reviews.length
  if (count === 0) return null

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / count)
  const avgDisplay = avg.toFixed(1)

  // 별점별 카운트
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  // 포토 리뷰 이미지 목록 (flat)
  const photoItems = reviews
    .filter((r) => r.hasMedia && r.images?.length > 0)
    .flatMap((r) => r.images.map((url) => ({ url, reviewId: r.id })))

  return (
    <div className="bg-base-100 rounded-2xl p-5 flex flex-col gap-5">
      {/* 평점 요약 */}
      <div className="flex gap-8 items-center">
        {/* 왼쪽: 숫자 + 별 */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <span className="text-5xl font-extrabold text-base-content">{avgDisplay}</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <StarIcon key={s} filled={s <= Math.round(avg)} />
            ))}
          </div>
          <span className="text-xs text-base-content/50">리뷰 {count}개</span>
        </div>

        {/* 오른쪽: 분포 바 */}
        <div className="flex flex-col gap-1.5 flex-1">
          {dist.map(({ star, count: c }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs text-base-content/60 w-4 shrink-0">{star}점</span>
              <div className="flex-1 bg-base-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-warning rounded-full transition-all"
                  style={{ width: count > 0 ? `${(c / count) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-xs text-base-content/50 w-4 text-right shrink-0">{c}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 포토 리뷰 썸네일 */}
      {photoItems.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-base-content/60 mb-2">포토 리뷰 {photoItems.length}장</p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {photoItems.map((item, i) => (
              <button
                key={i}
                onClick={() => onThumbnailClick?.(item.reviewId, item.url)}
                className="shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-base-200 hover:opacity-80 transition-opacity"
              >
                <img src={item.url} alt="포토 리뷰" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
