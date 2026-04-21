import type { Problem } from '@/types'

export const designPatternProblems: Problem[] = [
  {
    id: 'dp-001',
    category: 'design-patterns',
    subcategory: 'Compound Component',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Compound Component 패턴',
    description: 'Compound Component 패턴을 사용하는 주된 이유는?',
    code: `// Compound Component 방식
function Tabs({ children }) {
  const [active, setActive] = useState(0)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      {children}
    </TabsContext.Provider>
  )
}
Tabs.List = TabList
Tabs.Tab = Tab
Tabs.Panel = TabPanel

// 사용
<Tabs>
  <Tabs.List>
    <Tabs.Tab index={0}>홈</Tabs.Tab>
    <Tabs.Tab index={1}>설정</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel index={0}>홈 내용</Tabs.Panel>
  <Tabs.Panel index={1}>설정 내용</Tabs.Panel>
</Tabs>`,
    options: [
      '컴포넌트를 더 빠르게 렌더링하기 위해',
      '내부 상태를 숨기면서 유연한 구조를 외부에 제공하기 위해',
      '타입스크립트 타입 안전성을 높이기 위해',
      '서버 컴포넌트와 호환성을 위해',
    ],
    correctAnswer: 1,
    explanation: `Compound Component 패턴:
내부 상태(Context)를 숨기고, 외부에는 유연한 JSX 구조를 제공합니다.

장점:
1. 유연성: 사용자가 서브 컴포넌트를 원하는 위치에 배치 가능
2. 관심사 분리: 상태는 부모가, UI는 자식이 담당
3. Props drilling 없음: Context로 내부 상태 공유

단점:
1. 상위 컴포넌트 밖에서는 서브 컴포넌트 사용 불가
2. 처음에 패턴 파악이 어려울 수 있음

실제 라이브러리 예:
- Radix UI, Headless UI 모두 이 패턴 사용
- <Select.Root>, <Select.Trigger>, <Select.Content>`,
    hints: ['외부에서 컴포넌트 구조를 조합할 수 있습니다'],
    deepDive: `🧩 Compound Component 완전 구현

// 1. Context로 상태 공유
const AccordionContext = createContext<{
  openIndex: number | null
  toggle: (i: number) => void
} | null>(null)

function useAccordion() {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error('Accordion 내부에서만 사용 가능')
  return ctx
}

// 2. 루트 컴포넌트
function Accordion({ children }: { children: React.ReactNode }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const toggle = (i: number) =>
    setOpenIndex(prev => prev === i ? null : i)
  return (
    <AccordionContext.Provider value={{ openIndex, toggle }}>
      <div>{children}</div>
    </AccordionContext.Provider>
  )
}

// 3. 서브 컴포넌트
Accordion.Item = function Item({ index, title, children }) {
  const { openIndex, toggle } = useAccordion()
  const isOpen = openIndex === index
  return (
    <div>
      <button onClick={() => toggle(index)}>{title}</button>
      {isOpen && <div>{children}</div>}
    </div>
  )
}

// 사용
<Accordion>
  <Accordion.Item index={0} title="Q1">답변 1</Accordion.Item>
  <Accordion.Item index={1} title="Q2">답변 2</Accordion.Item>
</Accordion>`,
    relatedProblems: ['dp-002', 'dp-003'],
  },
  {
    id: 'dp-002',
    category: 'design-patterns',
    subcategory: 'Render Props',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Render Props 패턴',
    description: 'Render Props 패턴의 핵심은?',
    code: `function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  return (
    <div onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}>
      {render(pos)}
    </div>
  )
}

// 사용
<MouseTracker
  render={({ x, y }) => (
    <p>마우스 위치: {x}, {y}</p>
  )}
/>`,
    options: [
      '컴포넌트가 직접 UI를 렌더링하지 않고, 렌더링 함수를 props로 받아 호출한다',
      '렌더링 성능을 최적화하기 위해 memo를 자동으로 적용한다',
      '서버에서 렌더링되는 컴포넌트를 만드는 방법이다',
      'React.createElement를 대체하는 패턴이다',
    ],
    correctAnswer: 0,
    explanation: `Render Props: 컴포넌트의 렌더링 결과를 함수 props로 외부에서 제어

흐름:
1. MouseTracker: 마우스 위치 상태를 관리
2. render prop: 그 상태를 이용해 "뭘 그릴지"는 외부에서 결정
3. MouseTracker는 상태 로직만, UI는 사용자가 결정

현대적 대안: Custom Hook
render props는 hooks로 대체 가능
const pos = useMousePosition()
→ 더 간단하고 조합하기 쉬움

render props가 여전히 유용한 경우:
- 클래스 컴포넌트와의 호환
- 렌더링 위치 자체를 제어해야 할 때`,
    hints: ['렌더링을 "무엇을 그릴지"와 "어떻게 그릴지"로 분리합니다'],
    deepDive: `🔄 Render Props → Custom Hook 마이그레이션

// 구식: Render Props
function useMousePosition() { /* ... */ }

function MouseProvider({ render }) {
  const pos = useMousePosition()
  return <>{render(pos)}</>
}

<MouseProvider render={pos => <Cursor {...pos} />} />

// 모던: Custom Hook (같은 로직, 더 간결)
function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])
  return pos
}

function Cursor() {
  const pos = useMousePosition()
  return <div style={{ left: pos.x, top: pos.y }} />
}

// Render Props가 여전히 빛나는 경우:
// children as function 패턴
<DataLoader url="/api/users">
  {({ data, loading, error }) => (
    loading ? <Spinner /> : <UserList users={data} />
  )}
</DataLoader>`,
    relatedProblems: ['dp-001', 'dp-004'],
  },
  {
    id: 'dp-003',
    category: 'design-patterns',
    subcategory: 'HOC',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'HOC (Higher-Order Component)',
    description: 'withAuth HOC를 사용하는 목적은?',
    code: `function withAuth(WrappedComponent) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth()

    if (loading) return <Spinner />
    if (!user) return <Redirect to="/login" />

    return <WrappedComponent {...props} user={user} />
  }
}

const ProtectedDashboard = withAuth(Dashboard)`,
    options: [
      '컴포넌트의 렌더링 속도를 높이기 위해',
      '인증/로깅/권한 같은 횡단 관심사(cross-cutting concerns)를 컴포넌트 로직과 분리하기 위해',
      '컴포넌트를 서버에서만 렌더링하기 위해',
      'TypeScript 타입을 자동으로 생성하기 위해',
    ],
    correctAnswer: 1,
    explanation: `HOC(Higher-Order Component): 컴포넌트를 받아 새로운 컴포넌트를 반환하는 함수

횡단 관심사 예시:
- 인증/인가 (withAuth)
- 로깅 (withLogger)
- 에러 바운더리 (withErrorBoundary)
- 데이터 페칭 (withData)

HOC의 규칙:
1. 원본 컴포넌트를 수정하지 말 것 (순수 함수처럼)
2. props를 그대로 전달 ({...props})
3. displayName을 설정해 디버깅 편의성 확보

현대적 대안:
- Custom Hooks로 대부분 대체 가능
- Compound Component로 구조 문제 해결
- HOC는 여전히 Error Boundary나 클래스 컴포넌트 래핑에 유용`,
    hints: ['HOC는 컴포넌트를 입력받아 새 컴포넌트를 반환합니다'],
    deepDive: `🏭 HOC 패턴 올바르게 작성하기

function withLogger<P extends object>(WrappedComponent: React.ComponentType<P>) {
  // displayName 설정으로 DevTools에서 식별 가능
  const displayName = WrappedComponent.displayName || WrappedComponent.name

  function WithLogger(props: P) {
    useEffect(() => {
      console.log(\`[\${displayName}] mounted\`)
      return () => console.log(\`[\${displayName}] unmounted\`)
    }, [])

    return <WrappedComponent {...props} />
  }

  WithLogger.displayName = \`withLogger(\${displayName})\`
  return WithLogger
}

// 여러 HOC 조합 (compose)
import { compose } from 'redux'  // 또는 직접 구현

const enhance = compose(
  withAuth,
  withLogger,
  withErrorBoundary,
)

const EnhancedDashboard = enhance(Dashboard)

// HOC vs Hooks 선택 기준:
// HOC: 여러 컴포넌트에 동일한 렌더링 로직 추가 필요 (에러 바운더리)
// Hooks: 상태/사이드이펙트 로직 재사용 (대부분의 경우)`,
    relatedProblems: ['dp-002', 'dp-004'],
  },
  {
    id: 'dp-004',
    category: 'design-patterns',
    subcategory: 'Custom Hook',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Custom Hook 설계 원칙',
    description: '좋은 Custom Hook 설계를 고르세요.',
    code: `// A: useUserProfile
function useUserProfile(userId: string) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [userId])

  return { user, loading, error }
}

// B: useEverything
function useEverything() {
  const user = useUserProfile()
  const theme = useTheme()
  const notifications = useNotifications()
  return { user, theme, notifications }
}`,
    options: [
      'B가 더 좋다 — 여러 관심사를 하나로 묶어 편리하다',
      'A가 더 좋다 — 단일 책임 원칙에 따라 하나의 관심사만 처리한다',
      '둘 다 좋지 않다 — Hook은 전역 상태만 관리해야 한다',
      '둘 다 동일하다',
    ],
    correctAnswer: 1,
    explanation: `Custom Hook 설계 원칙:

A (useUserProfile) ✅ 좋은 설계:
- 단일 책임: 유저 데이터 로딩 하나만 처리
- 재사용성: 여러 컴포넌트에서 사용 가능
- 테스트 쉬움: 하나의 동작만 검증

B (useEverything) ❌ 안좋은 설계:
- 관심사 혼합: 유저, 테마, 알림이 한 훅에
- 재사용 어려움: 유저 데이터만 필요해도 전부 포함
- 리렌더링 최적화 불가: 어느 하나 변해도 전체 리렌더링

Custom Hook 작명 규칙:
- use로 시작 (React 규칙)
- 동작을 명확히 설명: useLocalStorage, useDebounce, useFetch`,
    hints: ['하나의 Hook은 하나의 관심사만 처리해야 합니다'],
    deepDive: `🎣 실용적인 Custom Hook 패턴 모음

// 1. useLocalStorage — 로컬스토리지 동기화
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? '') ?? initialValue
    } catch { return initialValue }
  })

  const setStoredValue = (newValue: T) => {
    setValue(newValue)
    localStorage.setItem(key, JSON.stringify(newValue))
  }
  return [value, setStoredValue] as const
}

// 2. useDebounce — 입력 지연
function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// 3. usePrevious — 이전 값 추적
function usePrevious<T>(value: T) {
  const ref = useRef<T>()
  useEffect(() => { ref.current = value })
  return ref.current
}

// 4. useAsync — 비동기 상태 관리
function useAsync<T>(fn: () => Promise<T>, deps: any[]) {
  const [state, setState] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error'
    data?: T; error?: Error
  }>({ status: 'idle' })

  useEffect(() => {
    setState({ status: 'loading' })
    fn().then(data => setState({ status: 'success', data }))
       .catch(error => setState({ status: 'error', error }))
  }, deps)

  return state
}`,
    relatedProblems: ['dp-001', 'dp-005'],
  },
  {
    id: 'dp-005',
    category: 'design-patterns',
    subcategory: 'Container/Presenter',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Container/Presenter 패턴',
    description: 'Container/Presenter 분리의 핵심 목적은?',
    code: `// Presenter (표현 컴포넌트)
function UserList({ users, onSelect, loading }) {
  if (loading) return <Spinner />
  return (
    <ul>
      {users.map(u => (
        <li key={u.id} onClick={() => onSelect(u)}>{u.name}</li>
      ))}
    </ul>
  )
}

// Container (컨테이너 컴포넌트)
function UserListContainer() {
  const { users, loading } = useUsers()
  const navigate = useNavigate()
  return (
    <UserList
      users={users}
      loading={loading}
      onSelect={user => navigate(\`/users/\${user.id}\`)}
    />
  )
}`,
    options: [
      '코드 줄 수를 줄이기 위해',
      'UI(표현)와 비즈니스 로직(데이터)을 분리하여 각각 독립적으로 개발/테스트 가능하게',
      '서버 렌더링을 활성화하기 위해',
      '리렌더링 횟수를 줄이기 위해',
    ],
    correctAnswer: 1,
    explanation: `Container/Presenter 패턴:

Presenter (표현 컴포넌트):
- 오직 UI만 담당
- props를 받아 렌더링
- 상태 없음 (또는 UI 상태만)
- Storybook에서 독립 개발 가능
- 단위 테스트 쉬움

Container (컨테이너 컴포넌트):
- 데이터 로직 담당
- API 호출, 상태 관리
- UI 없음 (단순 Presenter 렌더링)
- 비즈니스 로직 테스트

현대적 관점:
Custom Hooks 등장 이후 Container 역할을 Hook이 대체하는 경우 많음
Presenter만 남겨 "Dumb Component"로 활용하는 것이 실용적`,
    hints: ['UI와 데이터 로직을 분리하는 패턴입니다'],
    deepDive: `🏗️ 현대적 설계: Custom Hook이 Container를 대체하는 패턴

// 기존 Container 방식
function UserListContainer() {
  const users = useUsers()      // 데이터
  const auth = useAuth()        // 인증
  const navigate = useNavigate() // 라우팅
  return <UserList users={users} onSelect={...} />
}

// 모던 방식: Hook이 Container 역할
function useUserListBehavior() {
  const { users, loading } = useUsers()
  const navigate = useNavigate()

  const handleSelect = useCallback((user: User) => {
    navigate(\`/users/\${user.id}\`)
  }, [navigate])

  return { users, loading, handleSelect }
}

// Presenter는 순수하게 유지
function UserList({ users, loading, onSelect }) {
  // UI만
}

// 사용 페이지에서 조합
function UserPage() {
  const props = useUserListBehavior()
  return <UserList {...props} />
}

// 이 패턴의 장점:
// 1. UserList는 Storybook에서 독립 개발
// 2. useUserListBehavior는 Jest로 순수 로직 테스트
// 3. UserPage는 통합 테스트`,
    relatedProblems: ['dp-004', 'dp-006'],
  },
  {
    id: 'dp-006',
    category: 'design-patterns',
    subcategory: 'Module Pattern',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Feature-based 폴더 구조',
    description: '대규모 프론트엔드 앱에서 권장되는 폴더 구조는?',
    code: `// A: 기술별(Type-based) 구조
src/
  components/UserCard.tsx
  components/PostCard.tsx
  hooks/useUser.ts
  hooks/usePost.ts
  services/userService.ts
  services/postService.ts

// B: 기능별(Feature-based) 구조
src/
  features/
    users/
      components/UserCard.tsx
      hooks/useUser.ts
      services/userService.ts
    posts/
      components/PostCard.tsx
      hooks/usePost.ts
      services/postService.ts`,
    options: [
      'A가 낫다 — 같은 종류의 파일이 한 곳에 모여 관리하기 쉽다',
      'B가 낫다 — 기능 단위로 묶여 있어 수정/삭제 시 관련 파일을 한곳에서 파악 가능',
      '둘 다 동등하다',
      'Next.js에서는 어떤 구조도 상관없다',
    ],
    correctAnswer: 1,
    explanation: `Feature-based(B) 구조가 권장되는 이유:

응집도(Cohesion): 관련 파일이 한 폴더에
→ users 기능 수정 시 features/users만 보면 됨

낮은 결합도: 기능 간 의존성 최소화
→ users 기능 삭제 시 폴더 하나만 제거

타입별(A) 구조의 문제:
→ "UserCard 수정" 하려면 components, hooks, services 3곳을 열어야 함
→ 파일이 늘어날수록 관련 파일 찾기 어려움

실무 권장 구조:
features/users/
  index.ts          ← 공개 API (외부에서 이 파일만 import)
  components/       ← 내부 컴포넌트
  hooks/            ← 내부 훅
  types.ts          ← 타입 정의
  api.ts            ← API 호출`,
    hints: ['수정할 때 관련 파일이 얼마나 흩어져 있는지 생각해보세요'],
    deepDive: `📁 실전 Feature-based 구조 + 공개 API 패턴

// 폴더 구조
src/
  features/
    auth/
      index.ts           ← 공개 API
      components/
        LoginForm.tsx     ← 내부 전용
      hooks/
        useAuth.ts        ← 내부 전용
      store/
        authSlice.ts      ← 내부 전용
      types.ts
    users/
      index.ts
      ...

// features/auth/index.ts — 공개 API만 export
export { LoginForm } from './components/LoginForm'
export { useAuth } from './hooks/useAuth'
export type { User, AuthState } from './types'
// 내부 구현 상세는 export 안 함

// 다른 기능에서 사용 시
import { useAuth } from '@/features/auth'  // ✅ index.ts를 통해서만
import { authSlice } from '@/features/auth/store/authSlice'  // ❌ 내부 직접 접근 금지

// 이 패턴의 이점:
// 1. 내부 구현 변경 자유로움 (외부가 index.ts만 의존)
// 2. 순환 참조 방지 (features 간 직접 의존 금지)
// 3. 기능별 독립 배포/테스트 가능`,
    relatedProblems: ['dp-007'],
  },
  {
    id: 'dp-007',
    category: 'design-patterns',
    subcategory: 'SOLID',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: '단일 책임 원칙 (SRP) in React',
    description: '아래 컴포넌트를 SRP에 맞게 리팩토링한다면?',
    code: `// 리팩토링 전
function UserDashboard() {
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])

  const filtered = users.filter(u =>
    u.name.includes(filter)
  )

  return (
    <div>
      <input value={filter} onChange={e => setFilter(e.target.value)} />
      <ul>{filtered.map(u => <li key={u.id}>{u.name}</li>)}</ul>
    </div>
  )
}`,
    options: [
      '리팩토링 불필요 — 이미 충분히 작다',
      'useUsers 훅(데이터), useFilter 훅(필터), UserList(UI)로 분리',
      '컴포넌트를 더 작게 나눌수록 항상 좋다',
      '하나의 파일에 여러 함수로만 나누면 된다',
    ],
    correctAnswer: 1,
    explanation: `현재 UserDashboard의 책임:
1. 데이터 페칭 (API 호출)
2. 필터 상태 관리
3. UI 렌더링

SRP 적용: 각 책임을 분리

// 1. 데이터 책임 → useUsers 훅
function useUsers() {
  const [users, setUsers] = useState([])
  useEffect(() => { fetch('/api/users').then(...) }, [])
  return users
}

// 2. 필터 책임 → useFilter 훅
function useFilter(items) {
  const [filter, setFilter] = useState('')
  const filtered = items.filter(u => u.name.includes(filter))
  return { filter, setFilter, filtered }
}

// 3. UI 책임 → UserList 컴포넌트 (순수)
function UserList({ users, filter, onFilterChange }) { ... }

분리 후 장점:
- useUsers는 다른 컴포넌트에서 재사용 가능
- useFilter는 범용 필터 훅으로 확장 가능
- UserList는 독립 테스트/스토리북 가능`,
    hints: ['각 책임(데이터, 로직, UI)을 따로 분리하세요'],
    deepDive: `🏛️ SOLID 원칙을 React에 적용하기

// S — Single Responsibility: 컴포넌트 하나, 책임 하나
// 각 컴포넌트/훅은 하나의 이유로만 변경

// O — Open/Closed: 확장에 열려, 수정에 닫혀
// 기존 컴포넌트 수정 없이 새 기능 추가
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  // 새 variant 추가 시 Button 내부 수정 최소화
}

// L — Liskov Substitution: 하위 컴포넌트는 상위와 교체 가능
// 공통 props 인터페이스 유지

// I — Interface Segregation: 필요한 props만 받기
// ❌ function Component({ user, post, comment, auth })
// ✅ function UserCard({ name, avatar }) — 필요한 것만

// D — Dependency Inversion: 구체적 구현 아닌 추상에 의존
// ❌ function UserList() { const users = await prisma.user.findMany() }
// ✅ function UserList({ fetchUsers }) { const users = await fetchUsers() }
// 데이터 소스를 주입받아 테스트/교체 쉽게

// 실전 팁: 이 원칙들을 엄격하게 따르기보다
// "변경 이유를 최소화하고, 재사용성을 높이자"는 방향성으로 이해하세요`,
    relatedProblems: ['dp-006', 'dp-004'],
  },
  {
    id: 'dp-008',
    category: 'design-patterns',
    subcategory: 'Observer Pattern',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Observer 패턴과 이벤트 버스',
    description: '프론트엔드에서 Observer 패턴이 적용된 대표적인 예시는?',
    options: [
      'for...of 루프',
      'useEffect의 의존성 배열, EventTarget의 addEventListener',
      'JSX의 {}로 값 삽입',
      'useState의 초기값 설정',
    ],
    correctAnswer: 1,
    explanation: `Observer 패턴: 상태 변화를 구독자(Observer)에게 자동으로 알리는 패턴

프론트엔드 예시:
1. DOM 이벤트:
   element.addEventListener('click', handler)
   → element(Subject)가 클릭되면 handler(Observer)에 알림

2. React useEffect:
   useEffect(() => { ... }, [state])
   → state(Subject)가 변하면 effect(Observer) 실행

3. Zustand/Jotai 같은 상태 관리:
   const count = useAtom(countAtom)
   → countAtom(Subject)이 변하면 구독 컴포넌트(Observer) 리렌더링

4. MutationObserver:
   DOM 변화를 감지하는 브라우저 내장 Observer

패턴의 핵심:
Subject(발행자)와 Observer(구독자)가 느슨하게 결합
→ Subject는 Observer가 누군지 몰라도 됨`,
    hints: ['상태 변화를 구독하는 모든 곳이 Observer 패턴입니다'],
    deepDive: `📡 간단한 EventBus 구현과 활용

// EventBus — 컴포넌트 간 직접 통신 (Redux 없이)
class EventBus {
  private listeners = new Map<string, Set<Function>>()

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
    return () => this.off(event, callback)  // 구독 해제 함수 반환
  }

  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback)
  }

  emit(event: string, data?: unknown) {
    this.listeners.get(event)?.forEach(cb => cb(data))
  }
}

export const bus = new EventBus()

// React에서 활용
function useEventBus(event: string, handler: Function) {
  useEffect(() => {
    const unsubscribe = bus.on(event, handler)
    return unsubscribe  // cleanup 자동 처리
  }, [event, handler])
}

// 컴포넌트 A: 발행
function OrderButton() {
  return <button onClick={() => bus.emit('order:placed', { id: 123 })}>주문</button>
}

// 컴포넌트 B: 구독 (A를 모르지만 이벤트를 받음)
function NotificationPanel() {
  useEventBus('order:placed', (order) => showToast(\`주문 #\${order.id} 완료\`))
}`,
    relatedProblems: ['dp-005', 'dp-001'],
  },
]
