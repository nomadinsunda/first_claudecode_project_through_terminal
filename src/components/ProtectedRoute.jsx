import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAuthenticated, selectAuthIsLoading } from '../features/auth/authSlice'

/**
 * 비인증 사용자를 /login으로 리다이렉트합니다.
 * 로그인 후 원래 경로로 복귀할 수 있도록 location.pathname을 state로 전달합니다.
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isLoading = useSelector(selectAuthIsLoading)
  const location = useLocation()

  if (isLoading) return null // AuthInitializer 스피너가 처리 중

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}
