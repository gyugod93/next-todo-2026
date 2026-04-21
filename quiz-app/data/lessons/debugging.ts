import type { Lesson } from '@/types'

export const debuggingLessons: Lesson[] = [
  {
    id: 'dbg-l-001',
    category: 'debugging',
    subcategory: 'devtools',
    title: '브라우저 DevTools 완전 정복',
    description: 'Network/Performance/Memory 탭을 자유자재로 다루는 실전 디버깅',
    emoji: '🔧',
    readingTime: 9,
    tags: ['devtools', 'network', 'performance', 'memory'],
    sections: [
      {
        title: 'Network 탭 — 요청 흐름 파악',
        content: `네트워크 탭은 페이지가 주고받는 모든 HTTP 요청을 기록합니다. 실전에서 가장 자주 여는 탭입니다.

**핵심 컬럼:**
- **Status**: 200(성공), 304(캐시), 401(인증 필요), 403(권한 없음), 404(없음), 500(서버 에러), 0(CORS 차단)
- **Type**: XHR/fetch, document, script, stylesheet, font, img
- **Waterfall**: 요청 타이밍 시각화 — 어디서 병목인지 한눈에 파악

**꼭 알아야 할 필터:**
- \`Fetch/XHR\` 필터: API 요청만 보기
- \`Preserve log\`: 페이지 이동 후에도 로그 유지 (리다이렉트 디버깅 필수)
- \`Disable cache\`: 캐시 무시하고 항상 서버에서 받기

**요청 클릭 후 확인:**
- **Headers**: 요청/응답 헤더, CORS 헤더 확인
- **Payload**: 보낸 request body
- **Response**: 서버 응답 원문
- **Preview**: JSON 예쁘게 보기
- **Timing**: DNS, SSL, TTFB 각 단계 소요 시간`,
      },
      {
        title: 'Console 고급 활용',
        content: `console.log만 쓰면 손해입니다. DevTools Console의 강력한 기능을 활용하세요.`,
        code: `// console.table — 배열/객체를 표로 출력
const users = [
  { id: 1, name: '김철수', role: 'admin' },
  { id: 2, name: '이영희', role: 'user' },
]
console.table(users)
// ┌─────────┬────┬────────┬─────────┐
// │ (index) │ id │  name  │  role   │
// └─────────┴────┴────────┴─────────┘

// console.group — 관련 로그 묶기
console.group('API 요청: /api/users')
console.log('요청 시각:', new Date())
console.log('파라미터:', { page: 1, limit: 10 })
console.groupEnd()

// console.time — 성능 측정
console.time('데이터 처리')
const result = heavyProcessing(data)
console.timeEnd('데이터 처리') // "데이터 처리: 42.3ms"

// console.trace — 호출 스택 출력
function thirdLevel() { console.trace('어디서 호출됐나?') }
function secondLevel() { thirdLevel() }
function firstLevel() { secondLevel() }
firstLevel()

// console.assert — 조건이 false일 때만 출력
console.assert(user.role === 'admin', '관리자만 접근 가능', user)

// $ 단축키 (DevTools Console에서)
// $0 — 현재 선택된 DOM 요소
// $('selector') — document.querySelector 단축
// $$('selector') — document.querySelectorAll 단축
// $_ — 마지막 표현식 결과`,
        language: 'javascript',
      },
      {
        title: 'Sources 탭 — 중단점(Breakpoint) 디버깅',
        content: `console.log 대신 중단점을 사용하면 실행 중인 상태를 직접 검사할 수 있습니다.

**중단점 종류:**
- **Line breakpoint**: 해당 줄에서 일시 정지 (줄 번호 클릭)
- **Conditional breakpoint**: 특정 조건일 때만 정지 (우클릭 → Add conditional breakpoint)
- **Logpoint**: 정지 없이 값만 출력 (console.log 대체)
- **XHR breakpoint**: 특정 URL 요청 시 정지

**디버깅 단축키:**
- **F8 / ⌘\\**: 실행 재개 (Resume)
- **F10 / F⌘'**: 다음 줄로 이동 (Step over) — 함수 내부 진입 안 함
- **F11 / F⌘;**: 함수 내부로 진입 (Step into)
- **Shift+F11**: 현재 함수에서 나오기 (Step out)

**Watch 패널**: 감시할 변수를 추가해두면 실행 중 값 변화를 추적할 수 있습니다.`,
        code: `// debugger 문으로 코드에서 직접 중단점 설정
function processPayment(amount: number, userId: string) {
  debugger // 여기서 DevTools가 자동으로 일시 정지
  const discounted = applyDiscount(amount, userId)
  return chargeCard(discounted)
}

// Conditional breakpoint 예시 (DevTools에서 설정):
// 조건: userId === 'problem-user-123'
// → 특정 유저의 요청만 잡을 때 유용`,
        language: 'typescript',
      },
      {
        title: 'Memory 탭 — 메모리 누수 찾기',
        content: `앱이 시간이 지날수록 느려진다면 메모리 누수를 의심해보세요.

**Heap Snapshot 사용법:**
1. DevTools → Memory → Heap snapshot → Take snapshot
2. 의심되는 동작 수행 (예: 모달 열고 닫기 10회)
3. 다시 스냅샷 찍기
4. "Comparison" 모드로 두 스냅샷 비교
5. Δ Size(증가량)가 큰 객체 확인

**Allocation Timeline:**
- 시간에 따른 메모리 할당 기록
- 특정 시점에 급격히 늘어난 객체 추적 가능

**메모리 누수 주요 원인 식별:**
- Detached DOM trees (DOM 노드가 메모리에 남아 있음)
- 클로저가 큰 객체 참조 유지
- 제거되지 않은 이벤트 리스너`,
        code: `// 메모리 누수 패턴 — Detached DOM
function badPattern() {
  const btn = document.getElementById('btn')
  const bigData = new Array(100000).fill('data')

  btn?.addEventListener('click', () => {
    console.log(bigData.length) // bigData 클로저 유지
  })
  // btn을 DOM에서 제거해도 이벤트 리스너 때문에 bigData가 GC되지 않음
}

// 확인 방법:
// Memory → Heap Snapshot → "Detached" 검색
// → HTMLElement가 남아 있으면 누수`,
        language: 'javascript',
      },
    ],
    keyPoints: [
      'Network 탭: Preserve log + Fetch/XHR 필터로 API 요청만 추적',
      'console.table/time/group으로 console.log보다 효율적인 로깅',
      'Conditional breakpoint: 특정 조건일 때만 멈춰서 불필요한 중단 방지',
      'Memory → Heap Snapshot Comparison으로 메모리 누수 객체 특정',
    ],
    relatedProblemIds: ['dbg-q-001', 'dbg-q-002'],
  },
  {
    id: 'dbg-l-002',
    category: 'debugging',
    subcategory: 'error-patterns',
    title: '에러 메시지 해독 — 패턴별 원인과 해결',
    description: 'TypeError, ReferenceError, Cannot read properties, async 에러 등 실전 에러 해결법',
    emoji: '🚨',
    readingTime: 8,
    tags: ['error', 'TypeError', 'async-error', 'debugging'],
    sections: [
      {
        title: '가장 흔한 에러 패턴',
        content: `에러 메시지를 읽는 능력은 디버깅의 핵심입니다. 패턴을 외우면 에러를 보는 순간 원인이 보입니다.

**TypeError: Cannot read properties of undefined (reading 'xxx')**
원인: undefined인 값에 프로퍼티 접근
해결: 옵셔널 체이닝(\`?.\`) 또는 null 체크

**TypeError: xxx is not a function**
원인: 함수가 아닌 값을 호출하거나, this 바인딩 손실
해결: 함수 타입 확인, 화살표 함수 또는 .bind(this)

**ReferenceError: xxx is not defined**
원인: 선언되지 않은 변수 접근, 또는 TDZ(Temporal Dead Zone)
해결: 변수 선언 확인, let/const는 선언 전 접근 불가

**Uncaught (in promise) Error**
원인: Promise reject를 catch하지 않음
해결: try/catch 또는 .catch() 추가`,
        code: `// ❌ Cannot read properties of undefined
const user = undefined
console.log(user.name) // TypeError!

// ✅ 해결 1: 옵셔널 체이닝
console.log(user?.name) // undefined (에러 없음)

// ✅ 해결 2: 조기 반환
if (!user) return null

// ✅ 해결 3: 기본값
const { name = '알 수 없음' } = user ?? {}

// ❌ is not a function — this 바인딩 손실
class Timer {
  count = 0
  start() {
    setInterval(function() {
      this.count++ // this가 window가 됨!
    }, 1000)
  }
}

// ✅ 화살표 함수로 해결
class Timer {
  count = 0
  start() {
    setInterval(() => {
      this.count++ // 화살표 함수는 this 바인딩 없음 → 외부 this 사용
    }, 1000)
  }
}`,
        language: 'typescript',
      },
      {
        title: 'async/await 에러 처리 패턴',
        content: `비동기 에러는 동기 에러와 다르게 동작합니다. 처리 패턴을 명확히 이해해야 에러가 사라지지 않습니다.`,
        code: `// ❌ 비동기 에러를 잡지 못하는 패턴
function fetchData() {
  fetch('/api/data') // Promise 반환이지만 await 없음
    .then(r => r.json())
  // UnhandledPromiseRejection: 에러가 콘솔에만 출력됨
}

// ✅ 패턴 1: try/catch + async/await (가장 권장)
async function fetchData() {
  try {
    const res = await fetch('/api/data')
    if (!res.ok) throw new Error(\`HTTP \${res.status}: \${res.statusText}\`)
    return await res.json()
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('네트워크 연결 실패:', error)
    } else {
      console.error('API 에러:', error)
    }
    throw error // 필요하면 상위로 전파
  }
}

// ✅ 패턴 2: Result 타입 패턴 (에러를 값으로 처리)
async function safeRequest<T>(
  url: string
): Promise<{ data: T; error: null } | { data: null; error: Error }> {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(\`\${res.status} \${res.statusText}\`)
    const data: T = await res.json()
    return { data, error: null }
  } catch (e) {
    return { data: null, error: e instanceof Error ? e : new Error(String(e)) }
  }
}

// 사용
const { data, error } = await safeRequest<User[]>('/api/users')
if (error) { /* 에러 처리 */ return }
console.log(data) // data가 null이 아님을 TypeScript가 앎

// ✅ 패턴 3: Promise.allSettled — 여러 요청 중 일부 실패 허용
const results = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/products'),
  fetch('/api/orders'),
])

results.forEach((result, i) => {
  if (result.status === 'fulfilled') {
    console.log(\`요청 \${i} 성공:\`, result.value)
  } else {
    console.error(\`요청 \${i} 실패:\`, result.reason)
  }
})`,
        language: 'typescript',
      },
      {
        title: '에러 스택 트레이스 읽기',
        content: `스택 트레이스는 에러 발생까지의 함수 호출 경로입니다. 아래에서 위로 읽으면 됩니다 — 가장 아래가 최초 진입점, 가장 위가 에러 발생 지점입니다.

**Source Map**: 번들된 코드(.min.js)의 스택 트레이스를 원본 TypeScript 코드로 매핑합니다. 개발 환경에서는 자동으로 활성화되어 있습니다. Vercel/Netlify 프로덕션에서도 source map을 업로드하면 원본 코드 위치를 볼 수 있습니다.`,
        code: `// 스택 트레이스 예시
// TypeError: Cannot read properties of null (reading 'value')
//     at handleSubmit (ContactForm.tsx:45:22)  ← 에러 발생 지점
//     at HTMLButtonElement.onClick (ContactForm.tsx:78:5)
//     at React.SyntheticEvent (react-dom.js:1234)
//
// → ContactForm.tsx 45번 줄로 가서 null 체크 추가

// Node.js에서 에러 원인 체인
async function processOrder(orderId: string) {
  try {
    const order = await db.orders.findById(orderId)
    await sendConfirmationEmail(order)
  } catch (error) {
    // cause로 원인 체인 유지
    throw new Error(\`주문 처리 실패: \${orderId}\`, { cause: error })
  }
}

// 출력:
// Error: 주문 처리 실패: order_123
//   [cause]: Error: SMTP connection refused`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      '"Cannot read properties of undefined" → 옵셔널 체이닝(?.)으로 즉시 해결',
      'async 에러는 반드시 try/catch 또는 .catch()로 처리 — UnhandledPromiseRejection 방지',
      'Result 타입 패턴: 에러를 예외가 아닌 값으로 처리해 타입 안전하게',
      '스택 트레이스는 아래→위로: 가장 위 줄이 에러가 실제로 발생한 위치',
    ],
    relatedProblemIds: ['dbg-q-002', 'dbg-q-003'],
  },
  {
    id: 'dbg-l-003',
    category: 'debugging',
    subcategory: 'react-debugging',
    title: 'React 디버깅 — DevTools와 에러 경계',
    description: 'React DevTools Profiler로 불필요한 리렌더링 찾기, Error Boundary 설계',
    emoji: '⚛️',
    readingTime: 7,
    tags: ['react-devtools', 'profiler', 'error-boundary', 're-render'],
    sections: [
      {
        title: 'React DevTools — 컴포넌트 검사',
        content: `React DevTools는 Chrome/Firefox 확장 프로그램으로 설치합니다. Components 탭과 Profiler 탭 두 가지를 제공합니다.

**Components 탭 활용:**
- 컴포넌트 트리에서 특정 컴포넌트 선택
- 현재 props, state, hooks 값 실시간 확인
- props/state를 직접 수정해 동작 테스트 가능
- 톱니바퀴 아이콘 → "Highlight updates when components render" 활성화하면 리렌더되는 컴포넌트가 파란 테두리로 표시됨

**불필요한 리렌더링 찾기:**
부모 상태 변경 시 자식이 함께 리렌더되는지 하이라이트로 확인합니다. 불필요하게 리렌더되는 컴포넌트에 React.memo 적용을 검토합니다.`,
      },
      {
        title: 'Profiler 탭 — 렌더링 성능 측정',
        content: `어떤 컴포넌트가 얼마나 자주, 얼마나 오래 렌더링되는지 정밀하게 측정합니다.

**사용 방법:**
1. React DevTools → Profiler 탭
2. Record 버튼 클릭
3. 느린 인터랙션 수행 (버튼 클릭, 입력 등)
4. Record 중지
5. Flamegraph/Ranked 차트로 분석

**Flamegraph 읽는 법:**
- 가로: 렌더링 시간 비율 (넓을수록 오래 걸림)
- 색상: 회색(렌더 안 됨), 노란색(느림), 초록(빠름)
- 클릭 → 왜 렌더됐는지(props/state/hooks 변화) 표시`,
        code: `// React 18 — 렌더링 원인 추적
// Profiler 패널에서 "Why did this render?" 클릭
// → "Props changed: { items: [Array] }" 같은 정보 표시

// 코드에서 Profiler로 측정
import { Profiler } from 'react'

function onRenderCallback(
  id: string,          // 컴포넌트 트리 이름
  phase: 'mount' | 'update',
  actualDuration: number, // 실제 렌더링 시간(ms)
  baseDuration: number,   // 메모이제이션 없을 때 예상 시간
  startTime: number,
  commitTime: number,
) {
  if (actualDuration > 16) { // 60fps 기준 16ms 초과
    console.warn(\`⚠️ 느린 렌더: \${id} — \${actualDuration.toFixed(2)}ms\`)
  }
}

function App() {
  return (
    <Profiler id="ProductList" onRender={onRenderCallback}>
      <ProductList />
    </Profiler>
  )
}

// why-did-you-render 라이브러리 — 개발 환경 전용
// npm install @welldone-software/why-did-you-render
import React from 'react'
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  })
}`,
        language: 'typescript',
      },
      {
        title: 'Error Boundary — 에러 격리와 복구',
        content: `Error Boundary는 하위 컴포넌트 트리에서 발생하는 JS 에러를 잡아 앱 전체가 흰 화면으로 깨지는 것을 방지합니다.

**Error Boundary가 잡지 못하는 에러:**
- 이벤트 핸들러 내부 에러 (try/catch로 직접 처리)
- 비동기 코드 에러 (async/await, setTimeout)
- 서버 사이드 렌더링 에러
- Error Boundary 자체 에러

**배치 전략:** 페이지 단위 + 중요 컴포넌트 단위로 계층적으로 배치합니다.`,
        code: `// Error Boundary 컴포넌트 (클래스 컴포넌트 필수)
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // 에러 모니터링 서비스에 전송 (Sentry, Datadog 등)
    console.error('ErrorBoundary caught:', error, info.componentStack)
    this.props.onError?.(error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-700 font-bold">문제가 발생했습니다</h2>
          <p className="text-red-600 text-sm mt-1">{this.state.error?.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 text-sm text-red-700 underline"
          >
            다시 시도
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// 사용 — 계층적 배치
export default function App() {
  return (
    <ErrorBoundary fallback={<PageError />}> {/* 페이지 전체 */}
      <Header />
      <ErrorBoundary fallback={<WidgetError />}> {/* 위젯 단위 */}
        <ProductRecommendation />
      </ErrorBoundary>
      <ErrorBoundary fallback={<WidgetError />}>
        <ReviewSection />
      </ErrorBoundary>
    </ErrorBoundary>
  )
}`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'React DevTools → "Highlight updates" 활성화로 불필요한 리렌더링 시각화',
      'Profiler 탭: Flamegraph에서 가로가 넓은(오래 걸리는) 컴포넌트를 우선 최적화',
      'Error Boundary로 에러 격리 — 위젯/섹션 단위로 계층적으로 배치',
      'Error Boundary는 이벤트 핸들러/async 에러를 잡지 못함 → 별도 try/catch 필요',
    ],
    relatedProblemIds: ['dbg-q-003', 'dbg-q-004'],
  },
  {
    id: 'dbg-l-004',
    category: 'debugging',
    subcategory: 'performance-debugging',
    title: '웹 성능 디버깅 — Core Web Vitals',
    description: 'LCP, CLS, INP 측정과 개선 — Lighthouse, Performance 탭 실전 활용',
    emoji: '⚡',
    readingTime: 7,
    tags: ['core-web-vitals', 'LCP', 'CLS', 'INP', 'lighthouse', 'performance'],
    sections: [
      {
        title: 'Core Web Vitals 이해',
        content: `Google이 정의한 사용자 경험 핵심 지표입니다. SEO 랭킹에도 직접 영향을 줍니다.

**LCP (Largest Contentful Paint)** — 로딩 성능
- 뷰포트에서 가장 큰 콘텐츠(이미지/텍스트)가 렌더되는 시간
- 기준: 좋음 ≤ 2.5s / 개선 필요 ≤ 4s / 나쁨 > 4s
- 주요 원인: 큰 이미지 최적화 안 됨, 렌더 블로킹 리소스, 느린 TTFB

**CLS (Cumulative Layout Shift)** — 시각적 안정성
- 페이지 로드 중 레이아웃이 얼마나 갑자기 움직이는지
- 기준: 좋음 ≤ 0.1 / 개선 필요 ≤ 0.25 / 나쁨 > 0.25
- 주요 원인: 크기 없는 이미지/동영상, 동적으로 삽입되는 광고, 폰트 교체

**INP (Interaction to Next Paint)** — 반응성 (FID 대체)
- 클릭/탭/키보드 입력 후 시각적 피드백까지 걸리는 시간
- 기준: 좋음 ≤ 200ms / 개선 필요 ≤ 500ms / 나쁨 > 500ms
- 주요 원인: 긴 JS 태스크, 과도한 DOM 크기, 메인 스레드 블로킹`,
      },
      {
        title: 'Lighthouse로 진단하기',
        content: `Chrome DevTools → Lighthouse 탭에서 종합 성능 점수를 측정합니다.

**측정 시 주의사항:**
- **Incognito 모드**에서 실행 (확장 프로그램 영향 제거)
- **Throttling 설정** 확인 (모바일 시뮬레이션)
- 여러 번 실행해 평균값 사용 (첫 번째 실행은 캐시 없음)

**Opportunities vs Diagnostics:**
- Opportunities: 직접적인 성능 개선 항목 (예상 절감 시간 표시)
- Diagnostics: 추가 정보 및 모범 사례

**핵심 개선 항목 우선순위:**
1. Eliminate render-blocking resources (CSS/JS defer)
2. Properly size images (WebP 변환, srcset)
3. Remove unused JavaScript (코드 스플리팅)
4. Reduce initial server response time (TTFB)`,
        code: `// Next.js에서 LCP 개선 — 이미지 최적화
import Image from 'next/image'

// ✅ LCP 이미지에 priority 추가 (preload 생성)
function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      width={1200}
      height={600}
      priority   // 중요: LCP 이미지는 반드시 추가
      sizes="100vw"
    />
  )
}

// ✅ CLS 방지 — 이미지에 width/height 명시
// ❌ CLS 유발
<img src="/logo.png" alt="Logo" />  // 크기 없음 → 로드 전후 레이아웃 변화

// ✅ CLS 안전
<Image src="/logo.png" alt="Logo" width={120} height={40} />

// ✅ 폰트로 인한 CLS 방지
// next/font 사용 — 폰트 교체 없이 로드
import { Inter } from 'next/font/google'
const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // FOUT 허용 (FOIT보다 CLS 적음)
})`,
        language: 'typescript',
      },
      {
        title: 'Performance 탭 — 런타임 성능 분석',
        content: `Lighthouse가 "무엇이 느린지" 알려준다면, Performance 탭은 "왜 느린지" 분석합니다.

**기록 방법:**
1. Performance 탭 → Record (⌘+E)
2. 느린 인터랙션 수행
3. Stop 후 분석

**플레임차트 읽기:**
- **Main**: 메인 스레드 작업 (JS 실행, 렌더링)
- **Long Task**: 빨간 테두리 — 50ms 이상 걸리는 태스크 (INP 악화)
- **Call Tree**: 어떤 함수가 시간을 가장 많이 썼는지

**병목 패턴:**
- 빨간 "Long Task" → JS 분할 또는 Web Worker로 이동
- 반복되는 Layout/Paint → Reflow 유발 코드 제거
- 과도한 스크립트 파싱 → Code splitting, Tree shaking`,
        code: `// Long Task 감지 — PerformanceObserver
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 50) { // Long Task 기준
      console.warn('⚠️ Long Task 감지:', {
        duration: entry.duration.toFixed(2) + 'ms',
        startTime: entry.startTime.toFixed(2) + 'ms',
      })
    }
  }
})
observer.observe({ entryTypes: ['longtask'] })

// INP 직접 측정 — web-vitals 라이브러리
import { onINP, onLCP, onCLS } from 'web-vitals'

onINP((metric) => {
  console.log('INP:', metric.value, metric.rating)
  // rating: 'good' | 'needs-improvement' | 'poor'
  if (metric.rating === 'poor') {
    sendToAnalytics({ metric: 'INP', value: metric.value })
  }
})

onLCP((metric) => {
  console.log('LCP:', metric.value, metric.rating)
})

// Next.js에서 자동 Web Vitals 수집
// app/layout.tsx
export function reportWebVitals(metric: NextWebVitalsMetric) {
  if (metric.label === 'web-vital') {
    sendToAnalytics(metric)
  }
}`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'LCP ≤ 2.5s: 가장 큰 이미지에 priority, WebP 변환, TTFB 개선',
      'CLS ≤ 0.1: 모든 이미지에 width/height, 동적 삽입 요소 공간 예약',
      'INP ≤ 200ms: Long Task(50ms+) 분리, 메인 스레드 언블로킹',
      'web-vitals 라이브러리로 실제 사용자 환경에서 지표 수집 가능',
    ],
    relatedProblemIds: ['dbg-q-004', 'dbg-q-005'],
  },
  {
    id: 'dbg-l-005',
    category: 'debugging',
    subcategory: 'nextjs-debugging',
    title: 'Next.js 실전 에러 트러블슈팅',
    description: 'Hydration 에러, "use client" 누락, 캐시 문제, 환경변수 오류 — 패턴별 해결법',
    emoji: '▲',
    readingTime: 7,
    tags: ['nextjs', 'hydration', 'server-component', 'cache', 'env'],
    sections: [
      {
        title: 'Hydration 에러',
        content: `Next.js에서 가장 흔한 에러입니다. 서버에서 렌더한 HTML과 클라이언트에서 렌더한 결과가 달라서 발생합니다.

**에러 메시지:**
\`Error: Hydration failed because the initial UI does not match what was rendered on the server.\`

**주요 원인:**
1. **Date.now() / Math.random()**: 서버와 클라이언트 실행 시간이 다름
2. **localStorage / window**: 서버에는 없는 브라우저 API
3. **잘못된 HTML 중첩**: \`<p>\` 안에 \`<div>\` 등 (브라우저가 자동 수정)
4. **3rd party 확장 프로그램**: 서버 HTML을 수정하는 경우`,
        code: `// ❌ Hydration 에러 유발 — 서버/클라이언트 결과 불일치
function TimeDisplay() {
  return <div>{new Date().toLocaleTimeString()}</div>
  // 서버: "14:30:00" / 클라이언트: "14:30:01" → 불일치!
}

// ✅ 해결 1: useEffect로 클라이언트 전용 렌더링
function TimeDisplay() {
  const [time, setTime] = useState<string>()

  useEffect(() => {
    setTime(new Date().toLocaleTimeString())
  }, [])

  return <div>{time ?? '로딩 중...'}</div>
}

// ✅ 해결 2: suppressHydrationWarning (날짜 표시 등 의도적 불일치)
function TimeDisplay() {
  return (
    <time suppressHydrationWarning>
      {new Date().toLocaleTimeString()}
    </time>
  )
}

// ✅ 해결 3: dynamic import + ssr: false
import dynamic from 'next/dynamic'
const ClientOnlyMap = dynamic(() => import('./Map'), { ssr: false })
// window/document를 직접 쓰는 컴포넌트에 사용`,
        language: 'typescript',
      },
      {
        title: 'Server/Client Component 경계 에러',
        content: `App Router의 Server Component와 Client Component를 잘못 조합하면 에러가 납니다.

**"use client" 누락 에러:**
\`Error: Event handlers cannot be passed to Client Component props.\`
→ onClick 같은 이벤트 핸들러를 Server Component에 직접 사용하려 함

**Server Component에서 할 수 없는 것:**
- useState, useEffect 등 Hooks 사용
- 이벤트 핸들러 (onClick, onChange 등)
- 브라우저 API (localStorage, window, document)
- Context API

**Client Component에서 할 수 없는 것:**
- async/await 직접 사용 (Server Actions 제외)
- 서버 전용 패키지 import (fs, database 드라이버 등)`,
        code: `// ❌ 잘못된 패턴 — Server Component에 이벤트 핸들러
// app/page.tsx (Server Component)
export default function Page() {
  return (
    <button onClick={() => alert('click')}> {/* Error! */}
      클릭
    </button>
  )
}

// ✅ 해결 — 이벤트 핸들러는 Client Component로 분리
// components/ClickButton.tsx
'use client'
export function ClickButton() {
  return <button onClick={() => alert('click')}>클릭</button>
}

// app/page.tsx (Server Component) — 데이터 페칭은 여기서
import { ClickButton } from '@/components/ClickButton'

export default async function Page() {
  const data = await fetchData() // 서버에서 직접 fetch
  return (
    <div>
      <h1>{data.title}</h1>
      <ClickButton /> {/* Client Component 포함 */}
    </div>
  )
}

// ✅ Server Component를 Client Component의 children으로 전달
// Client Component가 Server Component를 감싸야 할 때
'use client'
function Wrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setOpen(!open)}>토글</button>
      {open && children} {/* children은 Server Component일 수 있음 */}
    </div>
  )
}`,
        language: 'typescript',
      },
      {
        title: '캐시 문제와 환경변수 에러',
        content: `**캐시 무효화가 안 되는 경우:**
\`fetch\`의 기본 동작은 캐시입니다. 데이터가 업데이트되지 않으면 캐시 설정을 확인하세요.

**환경변수가 undefined인 경우:**
- 서버 전용 변수는 절대 클라이언트에서 접근 불가
- \`NEXT_PUBLIC_\` 접두사가 없으면 서버에서만 사용 가능`,
        code: `// ✅ fetch 캐시 제어
// 캐시 없이 항상 최신 데이터
const res = await fetch('/api/data', { cache: 'no-store' })

// 60초마다 재검증
const res = await fetch('/api/data', {
  next: { revalidate: 60 }
})

// 태그 기반 재검증 (Server Action에서 revalidateTag 호출 시)
const res = await fetch('/api/products', {
  next: { tags: ['products'] }
})

// Server Action에서 캐시 무효화
'use server'
import { revalidateTag } from 'next/cache'
export async function updateProduct(id: string, data: FormData) {
  await db.products.update(id, data)
  revalidateTag('products') // fetch 캐시 무효화
}

// ✅ 환경변수 올바른 사용
// .env.local
// DATABASE_URL=... (서버 전용 — 클라이언트 번들에 포함 안 됨)
// NEXT_PUBLIC_API_URL=... (공개 — 클라이언트에서 접근 가능)

// Server Component ✅
const db = await connect(process.env.DATABASE_URL) // 정상

// Client Component ❌
'use client'
const db = await connect(process.env.DATABASE_URL) // undefined!

// 타입 안전한 환경변수 검증 (t3-env 패키지 또는 직접 구현)
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다')
}`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'Hydration 에러: 서버/클라이언트 결과 불일치 — useEffect로 클라이언트 전용 렌더링',
      '"use client" 경계: 이벤트 핸들러/Hooks가 필요한 최소 범위만 클라이언트로',
      'Server Component를 children으로 전달하면 Client Component 안에서도 서버 렌더 가능',
      'NEXT_PUBLIC_ 접두사 없는 환경변수는 클라이언트에서 undefined',
    ],
    relatedProblemIds: ['dbg-q-005', 'dbg-q-006'],
  },
]
