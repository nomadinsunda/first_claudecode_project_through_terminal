import { useState, useEffect } from 'react'
import { useGetFaqsQuery } from '../../features/cs/csApiSlice'
import { FAQ_CATEGORIES } from '../../mocks/faqs'

const PAGE_SIZE = 10

export default function FaqTab({ externalKeyword = '' }) {
  const [category, setCategory] = useState('전체')
  const [keyword, setKeyword]   = useState(externalKeyword)
  const [visible, setVisible]   = useState(PAGE_SIZE)
  const [openId, setOpenId]     = useState(null)

  // 외부 검색(헤더)에서 키워드 전달 시 동기화
  useEffect(() => {
    if (externalKeyword) {
      setKeyword(externalKeyword)
      setCategory('전체')
      setVisible(PAGE_SIZE)
    }
  }, [externalKeyword])

  const { data, isLoading } = useGetFaqsQuery({ category, q: keyword })
  const allFaqs   = data?.content ?? []
  const shown     = allFaqs.slice(0, visible)
  const hasMore   = visible < allFaqs.length

  function handleCategoryChange(cat) {
    setCategory(cat)
    setVisible(PAGE_SIZE)
    setOpenId(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 카테고리 탭 */}
      <div className="flex gap-1 flex-wrap border-b border-base-300 pb-0">
        {FAQ_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              category === cat
                ? 'border-primary text-primary'
                : 'border-transparent text-base-content/60 hover:text-base-content'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 검색 상태 표시 */}
      {keyword && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-base-content/60">
            "<span className="font-semibold text-base-content">{keyword}</span>" 검색 결과
            {allFaqs.length > 0 ? ` ${allFaqs.length}건` : ' — 결과 없음'}
          </span>
          <button
            className="text-xs text-error hover:underline"
            onClick={() => { setKeyword(''); setVisible(PAGE_SIZE) }}
          >
            검색 초기화
          </button>
        </div>
      )}

      {/* FAQ 목록 */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : shown.length === 0 ? (
        <div className="py-16 text-center text-base-content/40 text-sm">
          해당하는 FAQ가 없습니다.
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-base-300 border border-base-300 rounded-xl overflow-hidden">
          {shown.map(faq => (
            <div key={faq.id}>
              <button
                className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-base-100 transition-colors"
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              >
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: '#7889fb' }}
                >
                  Q
                </span>
                <span className="flex-1 text-sm font-medium">{faq.question}</span>
                <svg
                  className={`w-4 h-4 text-base-content/40 shrink-0 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openId === faq.id && (
                <div className="px-4 pb-4 ml-9">
                  <p className="text-sm text-base-content/70 leading-relaxed border-l-2 border-base-300 pl-3">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 더보기 */}
      {hasMore && (
        <button
          className="btn btn-outline btn-sm w-full"
          onClick={() => setVisible(v => v + PAGE_SIZE)}
        >
          더보기 ({allFaqs.length - visible}개 남음)
        </button>
      )}
    </div>
  )
}
