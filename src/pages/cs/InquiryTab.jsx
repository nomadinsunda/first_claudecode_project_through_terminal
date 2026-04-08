import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { selectIsAuthenticated } from '../../features/auth/authSlice'
import { useGetMyInquiriesQuery } from '../../features/cs/csApiSlice'

const STATUS_LABEL = { ANSWERED: '상담종료', PENDING: '답변대기' }
const STATUS_CLASS = { ANSWERED: 'text-base-content/50', PENDING: 'text-primary' }

function InquiryDetail({ inquiry }) {
  if (!inquiry) {
    return (
      <div className="flex-1 flex items-center justify-center text-base-content/30 text-sm">
        고객센터 문의
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="badge badge-outline badge-sm mb-1">{inquiry.type}</span>
          <h3 className="font-semibold">{inquiry.title}</h3>
          <p className="text-xs text-base-content/50 mt-0.5">
            {new Date(inquiry.createdAt).toLocaleDateString('ko-KR')}
          </p>
        </div>
        <span className={`text-xs font-semibold shrink-0 ${STATUS_CLASS[inquiry.status]}`}>
          {STATUS_LABEL[inquiry.status]}
        </span>
      </div>

      {/* 상품 정보 */}
      {inquiry.productName && (
        <div className="flex items-center gap-3 p-3 bg-base-200 rounded-xl text-sm">
          <img src={inquiry.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
          <span className="text-base-content/70">{inquiry.productName}</span>
        </div>
      )}

      {/* 문의 내용 */}
      <div className="bg-base-100 border border-base-300 rounded-xl p-4">
        <p className="text-xs font-semibold text-base-content/50 mb-2">문의 내용</p>
        <p className="text-sm leading-relaxed">{inquiry.content}</p>
      </div>

      {/* 답변 */}
      {inquiry.answer ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-500 mb-2">
            답변 · {new Date(inquiry.answeredAt).toLocaleDateString('ko-KR')}
          </p>
          <p className="text-sm leading-relaxed text-base-content">{inquiry.answer}</p>
        </div>
      ) : (
        <div className="bg-base-200 rounded-xl p-4 text-sm text-base-content/50 text-center">
          답변 준비 중입니다. 24시간 내에 답변 드리겠습니다.
        </div>
      )}
    </div>
  )
}

function LoginPrompt() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center p-8">
      <p className="text-base-content/60 text-sm">문의내역을 확인하려면 로그인이 필요합니다.</p>
      <Link to="/login" state={{ from: '/cs' }} className="btn btn-primary btn-sm">
        로그인하기
      </Link>
    </div>
  )
}

export default function InquiryTab() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const [selectedId, setSelectedId] = useState(null)

  const { data, isLoading } = useGetMyInquiriesQuery(
    { page: 0, size: 50 },
    { skip: !isAuthenticated }
  )
  const inquiries = data?.content ?? []
  const selectedInquiry = inquiries.find(i => i.id === selectedId) ?? null

  return (
    <div className="border border-base-300 rounded-xl overflow-hidden" style={{ minHeight: 480 }}>
      <div className="flex h-full">
        {/* 사이드바 */}
        <div className="w-72 shrink-0 border-r border-base-300 flex flex-col">
          {/* 채팅 상담 버튼 */}
          <div className="p-4 flex items-center justify-between border-b border-base-300">
            <button
              style={{ backgroundColor: '#4a5af0' }}
              className="flex items-center gap-2 text-white text-sm font-semibold px-3 py-2 rounded-lg"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" />
              </svg>
              채팅 상담하기
            </button>
            <button className="text-xs text-base-content/50 hover:text-base-content">편집</button>
          </div>

          {/* 문의 목록 */}
          {!isAuthenticated ? (
            <div className="flex-1 flex items-center justify-center p-4 text-xs text-base-content/50 text-center">
              로그인 후 문의내역을<br />확인할 수 있습니다.
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-sm" />
            </div>
          ) : inquiries.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-1">
              <p className="text-sm font-semibold">최근 문의내역을 모두 확인하셨습니다.</p>
              <p className="text-xs text-primary">이전 문의내역이 필요하시면 고객센터에 문의해 주세요.</p>
            </div>
          ) : (
            <ul className="flex-1 overflow-y-auto divide-y divide-base-200">
              {inquiries.map(inq => (
                <li key={inq.id}>
                  <button
                    className={`w-full flex items-start gap-3 p-4 text-left hover:bg-base-100 transition-colors ${selectedId === inq.id ? 'bg-base-100' : ''}`}
                    onClick={() => setSelectedId(inq.id)}
                  >
                    <img src={inq.thumbnail} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-base-content/60">{inq.type}</p>
                      <p className="text-sm font-medium truncate">{inq.productName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-semibold ${STATUS_CLASS[inq.status]}`}>
                          {STATUS_LABEL[inq.status]}
                        </span>
                        <span className="text-xs text-base-content/40">
                          {new Date(inq.createdAt).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 상세 패널 */}
        {!isAuthenticated ? (
          <LoginPrompt />
        ) : (
          <InquiryDetail inquiry={selectedInquiry} />
        )}
      </div>
    </div>
  )
}
