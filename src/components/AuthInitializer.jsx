import { useSelector } from 'react-redux'
import { useGetMeQuery } from '../features/auth/authApiSlice'
import { selectAuthIsLoading } from '../features/auth/authSlice'

/**
 * 앱 최상단에서 /auth/me를 호출해 새로고침 시 인증 상태를 복원합니다.
 * isLoading이 true인 동안 스피너를 표시하여 FOUC를 방지합니다.
 *
 * onQueryStarted 콜백(authApiSlice)이 응답에 따라
 * setCredentials 또는 clearCredentials를 dispatch하고 isLoading을 false로 전환합니다.
 */
export default function AuthInitializer({ children }) {
  useGetMeQuery() // /auth/me 호출 트리거 (결과는 authApiSlice의 onQueryStarted가 처리)
  const isLoading = useSelector(selectAuthIsLoading)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  return children
}
