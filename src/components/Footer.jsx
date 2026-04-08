import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-base-100 border-t border-base-300 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* 상단: 고객센터 + 쇼핑안내 */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          {/* 고객센터 */}
          <div>
            <h3 className="font-bold text-sm mb-3">고객센터</h3>
            <ul className="space-y-2 text-sm text-base-content/70">
              <li>
                <Link to="/cs" state={{ tab: 'inquiry' }} className="link link-hover">1:1 문의내역</Link>
              </li>
              <li>
                <Link to="/cs" state={{ tab: 'voice' }} className="link link-hover">고객의 소리</Link>
              </li>
              <li>
                <Link to="/mypage/cs/returns" className="link link-hover">반품 / 교환 신청</Link>
              </li>
              <li>
                <Link to="/cs" state={{ tab: 'faq' }} className="link link-hover">자주묻는 질문</Link>
              </li>
              <li className="text-xs text-base-content/50 pt-1">
                운영시간: 평일 09:00 ~ 18:00<br />
                (점심: 12:00 ~ 13:00 / 주말·공휴일 휴무)
              </li>
            </ul>
          </div>

          {/* 쇼핑 안내 */}
          <div>
            <h3 className="font-bold text-sm mb-3">쇼핑 안내</h3>
            <ul className="space-y-2 text-sm text-base-content/70">
              <li>배송비: 30,000원 이상 구매 시 무료 (미만 3,000원)</li>
              <li>포인트: 최소 1,000P부터 사용 (결제금액의 최대 50%)</li>
              <li>취소: 결제완료 상태에서만 즉시 취소 가능</li>
              <li>반품: 수령일로부터 7일 이내 신청</li>
            </ul>
          </div>
        </div>

        {/* 하단: 사업자 정보 + 저작권 */}
        <div className="border-t border-base-300 pt-6 text-xs text-base-content/50 space-y-1">
          <p>
            상호: 펫마켓 &nbsp;|&nbsp; 대표: 홍길동 &nbsp;|&nbsp;
            사업자등록번호: 000-00-00000 &nbsp;|&nbsp;
            통신판매업 신고번호: 제2025-서울-00000호
          </p>
          <p>주소: 서울특별시 강남구 테헤란로 123, 펫마켓빌딩 5층</p>
          <div className="flex gap-3 pt-2">
            <span className="link link-hover cursor-pointer">이용약관</span>
            <span className="text-base-content/30">|</span>
            <span className="link link-hover cursor-pointer">개인정보처리방침</span>
          </div>
          <p className="pt-1">© 2025 펫마켓. All rights reserved.</p>
        </div>

      </div>
    </footer>
  )
}
