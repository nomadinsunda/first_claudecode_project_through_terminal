import { useNavigate } from 'react-router-dom'
import { useGetLandingDataQuery } from '../features/products/productsApiSlice'
import HeroBanner  from './landing/HeroBanner'
import QuickMenu   from './landing/QuickMenu'
import ThemeSection from './landing/ThemeSection'

export default function LandingPage() {
  const navigate = useNavigate()
  const { data, isLoading } = useGetLandingDataQuery()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (!data) return null

  const { heroBanners, quickMenus, policyStrip, themeSections, promoBanner } = data

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">

      {/* 히어로 배너 슬라이더 */}
      <HeroBanner banners={heroBanners} />

      {/* 퀵 메뉴 */}
      <section className="bg-base-100 rounded-2xl shadow-sm border border-base-200 px-4 py-4">
        <QuickMenu menus={quickMenus} />
      </section>

      {/* 정책 스트립 */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {policyStrip.map(({ emoji, text }, i) => (
          <div
            key={i}
            className="flex items-center gap-2 bg-base-100 rounded-xl px-4 py-3 border border-base-200 shadow-sm"
          >
            <span className="text-xl">{emoji}</span>
            <span className="text-xs text-base-content/70 font-medium">{text}</span>
          </div>
        ))}
      </section>

      {/* 테마 섹션 (피드 / 라이프스타일 / 건강) */}
      <div className="space-y-5">
        {themeSections.map((section) => (
          <ThemeSection key={section.id} section={section} />
        ))}
      </div>

      {/* 중간 프로모 배너 */}
      <section
        className="rounded-2xl px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ background: promoBanner.gradient }}
      >
        <div className="text-white">
          <p className="text-sm font-medium mb-1">{promoBanner.title}</p>
          <p className="text-xl font-extrabold">{promoBanner.highlight}</p>
          <p className="text-xs mt-1 text-white/80">{promoBanner.subtitle}</p>
        </div>
        <button
          onClick={() => navigate(promoBanner.ctaTo)}
          className="btn btn-sm bg-white text-purple-600 border-0 hover:bg-white/90 font-bold shrink-0"
        >
          {promoBanner.ctaLabel}
        </button>
      </section>

    </div>
  )
}
