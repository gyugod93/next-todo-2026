import type { Lesson } from '@/types'

export const designPatternLessons: Lesson[] = [
  {
    id: 'dp-l-001',
    category: 'design-patterns',
    subcategory: 'component-patterns',
    title: 'Compound Component 패턴',
    description: '관련 컴포넌트들을 하나의 네임스페이스로 묶어 유연한 API를 제공하는 패턴',
    emoji: '🧩',
    readingTime: 6,
    tags: ['compound-component', 'context', 'react-patterns'],
    sections: [
      {
        title: '패턴이 필요한 이유',
        content: `컴포넌트가 복잡해지면 props를 통해 내부 동작을 제어하게 됩니다. 이 방식은 곧 한계에 부딪힙니다.

**props 폭발 문제:**
\`<Select value title options isOpen onOpen onClose renderItem renderEmpty />\`

이런 컴포넌트는 사용하기도, 내부를 이해하기도 어렵습니다.

**Compound Component**는 이 문제를 해결합니다. HTML의 \`<select>\`/\`<option>\`처럼 부모-자식 컴포넌트가 Context를 통해 상태를 공유하되, 외부에서는 선언적으로 조합해서 사용하는 패턴입니다.`,
      },
      {
        title: 'Context 기반 구현',
        content: `부모 컴포넌트가 Context Provider를 통해 상태를 공유하고, 자식 컴포넌트들이 그 상태를 소비합니다. 외부에서는 컴포넌트를 자유롭게 조합합니다.`,
        code: `import { createContext, useContext, useState } from 'react'

// 1. Context 정의
interface TabsContext {
  activeTab: string
  setActiveTab: (id: string) => void
}

const TabsContext = createContext<TabsContext | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs 컴포넌트 내부에서 사용해야 합니다')
  return ctx
}

// 2. 부모 컴포넌트 — Context Provider
function Tabs({
  children,
  defaultTab,
}: {
  children: React.ReactNode
  defaultTab: string
}) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

// 3. 자식 컴포넌트들 — Context Consumer
function TabList({ children }: { children: React.ReactNode }) {
  return <div className="flex border-b">{children}</div>
}

function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const { activeTab, setActiveTab } = useTabs()
  return (
    <button
      className={activeTab === id ? 'border-b-2 border-blue-500' : ''}
      onClick={() => setActiveTab(id)}
    >
      {children}
    </button>
  )
}

function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  const { activeTab } = useTabs()
  if (activeTab !== id) return null
  return <div>{children}</div>
}

// 4. 네임스페이스로 묶기
Tabs.List = TabList
Tabs.Tab = Tab
Tabs.Panel = TabPanel

// 사용
function App() {
  return (
    <Tabs defaultTab="home">
      <Tabs.List>
        <Tabs.Tab id="home">홈</Tabs.Tab>
        <Tabs.Tab id="profile">프로필</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel id="home">홈 콘텐츠</Tabs.Panel>
      <Tabs.Panel id="profile">프로필 콘텐츠</Tabs.Panel>
    </Tabs>
  )
}`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'props 폭발 문제를 Context 기반 내부 상태 공유로 해결',
      '부모가 Provider, 자식들이 Context를 소비하는 구조',
      'useContext에 null 체크를 추가해 잘못된 사용을 컴파일 타임에 잡기',
      '네임스페이스로 묶으면 (Tabs.Tab) 관련 컴포넌트를 직관적으로 관리',
    ],
    relatedProblemIds: ['dp-001'],
  },
  {
    id: 'dp-l-002',
    category: 'design-patterns',
    subcategory: 'component-patterns',
    title: 'HOC vs Custom Hook — 언제 무엇을 쓸까',
    description: 'Higher-Order Component와 Custom Hook의 차이, 각각이 빛나는 시나리오',
    emoji: '🔀',
    readingTime: 7,
    tags: ['hoc', 'custom-hook', 'react-patterns', 'composition'],
    sections: [
      {
        title: 'HOC (Higher-Order Component)',
        content: `HOC는 **컴포넌트를 받아 새로운 컴포넌트를 반환하는 함수**입니다. 로직을 컴포넌트 렌더링 계층에서 재사용합니다.

**적합한 시나리오:**
- 렌더링 조건 제어가 필요할 때 (인증 게이트)
- 클래스 컴포넌트와 함께 사용해야 할 때 (레거시)
- 서드파티 라이브러리 통합 (connect(), withRouter())

**단점:**
- Props Drilling + 이름 충돌 가능
- 디버깅 시 컴포넌트 트리가 깊어짐
- TypeScript 타이핑이 복잡`,
        code: `// HOC 예시 — 인증 게이트
function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthGuard(props: P) {
    const { user, isLoading } = useAuth()

    if (isLoading) return <Spinner />
    if (!user) return <Navigate to="/login" />

    return <WrappedComponent {...props} />
  }
}

// 사용
const ProtectedDashboard = withAuth(Dashboard)
// <ProtectedDashboard /> — 인증 안 되면 자동 리다이렉트`,
        language: 'typescript',
      },
      {
        title: 'Custom Hook',
        content: `Custom Hook은 **로직만 재사용하고 렌더링은 호출한 컴포넌트가 결정**합니다. React 16.8 이후 HOC의 대부분 역할을 대체합니다.

**적합한 시나리오:**
- 상태 + 이벤트 핸들러 로직 재사용
- API 호출, 타이머, 이벤트 리스너 추상화
- 복잡한 상태 기계를 컴포넌트에서 분리

**장점:**
- 로직과 UI 명확히 분리
- 쉬운 TypeScript 타이핑
- 테스트하기 쉬움 (renderHook 사용)`,
        code: `// Custom Hook 예시 — 데이터 페칭
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)

    fetch(url, { signal: controller.signal })
      .then((res) => res.json())
      .then(setData)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [url])

  return { data, loading, error }
}

// 사용 — 렌더링 결정은 컴포넌트가
function UserProfile({ id }: { id: string }) {
  const { data: user, loading, error } = useFetch<User>(\`/api/users/\${id}\`)

  if (loading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  return <div>{user?.name}</div>
}`,
        language: 'typescript',
      },
      {
        title: '선택 기준 정리',
        content: `**Custom Hook을 선택:** 로직 재사용이 목적이고, 렌더링 제어가 필요 없을 때 (대부분의 경우)

**HOC를 선택:** 렌더링 자체를 제어해야 할 때 (인증 게이트, 에러 바운더리 래핑, 조건부 렌더링)

**실전 팁:**
- 새 코드는 기본적으로 Custom Hook 우선
- HOC는 "컴포넌트를 래핑해야 할 때"로 제한
- 둘 다 필요하면 Custom Hook을 HOC 내부에서 사용`,
      },
    ],
    keyPoints: [
      'Custom Hook: 로직 재사용, 렌더링은 호출 컴포넌트가 결정 — 대부분의 경우 선호',
      'HOC: 렌더링 자체를 제어해야 할 때 (인증 게이트, 조건부 렌더링)',
      'Custom Hook은 TypeScript 타이핑과 테스트가 HOC보다 훨씬 쉬움',
      '새 코드는 Custom Hook 우선, HOC는 렌더링 제어가 꼭 필요한 경우만',
    ],
    relatedProblemIds: ['dp-003', 'dp-004'],
  },
  {
    id: 'dp-l-003',
    category: 'design-patterns',
    subcategory: 'architecture',
    title: 'SOLID 원칙을 React에 적용하기',
    description: '단일 책임, 개방-폐쇄, 인터페이스 분리 원칙을 실제 컴포넌트 설계에 적용',
    emoji: '🏛️',
    readingTime: 8,
    tags: ['SOLID', 'architecture', 'refactoring', 'clean-code'],
    sections: [
      {
        title: 'S — 단일 책임 원칙 (SRP)',
        content: `**하나의 컴포넌트는 하나의 이유로만 변경되어야 합니다.**

가장 흔한 위반: 데이터 페칭 + UI 렌더링 + 비즈니스 로직이 한 컴포넌트에 혼재

**리팩토링 방향:**
- 데이터 페칭 → Custom Hook으로 분리
- 비즈니스 로직 → 순수 함수로 분리
- UI → Presentational Component로 분리`,
        code: `// ❌ 단일 책임 위반 — 너무 많은 책임
function UserDashboard() {
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('active')

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers)
  }, [])

  const filtered = users.filter(u => u.status === filter)
  const stats = { total: users.length, active: filtered.length }

  return (
    <div>
      <h1>Users ({stats.total})</h1>
      <select onChange={e => setFilter(e.target.value)}>{/* ... */}</select>
      {filtered.map(u => <UserCard key={u.id} user={u} />)}
    </div>
  )
}

// ✅ SRP 적용 — 책임 분리
function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers)
  }, [])
  return users
}

function computeStats(users: User[], filter: string) {
  const filtered = users.filter(u => u.status === filter)
  return { total: users.length, filtered }
}

function UserDashboard() {
  const users = useUsers()
  const [filter, setFilter] = useState('active')
  const { total, filtered } = computeStats(users, filter)

  return <UserDashboardView total={total} users={filtered} onFilter={setFilter} />
}`,
        language: 'typescript',
      },
      {
        title: 'O — 개방-폐쇄 원칙 (OCP)',
        content: `**확장에는 열려 있고, 수정에는 닫혀 있어야 합니다.**

컴포넌트 내부를 수정하지 않고도 동작을 확장할 수 있어야 합니다. Render Props, Slot 패턴, Composition이 대표적인 구현 방법입니다.`,
        code: `// ❌ OCP 위반 — 새 타입마다 내부 수정 필요
function Alert({ type, message }: { type: 'success' | 'error' | 'warning'; message: string }) {
  const config = {
    success: { icon: '✅', color: 'green' },
    error: { icon: '❌', color: 'red' },
    warning: { icon: '⚠️', color: 'yellow' },
    // 새 타입 추가 시 여기를 수정해야 함
  }
  const { icon, color } = config[type]
  return <div style={{ color }}>{icon} {message}</div>
}

// ✅ OCP 적용 — 확장 시 내부 수정 불필요
interface AlertProps {
  icon: React.ReactNode  // 외부에서 주입
  color: string
  message: string
}

function Alert({ icon, color, message }: AlertProps) {
  return <div style={{ color }}>{icon} {message}</div>
}

// 확장: Alert 내부 수정 없이 새 변형 추가
const SuccessAlert = (props: { message: string }) => (
  <Alert icon="✅" color="green" {...props} />
)
const InfoAlert = (props: { message: string }) => (
  <Alert icon="ℹ️" color="blue" {...props} />
)`,
        language: 'typescript',
      },
      {
        title: 'I — 인터페이스 분리 원칙 (ISP)',
        content: `**컴포넌트는 사용하지 않는 props에 의존하면 안 됩니다.**

거대한 User 객체를 통째로 넘기는 대신, 컴포넌트가 실제로 필요한 props만 받도록 설계합니다.`,
        code: `// ❌ ISP 위반 — 필요 이상으로 많은 데이터 의존
interface User {
  id: string; name: string; email: string; avatar: string
  role: string; permissions: string[]; lastLogin: Date
  // ...30개 필드
}

function Avatar({ user }: { user: User }) {
  // user.avatar, user.name만 사용하지만 전체 User를 받음
  return <img src={user.avatar} alt={user.name} />
}

// ✅ ISP 적용 — 실제 필요한 것만
function Avatar({ avatarUrl, name }: { avatarUrl: string; name: string }) {
  return <img src={avatarUrl} alt={name} />
}

// 호출부에서 필요한 것만 추출해서 전달
<Avatar avatarUrl={user.avatar} name={user.name} />

// 장점:
// - 테스트가 쉬워짐 (mock 데이터 최소화)
// - 컴포넌트 재사용성 증가
// - User 스키마 변경이 Avatar에 영향 없음`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'SRP: 데이터 페칭(Hook) + 비즈니스 로직(순수 함수) + UI(컴포넌트) 분리',
      'OCP: Render Props/Composition으로 내부 수정 없이 확장 가능하게 설계',
      'ISP: 컴포넌트에 전체 객체 대신 실제 필요한 props만 전달',
      'SOLID는 목표가 아닌 도구 — 복잡도가 생길 때 적용하고 과도한 추상화 금지',
    ],
    relatedProblemIds: ['dp-007'],
  },
  {
    id: 'dp-l-004',
    category: 'design-patterns',
    subcategory: 'architecture',
    title: '프로젝트 폴더 구조 전략',
    description: 'Feature-based vs Layer-based — 규모에 맞는 폴더 구조 선택하기',
    emoji: '📁',
    readingTime: 6,
    tags: ['folder-structure', 'architecture', 'feature-based', 'scalability'],
    sections: [
      {
        title: 'Layer-based 구조 (소규모)',
        content: `기능 단위가 아닌 **파일 역할(레이어)** 단위로 분류합니다.

**장점:** 작은 프로젝트에서 직관적, 새로운 팀원이 이해하기 쉬움

**단점:** 프로젝트가 커지면 관련 파일이 여러 폴더에 흩어짐 → 기능 하나 수정에 여러 폴더를 오가야 함`,
        code: `src/
├── components/          # 모든 컴포넌트
│   ├── Button.tsx
│   ├── UserCard.tsx
│   └── ProductList.tsx
├── hooks/               # 모든 훅
│   ├── useAuth.ts
│   └── useProducts.ts
├── services/            # 모든 API 호출
│   ├── auth.ts
│   └── products.ts
├── store/               # 모든 상태
│   ├── authStore.ts
│   └── productStore.ts
└── types/               # 모든 타입`,
        language: 'bash',
      },
      {
        title: 'Feature-based 구조 (중규모+)',
        content: `**기능(도메인)** 단위로 관련 파일을 함께 묶습니다. 각 feature 폴더는 해당 기능에 필요한 모든 것을 포함합니다.

**장점:**
- 기능 추가/수정/삭제 시 한 폴더만 건드림
- 팀 단위 소유권 명확
- 코드 삭제 시 영향 범위 파악 쉬움

**단점:** 공통 코드의 위치 결정이 어려울 수 있음`,
        code: `src/
├── features/
│   ├── auth/
│   │   ├── components/      # LoginForm, SignupForm
│   │   ├── hooks/           # useAuth, useSession
│   │   ├── services/        # authApi.ts
│   │   ├── store/           # authStore.ts
│   │   ├── types/           # AuthUser, Session
│   │   └── index.ts         # 외부 공개 API (배럴 파일)
│   ├── products/
│   │   ├── components/      # ProductCard, ProductList
│   │   ├── hooks/           # useProducts, useCart
│   │   ├── services/        # productsApi.ts
│   │   └── index.ts
│   └── quiz/
│       ├── components/
│       ├── hooks/
│       └── index.ts
├── shared/                  # 여러 feature에서 공유
│   ├── components/          # Button, Modal, Toast
│   ├── hooks/               # useDebounce, useLocalStorage
│   └── utils/               # formatDate, cn
└── app/                     # 라우팅 (Next.js App Router)`,
        language: 'bash',
      },
      {
        title: '배럴 파일과 경계 관리',
        content: `Feature-based 구조에서는 각 feature의 \`index.ts\`가 **공개 API**를 정의합니다. 외부에서는 이 파일을 통해서만 접근합니다.

이 패턴을 **"공개 API 패턴"**이라고 합니다. feature 내부 구현을 캡슐화하고, 리팩토링 시 외부 영향을 최소화합니다.`,
        code: `// features/auth/index.ts — 공개 API만 export
export { LoginForm } from './components/LoginForm'
export { useAuth } from './hooks/useAuth'
export type { AuthUser } from './types'
// 내부 구현 (authStore, authApi)은 export 안 함

// ✅ 올바른 import — 배럴 파일 통해
import { LoginForm, useAuth } from '@/features/auth'

// ❌ 잘못된 import — 내부 구현 직접 접근
import { authStore } from '@/features/auth/store/authStore'
// → 내부 리팩토링 시 이 import가 깨질 수 있음

// tsconfig.json paths 설정
{
  "paths": {
    "@/features/*": ["./src/features/*"],
    "@/shared/*": ["./src/shared/*"]
  }
}`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      '소규모(~10개 기능): Layer-based로 시작, 중규모 이상: Feature-based로 전환',
      'Feature 폴더는 해당 기능의 컴포넌트/훅/서비스/타입을 모두 포함',
      'index.ts(배럴 파일)로 공개 API를 명시 — 내부 구현 캡슐화',
      'shared/ 폴더에는 2개 이상의 feature에서 사용하는 것만 배치',
    ],
    relatedProblemIds: ['dp-006'],
  },
]
