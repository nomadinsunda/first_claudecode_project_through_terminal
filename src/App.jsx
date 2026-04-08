import { Routes, Route } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import AuthInitializer from './components/AuthInitializer'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage        from './pages/LandingPage'
import ProductListPage    from './pages/ProductListPage'
import ProductDetailPage  from './pages/ProductDetailPage'
import LoginPage          from './pages/LoginPage'
import OAuth2CallbackPage from './pages/OAuth2CallbackPage'
import CartPage           from './pages/CartPage'
import CheckoutPage       from './pages/CheckoutPage'
import OrderCompletePage  from './pages/OrderCompletePage'
import CsPage            from './pages/CsPage'

import MypageLayout    from './pages/mypage/MypageLayout'
import OrderListPage   from './pages/mypage/OrderListPage'
import OrderDetailPage from './pages/mypage/OrderDetailPage'
import PointsPage      from './pages/mypage/PointsPage'
import ReviewWritePage from './pages/mypage/ReviewWritePage'
import InquiryPage     from './pages/mypage/InquiryPage'
import ReturnPage      from './pages/mypage/ReturnPage'

export default function App() {
  return (
    <ErrorBoundary>
      <AuthInitializer>
        <Routes>
          <Route element={<Layout />}>
            {/* 공개 */}
            <Route path="/"                 element={<LandingPage />} />
            <Route path="/products"         element={<ProductListPage />} />
            <Route path="/products/:id"     element={<ProductDetailPage />} />
            <Route path="/login"            element={<LoginPage />} />
            <Route path="/oauth2/callback"  element={<OAuth2CallbackPage />} />
            <Route path="/cart"             element={<CartPage />} />
            <Route path="/cs"               element={<CsPage />} />

            {/* 인증 필요 */}
            <Route path="/checkout" element={
              <ProtectedRoute><CheckoutPage /></ProtectedRoute>
            } />
            <Route path="/orders/complete" element={
              <ProtectedRoute><OrderCompletePage /></ProtectedRoute>
            } />

            {/* 마이페이지 (전체 ProtectedRoute) */}
            <Route path="/mypage" element={
              <ProtectedRoute><MypageLayout /></ProtectedRoute>
            }>
              <Route path="orders"          element={<OrderListPage />} />
              <Route path="orders/:id"      element={<OrderDetailPage />} />
              <Route path="points"          element={<PointsPage />} />
              <Route path="reviews/write"   element={<ReviewWritePage />} />
              <Route path="cs/inquiries"    element={<InquiryPage />} />
              <Route path="cs/returns"      element={<ReturnPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthInitializer>
    </ErrorBoundary>
  )
}
