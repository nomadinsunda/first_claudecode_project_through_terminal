import { Link } from 'react-router-dom'

export default function LandingProductCard({ product }) {
  if (!product) return null

  const { id, name, imageUrl, salePrice, price, discountRate } = product

  return (
    <Link
      to={`/products/${id}`}
      className="flex gap-3 p-2 rounded-xl hover:bg-black/5 transition-colors"
    >
      <img
        src={imageUrl}
        alt={name}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-white"
      />
      <div className="flex-1 min-w-0 py-0.5">
        <p className="text-xs text-base-content/70 leading-tight line-clamp-2 mb-1">{name}</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {discountRate > 0 && (
            <span className="text-xs font-bold text-error">{discountRate}%</span>
          )}
          <span className="text-sm font-bold">{salePrice?.toLocaleString()}원</span>
        </div>
        {discountRate > 0 && (
          <p className="text-xs text-base-content/40 line-through">{price?.toLocaleString()}원</p>
        )}
      </div>
    </Link>
  )
}
