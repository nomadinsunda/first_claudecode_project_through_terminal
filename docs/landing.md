# 랜딩 페이지 (`/`)

## API

- `GET /landing` → `useGetLandingDataQuery()` (`src/features/products/productsApiSlice.js`)
- 응답: `heroBanners`, `quickMenus`, `policyStrip`, `themeSections`, `promoBanner`
- `themeSections[].products`는 `mockBaseQuery`에서 `productIds` → 상품 객체로 hydrate됨

---

## 섹션 구성

| 섹션 | 컴포넌트 | 설명 |
|---|---|---|
| 히어로 배너 | `HeroBanner` | 5초 자동 슬라이드, 3개 배너, 도트·화살표 |
| 퀵 메뉴 | `QuickMenu` | 8개 아이콘 그리드, `/products?category=` 또는 `?petType=` 링크 |
| 정책 스트립 | (inline) | 배송비·포인트·반품·고객센터 4가지 안내 |
| 테마 섹션 | `ThemeSection` | 좌(40%) 컬러 패널 + 우(60%) 2×2 상품 그리드 |
| 프로모 배너 | (inline) | 포인트 결제 안내, `/mypage/points` 링크 |

---

## 테마 섹션 상품 ID 매핑

| 섹션 | productIds | 링크 |
|---|---|---|
| 사료관 (feed) | 1, 7, 2, 8 | `/products?category=FOOD` |
| 라이프스타일 (lifestyle) | 15, 4, 10, 13 | `/products` |
| 건강용품 (health) | 3, 16, 6, 14 | `/products?category=SUPPLEMENT` |

---

## 정적 설정

- `src/config/landing.js` — 배너·퀵메뉴·테마 섹션 정적 config
  - 도메인 데이터가 아니므로 `src/mocks/` 외부에 위치 (CLAUDE.md Rule 10 예외)
  - 랜딩 데이터는 `GET /landing` 엔드포인트를 통해서만 컴포넌트에 전달됨
