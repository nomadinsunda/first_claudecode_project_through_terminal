/**
 * ReviewFilter
 * - 정렬: 베스트순 | 최신순 | 별점높은순 | 별점낮은순
 * - 필터 칩: 사진 리뷰만 보기 | 한달사용기
 * - 키워드 검색
 */

export const SORT_OPTIONS = [
  { value: 'best',       label: '베스트순' },
  { value: 'latest',     label: '최신순' },
  { value: 'rating_asc', label: '별점 낮은순' },
  { value: 'rating_desc',label: '별점 높은순' },
]

export const FILTER_CHIPS = [
  { value: 'photo',    label: '📸 사진 리뷰만' },
  { value: 'longterm', label: '📅 한달사용기' },
]

export default function ReviewFilter({ sort, onSortChange, keyword, onKeywordChange, activeFilters, onFilterToggle }) {
  return (
    <div className="flex flex-col gap-3">
      {/* 정렬 버튼 */}
      <div className="flex gap-1.5 flex-wrap">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onSortChange(opt.value)}
            className={`btn btn-xs rounded-full ${sort === opt.value ? 'btn-neutral' : 'btn-outline border-base-300'}`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* 필터 칩 */}
      <div className="flex gap-2 flex-wrap">
        {FILTER_CHIPS.map((chip) => {
          const active = activeFilters.includes(chip.value)
          return (
            <button
              key={chip.value}
              onClick={() => onFilterToggle(chip.value)}
              className={`btn btn-sm rounded-full gap-1 ${active ? 'btn-primary' : 'btn-outline border-base-300 text-base-content/70'}`}
            >
              {chip.label}
              {active && <span>✓</span>}
            </button>
          )
        })}
      </div>

      {/* 키워드 검색 */}
      <div className="relative">
        <input
          type="text"
          placeholder="리뷰 내용 검색 (예: 기호성, 알러지, 변 상태)"
          className="input input-bordered input-sm w-full pr-10"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
        {keyword && (
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
            onClick={() => onKeywordChange('')}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  )
}
