import { useState } from 'react'
import { useGetMyInquiriesQuery, useCreateInquiryMutation } from '../../features/cs/csApiSlice'

export default function InquiryPage() {
  const { data, isLoading, isError } = useGetMyInquiriesQuery()
  const [createInquiry, { isLoading: isSubmitting }] = useCreateInquiryMutation()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '' })

  const inquiries = data?.content ?? []

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    await createInquiry(form).unwrap()
    setForm({ title: '', content: '' })
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">1:1 문의</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowForm((v) => !v)}>
          {showForm ? '취소' : '문의 작성'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card bg-base-100 shadow-sm">
          <div className="card-body p-4 gap-3">
            <input name="title" placeholder="제목" className="input input-bordered w-full input-sm"
              value={form.title} onChange={handleChange} required />
            <textarea name="content" placeholder="문의 내용을 입력해주세요. (24시간 내 답변 목표)"
              className="textarea textarea-bordered w-full min-h-28"
              value={form.content} onChange={handleChange} required />
            <button type="submit" className="btn btn-primary btn-sm w-full" disabled={isSubmitting}>
              {isSubmitting ? <span className="loading loading-spinner loading-xs" /> : '제출'}
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-md" />
        </div>
      ) : isError ? (
        <p className="text-error py-12 text-center text-sm">문의 내역을 불러오지 못했습니다.</p>
      ) : inquiries.length === 0 ? (
        <p className="text-base-content/60 py-12 text-center text-sm">문의 내역이 없습니다.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {inquiries.map((inq) => (
            <li key={inq.id} className="card bg-base-100 shadow-sm">
              <div className="card-body p-4 flex-row justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{inq.title}</p>
                  <p className="text-xs text-base-content/50 mt-0.5">{new Date(inq.createdAt).toLocaleDateString('ko-KR')}</p>
                </div>
                <span className={`badge badge-sm shrink-0 ${inq.status === 'ANSWERED' ? 'badge-success' : 'badge-warning'}`}>
                  {inq.status === 'ANSWERED' ? '답변완료' : '답변대기'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
