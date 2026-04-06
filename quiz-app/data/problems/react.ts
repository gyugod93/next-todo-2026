import type { Problem } from '@/types'

export const reactProblems: Problem[] = [
  {
    id: 'react-001',
    category: 'react',
    subcategory: 'useState',
    type: 'code-output',
    difficulty: 'medium',
    title: 'useState 클로저 문제',
    description: '버튼을 3번 빠르게 클릭하면 count는 얼마가 될까요?',
    code: `function Counter() {
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setCount(count + 1)
    setCount(count + 1)
    setCount(count + 1)
  }

  return <button onClick={handleClick}>{count}</button>
}`,
    options: ['3', '1', '0', '에러 발생'],
    correctAnswer: 1,
    explanation: `React는 배치(batch) 업데이트를 합니다.
handleClick이 실행될 때 count는 클로저로 현재 값(0)을 캡처합니다.
setCount(0 + 1)이 세 번 호출되지만, 최종 결과는 1입니다.

✅ 함수형 업데이트로 해결:
const handleClick = () => {
  setCount(prev => prev + 1)  // prev는 최신 상태
  setCount(prev => prev + 1)
  setCount(prev => prev + 1)
}
// 결과: 3`,
    hints: [
      'count는 클릭 시점의 스냅샷 값입니다',
      '함수형 업데이트(prev => prev + 1)를 써보세요',
    ],
  },
  {
    id: 'react-002',
    category: 'react',
    subcategory: 'useEffect',
    type: 'bug-find',
    difficulty: 'hard',
    title: 'useEffect 무한 루프',
    description:
      '아래 코드는 무한 리렌더링이 발생합니다. 이유를 찾고 수정하세요.',
    code: `function UserList() {
  const [users, setUsers] = useState([])
  const filters = { active: true }

  useEffect(() => {
    fetchUsers(filters).then(setUsers)
  }, [filters])

  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}`,
    correctAnswer: `function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchUsers({ active: true }).then(setUsers)
  }, [])

  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}`,
    explanation: `문제 원인: 객체는 참조 타입입니다.
- 리렌더링마다 filters = { active: true }가 새 객체로 생성됩니다
- 내용이 같아도 참조가 다르므로 useEffect가 계속 실행됩니다
- fetchUsers가 setUsers를 호출 → 리렌더링 → 새 filters → 무한 반복

🔧 해결책:
1. filters를 컴포넌트 밖에 선언 (변경 없으면)
2. useEffect 내부에 직접 작성
3. useMemo로 메모이제이션
4. useRef로 이전 값과 비교

const filters = useMemo(() => ({ active: true }), [])`,
    hints: [
      '객체는 참조 타입입니다 — 내용이 같아도 새 객체면 다른 값입니다',
      'useEffect 의존성 배열에 객체를 넣으면 어떻게 될까요?',
    ],
  },
  {
    id: 'react-003',
    category: 'react',
    subcategory: 'useMemo/useCallback',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'useMemo vs useCallback',
    description: 'useMemo와 useCallback의 차이점을 가장 잘 설명한 것은?',
    options: [
      'useMemo는 값을 메모이제이션, useCallback은 함수를 메모이제이션한다',
      'useMemo는 렌더링을 막고, useCallback은 이벤트만 처리한다',
      'useMemo는 비동기, useCallback은 동기 함수에만 사용한다',
      '둘 다 완전히 동일하며 취향에 따라 쓴다',
    ],
    correctAnswer: 0,
    explanation: `useMemo vs useCallback:

useMemo: 계산 결과(값)를 메모이제이션
const value = useMemo(() => expensiveCalc(a, b), [a, b])
// expensiveCalc(a, b)의 반환값을 캐싱

useCallback: 함수 자체를 메모이제이션
const fn = useCallback(() => doSomething(a), [a])
// 함수 참조를 캐싱 (자식 컴포넌트에 props로 넘길 때 유용)

💡 관계:
useCallback(fn, deps) === useMemo(() => fn, deps)

언제 쓸까?
- useMemo: 무거운 계산 (정렬, 필터링, 복잡한 연산)
- useCallback: React.memo로 감싼 자식에게 함수를 props로 전달할 때`,
    hints: ['메모이제이션의 대상이 "값"인지 "함수"인지 생각해보세요'],
  },
  {
    id: 'react-004',
    category: 'react',
    subcategory: '커스텀 훅',
    type: 'code-complete',
    difficulty: 'hard',
    title: 'useFetch 커스텀 훅 구현',
    description:
      'URL을 받아 데이터를 fetch하는 useFetch 훅을 구현하세요. loading, data, error 상태를 반환해야 합니다.',
    code: `function useFetch(url) {
  // 여기를 완성하세요
}

// 사용 예시
function App() {
  const { data, loading, error } = useFetch('https://api.example.com/users')

  if (loading) return <p>로딩 중...</p>
  if (error) return <p>에러: {error.message}</p>
  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}`,
    correctAnswer: `function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
        return res.json()
      })
      .then(json => {
        if (!cancelled) setData(json)
      })
      .catch(err => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [url])

  return { data, loading, error }
}`,
    explanation: `핵심 포인트:
1. cancelled 플래그: 컴포넌트 언마운트 후 setState 호출 방지 (메모리 누수 방지)
2. cleanup 함수: useEffect에서 반환해 취소 처리
3. url이 바뀌면 useEffect 재실행 (의존성 배열)
4. 에러 처리: res.ok 체크 (4xx, 5xx도 catch 안 됨)

💡 실무에서는 React Query / SWR 사용을 권장:
const { data, isLoading, error } = useQuery(['users'], fetchUsers)`,
    hints: [
      'cancelled 플래그로 언마운트 후 setState를 막아야 합니다',
      'res.ok를 체크하지 않으면 4xx 에러를 잡을 수 없습니다',
    ],
  },
  {
    id: 'react-005',
    category: 'react',
    subcategory: '렌더링 최적화',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'React.memo 동작 방식',
    description: '아래 코드에서 Parent가 리렌더링될 때 Child도 리렌더링될까요?',
    code: `const Child = React.memo(function Child({ onClick }) {
  console.log('Child 렌더링')
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
      'handleClick이 매 렌더마다 새 함수라서 리렌더링 됨',
      'count가 변해야만 Child가 리렌더링 됨',
      'onClick props가 있으므로 항상 리렌더링 됨',
    ],
    correctAnswer: 1,
    explanation: `React.memo는 props를 얕은 비교(shallow compare)합니다.
handleClick은 Parent가 렌더링될 때마다 새로운 함수 참조가 생성됩니다.
→ 이전 onClick !== 새 onClick → Child 리렌더링 발생

✅ useCallback으로 해결:
const handleClick = useCallback(
  () => setCount(c => c + 1),
  [] // 의존성 없음 → 항상 같은 함수 참조
)

이제 Child는 리렌더링되지 않습니다.`,
    hints: [
      'React.memo는 props를 얕은 비교합니다',
      '함수는 참조 타입입니다 — 같은 내용이어도 새로 만들면 다른 참조입니다',
    ],
  },
]
