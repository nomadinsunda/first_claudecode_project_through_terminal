import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../features/auth/authSlice'
import { verifyOAuth2State } from '../utils/oauth2'

export default function OAuth2CallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // lazy initializer는 StrictMode에서도 최초 1회만 실행됩니다.
  // verifyOAuth2State는 sessionStorage nonce를 읽는 즉시 삭제(1회용)하므로
  // 반드시 1회만 호출되어야 합니다.
  const [status, setStatus] = useState(() => {
    const urlState = searchParams.get('state')
    return verifyOAuth2State(urlState) ? 'loading' : 'invalid_state'
  })

  useEffect(() => {
    if (status !== 'loading') return

    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error()
        return res.json()
      })
      .then((user) => {
        dispatch(setCredentials(user))
        navigate('/', { replace: true })
      })
      .catch(() => setStatus('fetch_error'))
  }, [status, dispatch, navigate])

  if (status === 'invalid_state') {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="card bg-base-100 shadow-md w-full max-w-sm">
          <div className="card-body items-center gap-4">
            <div role="alert" className="alert alert-error">
              <span>유효하지 않은 접근입니다. 다시 로그인해주세요.</span>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              로그인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'fetch_error') {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="card bg-base-100 shadow-md w-full max-w-sm">
          <div className="card-body items-center gap-4">
            <div role="alert" className="alert alert-error">
              <span>로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.</span>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/login')}>
              로그인으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="loading loading-spinner loading-lg" />
        <p className="text-base-content/60">로그인 처리 중...</p>
      </div>
    </div>
  )
}
