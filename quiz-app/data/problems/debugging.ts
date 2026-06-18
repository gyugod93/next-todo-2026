import type { Problem } from '@/types'

export const debuggingProblems: Problem[] = [
  {
    id: 'dbg-q-001',
    category: 'debugging',
    subcategory: 'devtools',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'Network 탭에서 CORS 차단 확인',
    description:
      'API 요청이 실패했을 때 Network 탭에서 CORS로 차단된 요청을 구별하는 Status 코드는?',
    conceptExplanation:
      'CORS(Cross-Origin Resource Sharing)는 브라우저가 다른 출처(Origin)의 리소스 요청을 제한하는 보안 정책입니다. 서버가 응답 헤더에 Access-Control-Allow-Origin을 포함하지 않으면 브라우저가 응답을 차단합니다. CORS는 브라우저에서만 적용되며, 서버 간 통신에는 영향을 주지 않습니다.',
    options: ['404', '500', '0 (failed)', '403'],
    correctAnswer: 2,
    explanation:
      'CORS로 차단된 요청은 Network 탭에서 Status가 "0" 또는 "(failed)"로 표시됩니다. 브라우저가 서버 응답을 받기 전에 차단하기 때문입니다. 404는 리소스 없음, 500은 서버 에러, 403은 권한 없음입니다. CORS 에러는 Console에 "Access-Control-Allow-Origin" 관련 메시지도 함께 출력됩니다.',
    hints: ['브라우저가 응답을 받기도 전에 막아버린다면 status는 어떻게 될까요?'],
    deepDive:
      'CORS 디버깅 체크리스트: ① Network 탭에서 실패 요청 클릭 → Headers 탭에서 Access-Control-Allow-Origin 헤더 확인 ② Preflight(OPTIONS) 요청이 별도로 나가는지 확인 ③ 서버 응답 헤더에 요청 origin이 허용됐는지 확인. Next.js에서는 API Route의 응답 헤더에 Access-Control-Allow-Origin 추가 또는 next.config.js headers 설정으로 해결합니다.',
    relatedProblems: ['dbg-q-002'],
  },
  {
    id: 'dbg-q-002',
    category: 'debugging',
    subcategory: 'devtools',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'console 고급 메서드 선택',
    description:
      '배열로 된 사용자 목록을 디버깅할 때 가장 가독성이 좋은 console 메서드는?',
    conceptExplanation:
      '브라우저 개발자 도구의 console 객체는 단순 로그 출력 외에도 다양한 형식으로 데이터를 시각화하는 메서드를 제공합니다. 각 메서드는 서로 다른 상황에 최적화되어 있으며 올바른 메서드를 선택하면 디버깅 효율이 크게 높아집니다. 테이블, 그룹, 타이머, 스택 추적 등 상황에 맞는 메서드를 활용하는 것이 실무 디버깅의 핵심입니다.',
    code: `const users = [
  { id: 1, name: '김철수', role: 'admin', age: 28 },
  { id: 2, name: '이영희', role: 'user', age: 24 },
  { id: 3, name: '박민준', role: 'user', age: 31 },
]

// 어떤 console 메서드가 가장 적합한가?`,
    options: [
      'console.log(users)',
      'console.table(users)',
      'console.dir(users)',
      'console.info(JSON.stringify(users))',
    ],
    correctAnswer: 1,
    explanation:
      'console.table()은 배열이나 객체를 테이블 형식으로 출력해 여러 항목의 필드를 한눈에 비교할 수 있습니다. console.log는 중첩된 배열 구조로 출력되어 비교가 어렵고, console.dir은 DOM 객체 탐색에 유용합니다. console.table은 특정 컬럼만 보고 싶을 때 console.table(users, [\'name\', \'role\'])처럼 두 번째 인자로 필드를 지정할 수도 있습니다.',
    hints: ['여러 객체의 같은 필드를 비교할 때 어떤 형식이 가장 편한가요?'],
    deepDive:
      '실전 console 활용: console.time("label") / console.timeEnd("label")로 코드 구간 성능 측정, console.group() / console.groupCollapsed() / console.groupEnd()로 관련 로그 묶기, console.trace()로 호출 스택 출력, console.assert(condition, message)로 조건 실패 시에만 출력. 프로덕션 빌드에서는 console.log를 제거하거나 로거 라이브러리로 교체하는 것이 좋습니다.',
    relatedProblems: ['dbg-q-001'],
  },
  {
    id: 'dbg-q-003',
    category: 'debugging',
    subcategory: 'error-patterns',
    type: 'bug-find',
    difficulty: 'medium',
    title: 'UnhandledPromiseRejection 원인 찾기',
    description: '다음 코드에서 "UnhandledPromiseRejection" 에러가 발생하는 이유는?',
    conceptExplanation:
      'UnhandledPromiseRejection은 reject된 Promise를 아무것도 처리(.catch() 또는 try/catch)하지 않았을 때 발생하는 런타임 에러입니다. async 함수는 내부에서 에러가 발생하면 reject된 Promise를 반환합니다. 이 Promise를 무시하면 에러 처리 없이 조용히 실패하여 디버깅이 어려워집니다.',
    code: `async function loadUserData(userId: string) {
  const user = await fetchUser(userId)
  const posts = await fetchPosts(userId)
  return { user, posts }
}

// 컴포넌트에서 호출
useEffect(() => {
  loadUserData(userId)
  // 결과를 사용하지는 않지만 에러가 발생
}, [userId])`,
    options: [
      'useEffect 안에서 async 함수를 직접 호출해서 에러가 발생한다',
      'loadUserData가 Promise를 반환하는데 await하지 않아 에러를 catch할 수 없다',
      'fetchUser와 fetchPosts를 순차적으로 실행해서 에러가 발생한다',
      'useEffect의 deps 배열에 loadUserData를 포함하지 않아서 에러가 발생한다',
    ],
    correctAnswer: 1,
    explanation:
      'loadUserData()는 Promise를 반환하지만 useEffect 콜백에서 await하지 않고 무시합니다. fetchUser나 fetchPosts에서 에러가 발생하면 이 Promise의 reject를 처리할 핸들러가 없어 UnhandledPromiseRejection이 발생합니다. 해결: loadUserData를 try/catch로 감싸거나, useEffect 내부에 .catch() 추가.',
    hints: ['반환된 Promise를 아무도 catch하지 않으면 어떻게 될까요?'],
    deepDive:
      '올바른 useEffect 비동기 패턴:\n```typescript\nuseEffect(() => {\n  async function load() {\n    try {\n      const data = await loadUserData(userId)\n      setData(data)\n    } catch (error) {\n      setError(error)\n    }\n  }\n  load() // 내부 async 함수 호출\n}, [userId])\n```\nuseEffect 콜백 자체를 async로 만들면 안 되는 이유: useEffect는 클린업 함수(동기 함수)를 반환해야 하는데, async 함수는 Promise를 반환하기 때문입니다.',
    relatedProblems: ['dbg-q-002', 'dbg-q-004'],
  },
  {
    id: 'dbg-q-004',
    category: 'debugging',
    subcategory: 'react-debugging',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Error Boundary가 잡지 못하는 에러',
    description: '다음 중 React Error Boundary가 잡을 수 없는 에러는?',
    conceptExplanation:
      'Error Boundary는 자식 컴포넌트 트리에서 발생한 JavaScript 에러를 잡아 대체 UI를 렌더링하는 React의 에러 처리 메커니즘입니다. getDerivedStateFromError로 에러를 감지하고 componentDidCatch로 로깅하는 클래스 컴포넌트로 구현합니다. 렌더링 사이클 내의 에러만 처리하며, 이벤트 핸들러나 비동기 코드의 에러는 잡지 못합니다.',
    code: `class ErrorBoundary extends Component {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return <h1>에러 발생</h1>
    return this.props.children
  }
}

// 어떤 에러가 ErrorBoundary를 통과하는가?`,
    options: [
      '렌더링 중 발생한 에러 (return 문에서 throw)',
      '이벤트 핸들러 안에서 발생한 에러',
      'useEffect 내부에서 throw된 에러 (동기)',
      '자식 컴포넌트의 constructor에서 발생한 에러',
    ],
    correctAnswer: 1,
    explanation:
      'Error Boundary는 이벤트 핸들러(onClick, onChange 등) 내부에서 발생한 에러를 잡지 못합니다. 이벤트 핸들러는 React의 렌더링 사이클 밖에서 실행되기 때문입니다. 이벤트 핸들러 에러는 직접 try/catch로 처리해야 합니다. Error Boundary가 잡는 것: 렌더링 중 에러, constructor 에러, lifecycle 메서드 에러.',
    hints: ['Error Boundary는 React 렌더링 사이클 내의 에러만 잡습니다'],
    deepDive:
      'Error Boundary가 잡지 못하는 4가지: ① 이벤트 핸들러 ② 비동기 코드(setTimeout, fetch) ③ 서버 사이드 렌더링 ④ Error Boundary 자체에서 발생한 에러. 이벤트 핸들러 에러 처리:\n```typescript\nfunction handleClick() {\n  try {\n    riskyOperation()\n  } catch (error) {\n    setError(error) // 상태로 관리\n  }\n}\n```',
    relatedProblems: ['dbg-q-003'],
  },
  {
    id: 'dbg-q-005',
    category: 'debugging',
    subcategory: 'performance-debugging',
    title: 'CLS(Cumulative Layout Shift) 원인',
    description: '다음 코드 중 CLS(레이아웃 이동) 점수를 악화시키는 것은?',
    conceptExplanation:
      'CLS(Cumulative Layout Shift)는 페이지 로드 중 요소가 예기치 않게 위치를 변경하는 정도를 측정하는 Core Web Vitals 지표입니다. 크기를 미리 알 수 없는 요소(크기 없는 이미지, 동적 삽입 콘텐츠, 웹폰트 교체)가 주요 원인입니다. 레이아웃 이동 발생 전에 공간을 미리 확보해두는 것이 해결의 핵심 원리입니다.',
    type: 'bug-find',
    difficulty: 'medium',
    code: `// A: 이미지 컴포넌트
<img src="/banner.jpg" alt="배너" />

// B: 이미지 컴포넌트
<Image src="/banner.jpg" alt="배너" width={800} height={400} />

// C: 광고 삽입
function AdSection() {
  const [ad, setAd] = useState<Ad | null>(null)
  useEffect(() => {
    fetchAd().then(setAd)
  }, [])
  return ad ? <div>{ad.content}</div> : null
}

// D: 폰트 적용
<style>{'.title { font-family: "CustomFont"; }'}</style>`,
    options: [
      'B — next/image는 항상 CLS를 악화시킨다',
      'A와 C와 D — 세 가지 모두 CLS 유발 가능',
      'C만 — 광고는 항상 CLS를 유발한다',
      'A와 C — 크기 없는 이미지와 동적 삽입 콘텐츠',
    ],
    correctAnswer: 3,
    explanation:
      'A(크기 없는 img)는 이미지가 로드되기 전과 후 레이아웃이 달라져 CLS 유발. C(동적 콘텐츠 삽입)는 null에서 ad로 전환 시 아래 콘텐츠가 밀려나 CLS 유발. D의 폰트 교체(FOUT)는 텍스트 크기가 바뀔 수 있지만 font-display: swap과 next/font 사용 시 최소화 가능. B는 width/height가 명시되어 있어 안전합니다.',
    hints: ['크기를 미리 알 수 없거나, 나중에 삽입되는 콘텐츠를 찾아보세요'],
    deepDive:
      'CLS 방지 체크리스트: ① 모든 이미지/동영상에 width, height 명시 ② 동적 콘텐츠 삽입 영역은 미리 min-height로 공간 예약 ③ skeleton UI로 로딩 중 공간 유지 ④ 폰트는 next/font 사용 ⑤ 광고는 고정 크기 컨테이너에 삽입. Skeleton 예시: <div className="h-[200px] animate-pulse bg-gray-200 rounded" />',
    relatedProblems: ['dbg-q-006'],
  },
  {
    id: 'dbg-q-006',
    category: 'debugging',
    subcategory: 'nextjs-debugging',
    type: 'bug-find',
    difficulty: 'hard',
    title: 'Next.js Hydration 에러 원인',
    description: '다음 컴포넌트에서 Hydration 에러가 발생하는 이유는?',
    conceptExplanation:
      'Hydration(하이드레이션)은 서버에서 생성된 HTML에 React가 이벤트 핸들러와 상태를 붙여 인터랙티브하게 만드는 과정입니다. 이 과정에서 React는 서버에서 렌더링된 결과와 클라이언트에서 렌더링한 결과가 동일한지 비교합니다. 두 결과가 다르면 Hydration 에러가 발생하며, 주로 실행 시점에 따라 값이 달라지는 코드가 원인입니다.',
    code: `// app/components/WelcomeMessage.tsx
export function WelcomeMessage() {
  return (
    <div>
      <p>현재 시각: {new Date().toLocaleTimeString()}</p>
      <p>방문자 수: {Math.floor(Math.random() * 1000)}</p>
    </div>
  )
}`,
    options: [
      'Server Component에서 toLocaleTimeString()을 사용할 수 없다',
      '서버와 클라이언트에서 실행 시점이 달라 new Date()와 Math.random() 결과가 달라진다',
      'toLocaleTimeString()이 브라우저 API라서 서버에서 실행되지 않는다',
      'Math.random()은 항상 Hydration 에러를 유발한다',
    ],
    correctAnswer: 1,
    explanation:
      'Server Component는 서버에서 HTML을 생성할 때 실행되고, React는 클라이언트에서 동일한 컴포넌트를 다시 실행해 비교합니다. new Date()와 Math.random()은 실행 시점에 따라 값이 달라지므로 서버/클라이언트 결과가 불일치해 Hydration 에러가 발생합니다.',
    hints: ['서버에서 렌더링할 때와 브라우저에서 렌더링할 때 시간 차이가 있습니다'],
    deepDive:
      '해결 방법 3가지:\n1. "use client" + useEffect로 클라이언트 전용 렌더링:\n```typescript\n"use client"\nfunction WelcomeMessage() {\n  const [time, setTime] = useState("")\n  useEffect(() => setTime(new Date().toLocaleTimeString()), [])\n  return <p>{time || "..."}</p>\n}\n```\n2. suppressHydrationWarning={true} (의도적 불일치에만)\n3. dynamic(() => import("./WelcomeMessage"), { ssr: false })\n\n날짜/랜덤값이 필요한 컴포넌트는 항상 "use client" + useEffect 패턴을 사용하세요.',
    relatedProblems: ['dbg-q-005'],
  },
]
