/**
 * ReviewCard
 * - 닉네임 + 반려동물 정보 뱃지
 * - 별점 + 작성일 + 구매 옵션
 * - 이미지 그리드 (최대 4장, 초과 시 +N 오버레이) + 라이트박스 모달
 * - 리뷰 내용 (한 줄 요약 + 본문 접기/펼치기)
 * - 도움이 돼요 버튼
 */

import { useState } from 'react'

const CONTENT_LIMIT = 120

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={`w-4 h-4 ${s <= rating ? 'text-warning' : 'text-base-300'}`} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// 라이트박스 모달
function Lightbox({ images, startIndex, onClose }) {
  const [idx, setIdx] = useState(startIndex)

  function prev(e) { e.stopPropagation(); setIdx((i) => (i - 1 + images.length) % images.length) }
  function next(e) { e.stopPropagation(); setIdx((i) => (i + 1) % images.length) }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
        {/* 닫기 */}
        <button
          className="absolute -top-10 right-0 text-white text-2xl leading-none"
          onClick={onClose}
        >✕</button>

        {/* 이미지 */}
        <img
          src={images[idx]}
          alt={`리뷰 사진 ${idx + 1}`}
          className="w-full rounded-xl object-contain max-h-[70vh]"
        />

        {/* 카운터 */}
        <p className="text-center text-white text-sm mt-3">{idx + 1} / {images.length}</p>

        {/* 네비게이션 */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-black/50 border-0 text-white"
              onClick={prev}
            >‹</button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-black/50 border-0 text-white"
              onClick={next}
            >›</button>
          </>
        )}
      </div>
    </div>
  )
}

export default function ReviewCard({ review, isHelpful, onHelpful }) {
  const [expanded, setExpanded] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(null)

  const { author, petInfo, rating, createdAt, orderedOption, images = [], summary, content, helpfulCount, hasMedia } = review
  const needsTruncate = content.length > CONTENT_LIMIT
  const displayContent = expanded || !needsTruncate ? content : content.slice(0, CONTENT_LIMIT) + '...'

  const MAX_THUMB = 4
  const shownImages = images.slice(0, MAX_THUMB)
  const extraCount = images.length - MAX_THUMB

  return (
    <>
      <div className="bg-base-100 rounded-2xl p-5 flex flex-col gap-3">
        {/* 헤더: 닉네임 + 반려동물 정보 */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{author}</span>
            {petInfo && (
              <span className="badge badge-outline badge-sm text-xs text-base-content/60">
                🐾 {petInfo.name} / {petInfo.breed} / {petInfo.age}세
              </span>
            )}
          </div>
          {hasMedia && (
            <span className="badge badge-warning badge-outline badge-xs shrink-0">포토</span>
          )}
        </div>

        {/* 별점 + 날짜 + 구매옵션 */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <StarRow rating={rating} />
            <span className="text-xs text-base-content/50">
              {new Date(createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>
          {orderedOption && (
            <p className="text-xs text-base-content/40">{orderedOption}</p>
          )}
        </div>

        {/* 이미지 그리드 */}
        {shownImages.length > 0 && (
          <div className="flex gap-2">
            {shownImages.map((url, i) => (
              <button
                key={i}
                onClick={() => setLightboxIdx(i)}
                className="relative w-20 h-20 rounded-xl overflow-hidden border border-base-200 shrink-0 hover:opacity-80 transition-opacity"
              >
                <img src={url} alt={`리뷰 이미지 ${i + 1}`} className="w-full h-full object-cover" />
                {/* +N 오버레이 (마지막 썸네일에만) */}
                {i === MAX_THUMB - 1 && extraCount > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">+{extraCount}</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* 리뷰 내용 */}
        <div>
          {summary && (
            <p className="font-semibold text-sm text-base-content mb-1">{summary}</p>
          )}
          <p className="text-sm text-base-content/80 leading-relaxed">{displayContent}</p>
          {needsTruncate && (
            <button
              className="text-xs text-primary mt-1 hover:underline"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? '접기' : '더보기'}
            </button>
          )}
        </div>

        {/* 도움이 돼요 */}
        <div className="flex items-center gap-2 pt-1 border-t border-base-200">
          <button
            onClick={onHelpful}
            disabled={isHelpful}
            className={`btn btn-xs rounded-full gap-1 ${isHelpful ? 'btn-neutral cursor-default' : 'btn-outline border-base-300 text-base-content/60 hover:border-base-content/40'}`}
          >
            👍 도움이 돼요
            <span className="font-semibold">{helpfulCount + (isHelpful ? 0 : 0)}</span>
          </button>
        </div>
      </div>

      {/* 라이트박스 */}
      {lightboxIdx !== null && (
        <Lightbox
          images={images}
          startIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}
    </>
  )
}
