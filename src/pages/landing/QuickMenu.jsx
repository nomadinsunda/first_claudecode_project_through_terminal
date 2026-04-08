import { Link } from 'react-router-dom'

export default function QuickMenu({ menus = [] }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
      {menus.map(({ id, emoji, label, to }) => (
        <Link
          key={id}
          to={to}
          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl hover:bg-base-200 transition-colors"
        >
          <span className="text-3xl">{emoji}</span>
          <span className="text-xs font-medium text-base-content/70">{label}</span>
        </Link>
      ))}
    </div>
  )
}
