# next-todo-2026

스터디에서 구현해보는 Next.js 뜯어보면서 구현하기

---

## 목차

- [렌더링 방식 성능 비교 프로젝트](#렌더링-방식-성능-비교-프로젝트)
- [Next.js 개념 정리](#nextjs-개념-정리)

---

## 렌더링 방식 성능 비교 프로젝트

> SSR / Streaming SSR / CSR 세 가지 렌더링 방식의 로딩 성능을 직접 체험하고 수치로 비교하는 데모 프로젝트

### 왜 만들었나

Streaming SSR을 처음 접하면서 "SSR이랑 뭐가 다른 거지?" 라는 궁금증에서 시작.
단순히 글로 읽는 것보다 **실제로 눈으로 보고 수치로 비교**하는 게 이해가 빠르기 때문.

### 핵심 개념 — 왜 이미지만으로는 부족한가

처음엔 "큰 이미지를 많이 불러오면 차이가 나지 않을까?" 라는 생각이 들 수 있다.

그런데 **이미지 로딩은 항상 브라우저(클라이언트)가 담당**한다.
렌더링 방식과 무관하게 HTML에 `<img src="...">` 가 있으면 브라우저가 그 다음에 이미지를 fetch한다.

```
SSR          : [서버 딜레이 -----] → HTML 전송 → [이미지 로딩]
Streaming SSR: [1번 완료] → HTML 일부 전송 → [2번 완료] → HTML 추가 → [이미지 로딩]
CSR          : HTML(빈 껍데기) 즉시 → JS 실행 → API fetch → [이미지 로딩]
```

SSR vs Streaming SSR의 차이는 **서버가 HTML을 언제 보내느냐**의 문제이므로,
서버 측 데이터 fetch 딜레이가 있어야 차이가 눈에 보인다.

→ 해결: **서버 딜레이(0~3000ms) 슬라이더**로 실제 API 응답 지연을 시뮬레이션 + 상품 카드에 고해상도 이미지(800×600) 30장 사용

### 렌더링 방식별 동작 원리

#### 🖥️ SSR (Server-Side Rendering)

```tsx
export default async function SSRPage({ searchParams }) {
  await delay(delayMs)          // 모든 데이터 준비될 때까지 블로킹
  const products = getAllProducts()
  return <ProductGrid products={products} />  // 완성된 HTML 한번에 전송
}
```

- 서버가 모든 데이터를 받아올 때까지 브라우저는 **완전히 빈 화면**
- 딜레이가 길수록 TTFB가 그대로 증가

#### ⚡ Streaming SSR (Progressive Streaming)

```tsx
export default async function StreamingPage({ searchParams }) {
  // await 없음 → 페이지 셸(헤더, 메트릭 패널) 즉시 전송
  return (
    <>
      <Suspense fallback={<Skeleton />}>
        <ProductSection delayMs={delayMs * 0.3} />   {/* 30% 딜레이 */}
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <ProductSection delayMs={delayMs * 0.65} />  {/* 65% 딜레이 */}
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <ProductSection delayMs={delayMs} />         {/* 100% 딜레이 */}
      </Suspense>
    </>
  )
}
```

- 페이지 접속 즉시 레이아웃과 스켈레톤 표시
- 각 `<Suspense>` 경계 안의 섹션이 준비되는 대로 스켈레톤 → 실제 콘텐츠로 교체
- **Next.js App Router는 기본적으로 이 방식**을 사용

#### 💻 CSR (Client-Side Rendering)

```tsx
'use client'
useEffect(() => {
  fetch(`/api/products?delay=${delayMs}`)
    .then(res => res.json())
    .then(data => setProducts(data))
}, [])
```

- 브라우저가 빈 HTML을 즉시 받음 → TTFB 매우 빠름
- JS 실행 후 API fetch → 실제 콘텐츠는 딜레이 이후에 등장
- SEO 불리, 초기 콘텐츠 노출이 느림

### Next.js가 기본적으로 Streaming SSR인 이유

```
pages/ (구 방식) → 전통 SSR (완성된 HTML 한번에)
app/  (신 방식) → 기본값이 Streaming SSR
```

`app/` 디렉토리에서 async 서버 컴포넌트를 쓰면 자동으로 스트리밍이 활성화된다.
차이를 만드는 건 **`<Suspense>` 경계를 어디에 두냐**다.

| 코드 패턴 | 동작 |
|---|---|
| page 컴포넌트에서 직접 `await` | 전통 SSR처럼 블로킹 |
| `<Suspense>` + 내부 async 컴포넌트에서 `await` | Streaming SSR |
| `'use client'` + `useEffect` fetch | CSR |

### 성능 측정 항목

각 페이지 방문 시 자동으로 측정 후 `/compare`에서 비교 가능

| 지표 | 설명 |
|---|---|
| **TTFB** | 첫 번째 바이트 도착 시간 (서버 응답 속도) |
| **FCP** | 첫 콘텐츠가 화면에 그려진 시간 |
| **LCP** | 가장 큰 콘텐츠가 화면에 그려진 시간 |
| **DOM Ready** | DOM 파싱 완료 시간 |
| **Load** | 페이지 완전 로드 시간 |

### 예상 결과 (딜레이 1500ms 기준)

| | TTFB | FCP | LCP |
|---|---|---|---|
| SSR | ~1500ms | ~1500ms | ~1500ms+ |
| Streaming SSR | ~10ms | ~450ms | ~1500ms |
| CSR | ~10ms | ~20ms (빈 화면) | ~1500ms |

> Streaming SSR의 FCP가 빠른 이유: 첫 섹션(30% 딜레이 = 450ms)이 도착하는 순간 콘텐츠가 그려지기 때문

### 프로젝트 구조

```
my-app/app/
├── page.tsx                    # 메인 허브 (딜레이 슬라이더 + 각 데모 링크)
├── _lib/
│   ├── mock-data.ts            # 상품 30개 목데이터 (picsum 이미지 800×600)
│   └── utils.ts                # delay(), formatMs(), 색상 유틸
├── _components/
│   ├── ProductCard.tsx         # 상품 카드 컴포넌트
│   ├── SkeletonCard/Grid.tsx   # 로딩 스켈레톤
│   ├── MetricsPanel.tsx        # 성능 측정 + localStorage 저장 (Client)
│   ├── DelaySlider.tsx         # 딜레이 조절 슬라이더 (Client)
│   └── SectionTimer.tsx        # 섹션별 도착 시간 표시 (Client)
├── ssr/page.tsx                # SSR 데모
├── streaming/
│   ├── page.tsx                # Streaming SSR 데모
│   └── ProductSection.tsx      # 각 섹션 async 서버 컴포넌트
├── csr/
│   ├── page.tsx                # Server wrapper (searchParams 파싱)
│   └── CSRContent.tsx          # CSR 데모 (Client Component)
├── api/products/route.ts       # GET API (delay 파라미터 지원)
└── compare/page.tsx            # 성능 비교 대시보드 (Client)
```

### 실행 방법

```bash
cd my-app
pnpm dev
```

`http://localhost:3000` 접속 후:
1. 딜레이 슬라이더 조절 (1500ms 권장)
2. SSR → Streaming SSR → CSR 순서로 방문
3. `/compare` 에서 TTFB / FCP / LCP 나란히 비교

> **주의:** 메인 페이지의 링크는 `<a>` 태그(하드 네비게이션)를 사용합니다.
> `<Link>` (클라이언트 사이드 라우팅)를 쓰면 Performance API가 초기화되지 않아 모든 페이지의 메트릭이 동일하게 측정됩니다.

---

## Next.js 개념 정리

### 서버 컴포넌트 vs 클라이언트 컴포넌트

- 서버 컴포넌트: 데이터 패칭을 서버에서 처리 → 클라이언트로 보내는 JS 코드 양 감소 → 성능 향상
- 클라이언트 컴포넌트: 상호작용(useState, useEffect 등)이 필요한 경우 사용

### 서버 액션 vs API 라우트 핸들러

**서버 액션**
- 함수 호출처럼 직접 실행, API 계층 건너뜀
- 단 한 번의 네트워크 왕복으로 서버 코드 실행 + 캐시 재검증 + UI 업데이트 처리 가능
- 과다 사용 시 CPU 점유율로 인해 화면이 느려질 수 있음

**API 라우트 핸들러**
- 클라이언트에서 API 호출 후 응답 받아 UI 수동 업데이트
- 대량의 데이터 처리에 적합

**언제 뭘 쓸까**

| 상황 | 선택 |
|---|---|
| 단순 조회 | 서버 컴포넌트 fetch / API Route |
| 단순 수정/삭제 | 서버 액션 |
| 무거운 데이터 처리 | API Route (+ SWR, TanStack Query) |
