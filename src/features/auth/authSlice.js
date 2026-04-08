import { createSlice } from '@reduxjs/toolkit'

// Redux Store에는 UI 렌더링용 사용자 정보만 저장합니다.
// 토큰/세션 ID는 절대 저장하지 않습니다 (HttpOnly 쿠키로 관리).
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    isLoading: true, // AuthInitializer가 /auth/me 응답을 받기 전까지 true
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.isLoading = false
    },
    clearCredentials: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.isLoading = false
    },
  },
})

export const { setCredentials, clearCredentials } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthIsLoading = (state) => state.auth.isLoading
