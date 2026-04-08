import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useLoginMutation } from '../features/auth/authApiSlice'
import { redirectToOAuth2 } from '../utils/oauth2'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [login, { isLoading, error }] = useLoginMutation()

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await login(form).unwrap()
      navigate(from, { replace: true })
    } catch {
      // error 상태로 처리됨
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="card bg-base-100 shadow-md w-full max-w-sm">
        <div className="card-body gap-4">
          <h1 className="text-2xl font-bold text-center">🐾 로그인</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              name="email"
              placeholder="이메일"
              className="input input-bordered w-full"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              className="input input-bordered w-full"
              value={form.password}
              onChange={handleChange}
              required
            />

            {error && (
              <p className="text-error text-sm">
                {error.data?.message ?? '이메일 또는 비밀번호를 확인해주세요.'}
              </p>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
              {isLoading ? <span className="loading loading-spinner loading-sm" /> : '로그인'}
            </button>
          </form>

          <div className="divider text-xs">소셜 로그인</div>

          <div className="flex flex-col gap-2">
            <button className="btn btn-outline w-full gap-2" onClick={() => redirectToOAuth2('google')}>
              <span>Google로 계속하기</span>
            </button>
            <button className="btn btn-warning w-full gap-2" onClick={() => redirectToOAuth2('kakao')}>
              <span>카카오로 계속하기</span>
            </button>
            <button className="btn btn-success w-full gap-2" onClick={() => redirectToOAuth2('naver')}>
              <span>네이버로 계속하기</span>
            </button>
          </div>

          <p className="text-center text-sm text-base-content/60">
            계정이 없으신가요?{' '}
            <Link to="/register" className="link link-primary">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
