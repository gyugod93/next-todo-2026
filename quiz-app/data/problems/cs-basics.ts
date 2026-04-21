import type { Problem } from '@/types'

export const csBasicsProblems: Problem[] = [
  {
    id: 'cs-q-001',
    category: 'cs-basics',
    subcategory: 'event-loop',
    type: 'code-output',
    difficulty: 'medium',
    title: '이벤트 루프 실행 순서',
    description: '다음 코드의 출력 순서는?',
    code: `console.log('A')

setTimeout(() => console.log('B'), 0)

Promise.resolve()
  .then(() => console.log('C'))
  .then(() => console.log('D'))

console.log('E')`,
    options: ['A, E, B, C, D', 'A, E, C, D, B', 'A, B, C, D, E', 'A, C, D, E, B'],
    correctAnswer: 1,
    explanation:
      '출력 순서: A → E → C → D → B. 동기 코드(A, E)가 먼저 실행되고, 콜 스택이 비워지면 마이크로태스크 큐(Promise.then: C, D)를 모두 소진한 뒤, 마지막으로 매크로태스크(setTimeout: B)가 실행됩니다.',
    hints: [
      '동기 코드 → 마이크로태스크(Promise.then) → 매크로태스크(setTimeout) 순서를 떠올리세요',
    ],
    deepDive:
      '이벤트 루프 규칙: ① 콜 스택이 비워지면 ② 마이크로태스크 큐를 전부 소진 (재귀적으로) ③ 매크로태스크 하나 꺼내 실행 ④ 반복. 마이크로태스크: Promise.then/catch/finally, async/await 이후 코드, queueMicrotask(), MutationObserver. 매크로태스크: setTimeout, setInterval, I/O.',
    relatedProblems: ['cs-q-002'],
  },
  {
    id: 'cs-q-002',
    category: 'cs-basics',
    subcategory: 'event-loop',
    type: 'code-output',
    difficulty: 'hard',
    title: 'async/await와 이벤트 루프',
    description: '다음 코드의 출력 순서는?',
    code: `async function foo() {
  console.log('B')
  await Promise.resolve()
  console.log('D')
}

console.log('A')
foo()
console.log('C')`,
    options: ['A, B, C, D', 'A, B, D, C', 'A, C, B, D', 'B, A, C, D'],
    correctAnswer: 0,
    explanation:
      '출력 순서: A → B → C → D. foo()를 호출하면 B가 동기적으로 출력되고, await에서 일시 중단됩니다. 제어권이 돌아와 C가 출력되고, 콜 스택이 비워지면 마이크로태스크로 스케줄된 D가 실행됩니다.',
    hints: ['await는 해당 지점에서 일시 중단되고 제어권을 호출자에게 돌려줍니다'],
    deepDive:
      'async/await는 Promise의 문법적 설탕입니다. await 이후 코드는 .then() 콜백과 동일하게 마이크로태스크 큐에 스케줄됩니다. 즉, await Promise.resolve()는 Promise.resolve().then(() => { /* 이후 코드 */ })와 동일합니다.',
    relatedProblems: ['cs-q-001'],
  },
  {
    id: 'cs-q-003',
    category: 'cs-basics',
    subcategory: 'browser-rendering',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Reflow vs Repaint',
    description: '다음 CSS 속성 변경 중 Reflow(Layout)가 발생하는 것은?',
    options: [
      'opacity: 0.5 → opacity: 1',
      'transform: translateX(10px)',
      'width: 100px → width: 200px',
      'background-color: red → background-color: blue',
    ],
    correctAnswer: 2,
    explanation:
      'width 변경은 요소의 크기를 변경하므로 Reflow(Layout 재계산)가 발생합니다. opacity와 transform은 Composite only(GPU 처리)로 가장 저렴합니다. background-color 변경은 Repaint만 발생합니다. 성능 순서: Composite(transform, opacity) > Repaint(색상, 배경) > Reflow(크기, 위치).',
    hints: ['크기나 위치가 바뀌면 주변 요소도 다시 계산해야 합니다'],
    deepDive:
      'Layout Thrashing 방지: DOM 읽기(offsetWidth, getBoundingClientRect)와 쓰기(style 변경)를 번갈아 하면 브라우저가 강제로 Layout을 재계산합니다. 읽기를 한 번에 모아서 하고, 쓰기를 한 번에 모아서 하는 패턴으로 방지하거나 requestAnimationFrame을 사용하세요.',
    relatedProblems: ['cs-q-004'],
  },
  {
    id: 'cs-q-004',
    category: 'cs-basics',
    subcategory: 'browser-rendering',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Critical Rendering Path 순서',
    description: '브라우저의 Critical Rendering Path 순서로 올바른 것은?',
    options: [
      'HTML 파싱 → CSS 파싱 → Render Tree → Layout → Paint → Composite',
      'CSS 파싱 → HTML 파싱 → Render Tree → Paint → Layout → Composite',
      'HTML 파싱 → Render Tree → CSS 파싱 → Layout → Paint → Composite',
      'HTML 파싱 → Layout → CSS 파싱 → Render Tree → Paint → Composite',
    ],
    correctAnswer: 0,
    explanation:
      'CRP 순서: HTML 파싱(DOM) → CSS 파싱(CSSOM) → Render Tree 생성(DOM+CSSOM 결합) → Layout(위치/크기 계산) → Paint(픽셀 채우기) → Composite(레이어 합성). CSS는 렌더 블로킹 리소스로, CSSOM이 완성되기 전까지 Render Tree를 만들 수 없습니다.',
    hints: ['DOM과 CSSOM이 모두 준비되어야 Render Tree를 만들 수 있습니다'],
    deepDive:
      '렌더 블로킹 최적화: ① CSS는 <head>에 배치, Critical CSS는 인라인 ② JS는 async/defer 사용 ③ font-display: swap으로 폰트 블로킹 방지 ④ preload로 중요 리소스 조기 로드. display: none 요소는 Render Tree에서 제외되지만 visibility: hidden 요소는 포함됩니다.',
    relatedProblems: ['cs-q-003'],
  },
  {
    id: 'cs-q-005',
    category: 'cs-basics',
    subcategory: 'memory',
    type: 'bug-find',
    difficulty: 'medium',
    title: '메모리 누수 찾기',
    description: '다음 React 컴포넌트에서 메모리 누수가 발생하는 이유는?',
    code: `function DataPoller({ userId }: { userId: string }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(\`/api/user/\${userId}\`)
        .then(r => r.json())
        .then(setData)
    }, 3000)
  }, [userId])

  return <div>{JSON.stringify(data)}</div>
}`,
    options: [
      'useState가 너무 자주 호출되어 메모리가 누수된다',
      'useEffect 클린업 함수가 없어서 컴포넌트 언마운트 후에도 interval이 계속 실행되고 setState를 호출한다',
      'fetch가 Promise를 반환하기 때문에 메모리 누수가 발생한다',
      'userId가 변경될 때마다 이전 interval이 계속 쌓인다는 것은 맞지만 React가 자동으로 정리한다',
    ],
    correctAnswer: 1,
    explanation:
      'useEffect에서 setInterval을 생성했지만 클린업 함수(return () => clearInterval(interval))가 없습니다. 컴포넌트가 언마운트되어도 interval이 계속 실행되고, 이미 사라진 컴포넌트의 setState를 호출해 "Can\'t perform a React state update on an unmounted component" 경고와 함께 메모리 누수가 발생합니다.',
    hints: ['useEffect에서 생성한 것은 useEffect에서 정리해야 합니다'],
    deepDive:
      '수정 코드: useEffect(() => { const interval = setInterval(..., 3000); return () => clearInterval(interval) }, [userId]). 추가로, userId가 변경될 때 이전 fetch가 완료되기 전에 새 fetch가 시작될 수 있으므로 AbortController도 함께 사용하는 것이 좋습니다: const controller = new AbortController(); fetch(url, { signal: controller.signal }); return () => { clearInterval(interval); controller.abort() }',
    relatedProblems: ['cs-q-001'],
  },
  {
    id: 'cs-q-006',
    category: 'cs-basics',
    subcategory: 'algorithms',
    type: 'code-output',
    difficulty: 'medium',
    title: 'Debounce vs Throttle 선택',
    description: '다음 시나리오에서 debounce와 throttle 중 적합한 것은?\n\n시나리오: 사용자가 검색창에 타이핑할 때마다 API를 호출하는 자동완성 기능',
    options: [
      'throttle — 일정 간격마다 API를 호출해야 하므로',
      'debounce — 타이핑이 멈춘 후 N ms 뒤에 API를 한 번만 호출하므로 불필요한 요청을 줄임',
      'throttle — 더 빠른 응답성이 필요하므로',
      'debounce와 throttle 모두 부적합하며 매 입력마다 호출해야 한다',
    ],
    correctAnswer: 1,
    explanation:
      '자동완성 API 호출에는 debounce가 적합합니다. 사용자가 "react"를 입력할 때 r → re → rea → reac → react 각각 API를 호출하면 낭비입니다. debounce를 사용하면 타이핑이 300ms 멈춘 뒤 "react"로 한 번만 호출합니다. throttle은 "스크롤 위치 추적"처럼 연속 이벤트를 일정 간격으로 처리할 때 적합합니다.',
    hints: ['마지막 동작 이후 N ms 기다렸다가 실행 vs N ms마다 최대 1회 실행'],
    deepDive:
      'debounce 사용 사례: 검색 자동완성, 폼 유효성 검사, 윈도우 리사이즈 후 처리. throttle 사용 사례: 스크롤 이벤트, 게임 입력, 마우스 이동 추적, 무한 스크롤 트리거. useDebounce 커스텀 훅: const debouncedValue = useDebounce(searchTerm, 300) — 이 값이 변경될 때만 API 호출.',
    relatedProblems: ['cs-q-005'],
  },
]
