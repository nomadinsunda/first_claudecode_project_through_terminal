/**
 * document.cookie에서 특정 쿠키 값을 읽어 반환합니다.
 * XSRF-TOKEN처럼 HttpOnly가 아닌 쿠키를 읽을 때 사용합니다.
 */
export function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}
