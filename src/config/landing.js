/**
 * 랜딩 페이지 정적 설정 데이터.
 * 실제 상품 데이터는 mockBaseQuery GET /landing에서 productIds → 상품 객체로 hydrate됩니다.
 */

export const petLandingData = {
  // ── 히어로 배너 슬라이더 ────────────────────────────────────────────
  heroBanners: [
    {
      id: 1,
      gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
      decorColor: '#F59E0B',
      emoji: '🛒',
      badge: '이번 주 특가',
      title: '인기 사료 최대\n30% 할인!',
      subtitle: '프리미엄 그레인프리 사료 특가전\n지금 바로 확인하세요',
      ctaLabel: '지금 확인하기',
      ctaTo: '/products?category=FOOD',
      ctaStyle: { backgroundColor: '#D97706' },
    },
    {
      id: 2,
      gradient: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
      decorColor: '#3B82F6',
      emoji: '🌸',
      badge: '봄 시즌 신상',
      title: '봄맞이 반려동물\n패션 컬렉션',
      subtitle: '우리 아이 스타일을 완성해줄\n시즌 아이템 한눈에 보기',
      ctaLabel: '컬렉션 보기',
      ctaTo: '/products?category=CLOTHING',
      ctaStyle: { backgroundColor: '#2563EB' },
    },
    {
      id: 3,
      gradient: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
      decorColor: '#10B981',
      emoji: '🎁',
      badge: '신규 가입 혜택',
      title: '가입 즉시\n3,000P 지급!',
      subtitle: '지금 가입하고 첫 주문부터\n포인트로 할인 받으세요',
      ctaLabel: '회원가입 하기',
      ctaTo: '/login',
      ctaStyle: { backgroundColor: '#059669' },
    },
  ],

  // ── 퀵 메뉴 아이콘 그리드 ────────────────────────────────────────────
  quickMenus: [
    { id: 1, emoji: '🦴', label: '사료',     to: '/products?category=FOOD'       },
    { id: 2, emoji: '🍖', label: '간식',     to: '/products?category=SNACK'      },
    { id: 3, emoji: '💊', label: '영양제',   to: '/products?category=SUPPLEMENT' },
    { id: 4, emoji: '🎾', label: '장난감',   to: '/products?category=TOY'        },
    { id: 5, emoji: '👕', label: '의류',     to: '/products?category=CLOTHING'   },
    { id: 6, emoji: '🧴', label: '위생용품', to: '/products?category=HYGIENE'    },
    { id: 7, emoji: '🐱', label: '고양이',   to: '/products?petType=CAT'         },
    { id: 8, emoji: '🏷️', label: '세일관',   to: '/products'                     },
  ],

  // ── 정책 안내 스트립 ────────────────────────────────────────────────
  policyStrip: [
    { emoji: '🚚', text: '30,000원 이상 무료배송' },
    { emoji: '⭐', text: '리뷰 작성 시 최대 1,000P' },
    { emoji: '🔁', text: '7일 이내 반품/교환' },
    { emoji: '📞', text: '365일 24시간 고객센터' },
  ],

  // ── 테마 섹션 ────────────────────────────────────────────────────────
  themeSections: [
    {
      id: 'feed',
      badge: 'MD 추천',
      title: '건강한 한 끼,\n프리미엄 사료관',
      subtitle: '그레인프리부터 연령별 맞춤 사료까지\n우리 아이 입맛에 맞는 사료를 찾아보세요',
      bgColor: '#FEF9C3',
      accentColor: '#D97706',
      emoji: '🍽️',
      ctaLabel: '사료 전체보기',
      ctaTo: '/products?category=FOOD',
      productIds: [1, 7, 2, 8],
    },
    {
      id: 'lifestyle',
      badge: '인기 급상승',
      title: '산책·놀이·이동\n필수템 모음',
      subtitle: '반려동물과의 일상을 더 즐겁게 만들어줄\n라이프스타일 아이템을 만나보세요',
      bgColor: '#EFF6FF',
      accentColor: '#2563EB',
      emoji: '🎒',
      ctaLabel: '아이템 전체보기',
      ctaTo: '/products',
      productIds: [15, 4, 10, 13],
    },
    {
      id: 'health',
      badge: '수의사 추천',
      title: '우리 아이 건강,\n꼼꼼히 챙기세요',
      subtitle: '영양제부터 위생용품까지\n반려동물 건강 관리의 모든 것',
      bgColor: '#F0FDF4',
      accentColor: '#059669',
      emoji: '💚',
      ctaLabel: '건강용품 전체보기',
      ctaTo: '/products?category=SUPPLEMENT',
      productIds: [3, 16, 6, 14],
    },
  ],

  // ── 중간 프로모 배너 ─────────────────────────────────────────────────
  promoBanner: {
    gradient: 'linear-gradient(135deg, #7889fb 0%, #a78bfa 100%)',
    title: '펫마켓 회원이라면 누구나',
    highlight: '포인트로 최대 50% 결제 가능!',
    subtitle: '리뷰 작성, 이벤트 참여로 포인트를 모아보세요',
    ctaLabel: '포인트 내역 확인',
    ctaTo: '/mypage/points',
  },
}
