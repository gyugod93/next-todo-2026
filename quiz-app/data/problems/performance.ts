import type { Problem } from '@/types'

export const performanceProblems: Problem[] = [
  // ─── core-web-vitals ─────────────────────────────────────────────────────────

  {
    id: 'perf-q-001',
    category: 'performance',
    subcategory: 'core-web-vitals',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'Core Web Vitals 3가지 — LCP, INP, CLS',
    description: '2024년 기준 Google Core Web Vitals 3가지 지표와 측정 대상으로 올바른 것은?',
    conceptExplanation:
      'Core Web Vitals는 Google이 정의한 웹 페이지 사용자 경험의 핵심 측정 지표 모음입니다. 로딩 성능, 상호작용 반응성, 시각적 안정성을 각각 하나의 지표로 측정합니다. 이 지표들은 Google 검색 랭킹에도 영향을 주며, 매년 기준이 개정될 수 있습니다.',
    options: [
      'LCP(로딩 성능), FID(입력 지연), CLS(시각적 안정성) — 2023년부터 변경 없음',
      'LCP(로딩 성능), INP(상호작용 반응성), CLS(시각적 안정성) — INP가 2024년 3월에 FID를 대체',
      'FCP(첫 콘텐츠 표시), TTI(상호작용 가능 시간), TBT(총 차단 시간)',
      'LCP(최대 콘텐츠), FID(첫 입력 지연), INP(상호작용) — 셋 모두 포함',
    ],
    correctAnswer: 1,
    explanation:
      '2024년 3월부터 FID(First Input Delay)가 INP(Interaction to Next Paint)로 교체되었습니다. FID는 첫 번째 입력만 측정했지만, INP는 페이지 전체 생애주기 동안의 모든 상호작용을 측정합니다. LCP ≤ 2.5초, INP ≤ 200ms, CLS ≤ 0.1이 "Good" 기준입니다.',
    hints: ['INP는 FID의 후계자입니다 (2024년 3월 교체)'],
    deepDive:
      '```\nCore Web Vitals 2024 기준:\n┌────────┬──────────────────────────┬──────────┬────────────┐\n│ 지표   │ 측정 대상                │ Good     │ 개선 필요  │\n├────────┼──────────────────────────┼──────────┼────────────┤\n│ LCP    │ 최대 콘텐츠 렌더링 시간  │ ≤ 2.5s   │ > 4.0s     │\n│ INP    │ 상호작용 → 다음 화면     │ ≤ 200ms  │ > 500ms    │\n│ CLS    │ 레이아웃 이동 누적 점수  │ ≤ 0.1    │ > 0.25     │\n└────────┴──────────────────────────┴──────────┴────────────┘\n\nINP vs FID 차이:\n- FID: 첫 번째 클릭/키 입력의 응답 시간만 측정\n- INP: 모든 클릭, 키 입력, 탭의 응답 시간을 측정 (98th percentile)\n```\n\n```javascript\n// Web Vitals 측정 코드 (Next.js)\n// app/layout.tsx\nimport { useReportWebVitals } from "next/web-vitals"\n\nexport function WebVitals() {\n  useReportWebVitals((metric) => {\n    console.log(metric) // { name, value, rating, navigationType }\n    // rating: "good" | "needs-improvement" | "poor"\n\n    // 분석 도구로 전송\n    if (metric.name === "LCP") {\n      sendToAnalytics({ metric: "LCP", value: metric.value })\n    }\n  })\n}\n\n// 실제 측정 도구:\n// - Chrome DevTools > Lighthouse\n// - Chrome DevTools > Performance > Web Vitals 레인\n// - PageSpeed Insights (실제 사용자 데이터 포함)\n// - web-vitals npm 패키지\n```',
    relatedProblems: ['perf-q-002', 'perf-q-003', 'perf-q-004'],
  },
  {
    id: 'perf-q-002',
    category: 'performance',
    subcategory: 'core-web-vitals',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'INP vs FID — 2024년 교체 이유',
    description: 'Google이 2024년 3월에 FID를 INP로 교체한 이유로 가장 올바른 것은?',
    conceptExplanation:
      'INP(Interaction to Next Paint)는 페이지에서 발생하는 모든 사용자 상호작용의 반응 속도를 측정하는 지표입니다. 이전 지표인 FID(First Input Delay)는 첫 번째 입력의 지연만 측정했습니다. INP는 클릭, 탭, 키 입력 전체를 대상으로 하여 실제 사용 경험을 더 정확하게 반영합니다.',
    options: [
      'INP가 측정하기 더 쉽기 때문에 개발자 경험을 위해 교체했다',
      'FID는 첫 입력 이벤트만 측정하여 실제 사용 경험을 충분히 반영하지 못했고, INP는 페이지 전체 상호작용 반응성을 측정한다',
      'INP는 서버 측 렌더링 성능을 측정하는 새로운 지표다',
      'FID는 모바일 기기에서 측정이 불가능하여 교체가 필요했다',
    ],
    correctAnswer: 1,
    explanation:
      'FID는 오직 첫 번째 상호작용의 입력 지연만 측정했습니다. 사용자는 첫 클릭 이후에도 계속 상호작용하는데, 페이지 중간에 버튼이 느리게 반응한다면 FID로는 잡히지 않았습니다. INP는 모든 클릭, 탭, 키 입력을 측정하고 가장 느린 상호작용(98th percentile)을 보고합니다.',
    hints: ['FID = 첫 번째 이벤트만, INP = 전체 세션의 모든 이벤트'],
    deepDive:
      '```javascript\n// INP 개선 방법\n\n// 1. Long Task 분해 (메인 스레드 차단 방지)\n// 나쁜 예 — 하나의 긴 작업\nfunction processLargeData(items) {\n  items.forEach(item => expensiveOperation(item)) // 1000개 처리 → 긴 블로킹\n}\n\n// 좋은 예 — 청크로 나누어 처리\nasync function processLargeDataChunked(items) {\n  const CHUNK_SIZE = 50\n  for (let i = 0; i < items.length; i += CHUNK_SIZE) {\n    const chunk = items.slice(i, i + CHUNK_SIZE)\n    chunk.forEach(item => expensiveOperation(item))\n    // 각 청크 사이에 브라우저에 제어권 반환\n    await new Promise(resolve => setTimeout(resolve, 0))\n  }\n}\n\n// 2. React에서 INP 개선\nimport { startTransition } from "react"\n\nfunction SearchInput() {\n  const [query, setQuery] = useState("")\n  const [results, setResults] = useState([])\n\n  const handleChange = (e) => {\n    // 입력 업데이트는 즉시 (urgent)\n    setQuery(e.target.value)\n    // 검색 결과 업데이트는 낮은 우선순위 (non-urgent)\n    startTransition(() => {\n      setResults(searchData(e.target.value))\n    })\n  }\n\n  return <input onChange={handleChange} value={query} />\n}\n\n// 3. INP 측정\nimport { onINP } from "web-vitals"\nonINP((metric) => {\n  // metric.value: 밀리초, metric.rating: "good"|"needs-improvement"|"poor"\n  // metric.entries: 실제 상호작용 목록\n  console.log("INP:", metric.value, metric.entries[0].target)\n})\n```',
    relatedProblems: ['perf-q-001', 'perf-q-003'],
  },
  {
    id: 'perf-q-003',
    category: 'performance',
    subcategory: 'core-web-vitals',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'CLS 원인 — 레이아웃 이동 방지',
    description: 'CLS(Cumulative Layout Shift)가 발생하는 주요 원인과 해결 방법으로 올바른 것은?',
    conceptExplanation:
      'CLS(Cumulative Layout Shift)는 페이지 로딩 중에 요소가 예기치 않게 위치를 바꾸는 정도를 나타내는 시각적 안정성 지표입니다. 점수가 낮을수록 안정적이며, 0.1 이하가 Good 기준입니다. 이미지, 광고, 웹폰트 등이 로드되면서 다른 콘텐츠를 밀어내는 현상이 CLS를 유발합니다.',
    options: [
      'JavaScript 실행이 느릴 때 CLS가 발생하며, 코드 분할로 해결한다',
      '이미지에 width/height 미지정, 동적으로 삽입되는 광고/배너, 웹폰트 로딩이 주요 원인이며, 공간을 미리 예약해서 해결한다',
      'CLS는 서버 응답 속도에 의해서만 발생하므로 SSR로 해결한다',
      '모바일 기기의 화면 크기 차이로 인한 것으로 반응형 디자인으로만 해결 가능하다',
    ],
    correctAnswer: 1,
    explanation:
      '이미지/비디오에 명시적 크기 미지정, 나중에 삽입되는 광고 배너, 폰트 스왑(FOUT) 등이 CLS의 주요 원인입니다. 해결책: 이미지에 width/height 속성 명시, 광고 영역을 빈 공간으로 미리 예약, aspect-ratio CSS 사용. Next.js의 next/image는 이를 자동으로 처리합니다.',
    hints: ['레이아웃이 이동하려면 공간을 예약하지 않은 요소가 삽입되어야 합니다'],
    deepDive:
      '```tsx\n// CLS 원인 1: 이미지 크기 미지정\n// ❌ CLS 발생 — 이미지 로드 후 레이아웃 이동\n<img src="/hero.jpg" alt="히어로 이미지" />\n\n// ✅ 해결 — 크기 명시 또는 Next.js Image 컴포넌트\nimport Image from "next/image"\n<Image\n  src="/hero.jpg"\n  alt="히어로 이미지"\n  width={1200}\n  height={600}\n  // 내부적으로 aspect-ratio 박스 생성 → 공간 미리 예약\n/>\n\n// CLS 원인 2: 광고/배너 동적 삽입\n// ❌ 나쁜 예 — 콘텐츠 중간에 광고 삽입 시 이동\n<div className="article">..콘텐츠..</div>\n<AdComponent /> {/* 나중에 삽입 */}\n<div className="article">..계속 내용..</div>\n\n// ✅ 좋은 예 — 공간을 미리 예약\n<div style={{ minHeight: "280px" }}> {/* 광고 높이만큼 미리 예약 */}\n  <AdComponent />\n</div>\n\n// CLS 원인 3: 웹폰트 스왑\n// next/font는 FOUT를 방지하는 CSS 변수 방식 사용\nimport { Noto_Sans_KR } from "next/font/google"\nconst notoSansKr = Noto_Sans_KR({\n  subsets: ["latin"],\n  display: "swap", // FOUT 방지 (폴백 폰트 → 실제 폰트)\n  // 또는 display: "optional" (CLS 완전 방지, 느린 네트워크에서 폴백 유지)\n})\n\n// aspect-ratio로 동영상 컨테이너 크기 예약\n.video-container {\n  aspect-ratio: 16 / 9;\n  width: 100%;\n}\n```',
    relatedProblems: ['perf-q-001', 'perf-q-004'],
  },
  {
    id: 'perf-q-004',
    category: 'performance',
    subcategory: 'core-web-vitals',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'LCP 최적화 — fetchpriority와 preload',
    description: 'LCP(Largest Contentful Paint) 점수를 높이기 위한 가장 효과적인 방법은?',
    conceptExplanation:
      'LCP(Largest Contentful Paint)는 뷰포트 내에서 가장 큰 콘텐츠 요소(이미지, 텍스트 블록 등)가 화면에 렌더링되기까지 걸리는 시간을 측정합니다. 2.5초 이하가 Good 기준이며, 이 요소가 빠르게 나타날수록 사용자가 페이지를 빠르게 인식합니다. 리소스 우선순위 설정이 LCP 개선의 핵심입니다.',
    options: [
      'LCP 이미지를 lazy loading으로 설정하여 초기 로딩을 줄인다',
      'LCP 요소가 이미지라면 fetchpriority="high"와 <link rel="preload">를 함께 사용하여 브라우저가 우선 로드하게 한다',
      'LCP 개선은 서버 응답 시간에만 달려있으므로 CDN 도입이 유일한 해결책이다',
      'LCP 이미지를 CSS background-image로 변경하면 로딩 우선순위가 높아진다',
    ],
    correctAnswer: 1,
    explanation:
      'LCP 이미지는 최우선으로 로드되어야 합니다. fetchpriority="high"는 브라우저에게 이 이미지가 중요하다고 알리고, <link rel="preload">는 HTML 파싱 전에 리소스 요청을 시작합니다. CSS background-image는 CSS가 파싱된 후에야 로드를 시작하므로 더 늦습니다. lazy loading은 LCP 이미지에 절대 적용하면 안 됩니다.',
    hints: ['LCP 이미지에 loading="lazy"를 쓰면 오히려 점수가 낮아집니다'],
    deepDive:
      '```tsx\n// ✅ LCP 이미지 최적화 — Next.js App Router\nimport Image from "next/image"\n\n// 방법 1: priority prop (next/image)\nexport default function HeroSection() {\n  return (\n    <Image\n      src="/hero.webp"\n      alt="히어로"\n      width={1200}\n      height={600}\n      priority // ← fetchpriority="high" + preload 자동 적용\n      // loading="eager"도 자동 설정됨\n    />\n  )\n}\n\n// 방법 2: HTML에서 직접 설정\n// <head>에 preload 링크 추가\n<link\n  rel="preload"\n  href="/hero.webp"\n  as="image"\n  fetchpriority="high"\n/>\n<img\n  src="/hero.webp"\n  fetchpriority="high"\n  loading="eager"\n  decoding="async"\n/>\n\n// ❌ 나쁜 예 — LCP 이미지에 lazy loading\n<Image src="/hero.jpg" alt="히어로" width={1200} height={600}\n  loading="lazy" // ← LCP 지연! 절대 금지\n/>\n\n// LCP 점수에 영향을 주는 다른 요인:\n// - TTFB (Time to First Byte): 서버 응답 속도 → CDN, 서버 캐싱\n// - 렌더 차단 리소스: CSS/JS가 파싱을 막음 → async/defer\n// - 이미지 포맷: JPEG → WebP → AVIF (약 30~50% 용량 절감)\n\n// next.config.js — 이미지 최적화 설정\nmodule.exports = {\n  images: {\n    formats: ["image/avif", "image/webp"], // AVIF 우선, WebP 폴백\n    deviceSizes: [640, 750, 828, 1080, 1200, 1920],\n    minimumCacheTTL: 60 * 60 * 24 * 30, // 30일 캐시\n  },\n}\n```',
    relatedProblems: ['perf-q-001', 'perf-q-009'],
  },

  // ─── bundle ──────────────────────────────────────────────────────────────────

  {
    id: 'perf-q-005',
    category: 'performance',
    subcategory: 'bundle',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Code Splitting — dynamic import와 React.lazy',
    description: 'React/Next.js에서 코드 스플리팅을 적용하는 올바른 방법은?',
    conceptExplanation:
      '코드 스플리팅(Code Splitting)은 하나의 큰 JavaScript 번들을 여러 청크로 나누어 필요할 때만 로드하는 기법입니다. 초기 로딩 시 불필요한 코드를 다운로드하지 않아 첫 페이지 로드 속도가 빨라집니다. 동적 import() 구문을 사용하면 번들러가 자동으로 청크를 분리합니다.',
    options: [
      'import 구문을 파일 맨 아래에 작성하면 자동으로 코드 스플리팅이 된다',
      'dynamic import(import())와 React.lazy/Suspense를 사용하거나, Next.js의 next/dynamic으로 컴포넌트를 필요할 때 로드한다',
      '코드 스플리팅은 webpack에서만 지원하므로 Next.js에서는 사용할 수 없다',
      'React.memo와 useMemo를 사용하면 자동으로 코드 스플리팅이 적용된다',
    ],
    correctAnswer: 1,
    explanation:
      '코드 스플리팅은 초기 번들을 줄여 첫 로딩 속도를 개선합니다. React.lazy + Suspense는 클라이언트 컴포넌트에서, Next.js의 next/dynamic은 SSR 제어가 필요할 때 사용합니다. 모달, 차트, 어드민 페이지처럼 초기 렌더링에 필요 없는 컴포넌트에 적용하면 효과적입니다.',
    hints: ['초기 로딩에 필요 없는 컴포넌트를 나중에 로드하는 것이 핵심입니다'],
    deepDive:
      '```tsx\n// 방법 1: React.lazy + Suspense (클라이언트)\nconst HeavyChart = React.lazy(() => import("./HeavyChart"))\n\nfunction Dashboard() {\n  return (\n    <Suspense fallback={<div>차트 로딩 중...</div>}>\n      <HeavyChart />\n    </Suspense>\n  )\n}\n\n// 방법 2: next/dynamic (Next.js 권장)\nimport dynamic from "next/dynamic"\n\n// SSR 비활성화 (브라우저 전용 라이브러리)\nconst RichTextEditor = dynamic(() => import("./RichTextEditor"), {\n  ssr: false,\n  loading: () => <p>에디터 로딩 중...</p>,\n})\n\n// 조건부 로딩 (버튼 클릭 시)\nconst Modal = dynamic(() => import("./Modal"))\n\nfunction Page() {\n  const [open, setOpen] = useState(false)\n  return (\n    <>\n      <button onClick={() => setOpen(true)}>모달 열기</button>\n      {open && (\n        <Suspense fallback={null}>\n          <Modal onClose={() => setOpen(false)} />\n        </Suspense>\n      )}\n    </>\n  )\n}\n\n// 번들 사이즈 확인\n// next build 후 .next/analyze/client.html 열기\n// package.json\n"analyze": "ANALYZE=true next build"\n\n// 스플리팅 전략:\n// - 라우트별: Next.js App Router가 자동 처리\n// - 컴포넌트별: heavy 컴포넌트 (PDF viewer, chart, map)\n// - 라이브러리별: moment.js → date-fns (트리쉐이킹 가능)\n```',
    relatedProblems: ['perf-q-006', 'perf-q-007'],
  },
  {
    id: 'perf-q-006',
    category: 'performance',
    subcategory: 'bundle',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Tree Shaking — named export가 유리한 이유',
    description: '번들러의 Tree Shaking에서 named export가 default export보다 유리한 이유는?',
    conceptExplanation:
      'Tree Shaking은 번들러가 정적 분석을 통해 실제로 사용되지 않는 코드를 최종 번들에서 제거하는 최적화 기법입니다. 나무를 흔들어 죽은 잎사귀를 떨어뜨리는 것에서 유래한 이름입니다. ES Module의 정적 import/export 구조 덕분에 번들러가 빌드 시점에 사용 여부를 분석할 수 있습니다.',
    options: [
      'named export가 문법이 더 짧아서 파일 크기가 줄어들기 때문이다',
      'named export는 사용하는 함수만 번들에 포함시킬 수 있지만, default export는 전체 모듈이 포함될 수 있어 사용하지 않는 코드도 번들에 들어갈 수 있다',
      'Tree Shaking은 named/default export와 관계없이 동일하게 동작한다',
      'default export는 런타임에 결정되므로 번들러가 분석할 수 없어 Tree Shaking이 전혀 안 된다',
    ],
    correctAnswer: 1,
    explanation:
      'Tree Shaking은 정적 분석으로 사용되지 않는 코드를 제거합니다. named export는 개별 export를 정적으로 추적할 수 있어 미사용 함수를 번들에서 제거합니다. 일부 라이브러리는 default export 시 사이드 이펙트가 있어 Tree Shaking이 안 되기도 합니다. lodash처럼 거대한 라이브러리는 lodash-es(named export)를 사용해야 Tree Shaking 효과를 볼 수 있습니다.',
    hints: ['lodash vs lodash-es를 생각해보세요'],
    deepDive:
      '```typescript\n// ❌ Tree Shaking 방해 예시\n// utils.ts — default export\nconst utils = {\n  formatDate: () => {},\n  formatCurrency: () => {},\n  validateEmail: () => {},\n  // 100개의 함수...\n}\nexport default utils\n\n// 사용하는 곳\nimport utils from "./utils"\nutils.formatDate(date) // formatDate만 쓰지만 모든 함수가 번들에 포함\n\n// ✅ Tree Shaking 최적화\n// utils.ts — named export\nexport function formatDate() {}\nexport function formatCurrency() {}\nexport function validateEmail() {}\n\n// 사용하는 곳\nimport { formatDate } from "./utils" // formatDate만 번들에 포함!\n\n// 실무 적용 — lodash\n// ❌ 전체 lodash (70KB+)\nimport _ from "lodash"\n_.debounce(fn, 300)\n\n// ✅ 개별 함수 임포트 (2KB)\nimport debounce from "lodash-es/debounce"\nimport { debounce } from "lodash-es"\n\n// package.json sideEffects 설정 (라이브러리 개발 시)\n{\n  "sideEffects": false,\n  // 또는 side effect가 있는 파일만 명시\n  "sideEffects": ["./src/polyfills.js", "*.css"]\n}\n\n// next-bundle-analyzer로 확인\n// npm install @next/bundle-analyzer\n// next.config.js\nconst withBundleAnalyzer = require("@next/bundle-analyzer")({\n  enabled: process.env.ANALYZE === "true",\n})\nmodule.exports = withBundleAnalyzer(nextConfig)\n```',
    relatedProblems: ['perf-q-005', 'perf-q-007'],
  },
  {
    id: 'perf-q-007',
    category: 'performance',
    subcategory: 'bundle',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: '@next/bundle-analyzer로 번들 분석',
    description: 'Next.js 프로젝트에서 번들 크기 문제를 발견하고 분석하는 올바른 방법은?',
    conceptExplanation:
      '번들 분석(Bundle Analysis)은 최종 빌드 결과물에 어떤 모듈이 얼마나 많은 용량을 차지하는지 시각적으로 파악하는 과정입니다. 트리맵(Treemap) 형태로 각 청크와 모듈의 크기를 비교할 수 있습니다. 예상보다 큰 라이브러리나 중복 포함된 모듈을 찾아 최적화 대상을 식별합니다.',
    options: [
      '브라우저 DevTools Network 탭에서 파일 크기만 보면 충분하다',
      '@next/bundle-analyzer를 설정하고 ANALYZE=true next build로 실행하면 각 모듈의 크기와 의존성을 시각적으로 확인할 수 있다',
      '번들 분석은 배포 후 Lighthouse로만 가능하다',
      'next build 출력에 나오는 route 크기만 확인하면 충분하다',
    ],
    correctAnswer: 1,
    explanation:
      '@next/bundle-analyzer는 webpack-bundle-analyzer를 기반으로 각 청크의 내용을 트리맵으로 시각화합니다. 어떤 라이브러리가 얼마나 큰지, 중복 포함된 모듈은 없는지 확인할 수 있습니다. 실무에서 번들이 갑자기 커졌을 때 원인을 찾는 필수 도구입니다.',
    hints: ['트리맵에서 박스가 클수록 번들에서 더 많은 공간을 차지합니다'],
    deepDive:
      '```bash\n# 설치\nnpm install @next/bundle-analyzer\n\n# next.config.js\nconst withBundleAnalyzer = require("@next/bundle-analyzer")({\n  enabled: process.env.ANALYZE === "true",\n  openAnalyzer: true, // 분석 후 자동으로 브라우저 열기\n})\n\nmodule.exports = withBundleAnalyzer({\n  // 기존 Next.js 설정\n})\n\n# 실행\nANALYZE=true npm run build\n# → .next/analyze/client.html, server.html 생성\n```\n\n```\n번들 분석 후 일반적인 개선 포인트:\n\n1. moment.js (231KB) → date-fns (12KB) 교체\n   - date-fns는 named export로 Tree Shaking 가능\n\n2. lodash (70KB) → lodash-es + 개별 임포트\n   import { debounce } from "lodash-es"\n\n3. 중복 포함 라이브러리\n   - 같은 라이브러리가 server.html, client.html 양쪽에 있으면\n     불필요한 중복 → 서버 전용 코드와 클라이언트 코드 분리\n\n4. 큰 아이콘 라이브러리\n   // ❌ 전체 임포트\n   import { Home, Settings, User } from "lucide-react"\n   // lucide-react는 tree-shakable이므로 위 방식이 이미 최적\n   // ❌ 이런 건 위험\n   import * as Icons from "lucide-react"\n\n5. 번들 크기 제한 설정 (CI에서 자동 체크)\n// next.config.js\nbundlePagesRouterDependencies: true,\nexperimental: {\n  bundlePagesExternals: ["some-heavy-lib"],\n}\n```',
    relatedProblems: ['perf-q-005', 'perf-q-006'],
  },

  // ─── rendering ───────────────────────────────────────────────────────────────

  {
    id: 'perf-q-008',
    category: 'performance',
    subcategory: 'rendering',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'React.memo — 언제 쓰고 언제 낭비인가',
    description: 'React.memo를 사용해야 하는 상황과 오히려 낭비가 되는 상황으로 올바른 것은?',
    conceptExplanation:
      'React.memo는 함수형 컴포넌트를 감싸서 props가 변경되지 않으면 리렌더링을 건너뛰는 고차 컴포넌트입니다. 내부적으로 이전 props와 새 props를 얕은 비교(shallow comparison)하여 동일하면 이전 렌더링 결과를 재사용합니다. 클래스 컴포넌트의 PureComponent와 유사한 역할을 합니다.',
    options: [
      'React.memo는 모든 컴포넌트에 적용해야 최대 성능을 발휘한다',
      '부모가 자주 리렌더링되고 컴포넌트의 렌더링 비용이 높으며 props가 실제로 변하지 않을 때 효과적이고, 단순한 컴포넌트에는 오버헤드만 추가된다',
      'React.memo는 항상 불필요한 리렌더링을 방지하므로 성능이 향상된다',
      'React.memo는 함수형 컴포넌트에서만 동작하지 않고 클래스 컴포넌트에서만 사용해야 한다',
    ],
    correctAnswer: 1,
    explanation:
      'React.memo는 얕은 비교(shallow comparison)로 props를 비교합니다. 비교 자체가 비용이 있으므로 단순한 컴포넌트에서는 오히려 손해입니다. 효과적인 경우: 무거운 차트, 테이블 같은 렌더링 비용이 높은 컴포넌트, 부모가 매우 자주 리렌더링될 때. 주의: 객체/배열/함수 props는 매번 새로 생성되므로 memo 효과가 없습니다(useMemo/useCallback 필요).',
    hints: ['memo + useCallback/useMemo를 함께 쓰지 않으면 의미가 없는 경우가 많습니다'],
    deepDive:
      '```tsx\n// React.memo가 효과 있는 경우\nconst ExpensiveChart = React.memo(function ExpensiveChart({ data, config }) {\n  // 렌더링에 100ms 걸리는 무거운 차트\n  return <HeavyVisualization data={data} config={config} />\n})\n\n// 부모\nfunction Dashboard() {\n  const [count, setCount] = useState(0)\n  const chartData = useMemo(() => processData(rawData), [rawData])\n  // count 변경 시 Dashboard 리렌더링 → chartData가 같으면 ExpensiveChart 리렌더링 X\n  return (\n    <>\n      <Counter count={count} onChange={setCount} />\n      <ExpensiveChart data={chartData} /> {/* memo 효과 ✅ */}\n    </>\n  )\n}\n\n// React.memo가 무의미한 경우 (흔한 실수)\nconst SimpleButton = React.memo(({ onClick, children }) => (\n  <button onClick={onClick}>{children}</button>\n))\n\nfunction Parent() {\n  const [count, setCount] = useState(0)\n  // ❌ onClick이 매 렌더링마다 새 함수 → memo 효과 없음!\n  return <SimpleButton onClick={() => setCount(c => c + 1)}>{count}</SimpleButton>\n}\n\n// ✅ useCallback으로 함수 안정화 필요\nfunction Parent() {\n  const [count, setCount] = useState(0)\n  const handleClick = useCallback(() => setCount(c => c + 1), [])\n  return <SimpleButton onClick={handleClick}>{count}</SimpleButton>\n}\n\n// React Profiler로 실제 확인\n// Chrome DevTools > React 탭 > Profiler > Record\n// "Ranked chart"에서 렌더링 시간이 긴 컴포넌트 확인\n```',
    relatedProblems: ['perf-q-009', 'perf-q-010'],
  },
  {
    id: 'perf-q-009',
    category: 'performance',
    subcategory: 'rendering',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'useMemo/useCallback — 실제 효과와 오용',
    description: 'useMemo와 useCallback의 실제 효과와 잘못된 사용 패턴으로 올바른 것은?',
    conceptExplanation:
      'useMemo는 비용이 큰 계산 결과를 캐싱하고, useCallback은 함수 참조를 안정적으로 유지하기 위한 React 훅입니다. 두 훅 모두 의존성 배열(dependency array)을 받아, 의존성이 변경될 때만 값을 재계산합니다. 메모이제이션 자체에도 비교 비용이 발생하므로 무분별하게 사용하면 오히려 성능이 저하될 수 있습니다.',
    options: [
      'useMemo와 useCallback은 항상 성능을 향상시키므로 가능한 많이 사용해야 한다',
      'useMemo는 비싼 계산을 캐싱하고 useCallback은 함수 참조를 안정화하지만, 의존성이 자주 바뀌면 오히려 오버헤드가 된다',
      'useMemo는 렌더링을 방지하고 useCallback은 API 호출을 줄인다',
      'useCallback은 항상 새 함수 생성을 방지하여 무조건 성능이 향상된다',
    ],
    correctAnswer: 1,
    explanation:
      'useMemo/useCallback은 의존성 배열 비교 + 이전 값 캐싱의 오버헤드가 있습니다. 의존성이 자주 바뀌면 매번 재계산 + 비교 비용까지 추가됩니다. 실제로 효과 있는 경우: useMemo는 O(n²) 이상 연산, useCallback은 memo로 감싼 자식에게 전달하는 함수. 단순한 원시값 반환이나 작은 계산에는 쓰지 않는 게 낫습니다.',
    hints: ['의존성이 자주 바뀌는 useMemo는 캐싱 효과가 없고 오버헤드만 생깁니다'],
    deepDive:
      '```tsx\n// useMemo가 효과 있는 경우\nfunction ProductList({ products, filter }) {\n  // ✅ 수천 개 상품 필터링 — 비싼 계산\n  const filteredProducts = useMemo(\n    () => products.filter(p => p.category === filter && p.stock > 0),\n    [products, filter]\n  )\n  return filteredProducts.map(p => <ProductCard key={p.id} product={p} />)\n}\n\n// useMemo가 무의미한 경우\nfunction Greeting({ name }) {\n  // ❌ 단순 문자열 연산에 useMemo는 낭비\n  const greeting = useMemo(() => `안녕하세요, ${name}!`, [name])\n  return <p>{greeting}</p>\n  // ✅ 그냥 쓰면 됨\n  // return <p>안녕하세요, {name}!</p>\n}\n\n// useCallback 실제 효과 측정\nfunction Parent() {\n  const [count, setCount] = useState(0)\n  const [name, setName] = useState("")\n\n  // count나 name이 변경될 때마다 새 함수 생성\n  // ❌ 의존성이 자주 바뀌면 useCallback 무의미\n  const handleNameChange = useCallback((newName) => {\n    setName(newName)\n    sendAnalytics({ count, name: newName }) // count가 의존성\n  }, [count]) // count가 바뀔 때마다 새 함수 생성!\n\n  // ✅ 의존성 없는 안정적인 핸들러\n  const handleIncrement = useCallback(() => {\n    setCount(c => c + 1) // 함수형 업데이트로 의존성 제거\n  }, []) // 빈 배열 → 항상 같은 참조\n\n  return <ExpensiveChild onIncrement={handleIncrement} />\n}\n\n// 실무 원칙:\n// 1. 먼저 작성 → 프로파일링 → 문제 발견 → 최적화\n// 2. "섣부른 최적화는 모든 악의 근원" — Donald Knuth\n```',
    relatedProblems: ['perf-q-008', 'perf-q-010'],
  },
  {
    id: 'perf-q-010',
    category: 'performance',
    subcategory: 'rendering',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'React Profiler — 렌더링 병목 찾기',
    description: 'React DevTools Profiler를 사용해 렌더링 성능 문제를 찾는 올바른 방법은?',
    conceptExplanation:
      'React DevTools Profiler는 컴포넌트별 렌더링 시간과 빈도를 기록하고 시각화하는 개발 도구입니다. 플레임그래프(Flamegraph)로 렌더링 트리를 시각화하고, 어떤 컴포넌트가 왜 리렌더링됐는지 원인을 파악할 수 있습니다. 성능 최적화 전에 반드시 프로파일링으로 병목을 먼저 확인해야 합니다.',
    options: [
      'console.log를 각 컴포넌트에 추가해서 렌더링 횟수를 세는 것이 가장 정확하다',
      'React DevTools Profiler로 Record 후 Flamegraph에서 렌더링 시간이 긴 컴포넌트를 찾고, "Why did this render?" 기능으로 원인을 파악한다',
      'Profiler는 개발 모드에서만 부정확하므로 프로덕션 빌드에서만 사용해야 한다',
      'React Profiler API는 deprecated되었으므로 useRef로 타이머를 직접 구현해야 한다',
    ],
    correctAnswer: 1,
    explanation:
      'React DevTools Profiler는 각 컴포넌트의 렌더링 시간과 원인을 분석합니다. Flamegraph는 렌더링 트리를 시각화하고, Ranked chart는 가장 오래 걸린 컴포넌트를 순서대로 보여줍니다. "Why did this render?"는 어떤 props/state 변경이 리렌더링을 유발했는지 정확히 알려줍니다.',
    hints: ['DevTools Settings > General > "Record why each component rendered"를 켜야 "Why did this render?"가 활성화됩니다'],
    deepDive:
      '```tsx\n// React Profiler API (코드에서 직접 측정)\nimport { Profiler } from "react"\n\nfunction onRenderCallback(id, phase, actualDuration, baseDuration, startTime, commitTime) {\n  // id: Profiler의 id prop\n  // phase: "mount" | "update"\n  // actualDuration: 이번 렌더링에 걸린 시간 (ms)\n  // baseDuration: 최적화 없이 걸리는 기준 시간 (ms)\n  console.log(`[${id}] ${phase}: ${actualDuration.toFixed(2)}ms`)\n  // 프로덕션에서 수집 가능 (단, bundle에 포함됨)\n}\n\nfunction App() {\n  return (\n    <Profiler id="Dashboard" onRender={onRenderCallback}>\n      <Dashboard />\n    </Profiler>\n  )\n}\n\n// DevTools Profiler 사용법:\n// 1. Chrome > React DevTools 설치\n// 2. Profiler 탭 > ⚙️ Settings > "Record why each component rendered" 체크\n// 3. Record 버튼 클릭\n// 4. 느린 인터랙션 수행\n// 5. Record 중지\n// 6. Flamegraph에서 색이 진할수록 렌더링 시간이 긴 컴포넌트\n// 7. 컴포넌트 클릭 > "Why did this render?" 확인\n\n// 흔한 불필요한 리렌더링 원인:\n// - Context 값이 객체/배열 (매번 새 참조)\n// - 부모 컴포넌트의 인라인 함수/객체\n// - 전역 상태(Zustand)의 불필요한 구독\n\n// Zustand 최적화: 필요한 부분만 구독\nconst count = useStore(state => state.count) // ✅ count만 구독\nconst store = useStore() // ❌ 전체 구독\n```',
    relatedProblems: ['perf-q-008', 'perf-q-009'],
  },

  // ─── resource ────────────────────────────────────────────────────────────────

  {
    id: 'perf-q-011',
    category: 'performance',
    subcategory: 'resource',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'next/image 최적화 — WebP/AVIF, sizes 속성',
    description: 'Next.js의 next/image 컴포넌트를 올바르게 사용하는 방법은?',
    conceptExplanation:
      'next/image는 Next.js가 제공하는 이미지 최적화 컴포넌트로, 자동으로 WebP/AVIF 변환, 지연 로딩, 크기 최적화를 수행합니다. sizes 속성은 뷰포트 너비에 따라 이미지가 얼마나 크게 표시되는지 브라우저에게 알려주는 힌트입니다. 브라우저는 이 정보를 바탕으로 srcset에서 최적의 이미지 크기를 선택합니다.',
    options: [
      'sizes 속성은 이미지의 표시 크기를 고정하는 옵션이다',
      'sizes 속성으로 뷰포트별 이미지 표시 크기를 알려주면 브라우저가 적절한 srcset 이미지를 선택하고, Next.js는 WebP/AVIF를 자동으로 제공한다',
      'next/image는 항상 원본 이미지를 그대로 제공하며 최적화는 별도 설정이 필요하다',
      'fill 모드에서는 sizes 속성이 필요 없다',
    ],
    correctAnswer: 1,
    explanation:
      'sizes 속성은 브라우저에게 "이 이미지가 어떤 뷰포트에서 몇 px로 표시되는지"를 알려줍니다. 그러면 브라우저가 srcset에서 가장 적합한 크기의 이미지를 선택합니다. sizes 없이 full-width 이미지에 기본값을 쓰면 모바일에서도 1920px 이미지를 다운로드하게 됩니다. fill 모드에서는 부모 컨테이너 크기를 모르므로 sizes 지정이 더욱 중요합니다.',
    hints: ['sizes 없는 fill 이미지는 항상 100vw로 가정하여 큰 이미지를 다운로드합니다'],
    deepDive:
      '```tsx\nimport Image from "next/image"\n\n// ✅ 올바른 sizes 설정\nfunction ProductCard({ image }) {\n  return (\n    <Image\n      src={image.url}\n      alt={image.alt}\n      width={400}\n      height={300}\n      // 모바일: 100% 너비, 태블릿: 50% 너비, 데스크탑: 33% 너비\n      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"\n      // Next.js가 자동으로 WebP/AVIF srcset 생성\n    />\n  )\n}\n\n// fill 모드 (부모가 크기 결정)\nfunction HeroBanner() {\n  return (\n    <div style={{ position: "relative", height: "500px" }}>\n      <Image\n        src="/banner.jpg"\n        alt="배너"\n        fill\n        priority // LCP 이미지이므로 우선 로드\n        sizes="100vw" // 전체 너비\n        style={{ objectFit: "cover" }}\n      />\n    </div>\n  )\n}\n\n// next.config.js — AVIF 우선 활성화\nmodule.exports = {\n  images: {\n    formats: ["image/avif", "image/webp"],\n    // AVIF: JPEG 대비 50% 작음, WebP보다 20% 작음\n    // 단, AVIF 인코딩이 느리므로 서버 부하 주의\n    remotePatterns: [\n      { protocol: "https", hostname: "example.com" },\n    ],\n  },\n}\n\n// 생성되는 srcset 예시:\n// <img srcset="\n//   /_next/image?url=...&w=640&q=75 640w,\n//   /_next/image?url=...&w=1080&q=75 1080w,\n//   /_next/image?url=...&w=1920&q=75 1920w"\n//   sizes="(max-width: 640px) 100vw, 33vw"\n// />\n```',
    relatedProblems: ['perf-q-004', 'perf-q-012'],
  },
  {
    id: 'perf-q-012',
    category: 'performance',
    subcategory: 'resource',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: '폰트 최적화 — FOUT/FOIT와 next/font',
    description: 'FOUT, FOIT의 차이와 next/font로 폰트를 최적화하는 방법으로 올바른 것은?',
    conceptExplanation:
      'FOUT(Flash of Unstyled Text)는 웹폰트가 로드되기 전 폴백 폰트로 텍스트가 표시되다가 교체되는 현상이고, FOIT(Flash of Invisible Text)는 폰트 로드 전 텍스트가 아예 보이지 않는 현상입니다. 두 현상 모두 사용자 경험과 CLS 점수에 부정적인 영향을 줍니다. font-display CSS 속성으로 두 현상 사이의 균형을 조절할 수 있습니다.',
    options: [
      'FOUT와 FOIT는 동일한 현상이며, 둘 다 폰트가 너무 빠르게 로드될 때 발생한다',
      'FOUT(스타일 없는 텍스트 번쩍임)는 폴백 폰트 → 실제 폰트 교체로 발생하고, FOIT(보이지 않는 텍스트)는 폰트 로드 전 텍스트가 숨겨지며, next/font는 CSS 변수를 사용해 레이아웃 이동 없이 폰트를 최적화한다',
      'next/font는 구글 폰트를 항상 CDN으로 제공하여 빠른 로딩을 보장한다',
      'font-display: block을 사용하면 FOUT와 FOIT를 모두 방지할 수 있다',
    ],
    correctAnswer: 1,
    explanation:
      'FOUT(Flash of Unstyled Text): 폴백 폰트로 텍스트가 표시되다가 실제 폰트로 교체될 때 번쩍이는 현상. FOIT(Flash of Invisible Text): 폰트 로드 전 텍스트가 보이지 않다가 갑자기 나타나는 현상. next/font는 빌드 시 구글 폰트를 다운로드하고 자체 호스팅하며, size-adjust로 폴백 폰트와 크기를 맞춰 CLS를 최소화합니다.',
    hints: ['next/font는 구글 서버가 아닌 자체 서버에서 폰트를 제공합니다'],
    deepDive:
      '```tsx\n// next/font/google 사용 (권장)\nimport { Noto_Sans_KR, Inter } from "next/font/google"\n\n// 빌드 시 구글 폰트 다운로드 → 자체 호스팅\n// 구글 서버 DNS 조회 없음 → 개인정보 보호 + 성능\nconst notoSansKr = Noto_Sans_KR({\n  subsets: ["latin"],\n  weight: ["400", "700"],\n  display: "swap",   // FOUT 방식: 폴백 폰트 먼저, 로드 후 교체\n  // display: "optional" // 느린 네트워크에서 폴백 유지 (CLS 완전 방지)\n  preload: true,     // 기본값, 중요 폰트는 preload\n  variable: "--font-noto", // CSS 변수로 사용 가능\n})\n\n// app/layout.tsx\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="ko" className={notoSansKr.className}>\n      <body>{children}</body>\n    </html>\n  )\n}\n\n// 로컬 폰트\nimport localFont from "next/font/local"\nconst myFont = localFont({\n  src: [\n    { path: "./fonts/MyFont-Regular.woff2", weight: "400" },\n    { path: "./fonts/MyFont-Bold.woff2", weight: "700" },\n  ],\n  display: "swap",\n  // next/font가 자동으로 size-adjust 계산\n  // → 폴백 폰트와 크기가 거의 같아져 CLS 최소화\n})\n\n// font-display 값 비교:\n// auto: 브라우저 기본 (보통 block)\n// block: 최대 3초 대기 후 폴백 (FOIT)\n// swap: 즉시 폴백, 로드 후 교체 (FOUT, 권장)\n// fallback: 100ms 대기, 3초 내 로드 못하면 폴백 유지\n// optional: 100ms 대기, 못 로드하면 세션 내 폴백 유지 (CLS 없음)\n```',
    relatedProblems: ['perf-q-003', 'perf-q-013'],
  },
  {
    id: 'perf-q-013',
    category: 'performance',
    subcategory: 'resource',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'HTTP 캐싱 — Cache-Control 전략',
    description: 'Next.js App Router에서 정적 자산과 API 응답의 Cache-Control을 올바르게 설정하는 방법은?',
    conceptExplanation:
      'HTTP Cache-Control 헤더는 브라우저와 CDN이 리소스를 얼마나 오래 캐시할지 제어하는 지시어입니다. max-age, no-cache, no-store 등의 디렉티브를 조합해 캐싱 전략을 세밀하게 설정합니다. 올바른 캐싱 전략은 서버 부하를 줄이고 사용자에게 빠른 응답을 제공하는 핵심 성능 최적화 방법입니다.',
    options: [
      'Cache-Control: no-cache를 설정하면 브라우저가 캐시를 저장하지 않는다',
      '정적 자산은 immutable + 긴 max-age, API 응답은 stale-while-revalidate 전략을 사용하고, no-cache는 "캐시하지 않음"이 아니라 "매번 서버에 확인"을 의미한다',
      'Cache-Control은 서버에서만 설정하며 Next.js에서는 자동으로 최적 설정이 적용된다',
      'no-store와 no-cache는 동일하며 둘 다 캐싱을 완전히 비활성화한다',
    ],
    correctAnswer: 1,
    explanation:
      'no-cache는 "캐시하지 마라"가 아니라 "캐시는 하되 사용 전에 항상 서버에 확인하라"입니다. no-store가 실제로 캐시를 저장하지 않습니다. 정적 자산(JS, CSS, 이미지)은 파일명에 해시를 포함하므로 변경 시 URL이 바뀌어 immutable + 1년 max-age를 안전하게 설정할 수 있습니다.',
    hints: ['no-cache ≠ 캐시 안 함. no-store = 캐시 안 함'],
    deepDive:
      '```\nCache-Control 디렉티브 정리:\n\nno-store         캐시에 저장 안 함 (민감한 데이터)\nno-cache         저장은 하되, 매번 서버에 재검증 요청\nprivate          브라우저 캐시만 (CDN 캐시 X)\npublic           CDN 포함 모든 캐시\nmax-age=N        N초 동안 fresh (재검증 없이 사용)\ns-maxage=N       CDN에서의 max-age (브라우저는 max-age 사용)\nimmutable        max-age 기간 중 절대 변경 안 됨 (재검증 생략)\nstale-while-revalidate=N  만료 후 N초 동안 stale 응답 사용하며 백그라운드 재검증\n```\n\n```typescript\n// Next.js Route Handler에서 Cache-Control 설정\n// app/api/products/route.ts\nexport async function GET() {\n  const products = await getProductsFromDB()\n  return Response.json(products, {\n    headers: {\n      // 60초 캐시, 만료 후 10초간 stale 허용하며 백그라운드 갱신\n      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=10",\n    },\n  })\n}\n\n// 정적 자산 캐싱 (next.config.js)\nmodule.exports = {\n  async headers() {\n    return [\n      {\n        // _next/static은 콘텐츠 해시가 포함된 URL\n        source: "/_next/static/:path*",\n        headers: [\n          {\n            key: "Cache-Control",\n            value: "public, max-age=31536000, immutable",\n            // 1년 캐시 + 절대 변경 안 됨\n          },\n        ],\n      },\n      {\n        source: "/api/:path*",\n        headers: [\n          {\n            key: "Cache-Control",\n            value: "no-store", // API는 항상 최신 데이터\n          },\n        ],\n      },\n    ]\n  },\n}\n\n// Next.js fetch 캐싱 (App Router)\n// 서버 컴포넌트에서\nconst data = await fetch("/api/products", {\n  next: { revalidate: 60 }, // 60초 ISR\n  // next: { tags: ["products"] } // on-demand revalidation\n})\n```',
    relatedProblems: ['perf-q-014'],
  },
  {
    id: 'perf-q-014',
    category: 'performance',
    subcategory: 'resource',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Prefetch vs Preload vs Preconnect',
    description: 'HTML <link> 태그의 rel="prefetch", rel="preload", rel="preconnect"의 차이로 올바른 것은?',
    conceptExplanation:
      'preload, prefetch, preconnect는 브라우저가 리소스를 미리 준비하도록 힌트를 주는 HTML 링크 관계(rel) 속성입니다. 각각 현재 페이지용 우선 로드, 다음 페이지용 사전 다운로드, 외부 도메인 사전 연결이라는 다른 목적을 가집니다. 적절히 사용하면 페이지 전환과 리소스 로딩 속도를 크게 개선할 수 있습니다.',
    options: [
      'prefetch, preload, preconnect는 모두 동일하게 리소스를 미리 다운로드한다',
      'preload는 현재 페이지에 필요한 리소스를 높은 우선순위로 미리 로드하고, prefetch는 다음 페이지를 위해 낮은 우선순위로 준비하며, preconnect는 외부 도메인에 미리 TCP/TLS 연결을 맺는다',
      'preconnect는 리소스를 다운로드하고 preload는 DNS만 조회한다',
      'prefetch는 캐시에 저장되지 않아 실제 페이지 이동 시 다시 다운로드한다',
    ],
    correctAnswer: 1,
    explanation:
      'preload: 현재 페이지 렌더링에 필요한 중요 리소스를 높은 우선순위로 선점 로드 (LCP 이미지, 폰트). prefetch: 브라우저 유휴 시간에 다음 페이지 리소스를 낮은 우선순위로 미리 다운로드. preconnect: TCP 핸드셰이크 + TLS 협상을 미리 수행하여 외부 도메인 첫 요청 지연 감소. Next.js Link 컴포넌트는 viewport에 들어오면 자동으로 prefetch합니다.',
    hints: ['preload는 현재, prefetch는 미래, preconnect는 연결 준비'],
    deepDive:
      '```html\n<!-- preload: 현재 페이지 중요 리소스를 최우선 로드 -->\n<link rel="preload" href="/fonts/NotoSansKR.woff2"\n  as="font" type="font/woff2" crossorigin />\n<link rel="preload" href="/hero-image.webp"\n  as="image" fetchpriority="high" />\n\n<!-- preconnect: 외부 도메인 TCP+TLS 미리 연결 -->\n<link rel="preconnect" href="https://fonts.googleapis.com" />\n<link rel="preconnect" href="https://api.example.com" />\n\n<!-- dns-prefetch: DNS만 미리 조회 (preconnect 폴백) -->\n<link rel="dns-prefetch" href="https://cdn.example.com" />\n\n<!-- prefetch: 다음 페이지 리소스 미리 다운로드 (낮은 우선순위) -->\n<link rel="prefetch" href="/next-page-bundle.js" />\n```\n\n```tsx\n// Next.js App Router에서\n// 1. Link 컴포넌트 자동 prefetch\nimport Link from "next/link"\n\nfunction Nav() {\n  return (\n    <>\n      {/* 뷰포트에 들어오면 자동으로 /dashboard를 prefetch */}\n      <Link href="/dashboard">대시보드</Link>\n      {/* prefetch 비활성화 */}\n      <Link href="/heavy-page" prefetch={false}>무거운 페이지</Link>\n    </>\n  )\n}\n\n// 2. 프로그래매틱 prefetch\nimport { useRouter } from "next/navigation"\n\nfunction ProductCard({ product }) {\n  const router = useRouter()\n  return (\n    <div\n      onMouseEnter={() => router.prefetch(`/products/${product.id}`)}\n    >\n      {product.name}\n    </div>\n  )\n}\n\n// 3. next.config.js에서 외부 API preconnect\nmodule.exports = {\n  async headers() {\n    return [{\n      source: "/(.*)",\n      headers: [\n        {\n          key: "Link",\n          value: "<https://api.myservice.com>; rel=preconnect",\n        },\n      ],\n    }]\n  },\n}\n```',
    relatedProblems: ['perf-q-004', 'perf-q-013'],
  },
]
