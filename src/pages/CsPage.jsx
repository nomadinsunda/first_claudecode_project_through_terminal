import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import CsHeader   from './cs/CsHeader'
import InquiryTab from './cs/InquiryTab'
import FaqTab     from './cs/FaqTab'
import VoiceTab   from './cs/VoiceTab'
import NewsTab    from './cs/NewsTab'

const TAB = { INQUIRY: 'inquiry', FAQ: 'faq', VOICE: 'voice', NEWS: 'news' }

const TAB_LABELS = [
  { key: TAB.INQUIRY, label: '문의내역' },
  { key: TAB.FAQ,     label: '자주묻는 질문' },
  { key: TAB.VOICE,   label: '고객의 소리' },
  { key: TAB.NEWS,    label: '펫마켓소식' },
]

export default function CsPage() {
  const location   = useLocation()
  const initialTab = Object.values(TAB).includes(location.state?.tab) ? location.state.tab : TAB.INQUIRY

  const [tab, setTab]           = useState(initialTab)
  const [faqKeyword, setFaqKeyword] = useState('')

  function handleHeaderSearch(query) {
    setFaqKeyword(query)
    setTab(TAB.FAQ)
  }

  function handleTabChange(key) {
    setTab(key)
    if (key !== TAB.FAQ) setFaqKeyword('')
  }

  return (
    <div>
      {/* 파란 헤더 */}
      <CsHeader onSearch={handleHeaderSearch} />

      {/* 탭 네비게이션 */}
      <div className="border-b border-base-300 bg-base-100">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          {/* 메인 탭 */}
          <div className="flex">
            {TAB_LABELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                  tab === key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-base-content/60 hover:text-base-content'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 우측 유틸 */}
          <div className="flex items-center gap-4 text-xs text-base-content/50">
            <button className="hover:text-base-content transition-colors">환불안내</button>
            <span className="text-base-content/20">|</span>
            <div className="text-right">
              <p className="font-bold text-base-content/70">고객센터 070-1234-5678</p>
              <p>365일, 24시간 운영</p>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {tab === TAB.INQUIRY && <InquiryTab />}
        {tab === TAB.FAQ     && <FaqTab externalKeyword={faqKeyword} />}
        {tab === TAB.VOICE   && <VoiceTab />}
        {tab === TAB.NEWS    && <NewsTab />}
      </div>
    </div>
  )
}
