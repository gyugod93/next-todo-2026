export interface DeepExample {
  label: string
  code: string
  note: string
}

export interface DeepTopic {
  id: string
  category: string
  emoji: string
  title: string
  subtitle: string
  scenario: string
  scenarioCode?: string
  whyItMatters: string
  concept: string
  examples: DeepExample[]
  decisionGuide: { condition: string; answer: string }[]
  question: string
  referenceAnswer: string
  keyPoints: string[]
  tags: string[]
}

export const deepTopics: DeepTopic[] = [
  {
    id: 'form-choice',
    category: '상태 관리',
    emoji: '📋',
    title: '폼, 뭘로 만들지?',
    subtitle: 'useRef vs useState vs useForm — 판단 기준 잡기',
    scenario: `기획서에 "로그인 폼"이 있다. 이메일 + 비밀번호 두 개 입력받고 제출하면 됨. 그냥 useState 두 개 쓰면 되지 않나? 근데 다음 페이지엔 "회원가입 폼"이 있고 필드가 8개다. 유효성 검사도 각각 다르고, 제출 후 초기화도 해야 한다. 이제 뭘 써야 하지?`,
    scenarioCode: `// 지금 이 코드처럼 짜고 있다면...
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [emailError, setEmailError] = useState('')
const [passwordError, setPasswordError] = useState('')
const [isLoading, setIsLoading] = useState(false)
// 필드 8개면 state 16개...?`,
    whyItMatters: `useState로 폼 만들면 필드가 늘어날수록 state가 폭발한다. 유효성 검사 로직도 직접 다 짜야 하고, 어느 필드가 touched됐는지 추적하려면 또 state가 필요하다. 반대로 단순한 검색창에 react-hook-form 붙이면 오버엔지니어링이다. 판단 기준이 없으면 매번 헷갈린다.`,
    concept: `폼 구현엔 3가지 선택지가 있다. useRef는 리렌더링 없이 값만 읽을 때, useState는 입력마다 UI가 바뀌어야 할 때, useForm은 유효성 검사가 있고 필드가 3개 이상일 때다. 결국 "이 폼이 얼마나 복잡한가"가 판단 기준이다.`,
    examples: [
      {
        label: '단순 폼 — useState로 충분',
        code: `// 검색창처럼 단순한 경우
function SearchBar() {
  const [query, setQuery] = useState('')

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="검색어 입력"
    />
  )
}`,
        note: '필드 1-2개, 유효성 검사 없음, 제출 없음 → useState가 제일 단순하고 맞다',
      },
      {
        label: '복잡한 폼 — useForm + zod',
        code: `// 회원가입처럼 필드 많고 유효성 검사 있는 경우
const schema = z.object({
  email: z.string().email('이메일 형식이 아닙니다'),
  password: z.string().min(8, '8자 이상 입력하세요'),
  name: z.string().min(1, '이름을 입력하세요'),
})

function SignUpForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data) => {
    // data는 이미 검증된 값
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register('password')} />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">가입하기</button>
    </form>
  )
}`,
        note: 'useForm이 에러 추적, 터치 여부, 제출 상태를 다 알아서 관리해준다',
      },
      {
        label: '실시간 미리보기가 있는 폼 — useForm + watch',
        code: `// biz-link처럼 폼 값이 바뀔 때마다 미리보기가 갱신되는 경우
function EditLinkPage() {
  const form = useForm({ defaultValues: { title: '', link: '' } })

  return (
    <div className="flex gap-4">
      {/* 왼쪽: 미리보기 — form.watch()로 실시간 반영 */}
      <PhoneMockUp>
        <LinkBlock attributes={form.watch()} />
      </PhoneMockUp>

      {/* 오른쪽: 폼 */}
      <LinkForm form={form} />
    </div>
  )
}`,
        note: 'form.watch()로 입력값을 구독하면 useState 없이도 실시간 미리보기 가능',
      },
    ],
    decisionGuide: [
      { condition: '필드 1-2개, 유효성 검사 없음', answer: 'useState' },
      { condition: '제출 없이 값만 읽으면 됨 (포커스, 스크롤 등)', answer: 'useRef' },
      { condition: '필드 3개 이상 또는 유효성 검사 필요', answer: 'useForm + zod' },
      { condition: '제출 후 초기화, 에러 메시지, touched 추적 필요', answer: 'useForm + zod' },
      { condition: '폼 값이 바뀔 때마다 다른 UI가 반응해야 함', answer: 'useForm + watch()' },
    ],
    question: `로그인 폼(이메일 + 비밀번호)은 useState로 구현했는데, 이번엔 회원가입 폼(이름, 이메일, 비밀번호, 비밀번호 확인, 전화번호)을 만들어야 한다. 각 필드마다 유효성 검사가 있고 제출 후 초기화도 필요하다. useState 그대로 쓸 것인가, useForm으로 바꿀 것인가? 이유와 함께 설명해봐.`,
    referenceAnswer: `회원가입 폼은 useForm + zod로 구현해야 한다.

이유:
1. 필드가 5개 → useState 5개 + 에러 state 5개 = 최소 10개 state 필요. useForm은 register()만 붙이면 됨
2. 각 필드마다 유효성 검사 → zod schema로 한 곳에서 선언적으로 관리 가능
3. 비밀번호 확인 같은 cross-field 검사도 zod superRefine으로 처리 가능
4. 제출 후 초기화는 reset() 한 번이면 됨
5. 어떤 필드가 에러인지, 터치됐는지 formState가 다 추적해줌

로그인 폼처럼 단순한 건 useState가 맞지만, 복잡도가 올라가는 순간 useForm이 훨씬 낫다.`,
    keyPoints: [
      '폼 복잡도가 판단 기준이다',
      'useForm은 에러·터치·제출 상태를 자동 추적한다',
      'zod schema는 유효성 검사를 한 곳에서 선언적으로 관리한다',
      'form.watch()로 실시간 구독이 가능하다',
    ],
    tags: ['React', '폼', 'useState', 'useForm', 'zod'],
  },
  {
    id: 'data-fetching',
    category: '데이터 통신',
    emoji: '🔄',
    title: '서버 데이터, 어떻게 가져오지?',
    subtitle: 'fetch vs SWR vs TanStack Query — 뭘 언제 쓰나',
    scenario: `유저 목록 페이지를 만든다. "그냥 useEffect 안에서 fetch 쓰면 되지 않나?" 했다가, 로딩 상태도 따로 관리해야 하고, 에러 처리도 해야 하고, 다른 탭 갔다 오면 데이터가 오래됐는데 어떻게 갱신하지? 페이지네이션까지 붙으면 쿼리 파라미터 바뀔 때마다 다시 fetch해야 하고... 결국 코드가 복잡해진다.`,
    scenarioCode: `// 이렇게 시작했다가...
const [users, setUsers] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  setLoading(true)
  fetch('/api/users')
    .then(r => r.json())
    .then(data => { setUsers(data); setLoading(false) })
    .catch(e => { setError(e); setLoading(false) })
}, [])
// 페이지 바뀔 때마다 다시? 캐시는? 갱신은?`,
    whyItMatters: `서버 데이터는 "언제 오래됐는지", "언제 다시 가져올지", "여러 컴포넌트에서 같은 데이터 쓸 때 중복 요청 막기" 같은 문제가 항상 따라온다. useEffect + useState로 직접 관리하면 이걸 다 직접 구현해야 한다. SWR이나 TanStack Query는 이 문제들을 이미 해결해놓은 도구다.`,
    concept: `SWR과 TanStack Query는 둘 다 "서버 상태 관리" 라이브러리다. 자동 캐싱, 포커스 시 갱신, 중복 요청 제거를 해준다. SWR은 더 단순하고 Next.js 팀이 만들었다. TanStack Query는 기능이 더 풍부하고 (mutation, optimistic update, infinite scroll 등) 대형 앱에 잘 맞는다.`,
    examples: [
      {
        label: 'SWR — 단순 데이터 조회',
        code: `import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

function UserList() {
  const { data, error, isLoading } = useSWR('/api/users', fetcher)

  if (isLoading) return <Spinner />
  if (error) return <p>에러 발생</p>

  return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}

// 같은 key('/api/users')로 여러 컴포넌트에서 써도 요청은 한 번만`,
        note: '로딩/에러/데이터 자동 관리, 탭 포커스 시 자동 갱신',
      },
      {
        label: 'TanStack Query — mutation까지 있는 경우',
        code: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function UserList() {
  const queryClient = useQueryClient()

  // 조회
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
  })

  // 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(\`/api/users/\${id}\`, { method: 'DELETE' }),
    onSuccess: () => {
      // 삭제 성공 후 목록 자동 갱신
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return (
    <ul>
      {data?.map(u => (
        <li key={u.id}>
          {u.name}
          <button onClick={() => deleteMutation.mutate(u.id)}>삭제</button>
        </li>
      ))}
    </ul>
  )
}`,
        note: 'mutation 후 자동 refetch, optimistic update도 가능',
      },
      {
        label: '페이지네이션 — queryKey에 파라미터 포함',
        code: `// business-admin처럼 검색 파라미터가 있는 목록
function useMembers() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') ?? '1'
  const name = searchParams.get('name')

  // queryKey에 파라미터 넣으면 파라미터 바뀔 때 자동 refetch
  return useQuery({
    queryKey: ['members', { page, name }],
    queryFn: () => api.get(\`/members?page=\${page}&name=\${name}\`),
    placeholderData: keepPreviousData, // 페이지 전환 시 이전 데이터 유지
  })
}`,
        note: 'queryKey가 바뀌면 자동으로 새 데이터 요청 — useEffect 의존성 배열 직접 관리 불필요',
      },
    ],
    decisionGuide: [
      { condition: '그냥 컴포넌트 한 곳에서만 데이터 쓰고 단순한 경우', answer: 'useEffect + fetch도 무방' },
      { condition: '여러 컴포넌트에서 같은 데이터 공유, 자동 캐싱 필요', answer: 'SWR' },
      { condition: '데이터 조회 + 생성/수정/삭제 mutation 함께 필요', answer: 'TanStack Query' },
      { condition: '무한 스크롤, optimistic update, 복잡한 캐시 제어 필요', answer: 'TanStack Query' },
      { condition: 'Next.js App Router에서 서버 컴포넌트로 처리 가능한 경우', answer: 'fetch() in Server Component (라이브러리 불필요)' },
    ],
    question: `어드민 페이지에서 유저 목록을 보여주고, 각 유저를 삭제하는 기능도 있다. 삭제하면 목록이 즉시 갱신돼야 한다. 검색 필터(이름, 이메일)도 있어서 필터 바뀌면 새로 요청해야 한다. 지금 useEffect + useState로 짜고 있는데 뭘 쓰는 게 맞고 왜 그런가?`,
    referenceAnswer: `TanStack Query를 쓰는 게 맞다.

이유:
1. 삭제 후 목록 갱신 → useMutation + invalidateQueries로 자동 처리. 직접 setState로 갱신하면 실제 DB 상태와 안 맞을 수 있음
2. 검색 필터 → queryKey에 필터 값 포함하면 필터 바뀔 때 자동으로 새 요청. useEffect 의존성 배열 관리 불필요
3. 페이지 이동 후 돌아왔을 때 데이터 오래됐으면 자동 refetch
4. 같은 데이터를 여러 컴포넌트에서 쓸 때 중복 요청 없음

useEffect + useState로 이걸 다 구현하려면 코드가 훨씬 복잡해지고, 엣지 케이스(경쟁 조건, 언마운트 후 setState 등) 처리도 직접 해야 한다.`,
    keyPoints: [
      'queryKey가 캐시의 키다 — 파라미터 포함하면 자동 refetch',
      'mutation 후 invalidateQueries로 관련 데이터 자동 갱신',
      'SWR은 단순 조회, TanStack Query는 mutation까지 필요할 때',
      'Next.js App Router에서 Server Component로 fetch하면 라이브러리 불필요',
    ],
    tags: ['React', '데이터 통신', 'SWR', 'TanStack Query', 'useEffect'],
  },
  {
    id: 'zustand-when',
    category: '상태 관리',
    emoji: '🗂️',
    title: 'zustand, 언제 쓰는 건데?',
    subtitle: '전역 상태가 필요한 순간 vs 필요 없는 순간',
    scenario: `"상태 관리 할 줄 아세요?" → "네, zustand 써봤어요" 라고 했다. 근데 실제로 보면 모든 걸 zustand에 때려 넣거나, zustand가 필요한 상황인데 props로 계속 내려주고 있다. zustand가 정확히 어느 순간에 필요한 건지 모른다.`,
    scenarioCode: `// 이렇게 모든 걸 zustand에 넣고 있다면?
const useStore = create((set) => ({
  users: [],           // ← 서버 데이터를 zustand에?
  currentPage: 1,      // ← URL에 있어야 할 값을?
  isModalOpen: false,  // ← 이건 맞음
  userInput: '',       // ← 로컬 폼 값을?
  setUsers: (users) => set({ users }),
}))`,
    whyItMatters: `zustand에 서버 데이터를 넣으면 "캐시 무효화"를 직접 관리해야 한다. API 응답이 바뀌었는데 zustand 값이 오래된 채로 남아있는 버그가 생긴다. 반대로 zustand가 진짜 필요한 상황 — 여러 컴포넌트가 공유하는 UI 상태 — 을 props drilling으로 해결하려다 코드가 복잡해지기도 한다.`,
    concept: `상태에는 두 종류가 있다. 클라이언트 상태(모달 열림/닫힘, 선택된 탭, 알림 등)와 서버 상태(API에서 가져온 유저 목록, 게시글 등). zustand는 클라이언트 상태 관리 도구다. 서버 상태는 TanStack Query나 SWR에게 맡기는 게 맞다.`,
    examples: [
      {
        label: 'zustand 제대로 쓰는 경우 — 전역 UI 상태',
        code: `// ✅ 이런 게 zustand에 맞다
// 어느 컴포넌트에서든 열고 닫을 수 있는 Alert
const useAlert = create<AlertState>((set) => ({
  isOpen: false,
  message: '',
  open: (message: string) => set({ isOpen: true, message }),
  close: () => set({ isOpen: false }),
}))

// 깊은 컴포넌트에서 바로 호출 가능
function SomeDeepComponent() {
  const { open } = useAlert()
  return <button onClick={() => open('삭제됐습니다')}>삭제</button>
}

// 최상위에서 렌더링
function AlertModal() {
  const { isOpen, message, close } = useAlert()
  if (!isOpen) return null
  return <Modal onClose={close}>{message}</Modal>
}`,
        note: 'props 없이 어디서든 접근 가능 — 이게 zustand를 쓰는 이유',
      },
      {
        label: '서버 데이터는 zustand에 넣지 않는다',
        code: `// ❌ 이렇게 하면 캐시 동기화 문제 생김
const useStore = create((set) => ({
  users: [],
  fetchUsers: async () => {
    const data = await api.get('/users')
    set({ users: data }) // 언제 오래되는지 알 수 없음
  },
}))

// ✅ 서버 데이터는 TanStack Query에게
function UserList() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users'),
  })
  // 자동 캐싱, 자동 갱신, stale 시간 설정 가능
}`,
        note: 'API 데이터를 zustand에 저장하면 "언제 다시 가져올지"를 직접 관리해야 함',
      },
      {
        label: '전역 vs 로컬 — 판단 기준',
        code: `// 이 상태가 필요한 컴포넌트가 어디에 있나?

// 1. 같은 부모 안에 있다면 → props로 충분
function Parent() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setIsOpen(true)} />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

// 2. 컴포넌트 트리 상관없이 어디서든 필요 → zustand
// ex) 토스트, 글로벌 로더, 장바구니, 로그인 사용자 정보`,
        note: '상태를 필요로 하는 컴포넌트들이 멀리 떨어져 있을 때 zustand가 맞다',
      },
    ],
    decisionGuide: [
      { condition: '같은 부모 안 컴포넌트들이 공유하는 상태', answer: 'useState + props' },
      { condition: '트리 깊은 곳에서 props drilling이 3단계 이상', answer: 'zustand 고려 또는 Context' },
      { condition: '어느 컴포넌트에서든 열고 닫아야 하는 모달, 토스트, 로더', answer: 'zustand' },
      { condition: 'API에서 가져온 데이터', answer: 'TanStack Query 또는 SWR (zustand 아님)' },
      { condition: '로그인한 유저 정보 (앱 전체에서 필요)', answer: 'zustand 또는 NextAuth session' },
    ],
    question: `어드민 앱에서 어떤 버튼을 눌러도 "정말 삭제하시겠습니까?" Confirm 모달이 뜨게 하고 싶다. 이 모달은 페이지가 달라도 어느 컴포넌트에서든 열 수 있어야 한다. 어떻게 구현할 것인가? zustand를 쓰는 것이 맞는가?`,
    referenceAnswer: `zustand가 맞다.

이유:
Confirm 모달은 전역 UI 상태다. 어느 페이지, 어느 컴포넌트에서든 열 수 있어야 하기 때문에 props로 내려주는 방식은 불가능에 가깝다.

구현 방법:
1. zustand store에 isOpen, message, onConfirm 등 저장
2. 어느 컴포넌트에서든 open() 호출
3. 앱 최상위(layout.tsx 등)에서 Confirm 컴포넌트 한 번만 렌더링

이미 business-admin-nextjs의 useConfirm.ts가 이 패턴으로 구현되어 있다.

서버 데이터(유저 목록, 삭제 결과 등)는 zustand가 아니라 TanStack Query의 mutation + invalidateQueries로 처리하는 것이 맞다.`,
    keyPoints: [
      '클라이언트 상태(UI)와 서버 상태(API 데이터)를 구분해라',
      'zustand는 전역 UI 상태 — 어디서든 접근해야 할 때',
      '서버 데이터를 zustand에 넣으면 캐시 동기화를 직접 관리해야 한다',
      'props drilling이 3단계 이상이면 zustand 또는 Context를 고려해라',
    ],
    tags: ['React', '상태 관리', 'zustand', 'TanStack Query'],
  },
  {
    id: 'layout-choice',
    category: 'CSS 레이아웃',
    emoji: '📐',
    title: 'flex 쓸까, grid 쓸까?',
    subtitle: '레이아웃 잡을 때 뭘 먼저 생각해야 하나',
    scenario: `기획서에 카드 목록이 있다. 한 줄에 3개, 반응형으로 모바일에선 1개. 그냥 flex로 짰는데 카드 너비 계산이 애매하고, 줄 바뀔 때 마지막 줄 카드가 왼쪽으로 몰린다. "flex로 하면 되지 않나?" 했는데 뭔가 어색하다. grid를 써야 했나?`,
    scenarioCode: `/* flex로 그리드처럼 만들려다 생기는 문제 */
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.card {
  width: calc(33.333% - 11px); /* 이 계산이 맞나? */
}
/* 마지막 줄에 카드가 1개면 꽉 찬 너비로 늘어나거나
   왼쪽으로 쏠리는 현상 발생 */`,
    whyItMatters: `flex는 1차원(가로 또는 세로 한 방향)을 잘 다룬다. 카드 목록처럼 가로 세로 모두 맞춰야 하는 2차원 레이아웃은 grid가 훨씬 자연스럽다. 반대로 버튼 나열, 헤더 좌우 배치 같은 건 flex가 맞다. 둘의 차이를 모르면 항상 한 쪽만 쓰다가 어색한 UI가 나온다.`,
    concept: `flex는 "아이템들을 한 줄에 어떻게 배치할까" 를 다룬다. grid는 "행과 열로 구성된 레이아웃에 아이템을 어떻게 배치할까"를 다룬다. flex는 1차원, grid는 2차원이라고 기억하면 쉽다. 실무에서는 둘을 함께 쓴다 — 전체 레이아웃은 grid, 컴포넌트 내부는 flex.`,
    examples: [
      {
        label: 'flex가 맞는 경우 — 1차원 배치',
        code: `/* ✅ 헤더 좌우 배치 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ✅ 버튼 그룹 */
.button-group {
  display: flex;
  gap: 8px;
}

/* ✅ 카드 내부 콘텐츠 배치 */
.card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}`,
        note: '한 방향으로 나열하거나, 한 줄 안에서 정렬할 때는 flex',
      },
      {
        label: 'grid가 맞는 경우 — 2차원 레이아웃',
        code: `/* ✅ 카드 목록 — 한 줄에 3개, 모바일 1개 */
.card-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .card-list {
    grid-template-columns: 1fr;
  }
}
/* 마지막 줄 카드도 자동으로 같은 너비 유지 */

/* ✅ Tailwind로 */
<div className="grid grid-cols-3 gap-4 md:grid-cols-1">`,
        note: 'grid는 마지막 줄 정렬 문제가 없고, 너비 계산도 fr로 자동',
      },
      {
        label: '실무에서 함께 쓰는 패턴',
        code: `/* 전체 페이지 레이아웃 — grid */
.page-layout {
  display: grid;
  grid-template-columns: 240px 1fr; /* 사이드바 + 콘텐츠 */
  grid-template-rows: 60px 1fr;     /* 헤더 + 본문 */
  min-height: 100vh;
}

/* 헤더 내부 — flex */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

/* 카드 목록 — grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
/* auto-fill + minmax: 공간 있으면 자동으로 컬럼 추가 */`,
        note: 'auto-fill + minmax는 반응형을 미디어쿼리 없이 처리하는 강력한 패턴',
      },
    ],
    decisionGuide: [
      { condition: '한 방향(가로 or 세로)으로 나열', answer: 'flex' },
      { condition: '아이템 간격, 정렬, 순서 조절', answer: 'flex' },
      { condition: '행과 열 모두 맞춰야 하는 카드 목록, 갤러리', answer: 'grid' },
      { condition: '전체 페이지 구조 (사이드바 + 콘텐츠)', answer: 'grid' },
      { condition: '반응형으로 컬럼 수가 바뀌는 레이아웃', answer: 'grid (auto-fill + minmax)' },
    ],
    question: `대시보드 페이지를 만든다. 상단에 4개의 통계 카드(너비 동일, 한 줄), 하단에 차트 2개(좌측 2/3, 우측 1/3 너비)가 있다. 지금 전부 flex로 짜고 있는데 이게 맞는가? flex와 grid 중 어디에 어떤 걸 쓸지 구조를 설명해봐.`,
    referenceAnswer: `전체 레이아웃은 grid, 개별 컴포넌트 내부는 flex를 쓰는 게 맞다.

상단 통계 카드 4개:
- grid-template-columns: repeat(4, 1fr) → 동일한 너비 자동
- flex로 하면 너비 계산을 직접 해야 하고, gap 포함 계산이 복잡

하단 차트 2개 (2/3 + 1/3):
- grid-template-columns: 2fr 1fr → 비율로 선언 가능
- flex로 하면 flex-basis나 퍼센트 계산 필요

각 카드/차트 내부:
- 콘텐츠 배치(제목, 숫자, 아이콘 등)는 flex가 적합

전체 구조:
페이지 레이아웃(grid) > 섹션들 > 카드 내부(flex)
이렇게 grid와 flex를 레이어별로 나눠서 쓰는 게 실무 패턴이다.`,
    keyPoints: [
      'flex는 1차원(한 방향), grid는 2차원(행+열)',
      '카드 목록, 갤러리, 대시보드 레이아웃 → grid',
      '버튼 나열, 헤더 배치, 컴포넌트 내부 → flex',
      'auto-fill + minmax로 반응형을 미디어쿼리 없이 처리 가능',
    ],
    tags: ['CSS', '레이아웃', 'flex', 'grid', 'Tailwind'],
  },
  {
    id: 'server-vs-client',
    category: 'Next.js',
    emoji: '⚡',
    title: 'Server Component야, Client Component야?',
    subtitle: 'use client 언제 붙이는지 모르면 Next.js 앱 라우터를 모르는 것',
    scenario: `Next.js 13+ App Router로 프로젝트 만들고 있는데, 어떤 파일엔 "use client" 붙이고 어떤 건 안 붙이고. 그냥 useState 쓰면 에러 나니까 "use client" 붙이는 식으로 하다 보면 결국 모든 파일에 붙이게 된다. 근데 그러면 뭘 위해 App Router 쓰는 건지 모르겠다.`,
    scenarioCode: `// 이렇게 되어가고 있다면...
'use client' // 일단 붙이고 보는 중
import { useState } from 'react'

// 사실 이 컴포넌트는 서버에서 돌아도 되는데
export default function UserProfile({ userId }: { userId: string }) {
  // DB에서 유저 가져와서 보여주는 것뿐인데
  // useState도 없고 이벤트도 없음
}`,
    whyItMatters: `"use client" 를 아무 데나 붙이면 서버 컴포넌트의 장점이 사라진다. 서버 컴포넌트는 번들 크기에 포함 안 되고, 직접 DB 접근이 가능하고, 자동으로 캐싱된다. 이걸 모르고 다 클라이언트로 만들면 Next.js 쓰는 이유가 없다.`,
    concept: `서버 컴포넌트는 서버에서 렌더링되고 HTML만 클라이언트로 내려온다. DB 직접 접근, 비동기 데이터 fetch, 번들 크기 0. 클라이언트 컴포넌트는 브라우저에서 실행되어 상호작용이 가능하다. 판단 기준: "이 컴포넌트가 클릭, 입력, 상태 변화에 반응해야 하는가?" — Yes면 Client, No면 Server.`,
    examples: [
      {
        label: '서버 컴포넌트 — 데이터 가져와서 보여주기만 할 때',
        code: `// app/users/page.tsx — "use client" 없음
// 서버에서 실행, DB 직접 접근 가능
import { prisma } from '@/lib/prisma'

export default async function UsersPage() {
  // await 바로 사용 가능 (async 컴포넌트)
  const users = await prisma.user.findMany()

  return (
    <ul>
      {users.map(u => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  )
}
// 클라이언트 JS 번들에 포함 안 됨
// 유저 목록은 HTML로 내려옴`,
        note: '데이터 fetch + 렌더링만 하는 경우 — 서버 컴포넌트. useState, useEffect 불필요',
      },
      {
        label: '클라이언트 컴포넌트 — 상호작용이 필요할 때',
        code: `'use client' // 브라우저에서 실행됨

import { useState } from 'react'

// 버튼 클릭, 입력, 상태 변화가 있을 때
export default function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)

  const handleLike = async () => {
    setLiked(!liked)
    setCount(c => liked ? c - 1 : c + 1)
    await fetch(\`/api/posts/\${postId}/like\`, { method: 'POST' })
  }

  return (
    <button onClick={handleLike}>
      {liked ? '❤️' : '🤍'} {count}
    </button>
  )
}`,
        note: 'onClick, useState, useEffect — 이 셋 중 하나라도 있으면 "use client"',
      },
      {
        label: '패턴 — 서버 컴포넌트 안에 클라이언트 컴포넌트',
        code: `// app/posts/[id]/page.tsx — 서버 컴포넌트
import { prisma } from '@/lib/prisma'
import LikeButton from './_components/LikeButton' // 클라이언트 컴포넌트

export default async function PostPage({ params }: { params: { id: string } }) {
  // 서버에서 DB 조회
  const post = await prisma.post.findUnique({ where: { id: params.id } })

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>

      {/* 상호작용이 필요한 부분만 클라이언트로 */}
      <LikeButton postId={post.id} initialCount={post.likeCount} />
    </article>
  )
}

// ✅ 핵심 패턴:
// 서버 컴포넌트(데이터 fetch) → 클라이언트 컴포넌트(상호작용)에 props로 전달
// 클라이언트 컴포넌트를 "가능한 한 leaf(말단)"에 배치`,
        note: '"use client" 경계를 최대한 아래로 내려라 — 상호작용이 필요한 최소 단위에만',
      },
    ],
    decisionGuide: [
      { condition: 'useState, useEffect, useRef 사용', answer: 'Client Component ("use client")' },
      { condition: 'onClick, onChange 같은 이벤트 핸들러 사용', answer: 'Client Component' },
      { condition: 'DB 직접 접근, 서버 API 호출, 비밀키 사용', answer: 'Server Component' },
      { condition: '데이터 가져와서 렌더링만 함', answer: 'Server Component (async 컴포넌트)' },
      { condition: 'Navbar처럼 로그인 상태 표시가 필요한 경우', answer: 'Client Component (session 읽기 필요)' },
    ],
    question: `상품 상세 페이지를 만든다. 상품 정보(이름, 가격, 설명)는 DB에서 가져오고, "장바구니 담기" 버튼을 누르면 장바구니에 추가된다. 이 페이지를 어떻게 Server/Client Component로 나눌 것인지, 그 이유와 함께 설명해봐.`,
    referenceAnswer: `페이지 자체는 Server Component, 장바구니 버튼만 Client Component로 분리한다.

구조:
- app/products/[id]/page.tsx (Server Component): DB에서 상품 정보 fetch, 렌더링
- _components/AddToCartButton.tsx (Client Component, "use client"): 클릭 이벤트, 장바구니 상태 관리

이유:
1. 상품 정보는 DB에서 가져오기만 하면 되므로 Server Component. 클라이언트 번들에 포함 안 됨
2. 장바구니 버튼은 onClick + 상태 변화가 필요하므로 Client Component
3. "use client" 경계를 최대한 작은 단위(버튼)로 내려야 Server Component의 장점을 최대한 살릴 수 있음

잘못된 방법: 페이지 전체에 "use client" 붙이기 → DB 직접 접근 불가, 번들 크기 증가`,
    keyPoints: [
      '"use client"는 필요한 최소 단위에만 붙여라',
      'useState/useEffect/이벤트 핸들러 → Client Component',
      'DB 접근, 비동기 fetch → Server Component (async 컴포넌트)',
      '서버 컴포넌트 안에 클라이언트 컴포넌트를 넣을 수 있다',
    ],
    tags: ['Next.js', 'App Router', 'Server Component', 'Client Component'],
  },
  {
    id: 'position-css',
    category: 'CSS 레이아웃',
    emoji: '📍',
    title: 'position, 제대로 알고 쓰나?',
    subtitle: 'relative / absolute / fixed / sticky — 뭐가 뭔지 헷갈릴 때',
    scenario: `툴팁을 버튼 아래에 붙이고 싶다. position: absolute 줬더니 화면 엉뚱한 데 가 있다. fixed 줬더니 스크롤해도 따라다닌다. relative를 부모에 줘야 한다는 건 알겠는데 왜인지 모르겠다. 매번 이것저것 써보면서 우연히 맞추는 중이다.`,
    scenarioCode: `/* 버튼 아래 툴팁 — 왜 안 되지? */
.tooltip {
  position: absolute;
  top: 100%;  /* 부모 기준인지 뷰포트 기준인지 모르겠음 */
  left: 0;
  /* 부모에 position: relative가 없으면
     가장 가까운 positioned 조상을 기준으로 함 */
}`,
    whyItMatters: `position을 모르면 모달, 드롭다운, 툴팁, sticky 헤더, 배지 같은 UI를 만들 때마다 막힌다. CSS 레이아웃의 절반이 position 이해에서 온다. "기준점이 어디인가"를 이해하면 모든 게 풀린다.`,
    concept: `position의 핵심은 "기준점"이다. static(기본)은 normal flow. relative는 자기 자신이 기준, 공간은 유지. absolute는 가장 가까운 positioned(static 아닌) 조상이 기준, 공간 사라짐. fixed는 뷰포트(화면) 기준, 스크롤해도 고정. sticky는 스크롤 전엔 relative처럼, 임계점 지나면 fixed처럼.`,
    examples: [
      {
        label: 'absolute — 부모 기준으로 정확히 위치 잡기',
        code: `/* 버튼 오른쪽 위에 뱃지 */
.button-wrapper {
  position: relative; /* ← 이게 없으면 뱃지가 엉뚱한 데 감 */
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  /* button-wrapper 기준으로 위치 */
}

/* Tailwind */
<div className="relative">
  <button>알림</button>
  <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-4 h-4 text-xs">3</span>
</div>`,
        note: 'absolute는 항상 가장 가까운 relative/absolute/fixed 조상을 찾는다',
      },
      {
        label: 'fixed — 스크롤해도 고정',
        code: `/* Navbar, 모달 오버레이, 플로팅 버튼 */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50; /* 다른 요소 위에 */
}

/* 주의: fixed 요소는 normal flow에서 빠져나옴
   → 아래 콘텐츠가 navbar 뒤로 숨음
   → body에 padding-top 줘야 함 */
body {
  padding-top: 60px; /* navbar 높이만큼 */
}

/* Tailwind */
<nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-white">`,
        note: 'fixed는 뷰포트 기준 — 부모가 어디 있든 상관없음. z-index 필수',
      },
      {
        label: 'sticky — 스크롤하다가 특정 위치에 고정',
        code: `/* 테이블 헤더, 섹션 타이틀이 스크롤하면 상단에 붙는 경우 */
.table-header {
  position: sticky;
  top: 0; /* 뷰포트 상단에서 0px 지점에 달라붙음 */
  background: white;
  z-index: 10;
}

/* 주의: 부모에 overflow: hidden 있으면 sticky 작동 안 함 */
/* 주의: top/bottom/left/right 값 반드시 지정해야 함 */

/* Tailwind */
<thead className="sticky top-0 bg-white z-10">
  <tr>...</tr>
</thead>`,
        note: 'sticky는 부모 요소 안에서만 고정됨 — 부모 영역 벗어나면 함께 사라짐',
      },
      {
        label: '드롭다운 / 툴팁 패턴',
        code: `/* 가장 흔한 패턴: 트리거 기준으로 열리는 메뉴 */
function Dropdown() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative"> {/* ← 기준점 */}
      <button onClick={() => setOpen(!open)}>메뉴</button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded shadow-lg z-10">
          {/* top: 100%는 부모 높이만큼 아래 */}
          <a href="#">항목 1</a>
          <a href="#">항목 2</a>
        </div>
      )}
    </div>
  )
}`,
        note: 'relative + absolute 조합이 드롭다운, 툴팁의 기본 패턴',
      },
    ],
    decisionGuide: [
      { condition: '특별한 위치 지정 없이 흐름대로', answer: 'static (기본값, 명시 불필요)' },
      { condition: '자기 자신을 약간 이동 (공간 유지)', answer: 'relative + top/left' },
      { condition: '부모 기준으로 정확한 위치 (뱃지, 툴팁, 드롭다운)', answer: 'absolute (부모에 relative 필수)' },
      { condition: '스크롤해도 화면에 고정 (Navbar, 모달)', answer: 'fixed' },
      { condition: '스크롤하다가 상단에 달라붙음 (테이블 헤더, 섹션 타이틀)', answer: 'sticky + top 값' },
    ],
    question: `상품 목록 페이지에서 각 상품 카드 오른쪽 상단에 "NEW" 뱃지가 있고, 스크롤해도 상단 필터 바가 고정되어 있고, 우측 하단에 "맨 위로" 플로팅 버튼이 있다. 세 가지 각각 어떤 position을 쓸 것인지 이유와 함께 설명해봐.`,
    referenceAnswer: `1. "NEW" 뱃지 → position: absolute
카드 기준 오른쪽 상단에 위치해야 하므로 absolute. 카드 wrapper에 position: relative 필수. top: -8px; right: -8px 정도로 잡음.

2. 상단 필터 바 → position: sticky + top: 0
스크롤 전엔 원래 위치에 있다가, 스크롤해서 뷰포트 상단에 닿으면 고정. fixed와 달리 부모 영역 안에서만 동작하고 normal flow를 유지해 아래 콘텐츠가 겹치지 않음.

3. "맨 위로" 플로팅 버튼 → position: fixed
뷰포트 기준 우측 하단에 항상 고정. 스크롤 위치와 무관하게 항상 같은 자리에 있어야 하므로 fixed. z-index 필요.`,
    keyPoints: [
      'absolute의 기준점은 가장 가까운 positioned(static 아닌) 조상',
      'absolute 쓸 때 부모에 relative 안 주면 엉뚱한 데 간다',
      'fixed는 뷰포트 기준, sticky는 부모 안에서만 고정',
      'sticky는 부모에 overflow: hidden 있으면 작동 안 한다',
    ],
    tags: ['CSS', 'position', 'absolute', 'fixed', 'sticky'],
  },
  {
    id: 'component-split',
    category: 'React 설계',
    emoji: '🧩',
    title: '컴포넌트, 언제 쪼개야 해?',
    subtitle: '분리 기준 없이 쪼개다 보면 오히려 더 복잡해진다',
    scenario: `"컴포넌트 분리를 잘 해야 한다"는 말은 들었다. 그래서 뭐든 100줄 넘으면 쪼개고, 비슷하게 생기면 합치고, props 많으면 또 쪼개고... 결과적으로 파일이 엄청 많아졌는데 오히려 코드 파악이 더 힘들다. 반대로 한 파일에 500줄 때려 넣어서 스크롤이 끝없이 내려가는 경우도 있다. 기준이 없다.`,
    scenarioCode: `// 너무 잘게 쪼갠 경우
<UserCard>
  <UserCardHeader>
    <UserCardAvatar />
    <UserCardName />
    <UserCardBadge />
  </UserCardHeader>
  <UserCardBody>
    <UserCardEmail />
    <UserCardPhone />
  </UserCardBody>
  <UserCardFooter>
    <UserCardActions />
  </UserCardFooter>
</UserCard>
// 실제로 재사용되지도 않는데 이렇게까지 해야 하나?`,
    whyItMatters: `분리가 너무 많으면 props drilling이 생기고, 파일 간 이동이 많아져 파악이 어렵다. 분리가 너무 없으면 한 파일이 너무 커져 유지보수가 힘들다. 분리의 기준은 "코드 길이"가 아니라 "책임"과 "재사용"이다.`,
    concept: `컴포넌트를 쪼개는 이유는 두 가지다. 첫째, 재사용 — 다른 곳에서 같은 컴포넌트를 쓸 때. 둘째, 복잡도 — 한 컴포넌트가 너무 많은 일을 하고 있을 때. 이 두 가지 이유가 없다면 쪼개지 않는 게 맞다.`,
    examples: [
      {
        label: '쪼개야 하는 경우 1 — 재사용',
        code: `// 여러 곳에서 같은 형태의 카드를 씀
// → 컴포넌트로 분리

// components/UserCard.tsx
export function UserCard({ user }: { user: User }) {
  return (
    <div className="border rounded-xl p-4 flex gap-3">
      <img src={user.avatar} className="w-10 h-10 rounded-full" />
      <div>
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  )
}

// 유저 목록, 검색 결과, 팔로워 목록 — 세 곳에서 사용
// → 분리 이유가 명확`,
        note: '재사용이 없는데 쪼개는 건 복잡도만 높인다',
      },
      {
        label: '쪼개야 하는 경우 2 — 복잡도 분리',
        code: `// 하나의 페이지가 너무 많은 걸 하고 있을 때
// app/dashboard/page.tsx 가 500줄이 됐다면?

// 각 섹션이 독립적인 "책임"을 가질 때 분리
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      <StatsSection />    {/* 통계 카드 4개 */}
      <RecentOrders />   {/* 최근 주문 테이블 */}
      <UserActivity />   {/* 유저 활동 차트 */}
    </div>
  )
}

// 각 섹션은 자체 데이터 fetching + 렌더링 책임
// → 한 섹션 수정할 때 다른 섹션 건드릴 필요 없음`,
        note: '"이 컴포넌트를 수정할 이유가 두 가지 이상"이면 쪼갤 신호',
      },
      {
        label: '쪼개지 않는 게 나은 경우',
        code: `// 딱 한 곳에서만 쓰이고, 단순한 경우
// → 굳이 파일 분리 안 해도 됨

// app/login/page.tsx 안에 그냥 다 넣어도 충분
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="...">
      <h1>로그인</h1>
      <form>
        <input value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">로그인</button>
      </form>
    </div>
  )
}
// LoginForm을 별도 파일로 분리할 이유?
// 재사용 없음 + 복잡도 낮음 → 분리 불필요`,
        note: '분리 = 파일 증가 + 파악 비용 증가. 이유 없는 분리는 손해',
      },
    ],
    decisionGuide: [
      { condition: '다른 페이지/컴포넌트에서도 같은 UI를 씀', answer: '분리 (재사용)' },
      { condition: '한 컴포넌트가 데이터 fetch + 로직 + 렌더링을 다 함', answer: '분리 (책임 분리)' },
      { condition: '파일이 300줄 이상이고 스크롤이 많이 필요함', answer: '분리 검토 (섹션별로)' },
      { condition: '딱 한 곳에서만 쓰이고 로직이 단순함', answer: '분리 불필요' },
      { condition: '분리하면 props를 3단계 이상 내려줘야 함', answer: '분리보다 Context/zustand 고려' },
    ],
    question: `공지사항 목록 페이지를 만든다. 상단에 검색 폼(제목/날짜 필터), 중단에 공지 목록 테이블, 하단에 페이지네이션이 있다. 공지 목록 테이블은 다른 페이지에서 사용하지 않는다. 이 페이지를 어떻게 컴포넌트로 구성할 것인지 기준을 설명해봐.`,
    referenceAnswer: `세 영역의 분리 여부 판단:

1. 검색 폼 → 분리 권장
이유: 검색 로직(useState, 쿼리 파라미터 처리)이 독립적이고, 다른 목록 페이지에서도 유사한 검색 폼을 쓸 수 있음. NoticeSearchForm으로 분리.

2. 공지 목록 테이블 → 분리 검토
이유: 이 페이지에서만 쓰인다면 굳이 분리 안 해도 되지만, 테이블 컬럼/정렬/행 클릭 로직이 복잡하다면 NoticeTable로 분리.

3. 페이지네이션 → 분리 (재사용)
이유: 대부분의 목록 페이지에서 동일한 페이지네이션 UI를 쓸 가능성이 높음. Pagination 공통 컴포넌트로 분리.

기준 요약: 재사용되거나, 책임이 명확히 독립적이거나, 복잡도가 높은 경우에만 분리. 단순히 줄 수가 많다는 이유만으로는 분리하지 않는다.`,
    keyPoints: [
      '분리 이유는 "재사용" 또는 "책임 분리" 두 가지뿐',
      '재사용 없고 단순하면 한 파일에 두는 게 오히려 파악하기 쉽다',
      '"이 컴포넌트를 수정할 이유가 두 가지"이면 분리 신호',
      'props drilling이 3단계 이상이면 분리보다 Context/zustand가 낫다',
    ],
    tags: ['React', '컴포넌트 설계', '재사용', '책임 분리'],
  },
  {
    id: 'usememo-usecallback',
    category: 'React 최적화',
    emoji: '⚙️',
    title: 'useMemo, useCallback 언제 써?',
    subtitle: '최적화한다고 다 쓰면 오히려 느려진다',
    scenario: `"React 최적화 할 줄 아세요?" 물어보면 useMemo, useCallback 안다고 한다. 근데 실제로 언제 써야 하는지 모르고, 그냥 함수마다 useCallback, 계산마다 useMemo 붙이는 중이다. 사실 이러면 메모이제이션 비용이 오히려 더 들 수 있다.`,
    scenarioCode: `// 이렇게 하고 있다면 잘못된 것
const MyComponent = ({ items, onFilter }) => {
  // items가 바뀔 때만 필터링? 맞음. 근데...
  const filtered = useMemo(() => items.filter(i => i.active), [items])

  // 이건 진짜 필요한가?
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])

  // 단순 계산에 useMemo, 단순 함수에 useCallback — 오히려 비용
}`,
    whyItMatters: `useMemo와 useCallback은 "메모이제이션 비용"이 있다. 값을 캐시하는 공간을 차지하고, 의존성 비교 연산을 매 렌더마다 한다. 단순한 계산이나 함수에 붙이면 안 붙인 것보다 느리다. 진짜 필요한 상황이 따로 있다.`,
    concept: `useMemo는 "값 계산이 비싸고, 의존성이 바뀌지 않으면 이전 값을 재사용"할 때. useCallback은 "함수를 자식 컴포넌트에 props로 넘기는데, 부모 리렌더링마다 자식도 리렌더링되는 것을 막고 싶을 때". 둘 다 React.memo와 함께 써야 효과가 있다.`,
    examples: [
      {
        label: 'useMemo — 진짜 필요한 경우',
        code: `// ✅ 계산 비용이 높을 때 — 수천 개 데이터 필터링/정렬
function ProductList({ products, searchQuery, sortBy }) {
  const processedProducts = useMemo(() => {
    // 검색 + 정렬 — products 수천 개면 매 렌더마다 하기 아까움
    return products
      .filter(p => p.name.includes(searchQuery))
      .sort((a, b) => a[sortBy] > b[sortBy] ? 1 : -1)
  }, [products, searchQuery, sortBy])
  // products, searchQuery, sortBy 바뀔 때만 재계산

  return <ul>{processedProducts.map(p => <ProductCard key={p.id} product={p} />)}</ul>
}

// ❌ 이건 useMemo 불필요 — 단순 연산
const double = useMemo(() => count * 2, [count])
// 그냥 const double = count * 2 가 더 빠름`,
        note: 'MDN 기준: 1ms 이상 걸리는 계산에만 useMemo 가치 있음',
      },
      {
        label: 'useCallback — 진짜 필요한 경우',
        code: `// ✅ React.memo로 감싼 자식에 함수 넘길 때
const HeavyChildComponent = React.memo(({ onDelete }: { onDelete: () => void }) => {
  console.log('자식 렌더링') // 이게 자주 찍히면 문제
  return <button onClick={onDelete}>삭제</button>
})

function Parent() {
  const [count, setCount] = useState(0)

  // useCallback 없으면: 부모 리렌더 → onDelete 새 함수 생성
  // → React.memo도 새 props로 판단 → 자식도 리렌더
  const handleDelete = useCallback(() => {
    // 삭제 로직
  }, []) // 의존성 없으면 항상 같은 함수 참조

  return (
    <>
      <button onClick={() => setCount(c => c + 1)}>+{count}</button>
      <HeavyChildComponent onDelete={handleDelete} />
    </>
  )
}

// ❌ React.memo 없이 useCallback만 — 의미 없음
// 자식이 React.memo가 아니면 어차피 부모 리렌더 시 자식도 리렌더`,
        note: 'useCallback은 React.memo와 세트. 하나만 쓰면 효과 없음',
      },
      {
        label: '최적화 전 — 먼저 측정해라',
        code: `// React DevTools Profiler로 먼저 확인
// "어디서 시간이 오래 걸리나?" → 거기에만 최적화

// 최적화 순서:
// 1. 느린지 먼저 확인 (Profiler)
// 2. 느리다면 원인 파악 (불필요한 리렌더? 비싼 계산?)
// 3. 그때 useMemo/useCallback/React.memo 적용

// 대부분의 컴포넌트는 최적화 없어도 충분히 빠름
// 과도한 최적화 = 읽기 어려운 코드 + 오히려 느릴 수 있음`,
        note: '"Premature optimization is the root of all evil" — 먼저 측정, 그 다음 최적화',
      },
    ],
    decisionGuide: [
      { condition: '수천 개 데이터 필터링/정렬/변환 — 계산이 눈에 띄게 오래 걸림', answer: 'useMemo' },
      { condition: 'React.memo로 감싼 자식 컴포넌트에 함수 props 전달', answer: 'useCallback' },
      { condition: 'useEffect 의존성 배열에 객체/함수 포함 (무한 루프 방지)', answer: 'useMemo / useCallback' },
      { condition: '단순 사칙연산, 짧은 배열 처리', answer: '그냥 써라 (최적화 불필요)' },
      { condition: '자식이 React.memo가 아닌 일반 컴포넌트', answer: 'useCallback 의미 없음' },
    ],
    question: `1000개짜리 상품 목록을 검색어로 필터링하고 가격순으로 정렬해서 보여주는 컴포넌트가 있다. 검색어가 바뀔 때마다 렌더링이 느리다. useMemo, useCallback, React.memo 중 무엇을 어떻게 쓸 것인가?`,
    referenceAnswer: `필터링+정렬 결과에 useMemo를 적용한다.

useMemo:
const sortedProducts = useMemo(() => {
  return products
    .filter(p => p.name.includes(searchQuery))
    .sort((a, b) => a.price - b.price)
}, [products, searchQuery])

이유: 1000개 필터+정렬은 비싼 연산. 검색어가 안 바뀌면 재계산 불필요.

React.memo + useCallback:
각 상품 카드가 리렌더링되는 것이 문제라면, ProductCard를 React.memo로 감싸고, onAddToCart 같은 함수 props에 useCallback 적용.

주의사항:
- 먼저 React DevTools Profiler로 어디가 병목인지 확인
- 목록 필터링이 문제인지, 개별 카드 렌더링이 문제인지 파악 후 적용
- 1000개도 useMemo 없이 충분히 빠를 수 있음 — 측정 먼저`,
    keyPoints: [
      'useMemo는 비싼 계산에만, useCallback은 React.memo 자식에 함수 넘길 때',
      'React.memo 없이 useCallback만 쓰면 의미 없다',
      '최적화 전에 반드시 Profiler로 측정 먼저',
      '단순한 계산에 useMemo 붙이면 오히려 느려진다',
    ],
    tags: ['React', '최적화', 'useMemo', 'useCallback', 'React.memo'],
  },
  {
    id: 'mongodb-schema',
    category: 'DB 설계',
    emoji: '🗄️',
    title: 'MongoDB 스키마 — 묶을까, 나눌까?',
    subtitle: 'Embedding vs Referencing 판단 기준',
    scenario: `MongoDB로 설계할 때 항상 헷갈린다. 유저 문서 안에 주소를 넣을까(embed), 아니면 주소 컬렉션을 따로 만들까(reference)? 블로그 글에 댓글을 embed할까, 댓글 컬렉션 따로 만들까? 매번 감으로 정하는데 나중에 문제가 생긴다.`,
    scenarioCode: `// 어떻게 해야 할지 모르는 상황
// Option A: 유저 문서 안에 댓글을 embed?
{
  _id: "user123",
  name: "홍길동",
  comments: [
    { text: "좋아요", postId: "post1", createdAt: "..." },
    { text: "잘 봤어요", postId: "post2", createdAt: "..." },
    // 댓글이 1000개 되면...? 문서 크기 제한 16MB
  ]
}

// Option B: 댓글 컬렉션 따로?
// 그러면 댓글 조회할 때마다 join(populate) 해야 하나?`,
    whyItMatters: `잘못 설계하면 나중에 구조 바꾸기가 매우 어렵다. 무한정 늘어나는 데이터를 embed하면 MongoDB 문서 16MB 제한에 걸리거나 성능이 떨어진다. 반대로 항상 함께 쓰는 데이터를 분리하면 매번 populate(join) 해야 해서 쿼리가 복잡해진다.`,
    concept: `MongoDB의 핵심 설계 질문: "이 데이터를 어떤 단위로 조회하는가?". 항상 함께 조회하면 embed. 독립적으로 조회하거나 무한히 늘어나면 reference. RDBMS처럼 무조건 정규화하지 않아도 되는 게 MongoDB의 장점이다.`,
    examples: [
      {
        label: 'Embedding — 함께 조회하는 데이터',
        code: `// ✅ 유저 프로필 정보 — 유저 조회할 때 항상 함께 필요
{
  _id: ObjectId("..."),
  name: "홍길동",
  email: "hong@example.com",
  profile: {          // embed — 항상 유저와 함께 조회
    avatar: "https://...",
    bio: "안녕하세요",
    website: "https://..."
  },
  address: {          // embed — 개수 제한적 (1-2개)
    street: "서울시 강남구",
    zip: "06000"
  }
}

// 장점: 단일 쿼리로 모든 데이터 조회
const user = await User.findById(id)
// user.profile, user.address 바로 접근 가능 (populate 불필요)`,
        note: '항상 함께 조회, 개수가 제한적, 독립적으로 조회할 일 없음 → embed',
      },
      {
        label: 'Referencing — 독립적이거나 무한히 늘어나는 데이터',
        code: `// ✅ 주문(Order)은 유저와 별도로 조회되고 무한히 늘어남
// User 문서
{
  _id: ObjectId("user123"),
  name: "홍길동",
  // orders 배열 embed 금지 — 무한히 늘어남
}

// Order 컬렉션 (별도)
{
  _id: ObjectId("..."),
  userId: ObjectId("user123"),  // reference
  items: [...],
  totalPrice: 50000,
  createdAt: Date
}

// Mongoose로 populate
const userWithOrders = await User
  .findById(id)
  .populate('orders') // 필요할 때만

// 또는 주문만 별도 조회
const orders = await Order.find({ userId: id })`,
        note: '무한히 늘어나거나, 독립적으로 조회하거나, 여러 곳에서 참조되면 → reference',
      },
      {
        label: '실무 패턴 — 하이브리드',
        code: `// 게시글(Post)과 댓글(Comment) 설계
// 댓글 수가 많을 수 있고, 독립적으로 관리됨 → reference

// Post 문서
{
  _id: ObjectId("post1"),
  title: "제목",
  content: "내용",
  authorId: ObjectId("user123"),  // reference
  commentCount: 42,               // 댓글 수만 embed (카운트 표시용)
  tags: ["react", "nextjs"],      // 배열이지만 개수 제한적 → embed
}

// Comment 컬렉션 (별도)
{
  _id: ObjectId("..."),
  postId: ObjectId("post1"),    // reference
  authorId: ObjectId("user123"),
  text: "좋은 글이네요",
  createdAt: Date
}

// 게시글 목록: commentCount만 있으면 됨 (populate 불필요)
// 게시글 상세: Comment.find({ postId }) 로 별도 조회`,
        note: '자주 쓰는 집계(count)만 embed, 실제 데이터는 reference — 성능과 유연성 둘 다',
      },
    ],
    decisionGuide: [
      { condition: '항상 부모와 함께 조회됨 (프로필, 설정)', answer: 'Embedding' },
      { condition: '개수가 고정적이거나 적음 (주소 1-3개, 태그 몇 개)', answer: 'Embedding' },
      { condition: '무한히 늘어날 수 있음 (댓글, 주문, 로그)', answer: 'Referencing' },
      { condition: '독립적으로 조회/수정이 필요함', answer: 'Referencing' },
      { condition: '여러 문서에서 같은 데이터를 참조함 (카테고리, 태그)', answer: 'Referencing' },
    ],
    question: `SNS 앱을 MongoDB로 설계한다. 유저(User), 게시글(Post), 팔로우 관계(Follow), 좋아요(Like)가 있다. 각각을 어떻게 설계할 것인가? embed할 것인지 reference로 분리할 것인지 이유와 함께 설명해봐.`,
    referenceAnswer: `User: 프로필 정보는 embed, 팔로워/팔로잉 수는 embed(카운트만), 팔로우 관계는 별도 컬렉션

Post: 작성자 기본 정보(이름, 아바타)는 embed(조회 시 populate 줄이기), 좋아요 수는 embed, 실제 좋아요 데이터는 별도 컬렉션

Follow: 별도 컬렉션 { followerId, followingId, createdAt } — 무한히 늘어남

Like: 별도 컬렉션 { userId, postId, createdAt } — 무한히 늘어남

이유:
- 게시글 목록 조회 시 작성자 이름/아바타가 항상 필요 → embed로 populate 없이 해결
- 팔로우/좋아요는 무한히 늘어나고 독립적으로 조회됨 → reference
- 좋아요 수는 자주 표시되므로 Post에 likeCount embed, 실제 좋아요 여부 확인은 Like 컬렉션 조회`,
    keyPoints: [
      '"항상 함께 조회?" → Embed, "무한히 늘어남?" → Reference',
      'MongoDB 문서 크기 제한은 16MB — 무한히 늘어나는 건 절대 embed 금지',
      '자주 표시되는 카운트만 embed, 실제 데이터는 reference 하이브리드 패턴',
      'populate 남발은 RDBMS join과 다를 게 없어짐 — 설계를 다시 봐야 함',
    ],
    tags: ['MongoDB', 'DB 설계', 'Mongoose', 'Schema', 'Embedding'],
  },
  {
    id: 'responsive-layout',
    category: 'CSS 레이아웃',
    emoji: '📱',
    title: '반응형, 어디서부터 시작해?',
    subtitle: 'Mobile-first로 짜야 하는 이유와 실전 패턴',
    scenario: `데스크탑 디자인 먼저 구현하고 나서 "모바일도 해야지" 하면서 미디어쿼리로 덮어쓰기 시작한다. 그러다 보면 미디어쿼리가 쌓이고, 모바일에서 이상하게 보이는 걸 고치다 데스크탑이 깨지는 악순환. 처음부터 올바르게 짜는 방법이 있는가?`,
    scenarioCode: `/* Desktop-first로 짜면 이렇게 됨 */
.container {
  width: 1200px;
  display: flex;
  gap: 24px;
}
/* 나중에 모바일 대응... */
@media (max-width: 768px) {
  .container {
    width: 100%;
    flex-direction: column;
    gap: 12px;
  }
}
/* 태블릿도... */
@media (max-width: 1024px) {
  .container { width: 100%; }
}
/* 점점 쌓이는 미디어쿼리...`,
    whyItMatters: `Desktop-first는 "덮어쓰기"다. 미디어쿼리가 누적되고 충돌이 생긴다. Mobile-first는 "확장"이다. 기본 스타일이 모바일용이고, 화면이 넓어질 때 추가하는 방식. Tailwind CSS가 이 방식을 강제하는데, 이걸 이해하지 못하면 Tailwind를 제대로 못 쓴다.`,
    concept: `Mobile-first: 기본 스타일 = 모바일, min-width 미디어쿼리로 큰 화면에서 확장. Desktop-first: 기본 스타일 = 데스크탑, max-width로 작은 화면에서 축소. Tailwind는 Mobile-first — sm:, md:, lg: 접두사는 min-width 기준이다.`,
    examples: [
      {
        label: 'Tailwind Mobile-first 이해',
        code: `{/* Tailwind 반응형 접두사는 min-width */}

{/* 잘못된 이해: "md:hidden이면 중간 크기에서만 숨김"이 아님 */}
<div className="hidden md:block">
  {/* hidden: 기본(모바일)에서 숨김 */}
  {/* md:block: 768px 이상(태블릿+데스크탑)에서 보임 */}
</div>

{/* 카드 레이아웃 — 모바일 1열, 태블릿 2열, 데스크탑 3열 */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/*
    기본(모바일): 1열
    md(768px+): 2열
    lg(1024px+): 3열
    오른쪽으로 갈수록 추가하는 방식
  */}
</div>

{/* 폰트 크기 */}
<h1 className="text-xl md:text-2xl lg:text-4xl">
  {/* 모바일: xl, 태블릿: 2xl, 데스크탑: 4xl */}
</h1>`,
        note: 'Tailwind sm:, md:, lg: 는 "이 크기 이상일 때" — Mobile-first',
      },
      {
        label: '실전 레이아웃 — 사이드바 + 콘텐츠',
        code: `{/* 모바일: 사이드바 숨김, 데스크탑: 사이드바 표시 */}
<div className="flex flex-col lg:flex-row min-h-screen">
  {/* 사이드바: 모바일에서 숨기고 데스크탑에서 표시 */}
  <aside className="hidden lg:block lg:w-64 border-r bg-gray-900">
    <nav>...</nav>
  </aside>

  {/* 메인 콘텐츠 */}
  <main className="flex-1 p-4 lg:p-8">
    {/* 콘텐츠 영역 */}
  </main>
</div>

{/* 모바일 전용 하단 네비게이션 */}
<nav className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden">
  {/* 모바일에서만 보임 */}
</nav>`,
        note: 'lg:hidden / hidden lg:block 패턴으로 모바일/데스크탑 전환',
      },
      {
        label: 'Container 패턴 — 최대 너비 제한',
        code: `{/* 공통 컨테이너 패턴 */}
<div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
  {/*
    max-w-screen-xl: 최대 1280px
    mx-auto: 중앙 정렬
    px-4: 모바일 좌우 여백 16px
    sm:px-6: 640px 이상 24px
    lg:px-8: 1024px 이상 32px
  */}
</div>

{/* Tailwind 기본 브레이크포인트 */}
{/* sm: 640px / md: 768px / lg: 1024px / xl: 1280px / 2xl: 1536px */}`,
        note: '좌우 padding을 화면 크기별로 늘리는 것도 반응형의 일부',
      },
    ],
    decisionGuide: [
      { condition: '기본 스타일 작성', answer: '모바일 기준으로 먼저 (Mobile-first)' },
      { condition: '더 큰 화면에서 레이아웃 변경', answer: 'md:, lg: 접두사로 확장' },
      { condition: '특정 화면에서만 보이거나 숨길 때', answer: 'hidden md:block / md:hidden 패턴' },
      { condition: '컬럼 수가 반응형으로 바뀌는 그리드', answer: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' },
      { condition: '미디어쿼리 없이 자동 반응형', answer: 'grid auto-fill + minmax(최소 너비, 1fr)' },
    ],
    question: `대시보드 페이지를 반응형으로 만든다. 모바일에서는 카드가 1열, 태블릿은 2열, 데스크탑은 4열. 사이드바는 데스크탑에서만 보이고 모바일에서는 하단 탭 바로 대체된다. Tailwind로 어떻게 구현할 것인지 핵심 구조를 설명해봐.`,
    referenceAnswer: `전체 구조:
1. 레이아웃: 모바일은 단일 컬럼, 데스크탑은 사이드바+메인 (flex flex-col lg:flex-row)

2. 사이드바: hidden lg:block — 모바일에서 숨기고 데스크탑에서 표시

3. 하단 탭 바: lg:hidden fixed bottom-0 — 데스크탑에서 숨기고 모바일에서 표시

4. 카드 그리드:
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
(모바일 1열 → 태블릿 2열 → 데스크탑 4열)

5. Mobile-first 원칙: 기본 스타일이 모바일, md:/lg:로 확장
Tailwind의 sm:, md:, lg: 는 모두 min-width — "이 크기 이상일 때"`,
    keyPoints: [
      'Tailwind의 md:, lg: 는 "이 크기 이상" — Mobile-first',
      'hidden md:block / md:hidden 으로 화면 크기별 표시/숨김',
      'grid-cols-1 → md:grid-cols-2 → lg:grid-cols-4 패턴',
      'Mobile-first = 기본이 모바일, 큰 화면으로 갈수록 추가',
    ],
    tags: ['CSS', 'Tailwind', '반응형', 'Mobile-first', 'Grid'],
  },
  {
    id: 'error-handling',
    category: 'React 설계',
    emoji: '🛡️',
    title: '에러 처리, 어디서 어떻게 해?',
    subtitle: '에러를 제대로 다루지 않으면 사용자가 빈 화면을 본다',
    scenario: `API 호출하다가 에러 나면 그냥 console.error 찍고 끝낸다. 아니면 try/catch 안에서 setError로 에러 메시지 state에 저장하는데, 그게 화면에 표시가 되는지도 잘 모른다. 사용자 입장에서 에러 났을 때 빈 화면이 뜨거나, 아무 반응이 없거나, 토스트가 뜨거나... 일관성이 없다.`,
    scenarioCode: `// 이런 패턴이 흩어져 있다면
async function fetchUser() {
  try {
    const data = await api.get('/user')
    setUser(data)
  } catch (e) {
    console.error(e) // 사용자는 모름
    // 또는
    alert('에러가 발생했습니다') // UX 최악
    // 또는
    setError(e.message) // 화면에 표시는 하는데...
  }
}`,
    whyItMatters: `에러 처리는 사용자 경험의 핵심이다. 에러를 무시하면 사용자는 왜 안 되는지 모른다. 에러를 너무 노출하면 보안 문제 + UX 저하. 어느 레이어(API 호출, 컴포넌트, 페이지)에서 어떻게 처리할지 일관된 패턴이 없으면 코드베이스 전체가 제각각이 된다.`,
    concept: `에러에는 두 종류가 있다. 예상 가능한 에러(폼 유효성 실패, 404, 인증 실패)와 예상 불가능한 에러(네트워크 단절, 서버 500). 예상 가능한 에러는 UI에서 친절하게 안내, 예상 불가능한 에러는 Error Boundary로 fallback UI 표시. API 에러는 공통 처리, 개별 처리를 레이어별로 나눠야 한다.`,
    examples: [
      {
        label: 'API 공통 에러 처리 — axios interceptor',
        code: `// lib/api.ts — 공통 에러 처리
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      // 인증 만료 → 로그인 페이지로
      window.location.href = '/login'
      return
    }

    if (status === 403) {
      toast.error('접근 권한이 없습니다')
      return
    }

    if (status >= 500) {
      toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      return
    }

    // 나머지 에러는 각 호출부에서 처리
    return Promise.reject(error)
  }
)

export default api`,
        note: '401/403/500은 앱 전체에서 동일하게 처리 — 인터셉터에서 한 번만',
      },
      {
        label: 'TanStack Query 에러 처리',
        code: `// 조회 에러 — isError, error 사용
function UserProfile({ userId }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get(\`/users/\${userId}\`),
    retry: 1, // 실패 시 1번만 재시도
  })

  if (isLoading) return <Skeleton />
  if (isError) return (
    <div className="text-center py-10">
      <p className="text-gray-400">유저 정보를 불러오지 못했습니다</p>
      <button onClick={() => refetch()} className="text-blue-400 text-sm mt-2">
        다시 시도
      </button>
    </div>
  )

  return <div>{data.name}</div>
}

// mutation 에러 — onError 콜백
const mutation = useMutation({
  mutationFn: (data) => api.post('/users', data),
  onSuccess: () => toast.success('저장됐습니다'),
  onError: (error) => {
    const message = error.response?.data?.message ?? '저장에 실패했습니다'
    toast.error(message)
  },
})`,
        note: '조회 실패는 UI에 안내, mutation 실패는 토스트 — 사용자가 뭔가 잘못됐다는 걸 알 수 있게',
      },
      {
        label: 'Error Boundary — 예상 못한 에러 잡기',
        code: `// components/ErrorBoundary.tsx
'use client'
import { Component, ReactNode } from 'react'

class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="text-center py-20">
          <p className="text-gray-400">문제가 발생했습니다</p>
          <button onClick={() => this.setState({ hasError: false })}>
            새로고침
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// app/layout.tsx에서 감싸기
<ErrorBoundary>
  <Dashboard />
</ErrorBoundary>

// Next.js App Router는 error.tsx 파일로 대체 가능
// app/dashboard/error.tsx`,
        note: 'JS 런타임 에러가 앱 전체를 죽이는 것을 방지 — 최소한의 안전망',
      },
    ],
    decisionGuide: [
      { condition: '401 인증 만료, 403 권한 없음, 500 서버 오류', answer: 'axios interceptor에서 공통 처리' },
      { condition: '데이터 조회 실패 (목록, 상세 페이지)', answer: 'isError + 안내 UI + 재시도 버튼' },
      { condition: '버튼 클릭 action 실패 (저장, 삭제 등)', answer: 'onError에서 toast.error()' },
      { condition: '폼 유효성 검사 실패', answer: 'zod 에러 메시지 인라인 표시' },
      { condition: '예상치 못한 런타임 에러', answer: 'Error Boundary / Next.js error.tsx' },
    ],
    question: `유저 목록 조회 API가 실패하는 케이스가 있다: 1) 인증 만료(401), 2) 네트워크 오류, 3) 서버 500 오류. 각 케이스를 어떻게 처리할 것인지, 코드 구조와 함께 설명해봐.`,
    referenceAnswer: `레이어별로 처리를 나눈다.

1. 401 인증 만료 → axios interceptor에서 처리
모든 API 호출에 공통으로 적용. 401 받으면 자동으로 로그인 페이지로 리다이렉트. 개별 컴포넌트에서 처리 불필요.

2. 네트워크 오류(오프라인, 타임아웃) → TanStack Query retry + UI 안내
retry: 2로 2번 재시도, 그래도 실패하면 isError로 "연결을 확인해주세요" 안내 + 재시도 버튼.

3. 500 서버 오류 → axios interceptor + Error Boundary
공통 인터셉터에서 toast.error("서버 오류"). 만약 렌더링 중 에러면 Error Boundary가 fallback UI 표시.

공통 원칙: 사용자가 항상 뭔가 잘못됐다는 걸 알아야 함. console.error만 찍고 끝내는 건 최악.`,
    keyPoints: [
      '401/403/500은 axios interceptor에서 공통 처리',
      '데이터 조회 실패는 isError + 재시도 버튼으로 안내',
      'mutation 실패는 onError에서 toast로 즉시 피드백',
      'Error Boundary는 예상 못한 런타임 에러의 최후 방어선',
    ],
    tags: ['React', '에러 처리', 'axios', 'TanStack Query', 'Error Boundary'],
  },
  {
    id: 'api-route-design',
    category: 'API 설계',
    emoji: '🔌',
    title: 'REST API, 어떻게 설계해?',
    subtitle: 'URL 구조, HTTP 메서드, 응답 형태 — 기준 없이 짜면 나중에 후회',
    scenario: `NestJS로 API 만들 때 URL을 어떻게 짜야 하는지 모르겠다. /getUsers 로 해야 하나, /users 로 해야 하나? 수정할 때 PUT을 써야 하나 PATCH를 써야 하나? 에러 났을 때 응답을 어떻게 줘야 하나? 프론트에서 API 연동할 때 마다 백엔드 응답 형태가 달라서 매번 파악해야 한다.`,
    scenarioCode: `// 이런 URL 설계를 보면 문제가 있는 것
GET  /getUsers          // ❌ 동사 사용
POST /createUser        // ❌ 동사 사용
POST /updateUser        // ❌ POST로 수정?
GET  /deleteUser?id=123 // ❌ GET으로 삭제?

// 응답도 제각각
{ data: users }          // 어떤 API
{ result: users }        // 다른 API
users                    // 또 다른 API
{ success: true, users } // 또 다른...`,
    whyItMatters: `일관성 없는 API는 프론트엔드 개발자(나 포함)를 힘들게 한다. 매번 이 API는 어떤 형태로 오는지 확인해야 하고, 에러 처리도 제각각이 된다. REST 컨벤션을 따르면 API 문서 없이도 어느 정도 예측이 가능하다.`,
    concept: `REST API의 핵심: URL은 명사(리소스), HTTP 메서드는 동사(행위). GET=조회, POST=생성, PUT=전체수정, PATCH=부분수정, DELETE=삭제. URL에 동사 쓰지 않는다. 응답 형태는 프로젝트 내에서 일관되게 유지한다.`,
    examples: [
      {
        label: 'URL 설계 원칙 — 명사 + 계층 구조',
        code: `// ✅ REST 컨벤션
GET    /users              // 목록 조회
POST   /users              // 생성
GET    /users/:id          // 단건 조회
PUT    /users/:id          // 전체 수정 (모든 필드)
PATCH  /users/:id          // 부분 수정 (일부 필드)
DELETE /users/:id          // 삭제

// 중첩 리소스 (유저의 주문 목록)
GET    /users/:id/orders   // 특정 유저의 주문 목록
GET    /orders/:id         // 주문 단건 (단독으로도 접근 가능)

// 행위가 필요한 경우 (REST에서 예외)
POST   /users/:id/activate    // 계정 활성화
POST   /orders/:id/cancel     // 주문 취소
POST   /auth/login            // 로그인 (동사지만 관행적으로 허용)`,
        note: 'URL = 리소스(명사), HTTP Method = 행위(동사). 동사를 URL에 쓰지 않는다',
      },
      {
        label: 'NestJS 컨트롤러 구조',
        code: `// users.controller.ts
@Controller('users')
export class UsersController {
  @Get()
  findAll(@Query() query: GetUsersDto) {
    return this.usersService.findAll(query)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Patch(':id')       // 부분 수정
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }
}`,
        note: 'NestJS @Get, @Post, @Patch, @Delete 데코레이터가 HTTP 메서드와 1:1 대응',
      },
      {
        label: '응답 형태 통일 — 공통 response 형식',
        code: `// 프로젝트 내 응답 형태를 통일하면 프론트에서 파악이 쉬움

// 성공 응답
{
  "success": true,
  "data": { ... },         // 단건
  // 또는
  "data": [ ... ],         // 목록
  "pagination": {          // 페이지네이션 있을 때
    "total": 100,
    "page": 1,
    "limit": 20
  }
}

// 에러 응답
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",       // 에러 코드 (프론트에서 분기 처리용)
    "message": "유저를 찾을 수 없습니다" // 사용자에게 보여줄 메시지
  }
}

// NestJS Global Exception Filter로 통일
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // 모든 에러를 위 형태로 변환
  }
}`,
        note: '응답 형태가 통일되면 axios interceptor에서 공통 처리 가능',
      },
    ],
    decisionGuide: [
      { condition: '데이터 조회 (목록, 단건)', answer: 'GET + 명사 URL (/users, /users/:id)' },
      { condition: '새 데이터 생성', answer: 'POST + 명사 URL (/users)' },
      { condition: '데이터 전체 교체', answer: 'PUT + 명사 URL (/users/:id)' },
      { condition: '일부 필드만 수정', answer: 'PATCH + 명사 URL (/users/:id)' },
      { condition: '데이터 삭제', answer: 'DELETE + 명사 URL (/users/:id)' },
      { condition: '행위(활성화, 취소, 승인)', answer: 'POST + /resource/:id/action' },
    ],
    question: `게시글(Post) API를 설계해야 한다: 목록 조회(페이지네이션), 단건 조회, 작성, 수정, 삭제, 게시글 좋아요 토글. URL 구조, HTTP 메서드, 각 응답 형태를 설계해봐.`,
    referenceAnswer: `URL 설계:
GET    /posts?page=1&limit=20    목록 (페이지네이션)
GET    /posts/:id                단건 조회
POST   /posts                    작성
PATCH  /posts/:id                수정 (일부 필드)
DELETE /posts/:id                삭제
POST   /posts/:id/like           좋아요 토글 (행위라 POST + action)

응답 형태:
목록: { success: true, data: [...], pagination: { total, page, limit } }
단건: { success: true, data: { id, title, content, author, likeCount } }
작성: { success: true, data: { id, ... } } + HTTP 201
수정: { success: true, data: { id, ... } }
삭제: { success: true } + HTTP 204 (data 없음)
좋아요: { success: true, data: { liked: true, likeCount: 42 } }

에러: { success: false, error: { code: "POST_NOT_FOUND", message: "..." } }

주의: 좋아요는 "행위"이므로 URL에 /like를 붙이고 POST 사용. GET /posts/:id/like 로 하면 조회인지 토글인지 불명확.`,
    keyPoints: [
      'URL은 명사(리소스), HTTP 메서드가 동사(행위) — URL에 동사 쓰지 않기',
      'PUT = 전체 교체, PATCH = 부분 수정 — 대부분의 경우 PATCH가 맞다',
      '행위(좋아요, 취소, 승인)는 POST + /resource/:id/action 패턴',
      '응답 형태를 통일하면 프론트에서 에러 처리가 일관되게 가능',
    ],
    tags: ['API', 'REST', 'NestJS', 'HTTP', '설계'],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 디버깅
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'debug-react-render',
    category: '디버깅',
    emoji: '🔄',
    title: '왜 무한으로 리렌더링되지?',
    subtitle: 'useEffect 의존성 배열 버그 — 콘솔 폭발 상황 진단법',
    scenario: `로그인 후 유저 정보를 불러오는 컴포넌트를 만들었다. 근데 Network 탭을 보니 API가 끊임없이 호출되고 있다. 콘솔엔 로그가 폭발 중. 분명히 useEffect 한 번만 실행되길 바랐는데... 뭐가 문제일까?`,
    scenarioCode: `function UserProfile() {
  const [user, setUser] = useState(null)
  const params = { userId: '123' }  // 🚨 매 렌더마다 새 객체 생성

  useEffect(() => {
    fetchUser(params).then(setUser)
  }, [params])  // 🚨 객체 참조가 매번 바뀜 → 무한 루프
  //             ↑ 이게 문제인지 모르는 경우가 많음

  return <div>{user?.name}</div>
}`,
    whyItMatters: `React의 useEffect는 의존성 배열의 값이 "변경됐는지"를 얕은 비교(===)로 확인한다. 객체·배열·함수는 렌더마다 새 참조가 생기므로, 의존성에 넣으면 무조건 "변경됨"으로 판단해 무한 루프가 된다. 이 버그는 처음엔 증상이 명확하지 않아서(API가 너무 많이 불린다, 느리다) 원인 찾기가 어렵다.`,
    concept: `useEffect 의존성 배열은 "이전 렌더의 값"과 "이번 렌더의 값"을 === 로 비교한다. 원시값(string, number, boolean)은 값 자체를 비교하지만, 객체·배열·함수는 참조(메모리 주소)를 비교한다. 그래서 { userId: '123' }을 렌더 안에서 매번 만들면 내용이 같아도 새 객체여서 "바뀐 것"으로 본다.`,
    examples: [
      {
        label: '❌ 무한 루프 — 객체를 렌더 안에서 생성',
        code: `function UserProfile() {
  const [user, setUser] = useState(null)

  // 문제: 렌더마다 새 객체가 만들어짐
  const options = { userId: '123', includeAvatar: true }

  useEffect(() => {
    fetchUser(options).then(setUser)
  }, [options]) // options 참조가 매번 달라짐 → 무한 호출
}`,
        note: '렌더 안에서 객체/배열/함수를 만들고 의존성에 넣으면 무조건 무한 루프',
      },
      {
        label: '✅ 수정 1 — 의존성에서 제거 (값이 변할 필요 없을 때)',
        code: `function UserProfile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // userId가 고정값이면 의존성 배열에 넣을 필요 없음
    fetchUser({ userId: '123' }).then(setUser)
  }, []) // 마운트 시 1번만 실행
}`,
        note: '값이 컴포넌트 생애주기 동안 변하지 않는다면 의존성 배열에서 제거',
      },
      {
        label: '✅ 수정 2 — 원시값으로 분리 (props/state에서 올 때)',
        code: `function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUser({ userId }).then(setUser)
  }, [userId]) // 원시값(string)은 값 비교 → 실제 변경 시에만 재실행
}`,
        note: '객체 대신 원시값(string, number)을 의존성으로 쓰면 안전하다',
      },
      {
        label: '✅ 수정 3 — useMemo로 객체 안정화',
        code: `function UserProfile({ userId, role }: Props) {
  const [user, setUser] = useState(null)

  // useMemo로 객체를 메모이제이션 — userId/role이 바뀔 때만 새 객체
  const params = useMemo(
    () => ({ userId, role }),
    [userId, role]
  )

  useEffect(() => {
    fetchUser(params).then(setUser)
  }, [params]) // params 참조가 진짜 변경될 때만 재실행
}`,
        note: '여러 값을 묶어서 보내야 할 때 useMemo로 참조를 안정화',
      },
    ],
    decisionGuide: [
      {
        condition: 'useEffect가 무한히 실행된다',
        answer: '의존성 배열에 객체·배열·함수가 있는지 확인. 있다면 원시값으로 쪼개거나 useMemo/useCallback 처리',
      },
      {
        condition: '의존성 배열이 [] 인데 ESLint가 경고를 낸다',
        answer: 'react-hooks/exhaustive-deps 경고. 의존성을 추가하되, 객체면 원시값 분리 or useMemo 검토',
      },
      {
        condition: '함수를 의존성에 넣어야 하는데 무한 루프가 된다',
        answer: '함수를 useCallback으로 감싸서 참조를 안정화',
      },
      {
        condition: 'API가 예상보다 많이 호출된다 (Network 탭에서 확인)',
        answer: 'React DevTools → Profiler → "왜 리렌더됐는가" 확인. useEffect 의존성 버그거나 부모 리렌더 전파',
      },
      {
        condition: 'Strict Mode에서 useEffect가 두 번 실행된다',
        answer: 'Next.js 개발 환경의 정상 동작. 클린업 함수가 없거나 비멱등(non-idempotent) 부작용이 있는지 점검',
      },
    ],
    question: `다음 코드에서 무한 루프가 발생하는 이유와, 이를 고치는 두 가지 방법을 설명하세요.

\`\`\`tsx
function PostList({ category }: { category: string }) {
  const [posts, setPosts] = useState([])
  const filter = { category, status: 'published' }

  useEffect(() => {
    fetchPosts(filter).then(setPosts)
  }, [filter])

  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}
\`\`\``,
    referenceAnswer: `무한 루프 원인: filter 객체가 렌더마다 새로운 참조로 생성되고, useEffect는 의존성을 === 로 비교하기 때문에 매번 "바뀐 것"으로 판단해 재실행됩니다.

수정 방법 1 — 원시값으로 분리: 의존성 배열에 객체 대신 category 문자열을 직접 넣습니다. useEffect 내부에서 { category, status: 'published' }를 구성합니다.

수정 방법 2 — useMemo로 안정화: const filter = useMemo(() => ({ category, status: 'published' }), [category]) 로 메모이제이션하면 category가 실제로 바뀔 때만 새 객체가 만들어집니다.`,
    keyPoints: [
      'useEffect 의존성 배열은 === 얕은 비교 — 객체는 내용이 같아도 참조가 다르면 "변경"',
      '의존성에 객체/배열/함수 → 무한 루프 경보. 원시값으로 쪼개거나 메모이제이션',
      'Network 탭에서 API 폭발 확인 → React DevTools Profiler로 리렌더 원인 추적',
      'Strict Mode 2번 실행은 정상. 클린업 함수 누락 여부를 점검하는 신호',
    ],
    tags: ['디버깅', 'useEffect', 'React', '무한루프', '의존성배열'],
  },

  {
    id: 'debug-network',
    category: '디버깅',
    emoji: '🌐',
    title: 'API 에러, 어디서부터 봐야 하지?',
    subtitle: '400/401/403/404/500 — 에러 코드별 디버깅 루트맵',
    scenario: `버튼을 눌렀더니 "에러가 발생했습니다"만 뜨고 아무것도 안 된다. 콘솔엔 뭔가 빨간 글씨가 있는데 무슨 뜻인지 모르겠다. 백엔드 탓인가? 프론트 탓인가? 어디서부터 봐야 하지?`,
    scenarioCode: `// 이런 에러를 만났을 때 어떻게 하시나요?
// ❌ 콘솔:
// POST https://api.example.com/posts 400 (Bad Request)
// Uncaught (in promise) Error: Request failed with status code 400

async function createPost(data: PostForm) {
  const response = await fetch('/api/posts', {
    method: 'POST',
    body: JSON.stringify(data),  // 🤔 여기가 문제일까?
  })
  // 응답을 확인하지 않고 바로 파싱
  const result = await response.json()
  return result
}`,
    whyItMatters: `HTTP 에러 코드는 "누가 잘못했는가"를 알려준다. 400대는 클라이언트(프론트) 문제, 500대는 서버(백엔드) 문제다. 이걸 구분하지 못하면 백엔드 개발자에게 "에러 납니다"만 말하거나, 프론트 코드를 뒤지는데 사실 서버 문제인 경우가 반복된다. 에러 코드를 읽는 것만으로 디버깅 시간이 절반 이상 줄어든다.`,
    concept: `HTTP 상태 코드는 범위로 의미를 가진다. 2xx = 성공, 3xx = 리다이렉트, 4xx = 클라이언트 실수, 5xx = 서버 실수다. 4xx 중에서도 400(잘못된 요청)/401(인증 안 됨)/403(권한 없음)/404(리소스 없음)은 각각 원인과 해결 방향이 완전히 다르다. Network 탭 → Response 탭에서 서버가 보낸 에러 메시지를 먼저 읽는 것이 디버깅의 첫 단계다.`,
    examples: [
      {
        label: '400 Bad Request — 요청 데이터 문제',
        code: `// 🔍 Network 탭 → Response 확인 예시:
// { "error": "title is required", "field": "title" }

// 원인: 서버가 기대하는 데이터 형식과 다름
// 흔한 케이스:
// 1. Content-Type 헤더 누락
await fetch('/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }, // ← 이걸 안 붙이면 400
  body: JSON.stringify(data),
})

// 2. 필드명 오타 (서버는 'userId' 기대, 프론트는 'user_id' 보냄)
// 3. 필수 필드 누락
// 4. 날짜 형식 불일치 (ISO 8601 vs 'YYYY-MM-DD')`,
        note: '400이면 내가 보낸 데이터 형식을 먼저 의심. Response 본문에 어떤 필드가 문제인지 나와있는 경우가 많다',
      },
      {
        label: '401 Unauthorized — 토큰 문제',
        code: `// 🔍 증상: 로그인은 됐는데 API 호출이 401
// 원인 체크리스트:
// 1. Authorization 헤더를 안 붙임
await fetch('/api/me', {
  headers: {
    Authorization: \`Bearer \${token}\`, // ← 이게 없으면 401
  }
})

// 2. 토큰이 만료됨 (localStorage에 있는 토큰을 확인)
const token = localStorage.getItem('access_token')
console.log('토큰:', token)
// → JWT라면 jwt.io에서 exp(만료시간) 확인

// 3. 토큰을 잘못된 키로 꺼냄
// localStorage.getItem('accessToken') vs 'access_token'`,
        note: '401은 "누구세요?" — 인증 자체가 없거나 토큰이 만료/누락. 403은 "알지만 안 돼요" — 권한 문제',
      },
      {
        label: '404 Not Found — 경로/ID 문제',
        code: `// 🔍 흔한 원인들

// 1. API 경로 오타
// ❌ fetch('/api/post/1')   → 서버는 '/api/posts/1' 이 맞음
// ✅ fetch('/api/posts/1')

// 2. 동적 ID가 undefined
const postId = router.query.id  // Next.js pages router
// query가 아직 안 채워졌을 때 undefined 상태로 호출
await fetch(\`/api/posts/\${postId}\`) // → '/api/posts/undefined'

// 수정:
if (!postId) return  // 가드 추가
await fetch(\`/api/posts/\${postId}\`)

// 3. 삭제된 리소스나 잘못된 ID
// → DB에서 해당 ID가 실제로 있는지 확인`,
        note: '404면 URL을 콘솔에 찍어보는 게 첫 번째. undefined나 null이 들어간 URL인 경우가 흔하다',
      },
      {
        label: '500 Internal Server Error — 서버 쪽 문제',
        code: `// 🔍 500이 뜨면 프론트 코드는 일단 무죄
// 단, 요청 데이터가 서버를 터뜨린 경우는 있음

// 확인 방법:
// 1. 동일한 요청을 curl이나 Postman으로 재현
// curl -X POST https://api.example.com/posts \\
//   -H "Content-Type: application/json" \\
//   -H "Authorization: Bearer TOKEN" \\
//   -d '{"title":"테스트"}'

// 2. 서버 로그 확인 (NestJS면 터미널, 배포환경이면 로그 서비스)

// 3. 요청 데이터를 단순화해서 어떤 데이터가 서버를 터뜨리는지 찾기
// 500이 계속 나면 백엔드 담당자에게 넘길 타이밍`,
        note: '500은 서버 담당자 영역. 하지만 "500 납니다"가 아니라 curl 재현 결과를 같이 주면 협업이 훨씬 빠르다',
      },
    ],
    decisionGuide: [
      {
        condition: '400 Bad Request',
        answer: 'Network 탭 → Response 탭에서 서버 에러 메시지 확인. 요청 헤더(Content-Type), 바디 필드명/형식 점검',
      },
      {
        condition: '401 Unauthorized',
        answer: 'Authorization 헤더 포함 여부 확인. 토큰 존재/만료 여부 확인. JWT라면 jwt.io에서 exp 체크',
      },
      {
        condition: '403 Forbidden',
        answer: '토큰은 있지만 권한이 없음. 요청 리소스가 내 것인지, 권한 설정이 맞는지 확인',
      },
      {
        condition: '404 Not Found',
        answer: 'URL을 콘솔에 찍어서 undefined/null 포함 여부 확인. API 경로 오타, 리소스 존재 여부 확인',
      },
      {
        condition: '500 Internal Server Error',
        answer: '서버 쪽 버그. curl/Postman으로 동일 요청 재현 후 서버 담당자에게 공유. 내 요청 데이터가 특이한지 확인',
      },
      {
        condition: 'CORS 에러 (Access-Control-Allow-Origin)',
        answer: '서버 CORS 설정 문제. 백엔드에서 허용할 오리진을 추가해야 함. 프론트 코드로 해결 불가',
      },
    ],
    question: `동료가 "API 호출이 자꾸 401이 나는데 왜 그런지 모르겠다"고 합니다. 당신이라면 어떤 순서로 원인을 찾겠습니까? 확인해야 할 것들을 구체적으로 나열해보세요.`,
    referenceAnswer: `1단계 — Network 탭에서 실제 요청 확인: Headers 탭에서 Authorization 헤더가 요청에 포함됐는지 확인합니다.

2단계 — 토큰 존재 확인: localStorage/cookie에서 토큰을 콘솔로 출력해 실제로 값이 있는지 확인합니다.

3단계 — 토큰 유효성 확인: JWT라면 jwt.io에 붙여넣어 exp(만료 시각)가 현재 시각보다 이후인지 확인합니다.

4단계 — 헤더 형식 확인: Authorization: Bearer {token} 형식이 맞는지 확인합니다. 'Bearer ' 뒤에 공백이 있어야 합니다.

5단계 — Response 본문 확인: Network 탭 Response에서 서버가 보낸 구체적인 에러 메시지를 읽습니다. "token expired"인지 "invalid token"인지에 따라 해결책이 다릅니다.`,
    keyPoints: [
      '4xx = 클라이언트 문제, 5xx = 서버 문제 — 범위로 책임 소재를 먼저 파악',
      'Network 탭 → Response 탭이 첫 번째 행선지. 서버 에러 메시지에 이미 원인이 있다',
      '401(인증 없음)과 403(권한 없음)은 다르다 — 해결 방향이 완전히 다름',
      'URL에 undefined/null이 들어간 404는 가드 조건 누락이 원인',
      'curl 재현 결과를 같이 주는 것이 백엔드 협업의 기본',
    ],
    tags: ['디버깅', 'HTTP', 'API', 'Network', '에러코드'],
  },

  {
    id: 'debug-async',
    category: '디버깅',
    emoji: '⏱️',
    title: '비동기 버그, 왜 가끔만 나타나지?',
    subtitle: 'Race condition & Stale closure — 재현하기 어려운 버그 잡기',
    scenario: `검색창에서 타이핑하면 API를 호출해서 결과를 보여주는 기능을 만들었다. 평소엔 잘 되는데, 빠르게 타이핑하면 가끔 이전 검색 결과가 나중에 뜨거나, 심지어 입력한 것과 전혀 다른 결과가 표시된다. 재현도 잘 안 되고, 원인도 모르겠다. 이런 버그가 왜 생기는 걸까?`,
    scenarioCode: `function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    if (!query) return

    // 🚨 Race condition: 빠르게 타이핑하면
    // "ri" 요청이 "react" 요청보다 늦게 응답이 올 수 있음
    searchAPI(query).then(data => {
      setResults(data)  // 어느 응답이 먼저 오든 덮어씀
    })
  }, [query])

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
    </div>
  )
}`,
    whyItMatters: `Race condition은 "가끔만 발생"해서 버그 리포트가 애매하고, 재현도 어렵고, 원인도 눈에 안 보인다. 실무에서 가장 잡기 힘든 버그 유형 중 하나다. 비동기 코드를 쓸 때마다 "이전 요청이 취소됐는가?"를 고려하는 습관만 있어도 이 버그를 미리 막을 수 있다.`,
    concept: `Race condition은 여러 비동기 작업이 완료 순서를 보장받지 못할 때 발생한다. 네트워크 요청은 보낸 순서대로 오지 않는다. 해결책은 두 가지다: 이전 요청을 취소(AbortController)하거나, 응답이 왔을 때 이미 "무효한 요청"인지 체크하는 것이다. Stale closure는 useEffect 내부의 함수가 오래된 state 값을 캡처해서 생기는 별개의 버그다.`,
    examples: [
      {
        label: '❌ Race condition 발생 코드',
        code: `useEffect(() => {
  // "re" → "rea" → "reac" → "react" 순으로 4번 호출
  // 응답 순서: "react"(빠름) → "re"(느림) 이면
  // 최종 결과는 "re" 검색 결과가 표시됨 ← 버그!
  searchAPI(query).then(setResults)
}, [query])`,
        note: '응답 속도는 네트워크 상황에 따라 달라짐. 로컬에선 재현 안 되고 실서비스에서만 나타나는 경우가 많음',
      },
      {
        label: '✅ AbortController로 이전 요청 취소',
        code: `useEffect(() => {
  if (!query) return

  const controller = new AbortController()

  searchAPI(query, { signal: controller.signal })
    .then(setResults)
    .catch(err => {
      if (err.name === 'AbortError') return // 취소된 요청은 무시
      console.error(err)
    })

  // 클린업: 다음 effect 실행 전에 이전 요청 취소
  return () => controller.abort()
}, [query])`,
        note: 'useEffect의 클린업 함수에서 abort() 호출. 새 query가 들어오면 이전 요청이 자동 취소됨',
      },
      {
        label: '✅ 플래그로 무효 응답 무시 (AbortController 미지원 환경)',
        code: `useEffect(() => {
  let isValid = true  // 현재 effect가 유효한지 추적

  searchAPI(query).then(data => {
    if (!isValid) return  // 이미 새 effect가 실행됐으면 무시
    setResults(data)
  })

  return () => {
    isValid = false  // 클린업: 이 effect를 무효화
  }
}, [query])`,
        note: '클로저를 활용한 방법. AbortController보다 단순하지만 실제 네트워크 요청은 취소하지 못함',
      },
      {
        label: '💡 Stale Closure 버그 — 별개의 문제',
        code: `function Timer() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      // 🚨 이 count는 effect 최초 실행 시점의 값(0)에 고정됨
      setCount(count + 1)  // 항상 0 + 1 = 1
    }, 1000)
    return () => clearInterval(id)
  }, [])  // 빈 배열 → count 변경을 감지 못함

  // 수정: 함수형 업데이트 사용
  // setCount(prev => prev + 1)  // 항상 최신 값 기반
}`,
        note: 'Stale closure: effect 내부 함수가 오래된 state를 캡처. 함수형 업데이트(prev => prev + 1)로 해결',
      },
    ],
    decisionGuide: [
      {
        condition: '검색/자동완성에서 이상한 결과가 표시된다',
        answer: 'Race condition 의심. useEffect 클린업에서 AbortController.abort() 호출. 또는 debounce로 요청 자체를 줄이기',
      },
      {
        condition: 'setInterval/setTimeout 안에서 state 값이 0 또는 초기값에 고정된다',
        answer: 'Stale closure. 함수형 업데이트 (setCount(prev => prev + 1)) 사용. 또는 useRef로 최신 값 추적',
      },
      {
        condition: '언마운트된 컴포넌트에서 setState 경고가 뜬다',
        answer: 'useEffect 클린업 함수가 없거나 불완전함. AbortController 또는 isValid 플래그로 비동기 완료 후 체크',
      },
      {
        condition: '빠른 탭 전환 시 다른 탭의 데이터가 잠깐 보인다',
        answer: 'Race condition + 마운트/언마운트 타이밍 문제. AbortController로 언마운트 시 요청 취소',
      },
      {
        condition: '가끔만 발생하고 재현이 안 된다',
        answer: '비동기 타이밍 문제일 가능성 높음. 네트워크 속도를 DevTools에서 Slow 3G로 낮추고 재현 시도',
      },
    ],
    question: `사용자가 드롭다운에서 카테고리를 빠르게 변경할 때 선택한 카테고리와 다른 데이터가 표시되는 버그가 신고됐습니다. 이 버그의 이름과 원인, 그리고 해결 방법을 설명하세요.`,
    referenceAnswer: `버그 이름: Race Condition (경쟁 상태)

원인: 카테고리를 빠르게 변경하면 여러 API 요청이 동시에 발생합니다. 나중에 보낸 요청이 먼저 응답하고, 먼저 보낸 요청이 나중에 응답하면 최종적으로 이전 카테고리 데이터가 화면에 표시됩니다.

해결 방법 1 (권장): AbortController를 useEffect의 클린업에서 사용합니다. 카테고리가 바뀌면 이전 요청을 abort() 하여 응답 자체를 무시합니다.

해결 방법 2: isValid 플래그를 클로저로 활용합니다. 새 effect가 실행되면 이전 effect의 isValid를 false로 설정하고, 응답이 왔을 때 isValid가 false이면 setState를 호출하지 않습니다.

추가로 debounce를 적용해서 카테고리 변경이 완료된 후에만 요청을 보내면 Race condition 발생 자체를 줄일 수 있습니다.`,
    keyPoints: [
      'Race condition: 응답 순서는 요청 순서와 다를 수 있다 — AbortController로 이전 요청 취소',
      'useEffect 클린업 함수는 "다음 effect 실행 전"과 "언마운트 시" 호출됨 — 비동기 취소에 활용',
      'Stale closure: effect 내 함수는 생성 시점의 state를 캡처 — 함수형 업데이트로 해결',
      '재현이 안 되는 버그 = 비동기 타이밍 문제. DevTools에서 Network 속도 낮춰서 재현',
    ],
    tags: ['디버깅', 'Race Condition', '비동기', 'useEffect', 'AbortController'],
  },

  {
    id: 'debug-typescript',
    category: '디버깅',
    emoji: '🔴',
    title: 'TypeScript 빨간 줄, 뭐가 문제야?',
    subtitle: 'TS 에러 메시지 독해법 — 겁먹지 말고 읽는 법',
    scenario: `열심히 코드를 짰는데 에디터가 온통 빨간 줄이다. 에러 메시지를 읽어보면 "Type 'string | undefined' is not assignable to type 'string'" 같은 말들이 나오는데, 무슨 뜻인지 몰라서 일단 \`as any\` 를 붙이고 넘어가고 있다. 근데 이러면 안 된다고는 아는데...`,
    scenarioCode: `// 흔히 마주치는 TS 에러들
interface User {
  id: string
  name: string
  email?: string  // optional
}

function sendWelcomeEmail(email: string) {
  // 이메일 전송 로직
}

const user: User = getUser()

// ❌ Error: Argument of type 'string | undefined' is not
//    assignable to parameter of type 'string'
sendWelcomeEmail(user.email)

// 😅 일단 as any로 막음... 하지만 이건 타입 안전성 포기
sendWelcomeEmail(user.email as any)`,
    whyItMatters: `TypeScript 에러 메시지는 무서워 보이지만 항상 같은 구조로 되어있다. 읽는 법을 알면 5초 안에 원인을 파악할 수 있다. \`as any\`는 TypeScript를 끄는 것과 같아서, 런타임 에러가 그대로 통과된다. 타입 에러를 제대로 해결하면 버그를 사전에 차단하는 것이고, \`as any\`는 그 보호막을 제거하는 것이다.`,
    concept: `TS 에러는 대부분 "A 타입을 기대했는데 B 타입이 왔다"는 패턴이다. 메시지에서 "is not assignable to type"의 왼쪽이 실제 값의 타입, 오른쪽이 필요한 타입이다. 대부분의 에러는 undefined/null 처리 누락, 타입 좁히기(narrowing) 누락, 또는 타입 정의와 실제 데이터 불일치 중 하나다.`,
    examples: [
      {
        label: '에러 메시지 읽는 법 — 기본 구조',
        code: `// "Type 'X' is not assignable to type 'Y'"
//       ↑ 내가 넘긴 값의 타입    ↑ 함수가 기대하는 타입

// Type 'string | undefined' is not assignable to type 'string'
// → user.email이 string | undefined 인데
// → 함수는 string 만 받음
// → undefined 가능성을 처리해야 한다는 의미

// 해결 1: 옵셔널 체이닝 + 얼리 리턴
if (!user.email) return
sendWelcomeEmail(user.email) // 여기선 email이 string 확정

// 해결 2: nullish coalescing
sendWelcomeEmail(user.email ?? 'no-reply@example.com')`,
        note: '"is not assignable to" 왼쪽 = 실제 타입, 오른쪽 = 기대 타입. 왼쪽이 더 넓은 타입인 경우가 대부분',
      },
      {
        label: '흔한 에러 1 — Property does not exist',
        code: `// Error: Property 'avatar' does not exist on type 'User'
// → User 인터페이스에 avatar 필드가 없다는 뜻

// 해결 방법 3가지:
// 1. 인터페이스에 추가
interface User {
  id: string
  name: string
  avatar?: string  // 추가
}

// 2. 타입 단언 (API 응답 타입과 다를 때)
const user = getUser() as User & { avatar: string }

// 3. 확장 타입 생성
type UserWithAvatar = User & { avatar?: string }`,
        note: '"does not exist on type" → 해당 타입 정의를 보고 필드가 실제로 없는지, 오타인지 확인',
      },
      {
        label: '흔한 에러 2 — Object is possibly undefined',
        code: `// Error: Object is possibly 'undefined'
// → ?. 없이 undefined일 수 있는 값에 접근했다는 뜻

const user = users.find(u => u.id === id) // User | undefined 반환

// ❌ user가 undefined이면 런타임 에러
console.log(user.name)

// ✅ 해결 방법들:
// 1. 가드 조건
if (!user) throw new Error('유저 없음')
console.log(user.name)  // 여기선 User 확정

// 2. 옵셔널 체이닝
console.log(user?.name)  // undefined면 undefined 반환

// 3. 타입 단언 (100% 있다고 확신할 때만)
console.log(user!.name)  // ! = "절대 undefined 아님" 주장`,
        note: '"possibly undefined" → find/filter 결과, optional 필드, 외부 API 응답에서 자주 발생',
      },
      {
        label: '흔한 에러 3 — 제네릭 타입 에러',
        code: `// Error: Type 'unknown' is not assignable to type 'Post'
// → API 응답을 타입 없이 받으면 unknown/any로 추론됨

// ❌ 타입 없는 fetch
const data = await fetch('/api/posts').then(r => r.json())
// data는 any → 타입 체크 무의미

// ✅ 응답 타입 명시
interface Post { id: string; title: string }

const data: Post[] = await fetch('/api/posts').then(r => r.json())
// 실제로는 런타임 검증이 없으므로, 중요한 경우 zod 사용

// zod를 쓰면 런타임까지 안전
const PostSchema = z.object({ id: z.string(), title: z.string() })
const posts = PostSchema.array().parse(await res.json())`,
        note: 'fetch 응답은 기본이 any. 제네릭이나 명시적 타입 선언으로 타입 정보를 줘야 체크가 활성화됨',
      },
    ],
    decisionGuide: [
      {
        condition: '"is not assignable to type" 에러',
        answer: '왼쪽 타입을 오른쪽 타입으로 좁혀야 함. undefined/null이라면 가드 조건 추가. 타입이 아예 다르면 변환 로직 추가',
      },
      {
        condition: '"possibly undefined/null" 에러',
        answer: 'if 가드 후 사용, 옵셔널 체이닝(?.), nullish coalescing(??) 중 상황에 맞게 선택',
      },
      {
        condition: '"Property does not exist on type" 에러',
        answer: '타입 정의에 해당 필드가 없거나 오타. 인터페이스 확인 후 추가하거나 오타 수정',
      },
      {
        condition: 'as any를 쓰고 싶어진다',
        answer: '멈추고 에러 메시지를 읽어라. 90%는 undefined 처리 누락이다. as any는 TypeScript 보호를 끄는 것',
      },
      {
        condition: 'as unknown as TargetType 패턴이 필요하다',
        answer: '타입 간 직접 호환이 안 될 때 사용. 하지만 이 패턴은 타입 안전성 포기. 가능하면 타입을 맞추는 방향으로',
      },
    ],
    question: `다음 에러 메시지를 보고: (1) 무슨 뜻인지 설명하고, (2) as any 없이 해결하는 방법 두 가지를 코드로 제시하세요.

에러: \`Argument of type 'User | undefined' is not assignable to parameter of type 'User'\`

발생 위치: \`updateUserProfile(users.find(u => u.id === targetId))\``,
    referenceAnswer: `에러 의미: users.find()의 반환 타입이 'User | undefined'인데, updateUserProfile 함수는 'User'만 받기 때문입니다. find()는 조건에 맞는 요소가 없을 때 undefined를 반환합니다.

해결 방법 1 — 가드 조건:
const user = users.find(u => u.id === targetId)
if (!user) return  // 또는 throw new Error('유저 없음')
updateUserProfile(user)  // 이 시점에 user는 User 타입으로 좁혀짐

해결 방법 2 — 옵셔널 체이닝과 얼리 리턴 결합:
const user = users.find(u => u.id === targetId)
if (!user) throw new Error(\`유저를 찾을 수 없습니다: \${targetId}\`)
updateUserProfile(user)

주의: user! (Non-null assertion)은 undefined일 때 런타임 에러가 발생하므로, 100% 존재를 보장할 수 없는 경우에는 사용하지 않는 것이 좋습니다.`,
    keyPoints: [
      '"is not assignable to": 왼쪽=실제 타입, 오른쪽=기대 타입. 왼쪽을 좁혀야 함',
      'find/filter 결과는 항상 | undefined — 사용 전 존재 확인 필수',
      'as any는 TypeScript 보호를 끄는 것. 에러 메시지를 읽고 제대로 해결하는 것이 우선',
      '에러 메시지 마지막 줄이 핵심 — 긴 에러는 끝부터 읽어라',
    ],
    tags: ['디버깅', 'TypeScript', '타입에러', 'undefined', '타입좁히기'],
  },

  {
    id: 'debug-nextjs-hydration',
    category: '디버깅',
    emoji: '💧',
    title: 'Hydration 에러, 왜 자꾸 나오지?',
    subtitle: 'SSR/CSR 불일치 — "서버에서 렌더한 것과 다릅니다" 해결법',
    scenario: `Next.js 앱을 만드는데 콘솔에 이런 에러가 뜬다: "Error: Hydration failed because the initial UI does not match what was rendered on the server." 페이지는 일단 보이는데, 콘솔 에러가 계속 신경 쓰인다. 그리고 가끔은 화면이 깜빡이거나 레이아웃이 잠깐 이상하게 된다. 이게 왜 생기는 걸까?`,
    scenarioCode: `// 🚨 Hydration 에러 유발 코드 패턴들

// 패턴 1: 브라우저에서만 존재하는 값 사용
function Header() {
  return (
    <div>
      {/* window는 서버에서 undefined → 클라이언트와 HTML이 달라짐 */}
      <span>현재 URL: {window.location.pathname}</span>
    </div>
  )
}

// 패턴 2: 렌더마다 다른 값
function TimestampBadge() {
  return (
    // 서버 렌더 시각 ≠ 클라이언트 하이드레이션 시각
    <span>접속 시각: {new Date().toLocaleTimeString()}</span>
  )
}

// 패턴 3: localStorage 직접 접근
function ThemeToggle() {
  const theme = localStorage.getItem('theme') // 서버에서 에러
  return <div className={theme}>{/* ... */}</div>
}`,
    whyItMatters: `Next.js는 서버에서 HTML을 먼저 만들고, 브라우저에서 React가 그 HTML에 "붙는"(hydration) 과정을 거친다. 이때 서버가 만든 HTML과 클라이언트 React가 그리려는 UI가 다르면 충돌이 생긴다. 방치하면 페이지가 깜빡이거나(flash), 사용자가 보는 내용이 잠깐 잘못 표시되고, React가 전체 DOM을 다시 그려서 성능도 나빠진다.`,
    concept: `Hydration은 서버가 만든 HTML(정적) + 클라이언트 React(동적)를 연결하는 과정이다. 이 과정에서 "서버 HTML = 클라이언트 첫 렌더" 여야 한다. window, localStorage, Date.now(), Math.random() 등 서버와 클라이언트가 다른 값을 내는 것들을 초기 렌더에 직접 쓰면 불일치가 생긴다. 해결 방법은 "이 값이 필요한 부분은 클라이언트에서만 렌더하게 한다"는 것이다.`,
    examples: [
      {
        label: '✅ 해결 1 — useEffect로 클라이언트 값 지연 적용',
        code: `// window, localStorage 등 브라우저 전용 값은 마운트 후 적용
function Header() {
  const [pathname, setPathname] = useState('')  // 초기값: 서버/클라이언트 공통 ''

  useEffect(() => {
    // 마운트 후(클라이언트)에만 실행
    setPathname(window.location.pathname)
  }, [])

  return (
    <div>
      <span>현재 URL: {pathname}</span>  {/* 처음엔 '', 마운트 후 실제 값 */}
    </div>
  )
}`,
        note: '초기 state를 서버/클라이언트 공통값으로 설정하고, useEffect에서 브라우저 전용 값으로 업데이트',
      },
      {
        label: "✅ 해결 2 — 'use client' + dynamic import (SSR 완전 비활성화)",
        code: `// next/dynamic으로 SSR 자체를 끔
import dynamic from 'next/dynamic'

const ThemeToggle = dynamic(
  () => import('./ThemeToggle'),
  { ssr: false }  // 이 컴포넌트는 클라이언트에서만 렌더
)

// 또는 컴포넌트 상단에 'use client' 추가 후
// SSR이 필요 없는 컴포넌트로 분리
// 주의: 'use client'만으로는 Hydration 에러가 안 사라짐
//       브라우저 전용 API는 여전히 useEffect로 지연 접근 필요`,
        note: 'ssr: false는 완전히 클라이언트에서만 렌더. 퍼포먼스 이점(SSR)은 포기하지만 가장 확실한 해결',
      },
      {
        label: '✅ 해결 3 — suppressHydrationWarning (의도된 불일치)',
        code: `// 경고를 알고도 무시해야 할 때 (예: 시각 표시)
function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    // suppressHydrationWarning: 이 요소의 불일치는 의도된 것
    <time suppressHydrationWarning>{time}</time>
  )
}`,
        note: '시각/날짜처럼 서버/클라이언트 불일치가 불가피한 경우에만 사용. 남발하면 안 됨',
      },
      {
        label: '🔍 Hydration 에러 원인 찾기',
        code: `// 1. 에러 메시지에서 불일치 요소 확인
// "Expected server HTML to contain a matching <div> in <div>"
// → 어떤 요소가 서버/클라이언트에서 다른지 알 수 있음

// 2. 의심되는 패턴 체크리스트:
// □ window / document / navigator 직접 사용
// □ localStorage / sessionStorage 접근
// □ Date.now() / new Date() / Math.random() 렌더에 직접 사용
// □ 브라우저 전용 라이브러리 (charts, maps)
// □ 서버/클라이언트 환경 분기 (process.env로 분기)

// 3. React DevTools에서 컴포넌트 트리 확인
// 에러 발생 시 어느 컴포넌트에서 불일치가 생기는지 스택 트레이스 확인`,
        note: '에러 스택 트레이스에 컴포넌트 이름이 나옴. 그 컴포넌트에서 브라우저 전용 값을 쓰는지 확인',
      },
    ],
    decisionGuide: [
      {
        condition: '"Hydration failed" 에러',
        answer: '서버 렌더 HTML과 클라이언트 첫 렌더가 다름. window/localStorage/Date 등 브라우저 전용 값을 초기 렌더에 쓰는지 확인',
      },
      {
        condition: '화면이 깜빡이다가 정상으로 돌아온다 (Flash)',
        answer: 'Hydration 불일치 후 React가 DOM을 다시 그리는 현상. useEffect로 브라우저 전용 값을 지연 적용',
      },
      {
        condition: '특정 컴포넌트만 SSR 없애고 싶다',
        answer: 'dynamic(() => import(...), { ssr: false })로 해당 컴포넌트만 클라이언트 전용 렌더',
      },
      {
        condition: 'localStorage에서 테마/설정을 읽어야 한다',
        answer: 'useEffect에서 읽어서 state에 저장. 초기 state는 서버/클라이언트 공통값(null 또는 기본값)으로',
      },
      {
        condition: '서버에서 window 접근으로 에러가 난다',
        answer: "typeof window !== 'undefined' 조건 체크 또는 useEffect 안에서만 접근",
      },
    ],
    question: `다음 컴포넌트에서 Hydration 에러가 나는 이유를 설명하고, 에러 없이 동작하도록 수정하세요.

\`\`\`tsx
function UserGreeting() {
  const savedName = localStorage.getItem('userName')

  return (
    <div>
      <h1>안녕하세요, {savedName ?? '방문자'}님!</h1>
      <p>접속 시각: {new Date().toLocaleTimeString()}</p>
    </div>
  )
}
\`\`\``,
    referenceAnswer: `Hydration 에러 원인 두 가지:

1. localStorage.getItem(): 서버 환경에는 localStorage가 없어서 에러가 발생하고, 서버에서 렌더한 HTML(방문자)과 클라이언트 렌더(저장된 이름)가 달라짐

2. new Date().toLocaleTimeString(): 서버 렌더 시각과 클라이언트 하이드레이션 시각이 달라 불일치 발생

수정 방법:
\`\`\`tsx
function UserGreeting() {
  const [userName, setUserName] = useState<string | null>(null)
  const [time, setTime] = useState('')

  useEffect(() => {
    setUserName(localStorage.getItem('userName'))
    setTime(new Date().toLocaleTimeString())
  }, [])

  return (
    <div>
      <h1>안녕하세요, {userName ?? '방문자'}님!</h1>
      <p>접속 시각: {time}</p>
    </div>
  )
}
\`\`\`
초기 state를 서버/클라이언트 공통값(null, '')으로 설정하고, 브라우저 전용 값은 useEffect에서 마운트 후 적용합니다.`,
    keyPoints: [
      'Hydration = 서버 HTML + 클라이언트 React 연결. 둘의 첫 렌더가 같아야 함',
      'window/localStorage/Date.now() → 서버에서 다른 값 or 에러. useEffect로 지연 처리',
      '완전히 클라이언트 전용 컴포넌트는 dynamic({ ssr: false })로 SSR 비활성화',
      '에러 스택 트레이스에 문제 컴포넌트 이름이 나옴 — 그 컴포넌트 안에서 브라우저 전용 API 찾기',
    ],
    tags: ['디버깅', 'Next.js', 'Hydration', 'SSR', 'useEffect'],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 인증 / 세션
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'nextauth-session',
    category: '인증 / 세션',
    emoji: '🔐',
    title: 'getServerSession vs useSession, 뭘 써야 해?',
    subtitle: 'NextAuth 세션 흐름 완전 이해 — 서버/클라이언트 어디서 어떻게',
    scenario: `NextAuth를 붙였다. 로그인도 되고 세션도 생겼다. 근데 페이지에서 로그인한 유저 정보를 보여주려 할 때 막힌다. 서버 컴포넌트에서 useSession() 썼더니 에러나고, 클라이언트 컴포넌트에서 getServerSession() 썼더니 또 에러난다. 어디서 뭘 써야 하는 건지?`,
    scenarioCode: `// 🚨 서버 컴포넌트에서 이렇게 하면 에러
// app/dashboard/page.tsx (Server Component)
import { useSession } from 'next-auth/react'

export default async function DashboardPage() {
  const { data: session } = useSession()  // ❌ hook은 클라이언트에서만!
  return <div>{session?.user?.name}</div>
}

// 🚨 클라이언트 컴포넌트에서 이렇게 하면 에러
// app/dashboard/_components/UserCard.tsx
'use client'
import { getServerSession } from 'next-auth'

export function UserCard() {
  const session = await getServerSession(authOptions)  // ❌ 서버 함수는 클라에서 못씀
  return <div>{session?.user?.name}</div>
}`,
    whyItMatters: `NextAuth는 세션을 두 가지 방식으로 노출한다. 서버 전용 API와 클라이언트 전용 훅이 따로 있어서, 잘못 쓰면 바로 에러가 난다. 이걸 모르면 페이지마다 "왜 여기선 안 되지?" 하면서 시간을 버린다. Next.js App Router에서 대부분의 페이지가 서버 컴포넌트이므로, 특히 getServerSession 사용법이 더 중요하다.`,
    concept: `NextAuth 세션 접근 방법은 실행 환경에 따라 다르다. 서버(Server Component, API Route, Server Action): getServerSession(authOptions). 클라이언트(Client Component): useSession() 훅. JWT 전략을 쓰면 세션은 쿠키에 암호화된 JWT로 저장되고, 서버에선 이 JWT를 복호화해서 세션을 만든다.`,
    examples: [
      {
        label: '서버 컴포넌트에서 세션 읽기 — getServerSession',
        code: `// app/dashboard/page.tsx (Server Component — async 가능)
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  // 서버에서 직접 세션 읽기 — 쿠키의 JWT를 복호화
  const session = await getServerSession(authOptions)

  // 미로그인 시 리다이렉트
  if (!session) redirect('/login')

  return (
    <div>
      <h1>안녕하세요 {session.user.name}님</h1>
      <p>역할: {session.user.role}</p>
    </div>
  )
}`,
        note: 'Server Component에서는 getServerSession. async/await 사용. authOptions를 반드시 넘겨야 세션을 복호화할 수 있다',
      },
      {
        label: '클라이언트 컴포넌트에서 세션 읽기 — useSession',
        code: `// app/dashboard/_components/UserAvatar.tsx (Client Component)
'use client'
import { useSession } from 'next-auth/react'

export function UserAvatar() {
  const { data: session, status } = useSession()
  //                     ↑ 'loading' | 'authenticated' | 'unauthenticated'

  if (status === 'loading') return <div>로딩중...</div>
  if (status === 'unauthenticated') return null

  return (
    <div>
      <img src={session.user.image} alt={session.user.name} />
      <span>{session.user.name}</span>
    </div>
  )
}

// ⚠️ 전제: 부모 어딘가에 SessionProvider가 있어야 함
// app/layout.tsx:
// <SessionProvider session={session}>{children}</SessionProvider>`,
        note: 'Client Component에서는 useSession. status로 로딩/인증 상태 구분. SessionProvider가 상위에 필요',
      },
      {
        label: 'JWT 콜백으로 커스텀 필드 추가 — admin 프로젝트 패턴',
        code: `// lib/auth.ts
export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  callbacks: {
    // ① 로그인 시 token에 추가 정보 저장
    jwt: async ({ token, user }) => {
      if (user) {
        // user는 authorize()가 반환한 객체
        token.role = user.role       // 커스텀 필드 추가
        token.trainerId = user.id
      }
      return token
    },
    // ② 클라이언트가 session 요청할 때 token → session 변환
    session: async ({ session, token }) => {
      if (token) {
        session.user.role = token.role       // session에도 추가
        session.user.trainerId = token.trainerId
      }
      return session
    },
  },
}

// 이렇게 하면 session.user.role, session.user.trainerId 사용 가능
// 단, TypeScript에서 타입 확장 필요:
// types/next-auth.d.ts
declare module 'next-auth' {
  interface Session {
    user: { role: string; trainerId: string } & DefaultSession['user']
  }
}`,
        note: 'jwt 콜백 → token 저장, session 콜백 → client에 노출. 이 두 단계를 거쳐야 session.user.role 같은 커스텀 필드를 쓸 수 있다',
      },
      {
        label: 'API Route에서 세션 확인 — 서버 사이드 인증',
        code: `// app/api/posts/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // API Route도 서버 → getServerSession 사용
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: '로그인 필요' }, { status: 401 })
  }

  // role 체크
  if (session.user.role !== 'admin') {
    return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  }

  const body = await req.json()
  // ... 비즈니스 로직
}`,
        note: 'API Route도 서버이므로 getServerSession. 미들웨어에서 인증을 먼저 걸러도, API 레벨에서 role 체크는 따로 하는 것이 안전하다',
      },
    ],
    decisionGuide: [
      {
        condition: 'Server Component (page.tsx, layout.tsx, async 컴포넌트)',
        answer: 'getServerSession(authOptions) — await로 호출. 미로그인 시 redirect()로 튕겨냄',
      },
      {
        condition: "Client Component ('use client' 붙은 컴포넌트)",
        answer: "useSession() 훅. 상위에 SessionProvider 필요. status === 'loading' 처리 필수",
      },
      {
        condition: 'API Route (app/api/**/route.ts)',
        answer: 'getServerSession(authOptions) — 서버 함수. 인증 + role 체크 여기서 직접',
      },
      {
        condition: 'session에 role이나 userId 같은 커스텀 필드가 없다',
        answer: 'jwt 콜백에서 token에 추가, session 콜백에서 session.user에 복사. TypeScript 타입 확장도 필요',
      },
      {
        condition: '로그인했는데 session이 null로 보인다',
        answer: 'Client Component라면 SessionProvider 누락 확인. Server Component라면 authOptions 인자 누락 확인. JWT 전략이면 NEXTAUTH_SECRET 환경변수 설정 확인',
      },
    ],
    question: `다음 두 컴포넌트가 있습니다. 각각 어떤 방식으로 세션을 읽어야 하는지, 왜 그래야 하는지 설명하세요.

A) \`app/dashboard/layout.tsx\` — 서버 컴포넌트, 유저 role에 따라 다른 메뉴를 보여줌
B) \`app/dashboard/_components/LogoutButton.tsx\` — 로그아웃 버튼, 클릭 이벤트 처리 필요`,
    referenceAnswer: `A) layout.tsx (Server Component): getServerSession(authOptions)를 await로 호출합니다. Server Component는 서버에서 실행되므로 React 훅을 쓸 수 없습니다. getServerSession은 서버 전용 함수로, JWT 쿠키를 직접 복호화해서 세션을 가져옵니다. 세션이 없으면 redirect('/login')으로 보냅니다.

B) LogoutButton.tsx (Client Component): 클릭 이벤트 핸들러가 필요하므로 'use client'가 필요합니다. 클라이언트에서는 useSession() 훅으로 세션을 읽고, 로그아웃은 next-auth/react의 signOut()을 호출합니다. 이 컴포넌트는 SessionProvider 안에 있어야 useSession이 동작합니다.

핵심: 서버(async 함수 실행 환경) → getServerSession, 클라이언트(브라우저 실행 환경) → useSession`,
    keyPoints: [
      'Server Component/API Route → getServerSession(authOptions), Client Component → useSession()',
      'jwt 콜백: 토큰에 커스텀 필드 저장 / session 콜백: 클라이언트에 노출할 필드 결정',
      'useSession은 SessionProvider 없이는 동작하지 않음 — root layout에 필수',
      'NEXTAUTH_SECRET 환경변수 없으면 JWT 복호화 실패 → session이 null',
    ],
    tags: ['NextAuth', '인증', '세션', 'JWT', 'Server Component'],
  },

  // ──────────────────────────────────────────────────────────────────────
  // 데이터 패칭 심화
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'swr-key-pattern',
    category: '데이터 통신',
    emoji: '🗝️',
    title: 'SWR key가 바뀌면 왜 자동으로 다시 불려?',
    subtitle: 'SWR 캐시 키 원리 + mutate로 수동 갱신하는 타이밍',
    scenario: `SWR로 목록을 불러오는데, 필터(카테고리, 날짜 등)를 바꿀 때마다 자동으로 API가 다시 호출된다. 신기하게 잘 되긴 하는데... 왜 되는지 모르겠다. 그리고 글을 새로 등록했는데 목록이 안 바뀐다. mutate를 써야 한다는데, 어떻게 쓰는 건지?`,
    scenarioCode: `// 이렇게 짰는데 필터 바꾸면 자동으로 refetch됨 — 왜?
const [category, setCategory] = useState('all')

const { data } = useSWR(
  \`/api/posts?category=\${category}\`,  // 🤔 이게 바뀌면 자동으로?
  fetcher
)

// 그리고 글 등록 후 목록을 어떻게 갱신하지?
async function createPost(data: PostForm) {
  await api.post('/api/posts', data)
  // ← 여기서 뭔가 해야 목록이 업데이트될 것 같은데...
}`,
    whyItMatters: `SWR에서 key는 단순한 URL이 아니라 캐시의 식별자다. key가 바뀌면 "다른 데이터"로 인식해서 자동으로 새로 불러온다. 이 원리를 모르면 필터가 왜 자동으로 동작하는지 이해 못하고, mutate를 언제 어떻게 쓸지 몰라서 목록 갱신을 페이지 리프레시로 해결하게 된다.`,
    concept: `SWR은 key를 기준으로 캐시를 관리한다. 같은 key = 같은 캐시, 다른 key = 다른 캐시다. key가 변경되면 SWR은 자동으로 새 key에 대한 데이터를 fetch한다. mutate()는 캐시를 직접 무효화하거나 업데이트하는 함수다. 특정 key의 데이터를 강제로 새로고침하거나, 응답 없이 직접 값을 넣을 수 있다.`,
    examples: [
      {
        label: 'key 변경 → 자동 refetch 원리',
        code: `const [category, setCategory] = useState('all')
const [page, setPage] = useState(1)

// key가 변수를 포함하면 변수가 바뀔 때마다 다른 캐시로 인식
const { data, isLoading } = useSWR(
  \`/api/posts?category=\${category}&page=\${page}\`,
  fetcher,
  { keepPreviousData: true }  // 새 key 로딩 중 이전 데이터 유지
)

// category를 'react'로 바꾸면:
// key: '/api/posts?category=all&page=1'  → 캐시에 있으면 즉시 표시
//  ↓ 변경 후
// key: '/api/posts?category=react&page=1' → 새 key, 자동으로 fetch 시작
setCategory('react')`,
        note: 'key가 다르면 새로운 fetch. 같은 key면 캐시 반환 (stale-while-revalidate). keepPreviousData로 로딩 깜빡임 방지',
      },
      {
        label: 'mutate — 등록/수정/삭제 후 목록 갱신',
        code: `// useSWR이 반환하는 mutate는 해당 key의 데이터를 갱신
const { data: posts, mutate } = useSWR('/api/posts', fetcher)

async function handleCreatePost(formData: PostForm) {
  // 1. API 호출
  await api.post('/api/posts', formData)

  // 2. mutate()로 캐시 무효화 → 자동으로 재요청
  mutate()  // '/api/posts' 키를 다시 fetch

  // 또는 낙관적 업데이트 (서버 응답 기다리지 않고 UI 먼저 반영)
  mutate(
    async (currentPosts) => {
      const newPost = await api.post('/api/posts', formData)
      return [...currentPosts, newPost.data]  // 응답 데이터로 캐시 업데이트
    },
    { optimisticData: (current) => [...current, { ...formData, id: 'temp' }] }
  )
}`,
        note: 'mutate()는 인자 없이 호출하면 재요청. 함수를 넘기면 캐시 직접 업데이트 (낙관적 업데이트 가능)',
      },
      {
        label: 'useSWRMutation — 등록/수정/삭제 전용',
        code: `import useSWRMutation from 'swr/mutation'

// useSWRMutation: 데이터 변경(POST/PUT/DELETE) 전용
// useSWR은 읽기 전용, useSWRMutation은 쓰기 전용
const { trigger: createPost, isMutating } = useSWRMutation(
  '/api/posts',
  async (url, { arg }: { arg: PostForm }) => {
    const res = await api.post(url, arg)
    return res.data
  }
)

// trigger 호출 시 자동으로 '/api/posts' 캐시 무효화
await createPost({ title: '새 글', content: '...' })
//                 ↑ arg로 전달

// isMutating: 요청 중 여부 (로딩 상태)
<Button disabled={isMutating}>
  {isMutating ? '저장중...' : '저장'}
</Button>`,
        note: 'useSWRMutation은 수동으로 trigger를 호출해야 실행됨. useSWR은 자동 실행. 생성/수정/삭제는 useSWRMutation이 적합',
      },
      {
        label: '전역 mutate — 다른 컴포넌트의 캐시 갱신',
        code: `import { mutate } from 'swr'  // 전역 mutate

// 하위 컴포넌트에서 상위 컴포넌트의 캐시를 갱신할 때
function PostForm() {
  async function handleSubmit(data: PostForm) {
    await api.post('/api/posts', data)

    // 이 컴포넌트에서 useSWR을 안 써도 다른 컴포넌트의 캐시를 갱신 가능
    mutate('/api/posts')  // '/api/posts' key를 쓰는 모든 useSWR 재요청
  }
}

// ⚠️ key가 동적이면 패턴 매칭 사용
mutate((key) => typeof key === 'string' && key.startsWith('/api/posts'))
// '/api/posts?category=react', '/api/posts?page=2' 등 모두 무효화`,
        note: "전역 mutate는 key를 직접 지정. 동적 key라면 함수 형태로 패턴 매칭. 'swr'에서 import하는 것이 useSWR이 반환하는 mutate와 다름에 주의",
      },
    ],
    decisionGuide: [
      {
        condition: '필터/페이지 변경 시 자동으로 다른 데이터를 불러오고 싶다',
        answer: '변수를 key에 포함시키면 됨. key가 바뀌면 자동 fetch. keepPreviousData: true로 로딩 중 이전 데이터 표시',
      },
      {
        condition: '등록/수정/삭제 후 목록을 새로고침하고 싶다',
        answer: 'useSWR의 mutate() 호출 (인자 없음). 또는 전역 mutate(key) 사용. API 호출 후 반드시 mutate 필요',
      },
      {
        condition: '생성/수정 API 요청을 만들고 싶다',
        answer: 'useSWRMutation 사용. trigger() 함수로 수동 실행. isMutating으로 로딩 상태 추적',
      },
      {
        condition: '로딩 중에 이전 데이터가 사라지는 깜빡임이 있다',
        answer: 'keepPreviousData: true 옵션 추가. key 변경 중에도 이전 캐시를 표시',
      },
      {
        condition: 'key를 null로 설정하면?',
        answer: 'fetch를 실행하지 않음. 조건부 fetch에 활용. useSWR(condition ? url : null, fetcher)',
      },
    ],
    question: `다음 코드에서 "글 삭제 후 목록이 자동으로 갱신되지 않는" 이유를 설명하고, 수정된 코드를 작성하세요.

\`\`\`tsx
function PostList() {
  const { data: posts, mutate } = useSWR('/api/posts', fetcher)

  async function handleDelete(id: string) {
    await api.delete(\`/api/posts/\${id}\`)
    // 여기서 끝
  }

  return (
    <ul>
      {posts?.map(post => (
        <li key={post.id}>
          {post.title}
          <button onClick={() => handleDelete(post.id)}>삭제</button>
        </li>
      ))}
    </ul>
  )
}
\`\`\``,
    referenceAnswer: `이유: 삭제 API를 호출했지만 SWR 캐시를 갱신하는 코드가 없습니다. SWR은 캐시 기반으로 동작하므로, 외부에서 데이터가 바뀌어도 자동으로 감지하지 못합니다.

수정 방법 1 — mutate()로 재요청:
async function handleDelete(id: string) {
  await api.delete(\`/api/posts/\${id}\`)
  mutate()  // '/api/posts' 캐시를 무효화하고 재요청
}

수정 방법 2 — 낙관적 업데이트 (더 빠른 UX):
async function handleDelete(id: string) {
  mutate(
    async (current) => {
      await api.delete(\`/api/posts/\${id}\`)
      return current?.filter(p => p.id !== id)  // 삭제된 항목 즉시 제거
    },
    { optimisticData: posts?.filter(p => p.id !== id) }  // 서버 응답 전에 UI 먼저 반영
  )
}`,
    keyPoints: [
      'SWR key = 캐시 식별자. key가 바뀌면 새 fetch, 같으면 캐시 반환',
      '등록/수정/삭제 후 mutate() 호출 필수 — 안 하면 화면이 안 바뀜',
      'useSWR = 읽기(자동), useSWRMutation = 쓰기(수동 trigger)',
      'null key → fetch 중단. 조건부 fetch: useSWR(isReady ? url : null, fetcher)',
    ],
    tags: ['SWR', '데이터패칭', 'mutate', '캐시', 'useSWRMutation'],
  },

  // ──────────────────────────────────────────────────────────────────────
  // Next.js
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'nextjs-middleware',
    category: 'Next.js',
    emoji: '🛡️',
    title: '미들웨어가 뭐고 언제 쓰는 거야?',
    subtitle: 'Next.js middleware.ts — 인증 체크, 경로 보호, 헤더 추가',
    scenario: `대시보드 페이지들이 10개가 넘는다. 로그인 안 한 사람이 주소를 직접 치고 들어오면 막아야 하는데, 모든 page.tsx에 세션 체크 코드를 붙이기엔 너무 반복된다. 미들웨어를 쓰면 된다고 하는데, 미들웨어가 뭔지, 어디에 파일을 만드는지, 어떻게 동작하는지 모르겠다.`,
    scenarioCode: `// 미들웨어 없이 모든 페이지에 이걸 반복해야 할까?
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')  // 반복 ①
  // ...
}

// app/settings/page.tsx
export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')  // 반복 ②
  // ...
}

// app/members/page.tsx
export default async function MembersPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')  // 반복 ③ ... 10개 더
}`,
    whyItMatters: `인증 체크를 페이지마다 반복하면 하나라도 빠뜨리면 보안 구멍이 된다. 미들웨어는 요청이 페이지/API에 도달하기 전에 실행되는 "관문"이다. 인증 체크, 경로 보호, 헤더 추가 같은 공통 로직을 한 곳에서 처리할 수 있다. 특히 NextAuth는 withAuth 미들웨어를 제공해서 훨씬 간단하게 구현할 수 있다.`,
    concept: `미들웨어(middleware.ts)는 요청이 서버에 도착했을 때, 페이지나 API Route가 실행되기 전에 먼저 실행되는 함수다. 파일 위치는 프로젝트 루트(src/ 사용 시 src/middleware.ts). matcher 설정으로 어떤 경로에 적용할지 지정한다. Edge Runtime에서 실행되므로 Node.js API(fs 등)는 쓸 수 없다.`,
    examples: [
      {
        label: '기본 구조 — 인증 없는 접근 차단',
        code: `// src/middleware.ts (또는 프로젝트 루트 middleware.ts)
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  const isAuthPage = request.nextUrl.pathname.startsWith('/login')

  // 로그인 안 됐고, 로그인 페이지도 아니면 → 로그인으로
  if (!isAuthenticated && !isAuthPage) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 이미 로그인했는데 로그인 페이지 접근 → 홈으로
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()  // 통과
}

// 어떤 경로에 미들웨어를 적용할지
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  // api, 정적 파일은 제외하고 나머지 전부 적용
}`,
        note: '미들웨어 파일 위치: src/middleware.ts. matcher로 적용 경로 지정. return NextResponse.next()는 "그대로 통과"',
      },
      {
        label: 'NextAuth withAuth — admin 프로젝트 실제 패턴',
        code: `// src/middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server'

// ① 미들웨어 로직 (withAuth 통과 후 실행)
const middleware = (request: NextRequest) => {
  // 현재 경로를 헤더에 추가 (서버 컴포넌트에서 읽기 위해)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-current-pathname', request.nextUrl.pathname)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

// ② withAuth: 토큰 없으면 자동으로 signIn 페이지로
export default withAuth(middleware, {
  callbacks: {
    authorized: ({ token }) => {
      // forceLogout 플래그 있으면 강제 로그아웃
      if (token?.forceLogout) return false
      return !!token  // 토큰 있으면 통과
    },
  },
})

export const config = {
  // 이 경로들은 미들웨어 적용 안 함 (negative lookahead)
  matcher: ['/((?!api|login|register|_next|favicon).*)'],
}`,
        note: 'withAuth(내부로직, 옵션) 패턴. authorized 콜백에서 false 반환 시 → signIn 페이지로 자동 리다이렉트',
      },
      {
        label: 'role 기반 접근 제어',
        code: `// 특정 경로는 admin만 접근 가능
export default withAuth(
  function middleware(request) {
    const token = request.nextauth.token
    const pathname = request.nextUrl.pathname

    // /admin/* 경로에 일반 유저가 접근하면
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/403', request.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,  // 기본: 로그인만 확인
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/settings/:path*'],
  //         ↑ 동적 세그먼트도 가능
}`,
        note: 'matcher에 :path*로 하위 경로 전체 적용. role 체크는 미들웨어에서 하되, API는 서버에서도 다시 확인 (Defense in Depth)',
      },
      {
        label: '미들웨어 vs API 레벨 인증 — 둘 다 해야 하는 이유',
        code: `// ❓ 미들웨어에서 인증 체크하는데 API에서 또 해야 해?
// → YES. 이유:

// 1. 미들웨어는 페이지 라우트만 보호
//    matcher에서 /api를 제외하면 API는 무방비
export const config = {
  matcher: ['/((?!api|...).*)'],  // api 제외!
}

// 2. 미들웨어를 우회할 수 있음 (curl 등 직접 호출)
// curl https://myapp.com/api/posts -H "직접 요청"
// → 미들웨어 없이 API에 접근 가능

// 3. 역할(role) 체크는 API 레벨에서 다시 해야 안전
// app/api/admin/route.ts
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: '401' }, { status: 401 })
  if (session.user.role !== 'admin') return Response.json({ error: '403' }, { status: 403 })
  // ...
}
// 미들웨어: 페이지 접근 1차 차단 (UX)
// API 레벨: 실제 데이터 보호 (Security)`,
        note: '미들웨어 = UX 보호 (잘못된 페이지 접근 방지). API 레벨 = 실제 보안. 둘 다 필요하며 역할이 다름',
      },
    ],
    decisionGuide: [
      {
        condition: '로그인 안 한 사람이 대시보드에 접근하면 막고 싶다',
        answer: 'middleware.ts에서 getToken()으로 확인 후 redirect. matcher로 보호할 경로 지정',
      },
      {
        condition: '특정 경로는 admin만 접근 가능하게 하고 싶다',
        answer: '미들웨어에서 pathname 체크 + token.role 확인. API는 서버에서 별도로 role 체크 (Defense in Depth)',
      },
      {
        condition: '미들웨어에서 DB 조회를 하고 싶다',
        answer: 'Edge Runtime에서는 Prisma 등 일부 라이브러리 동작 안 함. DB 조회는 page/API 레벨에서. 미들웨어는 토큰 검사만',
      },
      {
        condition: 'API Route도 인증이 필요하다',
        answer: '미들웨어 matcher에서 /api를 포함시키거나, API Route 내부에서 직접 세션 체크. 민감한 API는 반드시 API 레벨에서도 확인',
      },
      {
        condition: 'matcher 패턴을 어떻게 짜야 해?',
        answer: "/((?!제외경로1|제외경로2).*)  형태의 negative lookahead 사용. /api, /_next/static, /favicon.ico 등은 보통 제외",
      },
    ],
    question: `Next.js 앱에서 다음 요구사항을 미들웨어로 구현한다면 어떻게 짜겠습니까?

요구사항:
- /dashboard/*, /settings/* 경로는 로그인해야 접근 가능
- 미로그인 시 /login?callbackUrl=원래경로 로 리다이렉트
- /api 경로와 정적 파일은 미들웨어 적용 제외`,
    referenceAnswer: `\`\`\`ts
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  if (!token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
  // /api, _next 등은 matcher에 포함시키지 않으면 자동 제외됨
}
\`\`\`

미들웨어에서 getToken()으로 JWT 토큰 유무를 확인하고, 없으면 현재 경로를 callbackUrl로 담아서 /login으로 리다이렉트합니다. matcher를 /dashboard/:path*와 /settings/:path*로만 지정해서 해당 경로에만 적용합니다.`,
    keyPoints: [
      '미들웨어는 페이지/API 실행 전 "관문". Edge Runtime에서 동작 → Prisma 등 Node.js 전용 라이브러리 사용 불가',
      'matcher로 적용 경로 지정. /api, /_next/static은 보통 제외',
      '미들웨어(UX 보호) + API 레벨 인증(실제 보안) — 둘 다 필요, 역할이 다름',
      'withAuth는 NextAuth 전용 미들웨어 헬퍼. authorized 콜백에서 false 반환 시 자동 리다이렉트',
    ],
    tags: ['Next.js', '미들웨어', '인증', 'NextAuth', '경로보호'],
  },

  {
    id: 'prisma-n-plus-one',
    category: 'DB 설계',
    emoji: '🐢',
    title: 'N+1 쿼리, 왜 느려지는 거야?',
    subtitle: '반복문 안에서 DB 호출 — 성능 최악의 패턴과 해결법',
    scenario: `대시보드 페이지가 처음엔 잘 됐는데, 회원이 100명을 넘으면서 느려지기 시작했다. 코드를 보면 별로 복잡한 게 없는데... 왜 느린 걸까? 알고보니 "100명 조회"했더니 사실은 DB에 301번 쿼리가 날아가고 있었다. N+1 문제라는 게 뭔지, 어떻게 찾고 어떻게 고치는지.`,
    scenarioCode: `// 실제 admin 프로젝트 코드 (ThumbnailMaster.tsx)
// 회원 10명 = DB 쿼리 최소 21번 발생!

const users = await prisma.businessusers.findMany({
  where: { trainerId, useYn: 'Y' },
})
// ① 쿼리 1번: 전체 회원 조회

for (const user of users) {
  // ② 쿼리 N번: 회원마다 스케줄 조회
  const schedule = await prisma.userptschedules.findFirst({
    where: { uid: user.uid }
  })

  if (schedule) {
    // ③ 쿼리 N번: 회원마다 히스토리 조회
    const histories = await prisma.thumbnailmasterhistories.findMany({
      where: { uid: user.uid }
    })
  }
}
// 회원 10명 → 1 + 10 + 10 = 21번 쿼리
// 회원 100명 → 1 + 100 + 100 = 201번 쿼리 😱`,
    whyItMatters: `N+1 쿼리는 "1번 조회 + N번 반복 조회"가 합쳐진 패턴이다. 데이터가 적을 때는 티가 안 나지만, 회원이 100명, 1000명이 되면 쿼리가 201번, 2001번으로 늘어난다. 실무에서 가장 흔한 성능 버그 중 하나이고, 코드만 보면 이상해 보이지 않아서 발견하기도 어렵다. Prisma Logging으로 쿼리 수를 확인하는 방법을 알면 바로 발견할 수 있다.`,
    concept: `N+1 문제는 1번의 "목록 조회" 후 각 항목에 대해 N번의 "개별 조회"가 반복되는 패턴이다. 해결책은 두 가지다: (1) Prisma include로 관련 데이터를 한 번에 조인 조회, (2) 먼저 전체 ID 목록을 모아서 한 번에 in 쿼리로 조회. 어떤 방식이 더 나은지는 데이터 크기와 관계 구조에 따라 다르다.`,
    examples: [
      {
        label: '❌ N+1 발생 — for loop 안에서 DB 호출',
        code: `// 🐢 N+1 패턴: 회원 100명 = 201번 쿼리
const users = await prisma.businessusers.findMany({
  where: { trainerId }
})

for (const user of users) {
  // 🚨 각 user마다 별도 쿼리 실행
  const pt = await prisma.userptschedules.findFirst({
    where: { uid: user.uid }
  })
  // 전체 쿼리 수 = 1 + N
}

// 이걸 발견하는 법: Prisma 로그 켜기
const prisma = new PrismaClient({
  log: ['query'],  // 모든 쿼리를 콘솔에 출력
})
// 로그에 SELECT ... WHERE uid = '...' 가 N번 반복되면 N+1 문제`,
        note: 'for / forEach / map 안에서 await prisma.xxx.find 패턴이 보이면 N+1 의심. 쿼리 로그 켜서 개수 확인',
      },
      {
        label: '✅ 해결 1 — Prisma include로 한 번에 조인',
        code: `// ✅ include: 관련 데이터를 한 쿼리로 같이 가져옴
const users = await prisma.businessusers.findMany({
  where: { trainerId, useYn: 'Y' },
  include: {
    // users와 연결된 userptschedules도 같이 조회
    userptschedules: {
      where: { usedYn: 'Y', scheduleState: '1' },
      orderBy: { scheduleDt: 'desc' },
      take: 1,  // 최근 1개만
    },
    thumbnailmasterhistories: true,
  },
})
// 쿼리 수: 1~2번 (JOIN으로 처리)

// 이제 for loop 안에서 추가 쿼리 없이 접근
for (const user of users) {
  const schedule = user.userptschedules[0]  // 이미 포함됨
  const histories = user.thumbnailmasterhistories  // 이미 포함됨
}`,
        note: 'include는 Prisma에서 관련 테이블을 JOIN으로 가져오는 방법. 단, 데이터가 많으면 한 번에 너무 많이 가져올 수 있음',
      },
      {
        label: '✅ 해결 2 — ID 목록 모아서 한 번에 in 조회',
        code: `// ✅ 먼저 users 조회 → uid 목록 추출 → in 쿼리로 한 번에
const users = await prisma.businessusers.findMany({
  where: { trainerId, useYn: 'Y' },
  select: { uid: true, name: true },  // 필요한 필드만
})

const uids = users.map(u => u.uid)  // uid 목록 추출

// 한 번에 모든 schedule 조회
const schedules = await prisma.userptschedules.findMany({
  where: {
    uid: { in: uids },  // ← in 쿼리: uid가 목록 중 하나인 것
    usedYn: 'Y',
    scheduleState: '1',
  },
})

// Map으로 uid → schedule 매핑 (O(1) 접근)
const scheduleMap = new Map(schedules.map(s => [s.uid, s]))

// 이제 DB 쿼리 없이 매핑
for (const user of users) {
  const schedule = scheduleMap.get(user.uid)  // 추가 쿼리 없음
}
// 전체 쿼리 수: 2번 (users 조회 + schedules 조회)`,
        note: 'in 쿼리 패턴: ID 목록 모으기 → WHERE id IN (...) → Map으로 매핑. include보다 유연하고 필요한 데이터만 가져올 수 있음',
      },
      {
        label: '✅ 해결 3 — Promise.all로 병렬 실행 (부분 해결)',
        code: `// 관계가 없어서 JOIN이 안 될 때: 병렬 실행으로 시간 단축
const users = await prisma.businessusers.findMany({ where: { trainerId } })

// ❌ 순차 실행: user1 기다리고 → user2 기다리고 → ...
for (const user of users) {
  const pt = await prisma.userptschedules.findFirst({ where: { uid: user.uid } })
}

// ✅ 병렬 실행: 동시에 모두 요청
const schedulePromises = users.map(user =>
  prisma.userptschedules.findFirst({ where: { uid: user.uid } })
)
const schedules = await Promise.all(schedulePromises)
// 쿼리 수는 여전히 N+1이지만, 시간은 1개 쿼리 시간으로 단축

// ⚠️ 이건 완전한 해결은 아님. N개 쿼리 자체는 남아있음
// → DB 연결 수 제한에 걸릴 수 있음 (Prisma 기본값: 10개)`,
        note: 'Promise.all은 쿼리 수는 그대로지만 병렬로 실행해서 시간 단축. 완전한 해결은 아님. N이 클수록 DB 연결 고갈 위험',
      },
    ],
    decisionGuide: [
      {
        condition: 'for loop 안에 await prisma 코드가 있다',
        answer: 'N+1 의심. Prisma log: [\'query\'] 켜서 실제 쿼리 수 확인. include나 in 쿼리로 교체 검토',
      },
      {
        condition: '연관된 데이터를 같이 가져오고 싶다 (1:N 관계)',
        answer: 'Prisma include 사용. Prisma schema에 relation 정의되어 있어야 함',
      },
      {
        condition: 'Prisma schema에 relation이 없어서 include를 못 쓴다',
        answer: 'ID 목록을 먼저 모으고 WHERE uid IN (...) 쿼리로 한 번에 조회. Map으로 매핑',
      },
      {
        condition: '조회하는 필드가 너무 많아서 한 번에 가져오면 느리다',
        answer: 'select로 필요한 필드만 지정. include 대신 ID 목록 모아서 필요한 필드만 두 번 쿼리',
      },
      {
        condition: '페이지가 갑자기 느려졌다 (데이터 증가 후)',
        answer: 'Prisma 로그 켜서 쿼리 수 확인. N+1이면 include 또는 in 쿼리로 해결. DB 인덱스 누락 여부도 확인',
      },
    ],
    question: `다음 코드에서 N+1 문제가 발생하는 이유를 설명하고, Prisma의 \`in\` 쿼리를 사용해서 2번의 DB 쿼리로 해결하는 코드를 작성하세요.

\`\`\`ts
// 모든 트레이너의 최근 PT 횟수를 보여주는 대시보드
const trainers = await prisma.businesstrainers.findMany({
  where: { useYn: 'Y' }
})

const results = []
for (const trainer of trainers) {
  const ptCount = await prisma.userptschedules.count({
    where: { trainerId: trainer.id, usedYn: 'Y' }
  })
  results.push({ name: trainer.name, ptCount })
}
\`\`\``,
    referenceAnswer: `N+1 원인: trainers 조회 1번 + 각 trainer마다 ptCount 조회 N번 = 총 N+1번 쿼리. 트레이너가 50명이면 51번 쿼리 발생.

해결 코드 (2번 쿼리):
\`\`\`ts
// 1번째 쿼리: 트레이너 목록
const trainers = await prisma.businesstrainers.findMany({
  where: { useYn: 'Y' },
  select: { id: true, name: true },
})

const trainerIds = trainers.map(t => t.id)

// 2번째 쿼리: 모든 트레이너의 PT 기록을 한 번에
const ptSchedules = await prisma.userptschedules.findMany({
  where: { trainerId: { in: trainerIds }, usedYn: 'Y' },
  select: { trainerId: true },
})

// Map으로 trainerId별 count 계산 (DB 추가 호출 없음)
const countMap = new Map<string, number>()
for (const s of ptSchedules) {
  countMap.set(s.trainerId, (countMap.get(s.trainerId) ?? 0) + 1)
}

const results = trainers.map(t => ({
  name: t.name,
  ptCount: countMap.get(t.id) ?? 0,
}))
\`\`\``,
    keyPoints: [
      'N+1 = "목록 조회 1번 + 각 항목마다 N번" → 데이터 늘수록 기하급수적으로 느려짐',
      '발견법: Prisma log: [\'query\'] 켜서 같은 구조의 쿼리가 반복되는지 확인',
      '해결 1: Prisma include (JOIN), 해결 2: ID 목록 → WHERE IN 쿼리 + Map 매핑',
      'Promise.all은 병렬화로 시간을 줄이지만 쿼리 수는 그대로 — 근본 해결 아님',
    ],
    tags: ['Prisma', 'DB', 'N+1', '성능', 'MongoDB'],
  },
]

export function getDeepTopicById(id: string) {
  return deepTopics.find((t) => t.id === id)
}
