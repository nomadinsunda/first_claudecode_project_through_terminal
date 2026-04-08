import { useState } from 'react'
import { useGetNewsQuery } from '../../features/cs/csApiSlice'
import { NEWS_CATEGORIES } from '../../mocks/news'

const CATEGORY_BADGE = { 공지: 'badge-info', 이벤트: 'badge-warning', 보도자료: 'badge-ghost' }

export default function NewsTab() {
  const [category, setCategory] = useState('전체')
  const [openId, setOpenId]     = useState(null)

  const { data, isLoading } = useGetNewsQuery({ category })
  const newsList = data?.content ?? []

  return (
    <div className="flex flex-col gap-4">
      {/* 카테고리 탭 */}
      <div className="flex gap-1 border-b border-base-300">
        {NEWS_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setOpenId(null) }}
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

      {/* 소식 목록 */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : newsList.length === 0 ? (
        <div className="py-16 text-center text-base-content/40 text-sm">
          해당하는 소식이 없습니다.
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-base-300 border border-base-300 rounded-xl overflow-hidden">
          {newsList.map(item => (
            <div key={item.id}>
              <button
                className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-base-100 transition-colors"
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
              >
                <span className={`badge badge-sm shrink-0 ${CATEGORY_BADGE[item.category] ?? 'badge-ghost'}`}>
                  {item.category}
                </span>
                <span className="flex-1 text-sm">{item.title}</span>
                <span className="text-xs text-base-content/40 shrink-0">{item.date}</span>
                <svg
                  className={`w-4 h-4 text-base-content/40 shrink-0 transition-transform ${openId === item.id ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openId === item.id && (
                <div className="px-4 pb-5 border-t border-base-200 bg-base-50">
                  <p className="text-sm text-base-content/70 leading-relaxed pt-4">{item.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
