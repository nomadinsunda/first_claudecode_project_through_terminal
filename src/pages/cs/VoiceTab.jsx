import { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../../features/auth/authSlice'
import { useGetOrdersQuery } from '../../features/orders/ordersApiSlice'
import { useSubmitVoiceMutation } from '../../features/cs/csApiSlice'
import { ORDER_STATUS_LABEL } from '../../features/orders/orderConstants'

const VOICE_TYPES = ['상품 문의', '배송 문의', '반품/교환', '결제 문의', '포인트 문의', '기타']
const REPLY_METHODS = [
  { value: 'inquiry', label: '문의내역' },
  { value: 'phone',   label: '전화' },
  { value: 'sms',     label: '문자' },
  { value: 'none',    label: '답변 불필요' },
]
const MAX_IMAGES = 3

export default function VoiceTab() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const { data: ordersData } = useGetOrdersQuery(undefined, { skip: !isAuthenticated })
  const orders = ordersData?.content ?? []

  const [submitVoice, { isLoading: isSubmitting }] = useSubmitVoiceMutation()

  const [type, setType]           = useState('')
  const [orderRef, setOrderRef]   = useState('')
  const [content, setContent]     = useState('')
  const [replyMethod, setReplyMethod] = useState('inquiry')
  const [images, setImages]       = useState([])   // { file, preview }
  const [isDragging, setIsDragging] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors]       = useState({})
  const fileInputRef = useRef(null)

  function validate() {
    const errs = {}
    if (!type)          errs.type = '유형을 선택해 주세요.'
    if (!content.trim()) errs.content = '의견을 입력해 주세요.'
    return errs
  }

  function addFiles(fileList) {
    const remaining = MAX_IMAGES - images.length
    const newFiles  = Array.from(fileList).slice(0, remaining).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }))
    setImages(prev => [...prev, ...newFiles])
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    addFiles(e.dataTransfer.files)
  }

  function removeImage(idx) {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    await submitVoice({ type, orderRef, content, replyMethod }).unwrap()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="text-5xl">✅</div>
        <p className="text-xl font-bold">의견이 접수되었습니다.</p>
        <p className="text-sm text-base-content/60">소중한 의견 감사합니다. 선택하신 답변 방법으로 연락 드리겠습니다.</p>
        <button className="btn btn-primary btn-sm mt-2" onClick={() => { setSubmitted(false); setType(''); setOrderRef(''); setContent(''); setImages([]) }}>
          새 의견 보내기
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 상단 문구 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">
          펫마켓의 중심은 항상 <span style={{ color: '#7889fb' }}>고객님</span>입니다.
        </h2>
        <p className="text-sm text-base-content/70 leading-relaxed">
          펫마켓을 이용하시면서 느끼신 불편사항이나 바라는 점을 알려주세요.<br />
          고객님의 소중한 의견으로 한 뼘 더 성장하는 펫마켓이 되겠습니다.
        </p>
        <p className="text-sm text-warning font-medium mt-3">
          문의량이 많아 답변은 24시간 이상 소요될 수 있습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* 유형 + 주문 선택 */}
        <div className="border border-base-300 rounded-xl overflow-hidden mb-4">
          <div className="flex items-stretch divide-x divide-base-300">
            {/* 유형 선택 */}
            <div className="flex-1 p-1">
              <select
                className={`select select-ghost w-full text-sm ${errors.type ? 'select-error' : ''}`}
                value={type}
                onChange={(e) => { setType(e.target.value); setErrors(p => ({ ...p, type: '' })) }}
              >
                <option value="">유형을 선택해주세요</option>
                {VOICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* 주문내역 선택 */}
            <div className="flex-1 flex items-center pr-1">
              <select
                className="select select-ghost flex-1 text-sm"
                value={orderRef}
                onChange={(e) => setOrderRef(e.target.value)}
                disabled={!isAuthenticated || orders.length === 0}
              >
                <option value="">주문내역을 선택하세요</option>
                {orders.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.id} · {ORDER_STATUS_LABEL[o.status]}
                  </option>
                ))}
              </select>
              {orderRef && (
                <button type="button" className="text-base-content/40 hover:text-base-content px-2" onClick={() => setOrderRef('')}>✕</button>
              )}
            </div>

            <button
              type="button"
              style={{ backgroundColor: '#7889fb' }}
              className="shrink-0 text-white text-sm font-semibold px-4 py-3"
              onClick={() => {}}
            >
              주문상품 선택
            </button>
          </div>
          {errors.type && <p className="text-error text-xs px-4 pb-2">{errors.type}</p>}
        </div>

        {/* 의견 + 이미지 첨부 */}
        <div className="border border-base-300 rounded-xl overflow-hidden mb-4">
          {/* Textarea */}
          <textarea
            placeholder="의견을 남겨주세요"
            className={`w-full px-4 pt-4 pb-2 text-sm resize-none outline-none min-h-36 ${errors.content ? 'border-b border-error' : ''}`}
            value={content}
            onChange={(e) => { setContent(e.target.value); setErrors(p => ({ ...p, content: '' })) }}
          />
          {errors.content && <p className="text-error text-xs px-4 pb-2">{errors.content}</p>}

          {/* 이미지 첨부 구분선 */}
          <div className="border-t border-base-300 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-base-content/60">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>이미지 첨부 <span className="text-primary">20Mb이내 / jpg, png, bmp, gif 만 가능</span></span>
            </div>
            <span className="text-xs text-base-content/50">{images.length}개 / 최대 {MAX_IMAGES}개</span>
          </div>

          {/* Dropzone */}
          <div
            className={`mx-4 mb-4 border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${isDragging ? 'border-primary bg-primary/5' : 'border-base-300'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => images.length < MAX_IMAGES && fileInputRef.current?.click()}
          >
            {images.length === 0 ? (
              <p className="text-sm text-base-content/40">
                이미지를 여기로 끌어다 놓거나, 여기를 눌러 파일을 선택하세요.
              </p>
            ) : (
              <div className="flex gap-2 flex-wrap justify-center">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden">
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      onClick={(e) => { e.stopPropagation(); removeImage(i) }}
                    >✕</button>
                  </div>
                ))}
                {images.length < MAX_IMAGES && (
                  <div className="w-20 h-20 border-2 border-dashed border-base-300 rounded-lg flex items-center justify-center text-base-content/30 text-2xl">+</div>
                )}
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/bmp,image/gif"
            multiple
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {/* 답변 방법 */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="flex items-center gap-4">
            {REPLY_METHODS.map(m => (
              <label key={m.value} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="replyMethod"
                  className="radio radio-sm"
                  style={{ accentColor: '#7889fb' }}
                  checked={replyMethod === m.value}
                  onChange={() => setReplyMethod(m.value)}
                />
                <span className="text-sm">{m.label}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-base-content/50 text-center">
            고객님이 원하시는 답변 방법 1가지를 선택해주시면, 그에 맞게 답변 드리겠습니다.
          </p>
        </div>

        {/* 보내기 */}
        <button
          type="submit"
          style={{ backgroundColor: '#7889fb' }}
          className="w-full text-white font-bold py-3 rounded-xl text-base hover:opacity-90 transition-opacity disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : '보내기'}
        </button>
      </form>
    </div>
  )
}
