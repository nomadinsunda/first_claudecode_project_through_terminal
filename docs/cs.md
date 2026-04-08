# 고객센터 (CS)

## 기본 정책

- **1:1 문의**: 문의내역 탭에서 확인, 고객의 소리 탭에서 신규 제출. 24시간 내 답변 목표
- **반품**: 수령일로부터 7일 이내 신청 가능 (전자상거래법 기준)
  - 식품류(사료/간식/영양제) 개봉 시 단순 변심 반품 불가
  - 상품 결함/오배송의 경우 기간 제한 없이 반품 가능, 왕복 배송비 판매자 부담
- **교환**: 동일 상품(색상/사이즈 변경) 한정, 수령일로부터 7일 이내 신청 가능

---

## CS 페이지 구조 (`/cs`)

공개 라우트. 4개 탭으로 구성.

### 탭 구성

| 탭 key | 탭 라벨 | 설명 |
|---|---|---|
| `inquiry` | 문의내역 | 내 1:1 문의 목록(사이드바) + 상세 패널. 로그인 필요 |
| `faq` | 자주묻는 질문 | 카테고리 탭 + 아코디언 FAQ + 더보기. 헤더 검색 연동 |
| `voice` | 고객의 소리 | VOC 폼 제출. 비로그인 이용 가능 |
| `news` | 펫마켓소식 | 공지·이벤트·보도자료 아코디언 리스트 |

### 딥링크 (Footer/외부)
- `/cs` → `inquiry` 탭 (기본값)
- `/cs` + `state.tab = 'faq'` → FAQ 탭
- `/cs` + `state.tab = 'voice'` → 고객의 소리 탭
- `/cs` + `state.tab = 'news'` → 펫마켓소식 탭

---

## 도메인 데이터 구조

### 문의내역 (`src/mocks/inquiries.js`)

| 필드 | 설명 |
|---|---|
| `id` | 문의 ID (예: `INQ-001`) |
| `type` | 문의 유형 (상품 문의, 배송 문의 등) |
| `productName` | 관련 상품명 |
| `productId` | 관련 상품 ID |
| `thumbnail` | 상품 썸네일 URL |
| `status` | `ANSWERED` (상담종료) / `PENDING` (답변대기) |
| `title` | 문의 제목 |
| `content` | 문의 내용 |
| `answer` | 답변 내용 (null이면 미답변) |
| `answeredAt` | 답변 일시 |
| `createdAt` | 문의 작성 일시 |

### FAQ (`src/mocks/faqs.js`)

- 카테고리: `전체`, `취소/반품`, `배송문의`, `상품문의`, `결제/포인트`, `기타`
- 각 항목: `id`, `category`, `question`, `answer`
- API: `GET /cs/faqs?category=&q=&page=&size=` (카테고리·키워드 필터)

### 공지/소식 (`src/mocks/news.js`)

- 카테고리: `전체`, `공지`, `이벤트`, `보도자료`
- 각 항목: `id`, `category`, `title`, `content`, `date`
- API: `GET /cs/news?category=&page=&size=`

### 고객의 소리

- API: `POST /cs/voice` — 단방향 피드백 제출, InquiryTab과 별도 시스템
- 폼 필드: `type`(유형), `orderRef`(주문 ID), `content`(의견), `replyMethod`(문의내역/전화/문자/답변불필요)
- 이미지 첨부: 최대 3장, Mock 모드에서는 미전송

---

## API 엔드포인트 요약

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET | `/cs/inquiries` | 내 문의 목록 (페이지네이션) |
| GET | `/cs/inquiries/:id` | 문의 상세 |
| POST | `/cs/inquiries` | 1:1 문의 등록 |
| GET | `/cs/faqs` | FAQ 목록 (카테고리·키워드 필터) |
| GET | `/cs/news` | 소식 목록 (카테고리 필터) |
| POST | `/cs/voice` | 고객의 소리 제출 |
| POST | `/cs/returns` | 반품 신청 |
| POST | `/cs/exchanges` | 교환 신청 |
