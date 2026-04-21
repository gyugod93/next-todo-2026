import type { Lesson } from '@/types'

export const csBasicsLessons: Lesson[] = [
  {
    id: 'cs-001',
    category: 'cs-basics',
    subcategory: 'javascript-engine',
    title: '이벤트 루프와 비동기 처리',
    description: '콜 스택, 마이크로태스크, 매크로태스크 큐 — JS 실행 순서 완전 정복',
    emoji: '🔄',
    readingTime: 8,
    tags: ['event-loop', 'microtask', 'macrotask', 'async'],
    sections: [
      {
        title: '자바스크립트 런타임 구조',
        content: `자바스크립트는 **싱글 스레드** 언어지만, 비동기 작업을 처리할 수 있습니다. 이를 가능하게 하는 것이 이벤트 루프입니다.

**핵심 구성 요소:**
- **Call Stack**: 현재 실행 중인 함수들의 스택
- **Heap**: 객체가 저장되는 메모리 공간
- **Web APIs**: setTimeout, fetch, DOM 이벤트 등 (브라우저 제공)
- **Microtask Queue**: Promise.then, queueMicrotask, MutationObserver
- **Macrotask Queue (Task Queue)**: setTimeout, setInterval, I/O 콜백

**이벤트 루프의 동작:**
1. Call Stack이 비었는지 확인
2. Microtask Queue를 **모두** 비움 (재귀적으로)
3. Macrotask Queue에서 **하나** 꺼내 실행
4. 반복`,
      },
      {
        title: '마이크로태스크 vs 매크로태스크',
        content: `**마이크로태스크**가 **매크로태스크**보다 항상 먼저 실행됩니다. 마이크로태스크 큐는 콜 스택이 비워질 때마다 큐 전체가 소진될 때까지 실행됩니다.

**마이크로태스크:** Promise.then/catch/finally, async/await 이후 코드, queueMicrotask(), MutationObserver

**매크로태스크:** setTimeout, setInterval, setImmediate(Node.js), MessageChannel, I/O 작업`,
        code: `console.log('1') // 동기

setTimeout(() => console.log('2'), 0) // 매크로태스크

Promise.resolve()
  .then(() => console.log('3')) // 마이크로태스크
  .then(() => console.log('4')) // 마이크로태스크

queueMicrotask(() => console.log('5')) // 마이크로태스크

console.log('6') // 동기

// 출력 순서: 1, 6, 3, 5, 4, 2
//
// 이유:
// 1. 동기 코드 실행: 1 → 6
// 2. 콜스택 비워짐 → 마이크로태스크 큐 전부 실행
//    - Promise.then → 3
//    - queueMicrotask → 5
//    - 체인된 Promise.then → 4
// 3. 마이크로태스크 큐 비워짐 → 매크로태스크 하나 실행: 2`,
        language: 'javascript',
      },
      {
        title: 'async/await와 이벤트 루프',
        content: `async/await는 Promise의 문법적 설탕(syntactic sugar)입니다. await 이후 코드는 마이크로태스크 큐에 들어갑니다.`,
        code: `async function foo() {
  console.log('A')
  await Promise.resolve()
  console.log('B') // 마이크로태스크로 스케줄됨
  await Promise.resolve()
  console.log('C') // 두 번째 마이크로태스크
}

console.log('start')
foo()
console.log('end')

// 출력: start → A → end → B → C

// await는 내부적으로:
// async function foo() {
//   console.log('A')
//   Promise.resolve().then(() => {
//     console.log('B')
//     Promise.resolve().then(() => {
//       console.log('C')
//     })
//   })
// }

// React 18의 자동 배칭도 이 원리를 활용:
// setState 호출들을 마이크로태스크로 묶어 한 번에 처리`,
        language: 'javascript',
      },
    ],
    keyPoints: [
      '마이크로태스크(Promise.then, async/await)는 매크로태스크(setTimeout)보다 항상 먼저 실행',
      '콜 스택이 비워지면 마이크로태스크 큐 전체가 소진될 때까지 실행',
      'await 이후 코드는 마이크로태스크 큐에 스케줄됨',
      'setTimeout(fn, 0)도 매크로태스크이므로 Promise.then보다 나중에 실행',
    ],
    relatedProblemIds: ['cs-q-001', 'cs-q-002'],
  },
  {
    id: 'cs-002',
    category: 'cs-basics',
    subcategory: 'browser',
    title: '브라우저 렌더링 파이프라인',
    description: 'Critical Rendering Path, Reflow vs Repaint, 레이어 합성 최적화',
    emoji: '🖼️',
    readingTime: 7,
    tags: ['browser', 'rendering', 'performance', 'CRP'],
    sections: [
      {
        title: 'Critical Rendering Path (CRP)',
        content: `브라우저가 HTML을 화면에 표시하기까지의 과정:

1. **HTML 파싱** → DOM 트리 생성
2. **CSS 파싱** → CSSOM 트리 생성
3. **Render Tree 생성**: DOM + CSSOM 결합 (visibility: hidden은 포함, display: none은 제외)
4. **Layout (Reflow)**: 각 요소의 위치와 크기 계산
5. **Paint (Repaint)**: 픽셀 채우기
6. **Composite**: GPU에서 레이어 합성

**렌더 블로킹 리소스:**
- CSS: \`<link rel="stylesheet">\` → 파싱 차단 (CSSOM 완성 전 렌더 불가)
- JS: \`<script>\` → 파싱 + 렌더 차단 (DOM 수정 가능하므로)
- 해결: \`async\`, \`defer\`, Critical CSS 인라인`,
      },
      {
        title: 'Reflow vs Repaint',
        content: `**Reflow (Layout)**: 요소의 크기/위치가 변경될 때 — 가장 비쌈
영향 범위: 변경된 요소 + 자식 + 부모까지 재계산

**Repaint**: 색상, 배경, 그림자 등 시각적 속성 변경 — 상대적으로 저렴
영향 범위: 해당 레이어만 픽셀 재계산

**Composite only**: transform, opacity — 가장 저렴 (GPU 처리)

**성능 좋은 순서:** Composite > Repaint > Reflow`,
        code: `// ❌ Reflow 유발 — 매번 레이아웃 재계산
for (let i = 0; i < 100; i++) {
  element.style.width = element.offsetWidth + 1 + 'px'
  // offsetWidth 읽기 → Layout Thrashing 발생!
}

// ✅ Layout Thrashing 방지 — 읽기/쓰기 분리
const width = element.offsetWidth // 한 번만 읽기
for (let i = 0; i < 100; i++) {
  element.style.width = width + i + 'px'
}

// ✅ requestAnimationFrame 활용
function animate() {
  element.style.transform = \`translateX(\${x}px)\` // Composite only
  x += 1
  requestAnimationFrame(animate)
}

// ✅ CSS contain으로 Reflow 범위 격리
// .component { contain: layout; }`,
        language: 'javascript',
      },
      {
        title: '레이어와 합성 최적화',
        content: `특정 CSS 속성은 요소를 **별도 레이어**로 분리해 GPU에서 처리합니다. 레이어가 분리되면 해당 요소 변경 시 다른 요소에 영향을 주지 않습니다.

**레이어 생성 조건:**
- \`transform: translateZ(0)\` or \`will-change: transform\`
- \`opacity < 1\` (애니메이션 중)
- \`position: fixed\`
- \`<video>\`, \`<canvas>\`, \`<iframe>\`

**주의:** 레이어가 너무 많으면 메모리 사용 증가 → 오히려 성능 저하`,
        code: `/* ✅ 애니메이션 성능 최적화 */
.button {
  /* will-change로 레이어 사전 생성 */
  will-change: transform;
  transition: transform 0.2s ease;
}

.button:hover {
  /* transform은 Composite only — Reflow 없음 */
  transform: scale(1.05);
}

/* ❌ Reflow 유발 애니메이션 */
.button-bad {
  transition: width 0.2s, height 0.2s;
}

.button-bad:hover {
  width: 110%; /* Reflow 발생 */
  height: 110%; /* Reflow 발생 */
}`,
        language: 'css',
      },
    ],
    keyPoints: [
      'CRP 순서: HTML → DOM → CSSOM → Render Tree → Layout → Paint → Composite',
      'Reflow(레이아웃) > Repaint > Composite 순으로 비용 감소',
      'transform/opacity는 Composite only — 애니메이션에 사용하면 성능 최적',
      'Layout Thrashing: 읽기/쓰기를 섞지 말고 한 번에 읽고 한 번에 쓸 것',
    ],
    relatedProblemIds: ['cs-q-003', 'cs-q-004'],
  },
  {
    id: 'cs-003',
    category: 'cs-basics',
    subcategory: 'network',
    title: 'HTTP/HTTPS와 웹 보안',
    description: 'HTTP/2, HTTPS TLS 핸드셰이크, CORS, CSP, CSRF, XSS 방어',
    emoji: '🌐',
    readingTime: 8,
    tags: ['http', 'https', 'security', 'cors', 'csrf', 'xss'],
    sections: [
      {
        title: 'HTTP/1.1 vs HTTP/2 vs HTTP/3',
        content: `**HTTP/1.1:**
- 요청당 1 TCP 연결 (Keep-Alive로 재사용 가능)
- Head-of-Line Blocking: 앞 요청이 완료될 때까지 다음 요청 대기
- 텍스트 기반 헤더 (압축 없음)

**HTTP/2:**
- 하나의 TCP 연결에서 **멀티플렉싱** (여러 요청 동시)
- 이진 프레임 프로토콜
- 헤더 압축 (HPACK)
- 서버 푸시 (Server Push)

**HTTP/3:**
- TCP 대신 **QUIC** (UDP 기반) 사용
- TCP 레벨 Head-of-Line Blocking 완전 해결
- 연결 설정 시간 단축 (0-RTT)`,
      },
      {
        title: 'HTTPS와 TLS 핸드셰이크',
        content: `HTTPS = HTTP + TLS (Transport Layer Security). 데이터 암호화, 서버 인증, 무결성 보장.

**TLS 1.3 핸드셰이크 (단순화):**
1. 클라이언트 → 서버: ClientHello (지원 암호화 목록)
2. 서버 → 클라이언트: ServerHello + 인증서
3. 클라이언트: 인증서 검증 (CA 체인 확인)
4. 키 교환 (ECDHE): 양측이 공유 비밀키 생성
5. 이후 모든 통신은 대칭키로 암호화

**0-RTT**: TLS 1.3에서 이전에 연결한 서버와는 핸드셰이크 없이 즉시 데이터 전송 가능`,
      },
      {
        title: 'CORS, CSRF, XSS 방어',
        content: `**CORS (Cross-Origin Resource Sharing):**
- 브라우저가 다른 출처(origin)에 요청 시 서버 허가 필요
- Simple Request vs Preflight (OPTIONS) Request
- \`Access-Control-Allow-Origin\` 헤더로 허용 출처 지정

**XSS (Cross-Site Scripting):**
- 공격자가 악성 스크립트를 페이지에 삽입
- 방어: 입력 이스케이프, CSP(Content-Security-Policy) 헤더, httpOnly 쿠키

**CSRF (Cross-Site Request Forgery):**
- 인증된 사용자의 브라우저를 이용해 악의적 요청 전송
- 방어: CSRF 토큰, SameSite 쿠키, Origin 헤더 검증`,
        code: `// Next.js API Route에서 CORS 설정
export async function GET(req: Request) {
  return new Response(JSON.stringify({ data }), {
    headers: {
      'Access-Control-Allow-Origin': 'https://yourdomain.com',
      'Content-Type': 'application/json',
    },
  })
}

// Next.js에서 CSP 헤더 설정
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'nonce-{nonce}'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
    ].join('; '),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY', // Clickjacking 방어
  },
]

// SameSite 쿠키로 CSRF 방어
// Set-Cookie: session=abc; SameSite=Strict; HttpOnly; Secure`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'HTTP/2는 멀티플렉싱으로 동시 요청, HTTP/3는 QUIC으로 HOL Blocking 완전 해결',
      'HTTPS는 TLS로 암호화 + 서버 인증 + 무결성 보장',
      'XSS 방어: 입력 이스케이프 + CSP 헤더 + httpOnly 쿠키',
      'CSRF 방어: SameSite 쿠키 + CSRF 토큰 + Origin 헤더 검증',
    ],
    relatedProblemIds: [],
  },
  {
    id: 'cs-004',
    category: 'cs-basics',
    subcategory: 'memory',
    title: '메모리 관리와 가비지 컬렉션',
    description: 'JS 메모리 생명주기, Mark & Sweep GC, 메모리 누수 패턴과 방지법',
    emoji: '🗑️',
    readingTime: 6,
    tags: ['memory', 'garbage-collection', 'memory-leak', 'performance'],
    sections: [
      {
        title: '메모리 생명주기',
        content: `모든 프로그래밍 언어의 메모리 생명주기:
1. **할당**: 변수 선언, 객체 생성 시 메모리 할당
2. **사용**: 읽기/쓰기
3. **해제**: 더 이상 필요 없을 때 메모리 반환

JavaScript는 **가비지 컬렉터(GC)**가 자동으로 메모리를 해제하지만, 개발자가 참조를 끊어주지 않으면 메모리 누수가 발생합니다.

**스택(Stack) vs 힙(Heap):**
- 스택: 원시값(number, string, boolean), 함수 호출 프레임 — 자동 해제
- 힙: 객체, 배열, 함수 — GC가 관리`,
      },
      {
        title: 'Mark & Sweep 알고리즘',
        content: `V8 엔진은 **Mark & Sweep** 방식으로 GC를 수행합니다.

**단계:**
1. **Mark**: 루트(전역 객체, 스택의 참조)에서 시작해 도달 가능한 모든 객체를 표시
2. **Sweep**: 표시되지 않은 객체(도달 불가능 = 사용 안 함)를 메모리에서 해제

**도달 불가능 = 수집 대상:**
어떤 변수나 객체에서도 참조되지 않는 객체는 GC에 의해 해제됩니다.

**V8의 최적화:**
- **Scavenge (Minor GC)**: 단명 객체(새 객체) 빠르게 수집
- **Major GC**: 장수 객체(오래된 힙) 처리
- **Incremental/Concurrent GC**: 메인 스레드를 최대한 덜 차단`,
        code: `// 도달 불가능한 객체 예시
function createObject() {
  const obj = { data: new Array(1000000) }
  return obj
}

let ref = createObject() // 참조 유지 → GC 불가
ref = null // 참조 제거 → GC 가능

// 순환 참조 (Mark & Sweep은 이것도 처리 가능)
// Reference Counting GC는 순환 참조 처리 불가
const a = {}
const b = {}
a.ref = b
b.ref = a
// a, b를 null로 만들면 순환 참조여도 GC 가능
// (루트에서 도달 불가능하므로)`,
        language: 'javascript',
      },
      {
        title: '메모리 누수 패턴',
        content: `JavaScript에서 자주 발생하는 메모리 누수 패턴과 방지법:

**1. 이벤트 리스너 미제거**
**2. 클로저의 의도치 않은 참조 유지**
**3. 전역 변수 오염**
**4. 타이머/인터벌 미제거**
**5. React: 언마운트 후 setState 호출**`,
        code: `// ❌ 메모리 누수 — 이벤트 리스너 미제거
function addHandler() {
  const bigData = new Array(1000000).fill('data')

  document.addEventListener('click', () => {
    console.log(bigData.length) // bigData를 클로저로 유지
  })
  // 리스너를 제거하지 않으면 bigData가 메모리에 계속 남음
}

// ✅ 해결 — 리스너 참조 저장 후 제거
function addHandlerFixed() {
  const bigData = new Array(1000000).fill('data')

  const handler = () => console.log(bigData.length)
  document.addEventListener('click', handler)

  return () => document.removeEventListener('click', handler)
}

// React에서 메모리 누수 방지
useEffect(() => {
  let isAlive = true // 언마운트 플래그

  fetchData().then((data) => {
    if (isAlive) setData(data) // 언마운트 후 setState 방지
  })

  return () => {
    isAlive = false // 정리 함수
  }
}, [])

// AbortController로 fetch 취소
useEffect(() => {
  const controller = new AbortController()

  fetch('/api/data', { signal: controller.signal })
    .then((res) => res.json())
    .then(setData)
    .catch((err) => {
      if (err.name !== 'AbortError') throw err
    })

  return () => controller.abort()
}, [])`,
        language: 'javascript',
      },
    ],
    keyPoints: [
      'Mark & Sweep: 루트에서 도달 불가능한 객체를 GC가 자동 수집',
      '순환 참조도 루트에서 도달 불가능하면 Mark & Sweep이 수집 가능',
      '이벤트 리스너, 타이머는 반드시 제거 (React useEffect cleanup)',
      'AbortController로 컴포넌트 언마운트 시 fetch 요청 취소',
    ],
    relatedProblemIds: ['cs-q-005'],
  },
  {
    id: 'cs-005',
    category: 'cs-basics',
    subcategory: 'algorithms',
    title: '프론트엔드 필수 알고리즘 패턴',
    description: 'debounce, throttle, 가상화(Virtualization), 메모이제이션 완전 이해',
    emoji: '⚙️',
    readingTime: 7,
    tags: ['debounce', 'throttle', 'memoization', 'virtualization', 'performance'],
    sections: [
      {
        title: 'Debounce vs Throttle',
        content: `연속으로 발생하는 이벤트(입력, 스크롤, 리사이즈)를 제어하는 두 가지 패턴:

**Debounce**: 이벤트가 **멈춘 후** N ms 뒤에 한 번만 실행
- 사용 예: 검색 자동완성, 폼 유효성 검사
- "마지막 입력 후 300ms 기다렸다가 API 호출"

**Throttle**: 이벤트를 N ms마다 **최대 한 번**만 실행
- 사용 예: 스크롤 이벤트, 게임 입력, 무한 스크롤
- "스크롤 중 100ms마다 한 번만 위치 업데이트"`,
        code: `// Debounce 구현
function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>

  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// Throttle 구현
function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= limit) {
      lastCall = now
      fn(...args)
    }
  }
}

// React Hook으로 사용
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}`,
        language: 'typescript',
      },
      {
        title: '메모이제이션',
        content: `동일한 입력에 대해 이전에 계산한 결과를 캐시해 재사용하는 최적화 기법.

**언제 사용:**
- 계산 비용이 높은 순수 함수
- 동일 인자로 반복 호출되는 함수
- React에서 props 변경 없는 리렌더링 방지

**언제 사용하지 않아야 할 때:**
- 캐시 유지 비용 > 재계산 비용인 경우
- 대부분의 단순한 연산 (React.memo의 비교 비용이 더 클 수 있음)`,
        code: `// 순수 메모이제이션
function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) return cache.get(key)!

    const result = fn(...args)
    cache.set(key, result)
    return result
  }) as T
}

// React useMemo — 계산값 메모이제이션
const expensiveValue = useMemo(() => {
  return heavyComputation(data) // data가 변경될 때만 재계산
}, [data])

// React useCallback — 함수 참조 메모이제이션
const handleSubmit = useCallback((formData: FormData) => {
  submitToServer(formData)
}, []) // 의존성 없으면 항상 동일 참조

// React.memo — 컴포넌트 메모이제이션
const ExpensiveComponent = React.memo(({ data }: Props) => {
  return <div>{/* 복잡한 렌더링 */}</div>
}, (prevProps, nextProps) => {
  // true: 리렌더링 스킵, false: 리렌더링
  return prevProps.data.id === nextProps.data.id
})`,
        language: 'typescript',
      },
      {
        title: '가상화 (Virtualization)',
        content: `10,000개의 리스트 아이템을 DOM에 모두 그리면 성능이 저하됩니다. 가상화는 **화면에 보이는 아이템만** DOM에 렌더링하는 기법입니다.

**원리:**
- 스크롤 위치를 추적
- 뷰포트 내 아이템만 렌더링 (예: 100개 중 10개만)
- 나머지는 빈 공간으로 대체

**라이브러리:** react-virtual, @tanstack/react-virtual, react-window

**적용 기준:** 아이템 수 > 수백 개인 경우 고려`,
        code: `import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // 각 아이템 높이 추정값
    overscan: 5, // 뷰포트 밖으로 미리 렌더링할 아이템 수
  })

  return (
    <div
      ref={parentRef}
      style={{ height: '400px', overflow: 'auto' }}
    >
      {/* 전체 높이를 나타내는 컨테이너 */}
      <div
        style={{ height: rowVirtualizer.getTotalSize() }}
        className="relative"
      >
        {/* 실제로 보이는 아이템만 렌더링 */}
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: virtualItem.start,
              height: virtualItem.size,
            }}
          >
            {items[virtualItem.index]}
          </div>
        ))}
      </div>
    </div>
  )
}`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'Debounce: 마지막 이벤트 후 N ms 뒤 실행 → 검색 자동완성에 적합',
      'Throttle: N ms마다 최대 1회 실행 → 스크롤 이벤트에 적합',
      '메모이제이션: 캐시 비용이 재계산 비용보다 작을 때만 의미 있음',
      '가상화: 수백 개 이상 리스트는 react-virtual로 DOM 렌더링 최소화',
    ],
    relatedProblemIds: ['cs-q-006'],
  },
]
