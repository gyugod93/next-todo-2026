import type { Problem } from '@/types'

export const reactProblems: Problem[] = [
  {
    id: 'react-001',
    category: 'react',
    subcategory: 'useState',
    type: 'code-output',
    difficulty: 'medium',
    title: 'useState 스냅샷',
    description: '버튼을 한 번 클릭하면 count는 얼마가 될까요?',
    code: `function Counter() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }

  return <button onClick={handleClick}>{count}</button>
}`,
    options: ['3', '1', '0', '무한 루프'],
    correctAnswer: 1,
    explanation: `React는 이벤트 핸들러 내에서 상태를 배치(batch) 처리합니다.
handleClick 실행 시 count는 클로저로 현재 값(0)을 캡처합니다.

setCount(0 + 1) → 예약
setCount(0 + 1) → 예약 (count는 여전히 0)
setCount(0 + 1) → 예약

최종 결과: 1

✅ 최신 상태를 기반으로 업데이트하려면 함수형 업데이트 사용:
setCount(prev => prev + 1) → 3
setCount(prev => prev + 1)
setCount(prev => prev + 1)`,
    hints: ['count는 클릭 시점의 스냅샷입니다', '함수형 업데이트(prev => ...)를 써보세요'],
  },
  {
    id: 'react-002',
    category: 'react',
    subcategory: 'useEffect',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'useEffect 무한 루프 원인',
    description: '아래 코드가 무한 리렌더링을 일으키는 이유는?',
    code: `function UserList() {
  const [users, setUsers] = useState([])
  const filters = { active: true }

  useEffect(() => {
    fetchUsers(filters).then(setUsers)
  }, [filters])

  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}`,
    options: [
      'fetchUsers가 비동기 함수라서',
      'filters가 매 렌더마다 새 객체로 생성되어 의존성 비교 시 항상 변경됨',
      'useState와 useEffect를 함께 쓰면 안 되어서',
      'setUsers 호출이 의존성 배열에 없어서',
    ],
    correctAnswer: 1,
    explanation: `객체는 참조 타입입니다.
{ active: true }는 내용이 같아도 렌더마다 새 객체(새 참조)가 생성됩니다.

동작 순서:
1. 렌더 → filters 새 객체 생성
2. useEffect 실행 (filters 변경 감지)
3. fetchUsers → setUsers → 리렌더
4. 다시 1번으로...

✅ 해결책:
// 1. useEffect 내부에 직접 작성
useEffect(() => {
  fetchUsers({ active: true }).then(setUsers)
}, [])

// 2. useMemo로 메모이제이션
const filters = useMemo(() => ({ active: true }), [])`,
    hints: ['객체는 같은 내용이어도 매번 새로운 참조가 생성됩니다'],
  },
  {
    id: 'react-003',
    category: 'react',
    subcategory: 'useMemo/useCallback',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'useMemo vs useCallback',
    description: 'useMemo와 useCallback의 차이를 가장 잘 설명한 것은?',
    options: [
      'useMemo는 계산 결과(값)를 메모이제이션하고, useCallback은 함수 자체를 메모이제이션한다',
      'useMemo는 렌더링을 막고, useCallback은 이벤트만 처리한다',
      'useMemo는 비동기 함수에만, useCallback은 동기 함수에만 사용한다',
      '둘은 완전히 동일하다',
    ],
    correctAnswer: 0,
    explanation: `useMemo: 계산 결과(값)를 캐싱
const sorted = useMemo(() => items.sort(), [items])
// items가 바뀔 때만 sort 재실행

useCallback: 함수 참조를 캐싱
const handleClick = useCallback(() => doSomething(id), [id])
// id가 바뀔 때만 새 함수 생성

💡 관계:
useCallback(fn, deps) === useMemo(() => fn, deps)

언제 쓰나?
- useMemo: 무거운 계산 (정렬, 필터링)
- useCallback: React.memo로 감싼 자식에게 함수를 props로 전달할 때`,
    hints: ['메모이제이션 대상이 "값"인지 "함수"인지 생각해보세요'],
  },
  {
    id: 'react-004',
    category: 'react',
    subcategory: '렌더링 최적화',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'React.memo가 실패하는 경우',
    description: 'Parent가 리렌더링될 때 Child도 리렌더링될까요?',
    code: `const Child = React.memo(function Child({ onClick }) {
  return <button onClick={onClick}>클릭</button>
})

function Parent() {
  const [count, setCount] = useState(0)
  const handleClick = () => setCount(c => c + 1)

  return (
    <>
      <p>{count}</p>
      <Child onClick={handleClick} />
    </>
  )
}`,
    options: [
      'React.memo로 감쌌으므로 리렌더링 안 됨',
      'handleClick이 렌더마다 새 함수 참조이므로 리렌더링 됨',
      'count가 변해야만 Child가 리렌더링 됨',
      'onClick props가 있으면 항상 리렌더링 됨',
    ],
    correctAnswer: 1,
    explanation: `React.memo는 props를 얕은 비교(shallow compare)합니다.
handleClick은 Parent가 렌더링될 때마다 새 함수 참조가 생성됩니다.

이전 onClick !== 새 onClick → Child 리렌더링 발생

✅ useCallback으로 해결:
const handleClick = useCallback(
  () => setCount(c => c + 1),
  [] // 의존성 없음 → 항상 같은 참조 유지
)
→ 이제 Child는 리렌더링되지 않습니다.`,
    hints: ['React.memo는 props를 얕은 비교합니다', '함수는 참조 타입입니다'],
  },
  {
    id: 'react-005',
    category: 'react',
    subcategory: 'useRef',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'useRef와 리렌더링',
    description: '버튼을 3번 클릭하면 화면에 표시되는 숫자는?',
    code: `function Component() {
  const count = useRef(0)

  const handleClick = () => {
    count.current += 1
    console.log(count.current) // 콘솔에는 올바르게 출력됨
  }

  return <button onClick={handleClick}>{count.current}</button>
}`,
    options: ['3', '1', '0', '매 클릭마다 증가'],
    correctAnswer: 2,
    explanation: `useRef로 만든 값은 변경해도 리렌더링을 트리거하지 않습니다.

콘솔에는 1, 2, 3이 정상 출력되지만
화면은 초기 렌더 이후 업데이트되지 않아 계속 0을 표시합니다.

useRef 사용 목적:
1. 렌더링과 무관한 값 저장 (이전 값, 타이머 ID 등)
2. DOM 직접 접근 (ref={inputRef})

화면에 표시가 필요한 값은 useState를 사용하세요.`,
    hints: ['useRef 변경은 리렌더링을 발생시키지 않습니다'],
  },
  {
    id: 'react-006',
    category: 'react',
    subcategory: 'Hooks 규칙',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Hooks 규칙 위반',
    description: '아래 코드의 문제는?',
    code: `function Component({ isLoggedIn }) {
  if (isLoggedIn) {
    const [user, setUser] = useState(null)
    useEffect(() => {
      fetchUser().then(setUser)
    }, [])
  }

  const [count, setCount] = useState(0)
  return <div>{count}</div>
}`,
    options: [
      'isLoggedIn이 false일 때 에러가 발생한다',
      'Hooks는 조건문 안에서 호출할 수 없다 (React Rules of Hooks 위반)',
      'useEffect의 의존성 배열이 잘못됐다',
      'useState를 두 번 호출하면 안 된다',
    ],
    correctAnswer: 1,
    explanation: `React Hooks의 두 가지 규칙:
1. 최상위 레벨에서만 호출 (반복문, 조건문, 중첩 함수 내부 불가)
2. React 함수 컴포넌트 또는 커스텀 훅에서만 호출

이유: React는 Hooks 호출 순서로 상태를 추적합니다.
isLoggedIn이 렌더마다 다르면 Hook 호출 순서가 달라져 상태 매핑이 깨집니다.

✅ 올바른 방법:
const [user, setUser] = useState(null) // 항상 호출
useEffect(() => {
  if (isLoggedIn) fetchUser().then(setUser)
}, [isLoggedIn])`,
    hints: ['Hook은 항상 같은 순서로 호출되어야 합니다'],
  },
  {
    id: 'react-007',
    category: 'react',
    subcategory: 'key prop',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'key prop과 상태 초기화',
    description: '버튼을 클릭하면 Input 컴포넌트에 어떤 일이 발생하나요?',
    code: `function Input() {
  const [value, setValue] = useState('')
  return <input value={value} onChange={e => setValue(e.target.value)} />
}

function Parent() {
  const [id, setId] = useState(1)
  return (
    <>
      <Input key={id} />
      <button onClick={() => setId(id + 1)}>초기화</button>
    </>
  )
}`,
    options: [
      'value만 빈 문자열로 초기화된다',
      'Input이 언마운트/마운트되어 value 상태가 초기화된다',
      '아무 일도 일어나지 않는다',
      '에러가 발생한다',
    ],
    correctAnswer: 1,
    explanation: `key가 변경되면 React는 기존 컴포넌트를 언마운트하고 새 인스턴스를 마운트합니다.

key는 동일한 컴포넌트인지를 판단하는 기준입니다.
key가 달라지면 → 다른 컴포넌트로 인식 → 완전히 새로 생성

✅ 이 패턴의 활용:
- 폼 초기화
- 자식 상태를 부모에서 강제 리셋
- 애니메이션 재시작

주의: key 변경은 비용이 크므로 남용하지 마세요.`,
    hints: ['React는 key로 컴포넌트 동일성을 판단합니다'],
  },
  {
    id: 'react-008',
    category: 'react',
    subcategory: 'Context',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Context와 React.memo',
    description: 'count 버튼 클릭 시 Child가 리렌더링될까요?',
    code: `const ThemeContext = createContext(null)

function App() {
  const [theme, setTheme] = useState('dark')
  const [count, setCount] = useState(0)

  return (
    <ThemeContext.Provider value={{ theme }}>
      <Child />
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </ThemeContext.Provider>
  )
}

const Child = React.memo(() => {
  const { theme } = useContext(ThemeContext)
  return <div>{theme}</div>
})`,
    options: [
      'React.memo로 감쌌으므로 리렌더링 안 됨',
      'Context value가 매 렌더마다 새 객체라서 리렌더링 됨',
      'theme이 변하지 않으므로 리렌더링 안 됨',
      'useContext가 있으면 항상 리렌더링 됨',
    ],
    correctAnswer: 1,
    explanation: `React.memo는 부모가 전달하는 props를 비교하지만
useContext는 Context value를 직접 구독합니다.

value={{ theme }}는 count가 변할 때마다 새 객체를 생성합니다.
→ Context value 변경 → useContext를 사용하는 Child 리렌더링
→ React.memo는 Context 변경을 막지 못합니다.

✅ 해결책:
const themeValue = useMemo(() => ({ theme }), [theme])
<ThemeContext.Provider value={themeValue}>
→ theme가 실제로 변경될 때만 새 객체 생성`,
    hints: ['React.memo는 props를 비교하지 Context는 비교 못 합니다'],
  },
  {
    id: 'react-009',
    category: 'react',
    subcategory: 'useReducer',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'useReducer를 선택하는 기준',
    description: 'useReducer를 useState보다 선택해야 하는 상황은?',
    options: [
      '상태가 단순한 string이나 number일 때',
      '다음 상태가 이전 상태와 action에 복잡하게 의존하고, 여러 상태가 함께 바뀔 때',
      '컴포넌트가 함수형일 때',
      '상태를 서버에서 가져올 때',
    ],
    correctAnswer: 1,
    explanation: `useReducer가 유리한 경우:
1. 여러 상태가 연관되어 함께 변경될 때
2. 다음 상태가 이전 상태에 복잡하게 의존할 때
3. 상태 전환 로직을 컴포넌트 외부로 분리하고 싶을 때
4. 복잡한 폼 상태 관리

useState가 유리한 경우:
1. 독립적인 단순 상태 (숫자, 불리언, 문자열)
2. 상태 전환이 단순할 때

예시:
// useReducer가 적합한 경우
const [state, dispatch] = useReducer(reducer, {
  loading: false,
  data: null,
  error: null
})
dispatch({ type: 'FETCH_START' }) // loading: true, data: null, error: null`,
    hints: ['상태 전환의 복잡도와 상태 간 관계를 생각해보세요'],
  },
  {
    id: 'react-010',
    category: 'react',
    subcategory: 'Suspense',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Suspense fallback 동작',
    description: 'HeavyComponent가 로드되는 동안 무엇이 표시되나요?',
    code: `const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}`,
    options: [
      '빈 화면',
      '"로딩 중..."',
      'HeavyComponent의 기본 스켈레톤',
      '에러 메시지',
    ],
    correctAnswer: 1,
    explanation: `React.lazy()는 컴포넌트를 동적으로 import합니다.
로드 중에 Suspense의 fallback prop이 표시됩니다.

Suspense 활용 사례:
1. 코드 스플리팅 (lazy + Suspense)
2. 데이터 패칭 대기 (Next.js의 async Server Component, SWR/React Query)
3. 스켈레톤 UI 구현

📦 Next.js에서는 loading.tsx 파일로 자동 Suspense:
// app/dashboard/loading.tsx → 자동으로 Suspense fallback으로 사용됨`,
    hints: ['Suspense의 fallback prop을 확인하세요'],
  },
  {
    id: 'react-011',
    category: 'react',
    subcategory: 'Transitions',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'useTransition 사용 목적',
    description: 'useTransition의 startTransition으로 감싼 상태 업데이트의 특성은?',
    options: [
      '즉시 실행되어 UI 업데이트가 빠르다',
      '우선순위가 낮아 타이핑 등 긴급한 업데이트에 양보한다',
      '서버에서만 실행된다',
      'setTimeout과 동일하게 동작한다',
    ],
    correctAnswer: 1,
    explanation: `useTransition은 상태 업데이트의 우선순위를 낮춥니다.

const [isPending, startTransition] = useTransition()

startTransition(() => {
  setFilteredList(heavyFilter(list)) // 무거운 작업
})

// isPending: 전환이 진행 중인지 여부

활용 사례:
- 검색 결과 필터링 (타이핑은 즉시, 필터 결과는 여유롭게)
- 탭 전환 (현재 탭 유지하면서 새 탭 준비)

vs useDeferredValue:
- useTransition: 업데이트를 "나중에 해도 됨"으로 표시 (트리거 측에서 제어)
- useDeferredValue: 값의 "지연된 버전" 사용 (수신 측에서 제어)`,
    hints: ['React 18의 Concurrent Features 중 하나입니다'],
  },
  {
    id: 'react-012',
    category: 'react',
    subcategory: 'Batching',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'React 18 자동 배치',
    description: 'React 18에서 handleClick 호출 시 리렌더링은 몇 번 발생할까요?',
    code: `function Component() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)

  async function handleClick() {
    setA(1)
    setB(1)
  }

  console.log('render')
  return <button onClick={handleClick}>클릭</button>
}`,
    options: [
      '2번 (각 setState마다 한 번씩)',
      '1번 (자동 배치로 한 번만 리렌더링)',
      '0번 (async 함수는 배치 안 됨)',
      '에러 발생',
    ],
    correctAnswer: 1,
    explanation: `React 17 이하: async 함수 내 setState는 배치 안 됨 → 2번 리렌더링
React 18: createRoot 사용 시 모든 곳에서 자동 배치 → 1번 리렌더링

React 18의 Automatic Batching:
- 이벤트 핸들러 내부 ✅ (이미 React 17에서도)
- setTimeout, Promise, async 함수 내부 ✅ (React 18 신규)
- Native 이벤트 핸들러 내부 ✅

배치를 막고 싶다면:
import { flushSync } from 'react-dom'
flushSync(() => setA(1)) // 즉시 리렌더링
flushSync(() => setB(1)) // 즉시 리렌더링`,
    hints: ['React 18에서는 async 함수도 배치됩니다'],
  },
]
