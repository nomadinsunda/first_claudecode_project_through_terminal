import { Component } from 'react'

/**
 * 런타임 에러를 포착하여 앱 전체가 흰 화면으로 죽는 것을 방지합니다.
 * App.jsx 최상위에 배치합니다.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div role="alert" className="alert alert-error max-w-md">
            <span>예상치 못한 오류가 발생했습니다. 페이지를 새로고침 해주세요.</span>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
