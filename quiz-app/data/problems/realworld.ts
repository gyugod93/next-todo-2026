import type { Problem } from '@/types'

export const realworldProblems: Problem[] = [
  {
    id: 'rw-q-001',
    category: 'realworld',
    subcategory: 'server-state',
    type: 'bug-find',
    difficulty: 'medium',
    title: 'useQuery가 에러를 감지하지 못하는 이유',
    description: '다음 TanStack Query 코드에서 서버가 500을 반환해도 isError가 true가 되지 않는 이유는?',
    code: `const { data, isError } = useQuery({
  queryKey: ['users'],
  queryFn: async () => {
    const res = await fetch('/api/users')
    // 서버가 500을 반환해도 isError가 false인 이유는?
    return res.json()
  },
})`,
    options: [
      'useQuery는 HTTP 상태코드를 자동으로 확인하지 않는다. fetch는 네트워크 에러가 아니면 throw하지 않으므로 에러로 인식하지 못한다',
      'queryKey 배열의 길이가 1이면 에러 감지가 안 된다',
      'isError 대신 isFailure를 사용해야 한다',
      'async queryFn에서는 에러 감지가 동작하지 않는다',
    ],
    correctAnswer: 0,
    explanation:
      'fetch API는 네트워크 오류(CORS, 연결 실패)에서만 throw합니다. 서버가 400, 500 같은 에러 상태코드를 반환해도 Promise는 resolve됩니다. TanStack Query는 queryFn이 throw하거나 reject된 Promise를 반환할 때만 isError를 true로 설정합니다. 따라서 res.ok 체크 후 직접 throw해야 합니다: if (!res.ok) throw new Error(`${res.status}`)',
    hints: ['fetch는 4xx, 5xx 응답에서도 성공으로 처리합니다'],
    deepDive:
      '올바른 queryFn 패턴:\n```typescript\nqueryFn: async () => {\n  const res = await fetch(\'/api/users\')\n  if (!res.ok) {\n    throw new Error(`HTTP ${res.status}: ${res.statusText}`)\n  }\n  return res.json()\n}\n```\n또는 axios를 사용하면 자동으로 throw합니다. 공통 fetcher 함수를 만들어 모든 쿼리에서 재사용하는 것이 best practice입니다.',
    relatedProblems: ['rw-q-002'],
  },
  {
    id: 'rw-q-002',
    category: 'realworld',
    subcategory: 'server-state',
    type: 'code-complete',
    difficulty: 'hard',
    title: 'Optimistic Update — 빈칸 채우기',
    description:
      '좋아요 버튼을 클릭하면 서버 응답 전에 즉시 UI를 업데이트하는 Optimistic Update를 구현하세요. onMutate에서 무엇을 반환해야 하는가?',
    code: `const likeMutation = useMutation({
  mutationFn: (postId: string) =>
    fetch(\`/api/posts/\${postId}/like\`, { method: 'POST' }).then(r => r.json()),

  onMutate: async (postId) => {
    await queryClient.cancelQueries({ queryKey: ['posts'] })
    const previousPosts = queryClient.getQueryData(['posts'])
    queryClient.setQueryData<Post[]>(['posts'], (old) =>
      old?.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p) ?? []
    )
    return ___________  // 무엇을 반환해야 하는가?
  },

  onError: (_err, _id, context) => {
    queryClient.setQueryData(['posts'], context?.__________)
  },

  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  },
})`,
    options: [
      '{ previousPosts } — 롤백에 쓸 이전 데이터를 context로 전달, onError에서 previousPosts로 복구',
      '{ newPosts } — 새 데이터를 저장해서 onError에서 다시 적용',
      'true — 성공 신호로 boolean 반환',
      'null — 반환값은 의미 없음',
    ],
    correctAnswer: 0,
    explanation:
      'onMutate의 반환값이 context로 전달됩니다. 낙관적 업데이트가 실패할 경우 이전 상태로 롤백하려면 이전 데이터(previousPosts)를 context에 담아 반환해야 합니다. onError에서 context.previousPosts로 캐시를 복구합니다. 이것이 Optimistic Update의 핵심 패턴입니다.',
    hints: ['실패 시 롤백하려면 "원래 상태"를 어딘가에 저장해야 합니다'],
    deepDive:
      'Optimistic Update 3단계:\n1. onMutate: 이전 데이터 저장 → UI 즉시 업데이트 → 이전 데이터 반환(context)\n2. onError: context의 이전 데이터로 롤백\n3. onSettled: 서버 데이터와 동기화 (성공/실패 모두)\n\n실제로 사용자는 서버 응답을 기다리지 않고 즉각적인 피드백을 받습니다. 실패하면 롤백되고 에러 토스트를 표시합니다.',
    relatedProblems: ['rw-q-001'],
  },
  {
    id: 'rw-q-003',
    category: 'realworld',
    subcategory: 'forms',
    type: 'bug-find',
    difficulty: 'medium',
    title: 'React Hook Form 제출이 안 되는 이유',
    description: '다음 코드에서 버튼을 클릭해도 onSubmit이 실행되지 않는 이유는?',
    code: `function LoginForm() {
  const { register, handleSubmit } = useForm()

  const onSubmit = (data: FormData) => {
    console.log('제출:', data)
  }

  return (
    <div>
      <input {...register('email')} />
      <input {...register('password')} type="password" />
      <button onClick={onSubmit}>로그인</button>
    </div>
  )
}`,
    options: [
      'register를 input에 직접 spread하면 안 된다',
      'button의 onClick에 onSubmit을 직접 연결하면 안 된다. form 태그와 handleSubmit(onSubmit)을 사용해야 한다',
      'useForm의 타입 파라미터가 없어서 에러가 발생한다',
      'onSubmit 함수명이 예약어여서 동작하지 않는다',
    ],
    correctAnswer: 1,
    explanation:
      'React Hook Form에서 submit은 반드시 <form> 태그의 onSubmit에 handleSubmit(onSubmit)을 연결해야 합니다. handleSubmit은 검증을 실행하고 검증 통과 시 onSubmit 콜백을 호출합니다. button onClick에 직접 연결하면 검증도 실행되지 않고 RHF가 관리하는 form 값도 전달되지 않습니다.',
    hints: ['RHF의 handleSubmit이 하는 역할이 무엇인지 생각해보세요'],
    deepDive:
      '올바른 패턴:\n```typescript\nreturn (\n  <form onSubmit={handleSubmit(onSubmit)}>\n    <input {...register(\'email\')} />\n    <button type="submit">로그인</button>\n  </form>\n)\n```\nhandleSubmit의 역할: ① 모든 필드 검증 실행 ② 검증 실패 시 errors 상태 업데이트 + onSubmit 미실행 ③ 검증 성공 시 form 데이터를 정리해서 onSubmit 호출 ④ isSubmitting 상태 관리',
    relatedProblems: ['rw-q-004'],
  },
  {
    id: 'rw-q-004',
    category: 'realworld',
    subcategory: 'forms',
    type: 'code-complete',
    difficulty: 'hard',
    title: 'Zod 스키마 — 비밀번호 확인 검증',
    description:
      '회원가입 폼에서 비밀번호와 비밀번호 확인이 일치하는지 Zod로 검증하려면 어떤 메서드를 사용해야 하는가?',
    code: `const schema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).__________(
  (data) => data.password === data.confirmPassword,
  {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  }
)`,
    options: [
      '.validate() — 커스텀 검증 메서드',
      '.refine() — 스키마 전체에 커스텀 검증 추가',
      '.check() — 조건 검증 메서드',
      '.assert() — 조건이 false면 에러 발생',
    ],
    correctAnswer: 1,
    explanation:
      'z.object().refine()은 스키마 전체(여러 필드)에 걸친 커스텀 검증을 추가합니다. 첫 번째 인자는 검증 함수(true면 통과, false면 에러), 두 번째 인자는 에러 메시지와 에러가 표시될 필드 경로(path)입니다. path: ["confirmPassword"]로 설정하면 RHF의 errors.confirmPassword에 에러가 표시됩니다.',
    hints: ['여러 필드를 함께 검증하는 Zod 메서드를 생각해보세요'],
    deepDive:
      'refine vs superRefine:\n- refine: 단순 커스텀 검증 (true/false 반환)\n- superRefine: 복잡한 검증 (여러 에러 추가 가능, ctx.addIssue 사용)\n\n여러 필드 간 검증 예시:\n```typescript\nz.object({ start: z.date(), end: z.date() })\n  .refine(data => data.end > data.start, {\n    message: "종료일은 시작일 이후여야 합니다",\n    path: ["end"]\n  })\n```',
    relatedProblems: ['rw-q-003'],
  },
  {
    id: 'rw-q-005',
    category: 'realworld',
    subcategory: 'state',
    type: 'bug-find',
    difficulty: 'medium',
    title: 'Zustand persist — 함수가 저장 안 되는 이유',
    description: '페이지 새로고침 후 Zustand store를 복구했는데 액션 함수들이 undefined입니다. 원인은?',
    code: `const useStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set(state => ({ count: state.count + 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: 'counter-storage',
      // 별도 설정 없음
    }
  )
)

// 새로고침 후: store.count는 복구되지만
// store.increment()를 호출하면 "is not a function" 에러`,
    options: [
      'persist 미들웨어가 함수를 JSON으로 직렬화할 수 없어서 저장하지 않는다. 하지만 store 자체는 create()로 재생성되므로 함수가 없어지지 않아야 한다',
      'localStorage에 함수가 문자열로 저장되어 복구 시 문자열이 된다',
      'persist가 localStorage의 데이터를 store의 초기값과 병합할 때 함수 필드를 덮어쓴다',
      'Zustand는 함수를 상태로 관리할 수 없다',
    ],
    correctAnswer: 2,
    explanation:
      'persist는 localStorage에서 읽은 데이터를 store 초기값에 얕은 병합(shallow merge)합니다. localStorage에는 직렬화 가능한 count: 0만 저장되고, 복구 시 { count: 0 }을 초기 store와 병합합니다. 문제는 저장된 객체에 increment/reset이 없어도 병합이 초기 store를 완전히 대체할 수 있습니다. 해결: partialize 옵션으로 함수를 제외하고 직렬화 가능한 값만 저장합니다.',
    hints: ['JSON.stringify로 함수를 직렬화하면 어떻게 될까요?'],
    deepDive:
      'partialize로 해결:\n```typescript\npersist(storeCreator, {\n  name: \'counter-storage\',\n  partialize: (state) => ({ count: state.count })\n  // 함수(increment, reset)는 저장 제외\n})\n```\n이렇게 하면 localStorage에는 count만 저장되고, 복구 시 count만 초기값에 병합됩니다. 함수는 create()에서 항상 새로 생성되므로 정상 동작합니다.',
    relatedProblems: ['rw-q-006'],
  },
  {
    id: 'rw-q-006',
    category: 'realworld',
    subcategory: 'auth',
    type: 'bug-find',
    difficulty: 'hard',
    title: 'NextAuth 세션이 undefined인 이유',
    description:
      'Server Component에서 사용자 세션을 가져오려 했는데 session이 null입니다. 코드의 문제는?',
    code: `// app/dashboard/page.tsx (Server Component)
import { useSession } from 'next-auth/react'

export default async function DashboardPage() {
  const { data: session } = useSession()

  if (!session) {
    redirect('/login')
  }

  return <div>안녕하세요 {session.user?.name}</div>
}`,
    options: [
      'redirect를 사용하면 세션을 가져올 수 없다',
      'useSession은 Client Component 전용 훅이다. Server Component에서는 getServerSession을 사용해야 한다',
      'async 함수에서는 useSession을 사용할 수 없다',
      'next-auth/react 대신 next-auth를 import해야 한다',
    ],
    correctAnswer: 1,
    explanation:
      'useSession은 React 훅으로, Client Component("use client")에서만 사용할 수 있습니다. Server Component는 훅을 지원하지 않습니다. Server Component에서 세션에 접근하려면 getServerSession(authOptions)을 사용해야 합니다. 이 함수는 서버에서 직접 쿠키를 읽어 세션을 반환합니다.',
    hints: ['훅(use로 시작하는 함수)은 React 컴포넌트 트리 내에서만 사용 가능합니다'],
    deepDive:
      '올바른 Server Component 패턴:\n```typescript\nimport { getServerSession } from "next-auth"\nimport { authOptions } from "@/lib/auth"\nimport { redirect } from "next/navigation"\n\nexport default async function DashboardPage() {\n  const session = await getServerSession(authOptions)\n  if (!session) redirect("/login")\n  return <div>안녕하세요 {session.user?.name}</div>\n}\n```\n\n서버/클라이언트 세션 접근 정리:\n- Server Component: getServerSession(authOptions)\n- API Route: getServerSession(authOptions)\n- Client Component: useSession() from next-auth/react\n- Middleware: req.nextauth.token (withAuth 사용 시)',
    relatedProblems: ['rw-q-005'],
  },
  {
    id: 'rw-q-007',
    category: 'realworld',
    subcategory: 'patterns',
    type: 'code-complete',
    difficulty: 'medium',
    title: 'useEffect 의존성 배열 — 무한 루프 디버깅',
    description: '다음 코드가 무한 루프에 빠지는 이유와 해결법은?',
    code: `function UserList() {
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState({ role: 'all', active: true })

  useEffect(() => {
    fetchUsers(filters).then(setUsers)
  }, [filters]) // ← 이 의존성 때문에 무한 루프 발생

  // filters 상태는 버튼 클릭 시에만 변경됨
  // 그런데도 무한 루프가 발생함. 왜?
}`,
    options: [
      'fetchUsers 함수가 컴포넌트 외부에 없어서 매번 새로 생성된다',
      'filters 객체는 매 렌더마다 새 참조로 생성되지 않으므로 무한 루프는 불가능하다',
      'filters는 useState로 관리되므로 참조가 안정적이다. 무한 루프 원인은 fetchUsers가 setUsers를 호출하고, setUsers가 리렌더를 유발하고, 리렌더 시 filters 객체가 새 참조로 생성되는 경우에만 발생한다',
      'useEffect 내부에서 setUsers를 호출하면 항상 무한 루프가 발생한다',
    ],
    correctAnswer: 2,
    explanation:
      'useState의 상태 객체는 setState로 새 값을 설정하지 않는 한 참조가 유지됩니다. 따라서 이 코드 자체는 무한 루프가 아닙니다. 하지만 만약 filters를 매 렌더마다 새 객체로 생성한다면(예: 컴포넌트 내부에서 const filters = { role: \'all\' } 처럼 선언) 매 렌더마다 다른 참조를 가져 무한 루프가 됩니다. 이 문제의 핵심은 객체/배열 의존성의 참조 동일성입니다.',
    hints: ['JavaScript에서 {} === {}는 false입니다. 객체는 참조로 비교됩니다'],
    deepDive:
      '실제 무한 루프가 자주 발생하는 패턴:\n```typescript\n// ❌ 매 렌더마다 새 객체 생성 → 무한 루프\nuseEffect(() => {\n  fetchUsers({ role: \'all\' }) // 매번 새 객체\n}, [{ role: \'all\' }])\n\n// ✅ 원시값으로 분리\nuseEffect(() => {\n  fetchUsers({ role })\n}, [role]) // 문자열은 값 비교\n\n// ✅ useMemo로 안정화\nconst stableFilters = useMemo(() => ({ role, active }), [role, active])\nuseEffect(() => {\n  fetchUsers(stableFilters)\n}, [stableFilters])\n```\n\nESLint의 exhaustive-deps 규칙을 켜두면 의존성 문제를 미리 잡을 수 있습니다.',
    relatedProblems: ['rw-q-001'],
  },
  {
    id: 'rw-q-008',
    category: 'realworld',
    subcategory: 'patterns',
    type: 'bug-find',
    difficulty: 'hard',
    title: '실전 Race Condition — 검색 자동완성',
    description: '사용자가 빠르게 타이핑할 때 오래된 결과가 최신 결과를 덮어씌우는 Race Condition이 발생합니다. 다음 코드의 문제는?',
    code: `function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query) { setResults([]); return }

    fetch(\`/api/search?q=\${query}\`)
      .then(r => r.json())
      .then(data => setResults(data)) // ← Race Condition 발생
  }, [query])

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {results.map(r => <div key={r.id}>{r.name}</div>)}
    </>
  )
}`,
    options: [
      'debounce 없이 매 입력마다 요청을 보내서 서버 부하가 생기지만 Race Condition은 발생하지 않는다',
      '"react" 입력 시 r→re→rea→reac→react 각 요청이 다른 시간에 완료되면 느린 이전 요청의 결과가 최신 결과를 덮어씌울 수 있다. AbortController로 이전 요청을 취소해야 한다',
      'fetch가 아닌 axios를 쓰면 해결된다',
      'useState 대신 useRef로 results를 관리하면 해결된다',
    ],
    correctAnswer: 1,
    explanation:
      '"r" 입력 → 요청A 시작, "re" 입력 → 요청B 시작. 네트워크 지연으로 요청B가 먼저 완료되면 "re" 결과가 표시되고, 이후 요청A가 완료되면 "r" 결과가 "re" 결과를 덮어씌웁니다. 사용자는 "re"를 입력했는데 "r" 결과가 보이는 버그입니다. 해결: useEffect cleanup에서 AbortController로 이전 요청 취소.',
    hints: ['비동기 요청은 발신 순서와 응답 도착 순서가 다를 수 있습니다'],
    deepDive:
      'AbortController로 Race Condition 해결:\n```typescript\nuseEffect(() => {\n  if (!query) { setResults([]); return }\n  \n  const controller = new AbortController()\n  \n  fetch(`/api/search?q=${query}`, { signal: controller.signal })\n    .then(r => r.json())\n    .then(data => setResults(data))\n    .catch(err => {\n      if (err.name !== \'AbortError\') console.error(err)\n      // AbortError는 정상 취소이므로 무시\n    })\n  \n  return () => controller.abort() // 새 query로 바뀌면 이전 요청 취소\n}, [query])\n```\n\n추가로 debounce(300ms)를 함께 사용하면 타이핑 중 불필요한 요청 자체를 줄일 수 있습니다.',
    relatedProblems: ['rw-q-007'],
  },
]
