import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const INTERVAL_MS = 5000

export default function HeroBanner({ banners = [] }) {
  const navigate = useNavigate()
  const [idx, setIdx] = useState(0)

  const next = useCallback(() => setIdx(i => (i + 1) % banners.length), [banners.length])
  const prev = () => setIdx(i => (i - 1 + banners.length) % banners.length)

  useEffect(() => {
    if (banners.length <= 1) return
    const id = setInterval(next, INTERVAL_MS)
    return () => clearInterval(id)
  }, [next, banners.length])

  if (!banners.length) return null

  const banner = banners[idx]

  return (
    <div className="relative overflow-hidden rounded-2xl" style={{ background: banner.gradient, minHeight: 260 }}>
      {/* 장식 원 */}
      <div
        className="absolute top-[-40px] right-[-40px] w-64 h-64 rounded-full opacity-20"
        style={{ backgroundColor: banner.decorColor }}
      />
      <div
        className="absolute bottom-[-30px] right-[60px] w-40 h-40 rounded-full opacity-10"
        style={{ backgroundColor: banner.decorColor }}
      />

      {/* 콘텐츠 */}
      <div className="relative z-10 px-10 py-10 flex items-center justify-between">
        <div className="max-w-xs">
          {banner.badge && (
            <span
              className="inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-3"
              style={{ backgroundColor: banner.decorColor }}
            >
              {banner.badge}
            </span>
          )}
          <h2 className="text-3xl font-extrabold text-gray-800 leading-tight whitespace-pre-line mb-2">
            {banner.title}
          </h2>
          <p className="text-sm text-gray-600 whitespace-pre-line mb-5">{banner.subtitle}</p>
          <button
            onClick={() => navigate(banner.ctaTo)}
            className="text-white text-sm font-bold px-5 py-2.5 rounded-full shadow"
            style={banner.ctaStyle}
          >
            {banner.ctaLabel}
          </button>
        </div>

        {/* 이모지 */}
        <div className="text-8xl select-none hidden sm:block">{banner.emoji}</div>
      </div>

      {/* 좌우 화살표 */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-white/60 hover:bg-white/80 border-0 shadow"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 btn btn-circle btn-sm bg-white/60 hover:bg-white/80 border-0 shadow"
          >
            ›
          </button>
        </>
      )}

      {/* 도트 인디케이터 */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === idx ? 'w-5 bg-gray-700' : 'bg-gray-400/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
