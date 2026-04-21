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
    deepDive: `📸 React 상태는 "스냅샷"이다

렌더링이 발생하면 React는 그 시점의 state 값을 고정합니다.
이벤트 핸들러 내부의 모든 코드는 렌더링 당시 스냅샷의 값을 사용합니다.

// 이 핸들러가 실행되는 렌더에서 count = 5라면:
const handleClick = () => {
  setCount(count + 1) // setCount(5 + 1)
  setCount(count + 1) // setCount(5 + 1) — 여전히 5!
  setCount(count + 1) // setCount(5 + 1) — 여전히 5!
}
// 결과: 6 (5+1), 스냅샷은 렌더 중에 바뀌지 않는다

함수형 업데이트는 큐에 쌓인 마지막 상태를 기준으로 계산:
setCount(prev => prev + 1) // prev = 5, 결과 6 큐에 추가
setCount(prev => prev + 1) // prev = 6, 결과 7 큐에 추가
setCount(prev => prev + 1) // prev = 7, 결과 8 큐에 추가
// 최종: 8

💡 규칙: 다음 상태가 이전 상태에 의존한다면 항상 함수형 업데이트를 사용하라.`,
    relatedProblems: ['react-012'],
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
    deepDive: `🔍 React 의존성 비교 방식: Object.is()

React는 useEffect 의존성을 Object.is()로 비교합니다.
Object.is()는 === 와 거의 동일하게 동작합니다.

Object.is(1, 1)           // true
Object.is('a', 'a')       // true
Object.is({}, {})         // false ← 참조가 다름!
Object.is([], [])         // false ← 참조가 다름!

// 안전한 의존성 패턴:
// 1. 원시값 (string, number, boolean) → 항상 안전
// 2. 컴포넌트 외부 상수 → 항상 안전
// 3. 렌더 내부 객체/배열/함수 → useMemo/useCallback 필요

// eslint-plugin-react-hooks의 exhaustive-deps 규칙을 활성화하면
// 빠진 의존성을 자동으로 경고해줍니다.`,
    relatedProblems: ['react-003'],
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
    deepDive: `⚠️ 메모이제이션을 남용하면 안 되는 이유

useMemo와 useCallback은 비용이 없는 게 아닙니다.
- 메모리 사용 증가 (이전 값 저장)
- 의존성 비교 비용 발생
- 코드 복잡도 증가

✅ 사용해야 하는 경우:
1. 계산이 실제로 비싼 경우 (1ms 이상이 기준점)
2. React.memo로 감싼 자식에게 props로 전달하는 함수
3. 다른 Hook의 의존성으로 사용되는 값/함수

❌ 사용하지 않아도 되는 경우:
1. 단순한 계산 (덧셈, 문자열 조합 등)
2. 원시값을 반환하는 경우
3. 컴포넌트가 어차피 자주 리렌더링되는 경우

// 이런 건 useMemo 필요 없음
const fullName = useMemo(() => firstName + ' ' + lastName, [firstName, lastName])
// 그냥 이렇게 쓰세요
const fullName = firstName + ' ' + lastName`,
    relatedProblems: ['react-004'],
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
    deepDive: `🧩 React.memo + useCallback 최적화 패턴

React.memo가 효과를 발휘하려면 모든 props 참조가 안정적이어야 합니다.

// 완전한 최적화 패턴
const Child = React.memo(function Child({ data, onAction }) {
  console.log('Child 렌더링') // 최적화 시 거의 호출 안 됨
  return <div onClick={onAction}>{data.name}</div>
})

function Parent() {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState([])

  // ✅ 함수는 useCallback으로 안정화
  const handleAction = useCallback(() => {
    console.log('action')
  }, []) // 의존성 없음

  // ✅ 객체는 useMemo로 안정화
  const data = useMemo(() => ({ name: 'item' }), [])

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <Child data={data} onAction={handleAction} />
    </>
  )
}
// count가 아무리 바뀌어도 Child는 리렌더링되지 않음`,
    relatedProblems: ['react-003', 'react-008'],
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
    deepDive: `📦 useRef의 두 가지 사용 패턴

패턴 1: DOM 접근
function AutoFocusInput() {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus() // 마운트 후 포커스
  }, [])

  return <input ref={inputRef} />
}

패턴 2: 렌더링 간 값 유지 (리렌더링 없이)
function Timer() {
  const [isRunning, setIsRunning] = useState(false)
  const intervalId = useRef(null) // 타이머 ID 저장

  const start = () => {
    setIsRunning(true)
    intervalId.current = setInterval(() => {
      // ...
    }, 1000)
  }

  const stop = () => {
    setIsRunning(false)
    clearInterval(intervalId.current) // ref로 저장한 ID 사용
  }
}

💡 규칙: 화면에 보여야 하면 useState, 보이지 않아도 되는 값은 useRef`,
    relatedProblems: ['react-001'],
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
    deepDive: `🔢 React가 Hooks 순서로 상태를 추적하는 방식

React는 내부적으로 각 컴포넌트에 Hook 상태를 연결 리스트로 저장합니다.
렌더링마다 Hook 호출 순서가 같아야 같은 상태에 접근할 수 있습니다.

// 첫 번째 렌더 (isLoggedIn = true)
useState(null) → 슬롯 1 (user)
useEffect(...)  → 슬롯 2
useState(0)    → 슬롯 3 (count)

// 두 번째 렌더 (isLoggedIn = false)
// if 블록 건너뜀!
useState(0)    → 슬롯 1 ← React는 이게 'user' 상태라고 착각!

→ 상태 매핑이 완전히 어긋남 → 예측 불가능한 버그 발생

✅ eslint-plugin-react-hooks의 rules-of-hooks 규칙이
   이런 위반을 빌드 타임에 잡아줍니다. 반드시 활성화하세요.`,
    relatedProblems: ['react-007'],
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
    deepDive: `🔑 key와 React 재조정(Reconciliation) 알고리즘

React는 렌더링마다 이전 트리와 새 트리를 비교(diffing)합니다.

같은 위치의 같은 타입 → 기존 인스턴스 재사용 (상태 유지)
같은 위치의 다른 타입 → 언마운트 후 새로 마운트
같은 위치 + key 변경 → 언마운트 후 새로 마운트

// 리스트에서 key가 중요한 이유
// ❌ index를 key로 사용 - 항목 추가/삭제/정렬 시 상태 오염
{items.map((item, index) => <Item key={index} data={item} />)}

// ✅ 고유 ID를 key로 사용
{items.map(item => <Item key={item.id} data={item} />)}

// 🔄 강제 리마운트 패턴
<Form key={formVersion} /> // formVersion 변경 시 폼 완전 초기화`,
    relatedProblems: ['react-006'],
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
    deepDive: `📦 Context 성능 최적화 패턴: Context 분리

Context가 자주 변하는 값과 자주 안 변하는 값을 한 곳에 담으면
자주 안 변하는 값만 구독하는 컴포넌트도 불필요하게 리렌더링됩니다.

// ❌ 하나의 Context에 모두 담기
const AppContext = createContext({ theme, user, count, setCount })

// ✅ 관심사별로 Context 분리
const ThemeContext = createContext(null)  // 거의 안 변함
const UserContext = createContext(null)   // 로그인 시에만 변함
const CounterContext = createContext(null) // 자주 변함

// 자주 변하는 값은 별도 Context로 분리하면
// 구독하지 않는 컴포넌트는 영향받지 않습니다.

// 대규모 앱에서는 Zustand, Jotai 같은 상태 관리 라이브러리가
// 이 문제를 더 효율적으로 해결합니다.`,
    relatedProblems: ['react-003', 'react-004'],
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
    deepDive: `🔄 useReducer 패턴: 비동기 상태 관리

useReducer는 loading/data/error 같이 함께 변하는 상태를 관리할 때 특히 강력합니다.

type State = { status: 'idle' | 'loading' | 'success' | 'error'; data: any; error: string | null }
type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: any }
  | { type: 'FETCH_ERROR'; payload: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { status: 'loading', data: null, error: null }
    case 'FETCH_SUCCESS':
      return { status: 'success', data: action.payload, error: null }
    case 'FETCH_ERROR':
      return { status: 'error', data: null, error: action.payload }
    default:
      return state
  }
}

// useState로 같은 걸 관리하면:
const [loading, setLoading] = useState(false)
const [data, setData] = useState(null)
const [error, setError] = useState(null)
// → 여러 setState를 동기화해야 해서 실수 가능성 높음`,
    relatedProblems: ['react-001'],
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
    deepDive: `⚡ Suspense와 Streaming SSR (Next.js App Router)

Next.js App Router에서 Suspense는 서버 스트리밍과 연동됩니다.

// app/dashboard/page.tsx
export default function Dashboard() {
  return (
    <div>
      <h1>대시보드</h1>
      {/* 이 부분이 준비되는 동안 fallback 표시 */}
      <Suspense fallback={<Skeleton />}>
        <SlowDataComponent /> {/* async 서버 컴포넌트 */}
      </Suspense>
    </div>
  )
}

동작 방식:
1. 서버에서 h1을 즉시 스트리밍 → 브라우저에 먼저 도착
2. SlowDataComponent가 데이터 패칭 중 → Skeleton 표시
3. 데이터 준비 완료 → HTML 스트리밍으로 Skeleton 교체

→ 전체 페이지 로딩을 기다리지 않고 보이는 부분부터 표시!
→ TTFB(첫 바이트 도달 시간) 개선, 체감 속도 향상`,
    relatedProblems: ['react-011'],
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
    deepDive: `⏳ useTransition vs setTimeout: 핵심 차이

setTimeout은 단순히 실행을 지연할 뿐이지만,
startTransition은 React Concurrent Mode와 통합됩니다.

// setTimeout 방식의 문제점
setTimeout(() => {
  setHeavyState(newValue) // 실행되면 무조건 처리, 중단 불가
}, 0)

// startTransition 방식의 장점
startTransition(() => {
  setHeavyState(newValue)
  // React가 더 긴급한 업데이트(타이핑, 클릭)가 오면
  // 이 업데이트를 일시 중단하고 긴급 업데이트를 먼저 처리
  // 긴급 업데이트 완료 후 다시 재개
})

// isPending으로 UX 개선
const [isPending, startTransition] = useTransition()

return (
  <>
    <input onChange={e => {
      setInputValue(e.target.value) // 즉시 업데이트
      startTransition(() => setSearchResults(filter(e.target.value)))
    }} />
    {isPending ? <Spinner /> : <Results />}
  </>
)`,
    relatedProblems: ['react-013', 'react-014'],
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
    deepDive: `🔬 flushSync가 필요한 실제 사례

대부분의 경우 자동 배치는 좋은 것이지만,
특정 DOM 측정이 업데이트 직후 필요할 때는 flushSync가 필요합니다.

import { flushSync } from 'react-dom'

function ScrollToBottom() {
  const listRef = useRef(null)
  const [items, setItems] = useState([])

  const addItem = (newItem) => {
    // 배치되면 DOM 업데이트 전에 scrollHeight를 읽게 됨
    flushSync(() => {
      setItems(prev => [...prev, newItem])
    })
    // flushSync 이후에는 DOM이 실제로 업데이트되어 있음
    listRef.current.scrollTop = listRef.current.scrollHeight
  }
}

// flushSync 사용 시나리오:
// - 상태 업데이트 직후 DOM 측정이 필요한 경우
// - 서드파티 라이브러리와 통합할 때
// ⚠️ 남용하면 성능 저하, 꼭 필요한 경우만 사용`,
    relatedProblems: ['react-001'],
  },
  {
    id: 'react-013',
    category: 'react',
    subcategory: 'Transitions',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'useDeferredValue 동작 방식',
    description: 'useDeferredValue를 사용할 때 나타나는 동작으로 올바른 것은?',
    code: `function SearchPage() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <SearchResults query={deferredQuery} />
    </>
  )
}`,
    options: [
      'input과 SearchResults가 항상 동시에 업데이트된다',
      'input은 즉시 업데이트되고, SearchResults는 브라우저가 여유 있을 때 업데이트된다',
      'deferredQuery는 query보다 항상 1초 느리게 업데이트된다',
      'SearchResults가 먼저 업데이트된 후 input이 업데이트된다',
    ],
    correctAnswer: 1,
    explanation: `useDeferredValue는 값의 "지연된 버전"을 반환합니다.

긴급하지 않은 업데이트(SearchResults)는 뒤로 미루고
긴급한 업데이트(input 타이핑)를 먼저 처리합니다.

동작 순서:
1. 사용자가 타이핑 → query 즉시 업데이트 → input 즉시 반영
2. deferredQuery는 아직 이전 값
3. 브라우저가 여유 있을 때 deferredQuery 업데이트 → SearchResults 리렌더링

useTransition vs useDeferredValue:
- useTransition: setState를 감싸서 제어 (내 코드에서 setState 호출 가능할 때)
- useDeferredValue: 값을 받아서 지연 (props나 외부 라이브러리 값일 때)`,
    hints: ['useDeferredValue는 값의 "지연된 버전"을 만듭니다'],
    deepDive: `🎨 useDeferredValue + React.memo로 stale 콘텐츠 표시

useDeferredValue의 강력한 패턴: 지연 중에 이전 결과를 보여주기

const SearchResults = memo(function SearchResults({ query }) {
  // query가 실제로 바뀔 때만 리렌더링 (memo 덕분에)
  const results = useSearchResults(query)
  return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
})

function SearchPage() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery // 지연 중인지 확인

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {/* 지연 중에는 이전 결과를 흐리게 표시 */}
      <div style={{ opacity: isStale ? 0.5 : 1, transition: 'opacity 0.2s' }}>
        <SearchResults query={deferredQuery} />
      </div>
    </>
  )
}

→ 타이핑 중에도 이전 검색 결과가 흐리게 유지되어
  "결과가 사라지는" 불쾌한 UX를 피할 수 있음`,
    relatedProblems: ['react-011', 'react-014'],
  },
  {
    id: 'react-014',
    category: 'react',
    subcategory: 'Transitions',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'useTransition isPending 활용',
    description: '탭 전환 중 isPending을 활용한 패턴의 장점은?',
    code: `function TabContainer() {
  const [tab, setTab] = useState('home')
  const [isPending, startTransition] = useTransition()

  const selectTab = (nextTab) => {
    startTransition(() => setTab(nextTab))
  }

  return (
    <>
      <TabButton onClick={() => selectTab('home')}>홈</TabButton>
      <TabButton onClick={() => selectTab('posts')}>포스트</TabButton>
      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        {tab === 'home' ? <HomePage /> : <PostsPage />}
      </div>
    </>
  )
}`,
    options: [
      '탭 전환이 완전히 차단되어 사용자가 다시 클릭할 수 없다',
      '현재 탭을 유지하면서 새 탭을 백그라운드에서 준비, 로딩 중엔 현재 탭이 흐리게 표시된다',
      'isPending 동안 모든 상태 업데이트가 차단된다',
      '탭이 즉시 빈 화면으로 전환된 후 데이터가 로드된다',
    ],
    correctAnswer: 1,
    explanation: `startTransition을 사용하면 "현재 UI를 유지하면서 새 UI를 준비"합니다.

일반 setState: 탭 클릭 → 즉시 새 탭으로 전환 (로딩 중 빈 화면 또는 스피너)
startTransition: 탭 클릭 → 현재 탭 유지 + isPending=true + 백그라운드에서 새 탭 준비
                           → 준비 완료 시 새 탭으로 전환

isPending을 활용한 UX 패턴:
- opacity로 로딩 상태 시각화
- 로딩 스피너를 탭 버튼 옆에 표시
- 현재 탭을 유지하므로 레이아웃 점프 없음`,
    hints: ['isPending은 트랜지션이 진행 중임을 나타냅니다'],
    deepDive: `🏗️ useTransition과 Suspense의 관계

startTransition 내부에서 Suspense를 유발하는 컴포넌트를 렌더링하면
Suspense의 fallback으로 돌아가지 않고 현재 UI를 유지합니다.

// startTransition 없이 탭 전환 시:
// 탭 클릭 → Suspense fallback(스피너) 표시 → 데이터 로드 → 새 탭 표시
// → 레이아웃이 스피너 → 새 탭으로 '점프'하는 느낌

// startTransition + Suspense 조합:
// 탭 클릭 → 현재 탭 유지(isPending=true) → 백그라운드에서 데이터 로드
//         → 데이터 준비 완료 → 새 탭 즉시 표시(스피너 없음!)
// → 훨씬 자연스러운 전환

function App() {
  const [tab, setTab] = useState('home')
  const [isPending, startTransition] = useTransition()

  return (
    <Suspense fallback={<Loading />}> {/* 초기 로드에만 사용 */}
      <TabContent
        tab={tab}
        // 탭 전환은 startTransition이 처리 → fallback으로 안 떨어짐
        onChange={next => startTransition(() => setTab(next))}
      />
    </Suspense>
  )
}`,
    relatedProblems: ['react-011', 'react-013'],
  },
  {
    id: 'react-015',
    category: 'react',
    subcategory: 'React 19',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'useOptimistic 패턴',
    description: 'useOptimistic을 사용하는 주된 목적은?',
    code: `function LikeButton({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes)
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (currentLikes, increment) => currentLikes + increment
  )

  async function handleLike() {
    addOptimisticLike(1) // 즉시 UI 업데이트
    await likePost(postId) // 서버 요청
    setLikes(prev => prev + 1) // 서버 확인 후 실제 업데이트
  }

  return <button onClick={handleLike}>❤️ {optimisticLikes}</button>
}`,
    options: [
      '서버 응답을 기다리지 않고 UI를 먼저 업데이트해 빠른 반응성을 제공한다',
      '서버에서 검증 후에만 UI를 업데이트해 데이터 정확성을 보장한다',
      'useState의 성능을 향상시킨다',
      '서버와 클라이언트의 상태를 자동으로 동기화한다',
    ],
    correctAnswer: 0,
    explanation: `useOptimistic은 낙관적 업데이트(Optimistic Update) 패턴을 구현합니다.

낙관적 업데이트: "서버 요청이 성공할 것"이라 가정하고 UI를 먼저 업데이트

동작 흐름:
1. handleLike 호출 → addOptimisticLike(1)로 즉시 UI에 +1 반영
2. 서버 요청이 진행되는 동안 optimisticLikes 값 사용
3. 서버 응답 완료 → setLikes로 실제 값 업데이트
4. 서버 요청 실패 시 → optimisticLikes가 likes 값으로 자동 롤백

효과: 사용자는 네트워크 지연 없이 즉각적인 피드백을 받음`,
    hints: ['낙관적 업데이트는 서버 응답 전에 UI를 미리 업데이트합니다'],
    deepDive: `🔄 useOptimistic 롤백 메커니즘 (React 19)

useOptimistic의 가장 중요한 특성은 자동 롤백입니다.

const [optimisticState, addOptimistic] = useOptimistic(
  serverState,          // 실제 상태 (서버에서 온 값)
  (current, newValue) => current + newValue  // 업데이트 함수
)

// 서버 요청 성공 시:
// optimisticState → 새 serverState로 교체 (정상 흐름)

// 서버 요청 실패 시:
// optimisticState → 자동으로 원래 serverState로 롤백!
// → 별도의 에러 핸들링 없이 UI가 원상복구

// Next.js Server Actions와의 조합 예시:
async function handleSubmit(formData) {
  const text = formData.get('text')
  addOptimisticMessage({ text, sending: true }) // 즉시 표시

  // Server Action 호출
  await sendMessage(text) // 성공 시 실제 메시지로 교체, 실패 시 롤백
}

// React 19에서는 form action과 함께 더 간결하게 사용 가능:
<form action={handleSubmit}>
  <input name="text" />
  <button>전송</button>
</form>`,
    relatedProblems: ['react-016'],
  },
  {
    id: 'react-016',
    category: 'react',
    subcategory: 'React 19',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'use() Hook 특성',
    description: 'React 19의 use() Hook이 기존 Hook들과 다른 점은?',
    code: `// 기존 방식
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId])
  if (!user) return <Loading />
  return <div>{user.name}</div>
}

// use() 방식
function UserProfile({ userPromise }) {
  const user = use(userPromise) // Promise를 직접 읽음
  return <div>{user.name}</div>
}`,
    options: [
      'use()는 서버 컴포넌트에서만 사용할 수 있다',
      'use()는 조건문이나 반복문 안에서도 호출할 수 있다',
      'use()는 useState보다 빠르다',
      'use()는 useEffect를 내부적으로 사용한다',
    ],
    correctAnswer: 1,
    explanation: `use()는 Hooks의 규칙 중 "최상위에서만 호출" 규칙을 따르지 않아도 됩니다.

// 가능! (다른 Hook은 불가)
function Component({ condition, promise }) {
  if (condition) {
    const data = use(promise) // 조건문 안에서도 OK
    return <div>{data}</div>
  }
  return <div>조건 미충족</div>
}

use()가 할 수 있는 것:
1. Promise 읽기 → Suspense와 함께 동작
2. Context 읽기 → useContext의 대안

Promise를 use()로 읽으면:
- Promise가 pending 상태 → 가장 가까운 Suspense의 fallback 표시
- Promise가 resolved → 값 반환
- Promise가 rejected → 가장 가까운 Error Boundary로 에러 전파`,
    hints: ['use()는 일반 Hook 규칙의 예외입니다'],
    deepDive: `🚀 use() + Server Components 패턴 (React 19 + Next.js)

use()는 서버에서 생성한 Promise를 클라이언트로 전달할 때 특히 강력합니다.

// app/page.tsx (Server Component)
export default function Page() {
  // 서버에서 Promise 생성 (await 안 함!)
  const userPromise = fetchUser() // Promise<User>

  return (
    <Suspense fallback={<Skeleton />}>
      {/* Promise를 클라이언트 컴포넌트에 prop으로 전달 */}
      <UserCard userPromise={userPromise} />
    </Suspense>
  )
}

// components/UserCard.tsx (Client Component)
'use client'
function UserCard({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise) // 클라이언트에서 Promise를 읽음
  return <div>{user.name}</div>
}

장점:
- 서버에서 데이터 패칭을 시작 → 클라이언트 JS 로드와 병렬로 진행
- 워터폴(순차적 대기) 없이 최대한 빨리 데이터 시작
- Suspense로 로딩 UI 자동 처리`,
    relatedProblems: ['react-010', 'react-015'],
  },
]
