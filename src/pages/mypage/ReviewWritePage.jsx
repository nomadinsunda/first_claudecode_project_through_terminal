import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useCreateReviewMutation } from '../../features/reviews/reviewsApiSlice'
import { isReviewEligible, getReviewPoints } from '../../features/reviews/reviewUtils'

export default function ReviewWritePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation()

  const orderId     = searchParams.get('orderId') ?? ''
  const productId   = Number(searchParams.get('productId') ?? 0)
  const productName = searchParams.get('productName') ?? '상품'
  const deliveredAt = searchParams.get('deliveredAt') ?? ''

  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [hasMedia, setHasMedia] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const eligible = deliveredAt ? isReviewEligible(deliveredAt) : true
  const expectedPoints = getReviewPoints(hasMedia)

  async function handleSubmit(e) {
    e.preventDefault()
    if (rating === 0) return
    await createReview({ productId, orderId, rating, content, hasMedia }).unwrap()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="text-4xl">🌟</div>
        <p className="text-lg font-bold">리뷰가 등록되었습니다!</p>
        <p className="text-sm text-base-content/60">관리자 승인 후 {expectedPoints.toLocaleString()}P가 적립됩니다.</p>
        <button className="btn btn-primary btn-sm mt-2" onClick={() => navigate('/mypage/orders')}>주문 내역으로</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">리뷰 작성</h2>

      {!eligible && (
        <div role="alert" className="alert alert-warning text-sm">
          배송완료 후 30일이 지나 리뷰 작성 기간이 종료되었습니다.
        </div>
      )}

      <div className="card bg-base-100 shadow-sm">
        <div className="card-body p-4 gap-1">
          <p className="text-xs text-base-content/50">주문 {orderId}</p>
          <p className="font-medium">{decodeURIComponent(productName)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-sm">
        <div className="card-body p-4 gap-4">
          {/* 별점 */}
          <div>
            <p className="text-sm font-medium mb-2">별점 <span className="text-error">*</span></p>
            <div className="rating rating-lg">
              {[1, 2, 3, 4, 5].map((s) => (
                <input key={s} type="radio" name="rating" className="mask mask-star-2 bg-warning"
                  checked={rating === s} onChange={() => setRating(s)} />
              ))}
            </div>
          </div>

          {/* 내용 */}
          <div>
            <p className="text-sm font-medium mb-2">리뷰 내용 <span className="text-error">*</span></p>
            <textarea
              className="textarea textarea-bordered w-full min-h-28"
              placeholder="상품에 대한 솔직한 리뷰를 작성해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              minLength={10}
            />
          </div>

          {/* 사진/영상 */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-primary"
              checked={hasMedia} onChange={(e) => setHasMedia(e.target.checked)} />
            <span className="text-sm">사진/영상 포함</span>
          </label>

          {/* 예상 적립 포인트 */}
          <div className="bg-base-200 rounded-lg p-3 text-sm">
            예상 적립 포인트:{' '}
            <span className="font-bold text-success">{expectedPoints.toLocaleString()}P</span>
            <span className="text-base-content/50 ml-1">(관리자 승인 후 지급)</span>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={!eligible || rating === 0 || isSubmitting}>
            {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : '리뷰 등록'}
          </button>
        </div>
      </form>
    </div>
  )
}
