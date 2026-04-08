import { Link } from 'react-router-dom'
import LandingProductCard from './LandingProductCard'

export default function ThemeSection({ section }) {
  const { badge, title, subtitle, bgColor, accentColor, emoji, ctaLabel, ctaTo, products = [] } = section

  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: bgColor }}>
      <div className="flex flex-col sm:flex-row">
        {/* 좌측 패널 (40%) */}
        <div className="sm:w-2/5 p-7 flex flex-col justify-between min-h-[220px]">
          <div>
            <span
              className="inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-3"
              style={{ backgroundColor: accentColor }}
            >
              {badge}
            </span>
            <h3
              className="text-xl font-extrabold leading-snug whitespace-pre-line mb-2"
              style={{ color: accentColor }}
            >
              {title}
            </h3>
            <p className="text-xs text-base-content/60 whitespace-pre-line leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="mt-4 flex items-end justify-between">
            <Link
              to={ctaTo}
              className="text-xs font-bold px-4 py-2 rounded-full text-white shadow"
              style={{ backgroundColor: accentColor }}
            >
              {ctaLabel}
            </Link>
            <span className="text-5xl opacity-30 select-none">{emoji}</span>
          </div>
        </div>

        {/* 우측 2×2 상품 그리드 (60%) */}
        <div className="sm:w-3/5 bg-white/60 p-3">
          <div className="grid grid-cols-2 gap-1">
            {products.slice(0, 4).map((product) => (
              <LandingProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
