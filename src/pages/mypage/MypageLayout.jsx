import { NavLink, Outlet } from 'react-router-dom'

const NAV = [
  { to: '/mypage/orders',       label: '주문 내역' },
  { to: '/mypage/points',       label: '포인트 내역' },
  { to: '/mypage/cs/inquiries', label: '1:1 문의' },
  { to: '/mypage/cs/returns',   label: '반품/교환' },
]

export default function MypageLayout() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
      {/* 사이드 네비 */}
      <aside className="md:w-44 shrink-0">
        <ul className="menu bg-base-100 rounded-box shadow-sm p-2">
          <li className="menu-title text-xs">마이페이지</li>
          {NAV.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => isActive ? 'active font-semibold' : ''}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* 콘텐츠 */}
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
