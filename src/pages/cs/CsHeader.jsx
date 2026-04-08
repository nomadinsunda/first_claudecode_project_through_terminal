import { useState } from 'react'

export default function CsHeader({ onSearch }) {
  const [query, setQuery] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  return (
    <div style={{ backgroundColor: '#7889fb' }} className="px-4 py-6">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        {/* 타이틀 */}
        <h1 className="text-white text-2xl font-extrabold shrink-0 w-28">고객센터</h1>

        {/* 검색바 */}
        <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-white rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="자주묻는 질문 검색"
            className="flex-1 px-4 py-2.5 text-sm outline-none text-base-content"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="px-4 py-2.5 text-base-content/40 hover:text-base-content transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>
        </form>

        {/* 채팅 상담하기 */}
        <button
          style={{ backgroundColor: '#4a5af0' }}
          className="shrink-0 flex items-center gap-2 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          채팅 상담하기
        </button>
      </div>
    </div>
  )
}
