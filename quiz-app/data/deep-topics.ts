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
]

export function getDeepTopicById(id: string) {
  return deepTopics.find((t) => t.id === id)
}
