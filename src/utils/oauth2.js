const OAUTH2_STATE_KEY = 'oauth2_state'

/**
 * 랜덤 nonce를 생성하여 sessionStorage에 저장하고 반환합니다.
 * OAuth2 인가 요청 시 CSRF 방지용 state 파라미터로 사용합니다.
 */
export function generateOAuth2State() {
  const state = crypto.randomUUID()
  sessionStorage.setItem(OAUTH2_STATE_KEY, state)
  return state
}

/**
 * callback에서 받은 state 파라미터를 저장된 nonce와 대조 검증합니다.
 * 검증 즉시 sessionStorage에서 삭제합니다 (1회용).
 */
export function verifyOAuth2State(receivedState) {
  const stored = sessionStorage.getItem(OAUTH2_STATE_KEY)
  sessionStorage.removeItem(OAUTH2_STATE_KEY)
  return stored !== null && stored === receivedState
}

/**
 * 소셜 로그인 인가 페이지로 리다이렉트합니다.
 * provider: 'google' | 'kakao' | 'naver' 등 백엔드가 지원하는 값.
 */
export function redirectToOAuth2(provider) {
  const state = generateOAuth2State()
  window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/${provider}?state=${state}`
}
