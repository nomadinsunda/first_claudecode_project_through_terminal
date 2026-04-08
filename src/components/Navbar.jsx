import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../features/auth/authSlice'
import { selectCartKindCount } from '../features/cart/cartSlice'
import { useLogoutMutation } from '../features/auth/authApiSlice'

export default function Navbar() {
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const cartCount = useSelector(selectCartKindCount)
  const [logout] = useLogoutMutation()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-10 px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-bold">🐾 펫마켓</Link>
      </div>

      <div className="flex-none gap-1">
        <Link to="/cs" className="btn btn-ghost btn-sm">고객센터</Link>

        {/* 장바구니 */}
        <Link to="/cart" className="btn btn-ghost btn-circle indicator">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cartCount > 0 && (
            <span className="badge badge-primary badge-xs indicator-item">{cartCount}</span>
          )}
        </Link>

        {isAuthenticated ? (
          <>
            <Link to="/mypage/orders" className="btn btn-ghost btn-sm">마이페이지</Link>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm">로그아웃</button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">로그인</Link>
        )}
      </div>
    </div>
  )
}
