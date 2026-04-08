/**
 * ReviewContainer
 * 데이터 페칭, 정렬/필터/검색/페이지네이션 상태 관리.
 * ReviewSummary + ReviewFilter + ReviewCard 목록을 조합합니다.
 */

import { useState, useMemo } from 'react'
import { useGetProductReviewsQuery, useMarkHelpfulMutation } from '../reviewsApiSlice'
import ReviewSummary from './ReviewSummary'
import ReviewFilter from './ReviewFilter'
import ReviewCard from './ReviewCard'

const PAGE_SIZE = 5  // 더보기 단위

function sortReviews(reviews, sort) {
  const arr = [...reviews]
  switch (sort) {
    case 'best':        return arr.sort((a, b) => (b.helpfulCount ?? 0) - (a.helpfulCount ?? 0))
    case 'latest':      return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'rating_desc': return arr.sort((a, b) => b.rating - a.rating)
    case 'rating_asc':  return arr.sort((a, b) => a.rating - b.rating)
    default:            return arr
  }
}

function filterReviews(reviews, activeFilters, keyword) {
  let result = reviews

  if (activeFilters.includes('photo')) {
    result = result.filter((r) => r.hasMedia && r.images?.length > 0)
  }

  if (activeFilters.includes('longterm')) {
    result = result.filter((r) => r.tags?.includes('longterm'))
  }

  if (keyword.trim()) {
    const lower = keyword.toLowerCase()
    result = result.filter(
      (r) =>
        r.content?.toLowerCase().includes(lower) ||
        r.summary?.toLowerCase().includes(lower)
    )
  }

  return result
}

export default function ReviewContainer({ productId }) {
  const [sort, setSort]                 = useState('best')
  const [keyword, setKeyword]           = useState('')
  const [activeFilters, setActiveFilters] = useState([])
  const [visibleCount, setVisibleCount]   = useState(PAGE_SIZE)
  const [helpfulIds, setHelpfulIds]       = useState(new Set())

  // 한 번에 충분히 가져와서 클라이언트 필터링
  const { data, isLoading, isError } = useGetProductReviewsQuery({
    productId,
    page: 0,
    size: 50,
  })
  const [markHelpful] = useMarkHelpfulMutation()

  const allReviews = data?.content ?? []

  const processedReviews = useMemo(() => {
    const filtered = filterReviews(allReviews, activeFilters, keyword)
    return sortReviews(filtered, sort)
  }, [allReviews, sort, activeFilters, keyword])

  const visibleReviews = processedReviews.slice(0, visibleCount)
  const hasMore = visibleCount < processedReviews.length

  function handleFilterToggle(value) {
    setActiveFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
    setVisibleCount(PAGE_SIZE) // 필터 변경 시 처음부터
  }

  function handleSortChange(value) {
    setSort(value)
    setVisibleCount(PAGE_SIZE)
  }

  function handleKeywordChange(value) {
    setKeyword(value)
    setVisibleCount(PAGE_SIZE)
  }

  function handleHelpful(reviewId) {
    if (helpfulIds.has(reviewId)) return
    markHelpful(reviewId)
    setHelpfulIds((prev) => new Set([...prev, reviewId]))
  }

  // 썸네일 클릭 시 해당 리뷰로 스크롤 (간략 구현: 해당 리뷰 ID의 카드로 포커스)
  function handleThumbnailClick(reviewId) {
    // 해당 리뷰가 보이도록 visibleCount 확장
    const idx = processedReviews.findIndex((r) => r.id === reviewId)
    if (idx >= visibleCount) setVisibleCount(idx + 1)
    setTimeout(() => {
      document.getElementById(`review-${reviewId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  if (isLoading) {
    return (
      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">리뷰</h2>
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-md" />
        </div>
      </section>
    )
  }

  if (isError) {
    return (
      <section className="mt-10">
        <h2 className="text-xl font-bold mb-4">리뷰</h2>
        <p className="text-error text-sm text-center py-8">리뷰를 불러오지 못했습니다.</p>
      </section>
    )
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold mb-4">
        리뷰
        {allReviews.length > 0 && (
          <span className="text-base font-normal text-base-content/50 ml-2">({allReviews.length})</span>
        )}
      </h2>

      {allReviews.length === 0 ? (
        <div className="py-12 text-center text-base-content/50 bg-base-100 rounded-2xl">
          아직 작성된 리뷰가 없습니다.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* 요약 통계 */}
          <ReviewSummary reviews={allReviews} onThumbnailClick={handleThumbnailClick} />

          {/* 구분선 */}
          <div className="divider my-0" />

          {/* 필터 */}
          <ReviewFilter
            sort={sort}
            onSortChange={handleSortChange}
            keyword={keyword}
            onKeywordChange={handleKeywordChange}
            activeFilters={activeFilters}
            onFilterToggle={handleFilterToggle}
          />

          {/* 결과 없음 */}
          {processedReviews.length === 0 ? (
            <div className="py-10 text-center text-base-content/50 bg-base-100 rounded-2xl text-sm">
              해당하는 리뷰가 없습니다.
            </div>
          ) : (
            <>
              <p className="text-xs text-base-content/50">
                {processedReviews.length}개의 리뷰
              </p>

              {/* 리뷰 카드 목록 */}
              <ul className="flex flex-col gap-3">
                {visibleReviews.map((review) => (
                  <li key={review.id} id={`review-${review.id}`}>
                    <ReviewCard
                      review={review}
                      isHelpful={helpfulIds.has(review.id)}
                      onHelpful={() => handleHelpful(review.id)}
                    />
                  </li>
                ))}
              </ul>

              {/* 더보기 */}
              {hasMore && (
                <button
                  className="btn btn-outline w-full"
                  onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                >
                  리뷰 더보기 ({processedReviews.length - visibleCount}개 남음)
                </button>
              )}
            </>
          )}
        </div>
      )}
    </section>
  )
}
