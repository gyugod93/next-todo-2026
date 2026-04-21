import type { Lesson } from '@/types'

export const realworldLessons: Lesson[] = [
  {
    id: 'rw-l-001',
    category: 'realworld',
    subcategory: 'server-state',
    title: 'TanStack Query 실전 — 서버 상태 완전 정복',
    description:
      '처음엔 왜 필요한지 모르다가, 직접 써보면 다시는 useEffect로 fetch 안 하게 됩니다',
    emoji: '🔄',
    readingTime: 10,
    tags: ['tanstack-query', 'react-query', 'server-state', 'caching'],
    sections: [
      {
        title: '왜 useEffect + fetch를 버려야 하는가',
        content: `useEffect로 데이터를 가져오는 코드를 직접 짜보면 반드시 이 문제들을 만납니다:

**1. 로딩/에러 상태 매번 직접 관리**
**2. 컴포넌트 언마운트 후 setState 호출 경고**
**3. 같은 데이터를 여러 컴포넌트에서 중복 fetch**
**4. 사용자가 탭 전환 후 돌아왔을 때 데이터 자동 갱신 안 됨**
**5. 낙관적 업데이트(Optimistic Update) 직접 구현이 복잡**

TanStack Query는 이 모든 문제를 해결합니다. **서버 상태 관리**에 특화된 라이브러리입니다.`,
      },
      {
        title: 'useQuery — 데이터 읽기',
        content: `staleTime과 gcTime(구 cacheTime)의 차이를 이해하는 게 핵심입니다. 헷갈리는 사람이 많습니다.

**staleTime**: 이 시간 동안은 데이터가 "신선"하다고 판단 → refetch 안 함 (기본값: 0)
**gcTime**: 사용하지 않는 캐시를 메모리에서 제거할 때까지 대기 시간 (기본값: 5분)

실전 시나리오: staleTime=60000 설정
→ 마운트 시 캐시에서 즉시 보여줌 → 1분이 안 됐으면 refetch 안 함 → 1분 지났으면 background refetch`,
        code: `import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// API 함수 정의 — query 함수는 별도 파일로 분리하는 게 best practice
async function fetchProducts(categoryId: string) {
  const res = await fetch(\`/api/products?category=\${categoryId}\`)
  if (!res.ok) throw new Error(\`\${res.status} \${res.statusText}\`) // 반드시 throw!
  return res.json() as Promise<Product[]>
}

// 컴포넌트에서 사용
function ProductList({ categoryId }: { categoryId: string }) {
  const {
    data,          // 성공 시 데이터
    isLoading,     // 최초 로딩 (캐시 없음)
    isFetching,    // 백그라운드 갱신 중
    isError,
    error,
    refetch,       // 수동 재요청
  } = useQuery({
    queryKey: ['products', categoryId], // 캐시 키 — 배열로 계층화
    queryFn: () => fetchProducts(categoryId),
    staleTime: 1000 * 60,      // 1분간 신선 유지
    gcTime: 1000 * 60 * 5,     // 5분간 캐시 유지
    retry: 2,                   // 실패 시 2회 재시도
    enabled: !!categoryId,      // categoryId 있을 때만 실행
    placeholderData: (prev) => prev, // 키 변경 시 이전 데이터 유지 (페이지네이션)
  })

  if (isLoading) return <Skeleton />
  if (isError) return <ErrorMessage error={error} />

  return (
    <div>
      {isFetching && <span className="text-xs text-gray-400">업데이트 중...</span>}
      {data?.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}`,
        language: 'typescript',
      },
      {
        title: 'useMutation + Optimistic Update',
        content: `Mutation은 데이터를 변경하는 작업(POST/PUT/DELETE)에 사용합니다. Optimistic Update는 서버 응답을 기다리지 않고 UI를 먼저 업데이트하는 기법으로, 실제로 느린 네트워크에서 체감이 확 바뀝니다.

**흐름:**
1. 버튼 클릭
2. 즉시 UI 업데이트 (낙관적으로)
3. 서버 요청 전송
4. 성공 → 서버 데이터로 동기화 / 실패 → 이전 상태로 롤백`,
        code: `function TodoItem({ todo }: { todo: Todo }) {
  const queryClient = useQueryClient()

  const toggleMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(\`/api/todos/\${id}/toggle\`, { method: 'PATCH' }).then(r => r.json()),

    // 1. Optimistic Update — 서버 응답 전에 UI 업데이트
    onMutate: async (todoId) => {
      // 진행 중인 refetch 취소 (충돌 방지)
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      // 현재 캐시 저장 (롤백용)
      const previous = queryClient.getQueryData<Todo[]>(['todos'])

      // 캐시를 낙관적으로 업데이트
      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.map(t => t.id === todoId ? { ...t, done: !t.done } : t) ?? []
      )

      return { previous } // context로 전달
    },

    // 2. 실패 시 롤백
    onError: (_err, _id, context) => {
      queryClient.setQueryData(['todos'], context?.previous)
    },

    // 3. 성공/실패 모두 → 서버 데이터로 동기화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return (
    <button
      onClick={() => toggleMutation.mutate(todo.id)}
      disabled={toggleMutation.isPending}
    >
      {todo.done ? '✅' : '⬜'} {todo.title}
    </button>
  )
}`,
        language: 'typescript',
      },
      {
        title: '실전 세팅 — QueryClient 전역 설정',
        content: `프로젝트 시작 시 QueryClient를 적절히 설정하면 이후 개별 쿼리에서 반복 설정을 줄일 수 있습니다.`,
        code: `// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,        // 기본 1분
      gcTime: 1000 * 60 * 10,      // 기본 10분
      retry: 1,                     // 실패 시 1회만 재시도
      refetchOnWindowFocus: true,   // 탭 포커스 시 refetch (기본 true)
    },
    mutations: {
      onError: (error) => {
        // 전역 에러 토스트
        toast.error(error instanceof Error ? error.message : '요청 실패')
      },
    },
  },
})

// app/providers.tsx
'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 Devtools 표시 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'staleTime: 이 시간 안에는 refetch 안 함 / gcTime: 사용 안 하는 캐시 삭제 대기',
      'queryFn에서 에러 시 반드시 throw — throw 안 하면 isError가 true가 안 됨',
      'queryKey 배열 계층화: [\'products\', categoryId] — categoryId 바뀌면 자동 재요청',
      'Optimistic Update: onMutate에서 UI 업데이트, onError에서 롤백, onSettled에서 동기화',
    ],
    relatedProblemIds: ['rw-q-001', 'rw-q-002'],
  },
  {
    id: 'rw-l-002',
    category: 'realworld',
    subcategory: 'forms',
    title: 'React Hook Form + Zod — 실전 폼 처리',
    description: '제어 컴포넌트의 리렌더링 문제를 해결하고, 타입 안전한 검증까지 한 번에',
    emoji: '📝',
    readingTime: 8,
    tags: ['react-hook-form', 'zod', 'form', 'validation'],
    sections: [
      {
        title: '왜 직접 짜면 안 되는가',
        content: `폼을 직접 구현하면 반드시 이런 코드가 됩니다:

\`\`\`tsx
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [emailError, setEmailError] = useState('')
const [isSubmitting, setIsSubmitting] = useState(false)
// ... 필드 10개면 상태 30개
\`\`\`

**문제점:**
1. 입력마다 useState가 전체 컴포넌트 리렌더링 유발 (입력 필드 50개면 50번 리렌더)
2. 검증 로직이 컴포넌트와 뒤섞임
3. 서버 에러를 필드별로 표시하는 코드가 복잡

React Hook Form은 **비제어 컴포넌트**(ref 기반)로 상태를 관리해 리렌더링을 최소화합니다.`,
      },
      {
        title: '기본 세팅 — register + handleSubmit',
        code: `import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 1. Zod 스키마 정의 — 검증 규칙 + 타입 자동 추론
const signupSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  password: z
    .string()
    .min(8, '비밀번호는 8자 이상이어야 합니다')
    .regex(/[A-Z]/, '대문자를 포함해야 합니다')
    .regex(/[0-9]/, '숫자를 포함해야 합니다'),
  confirmPassword: z.string(),
  age: z.coerce.number().min(14, '14세 이상만 가입 가능합니다'), // string → number 변환
}).refine(
  (data) => data.password === data.confirmPassword,
  { message: '비밀번호가 일치하지 않습니다', path: ['confirmPassword'] }
)

type SignupForm = z.infer<typeof signupSchema> // 타입 자동 생성

function SignupForm() {
  const {
    register,          // input에 연결
    handleSubmit,      // 검증 후 submit
    formState: { errors, isSubmitting, isDirty },
    setError,          // 서버 에러를 특정 필드에 설정
    reset,
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', age: 0 },
  })

  const onSubmit = async (data: SignupForm) => {
    try {
      await signupApi(data)
      reset()
    } catch (error) {
      if (error instanceof ApiError && error.field) {
        // 서버 에러를 특정 필드에 표시
        setError(error.field as keyof SignupForm, {
          message: error.message,
        })
      } else {
        // 전체 폼 에러
        setError('root', { message: '회원가입에 실패했습니다' })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          {...register('email')}
          placeholder="이메일"
          className={errors.email ? 'border-red-500' : 'border-gray-300'}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <input
          {...register('password')}
          type="password"
          placeholder="비밀번호"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {/* 전체 폼 에러 */}
      {errors.root && (
        <p className="text-red-500 text-sm">{errors.root.message}</p>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '처리 중...' : '가입하기'}
      </button>
    </form>
  )
}`,
        language: 'typescript',
        content: `Zod 스키마가 타입과 검증을 동시에 처리합니다. 스키마만 수정하면 TypeScript 타입도 자동으로 바뀝니다.`,
      },
      {
        title: 'Controller — 서드파티 UI 컴포넌트 연동',
        content: `Radix UI, shadcn/ui 같은 커스텀 컴포넌트는 register가 직접 동작하지 않습니다. 이때 Controller를 사용합니다.`,
        code: `import { Controller } from 'react-hook-form'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

function ProductForm() {
  const { control, handleSubmit } = useForm<ProductForm>()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Controller로 커스텀 컴포넌트 연동 */}
      <Controller
        name="category"
        control={control}
        rules={{ required: '카테고리를 선택해주세요' }}
        render={({ field, fieldState }) => (
          <div>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger ref={field.ref}>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">전자기기</SelectItem>
                <SelectItem value="clothing">의류</SelectItem>
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-red-500 text-sm">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
    </form>
  )
}

// useFormContext — 깊은 컴포넌트에서 form에 접근 (prop drilling 방지)
function FormProvider({ children }: { children: React.ReactNode }) {
  const methods = useForm<SignupForm>({ resolver: zodResolver(signupSchema) })
  return (
    <FormProviderContext {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProviderContext>
  )
}

// 자식 컴포넌트에서
function EmailField() {
  const { register, formState: { errors } } = useFormContext<SignupForm>()
  return (
    <div>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
    </div>
  )
}`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'RHF는 ref 기반 비제어 컴포넌트 → 입력 시 리렌더링 없음 (useState 방식과 차이)',
      'zodResolver로 Zod 스키마를 검증기로 연결 — 타입 추론도 자동',
      'setError로 서버 에러를 특정 필드나 root에 표시 가능',
      '커스텀 UI 컴포넌트는 Controller로 감싸서 연동',
    ],
    relatedProblemIds: ['rw-q-003', 'rw-q-004'],
  },
  {
    id: 'rw-l-003',
    category: 'realworld',
    subcategory: 'state',
    title: 'Zustand 실전 — 전역 상태 설계',
    description: '장바구니, 모달, 사용자 세션 등 실제 앱에서 Zustand 슬라이스 패턴으로 설계하기',
    emoji: '🐻',
    readingTime: 7,
    tags: ['zustand', 'state-management', 'persist', 'slice-pattern'],
    sections: [
      {
        title: 'Zustand가 Redux보다 나은 이유',
        content: `Redux는 Action → Reducer → Store의 흐름이 명시적이지만 보일러플레이트가 많습니다. Zustand는 같은 역할을 훨씬 적은 코드로 합니다.

**언제 Zustand를 쓰는가:**
- 여러 컴포넌트가 공유하는 상태 (장바구니, 사용자 정보, 모달 스택)
- URL에 저장하기 애매한 UI 상태 (사이드바 열림 여부)
- 서버 상태가 아닌 클라이언트 상태

**언제 쓰지 않는가:**
- 서버 데이터 캐싱 → TanStack Query 사용
- 단일 컴포넌트 로컬 상태 → useState
- URL 연동 필요한 필터/페이지 → searchParams`,
      },
      {
        title: '실전 스토어 설계 — 장바구니',
        code: `import { create } from 'zustand'
import { persist, devtools, immer } from 'zustand/middleware'
// npm install zustand immer

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  // 액션
  addItem: (product: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  // 파생 상태 (computed)
  totalPrice: () => number
  totalCount: () => number
}

export const useCartStore = create<CartStore>()(
  devtools(          // Redux DevTools 연동
    persist(         // localStorage에 자동 저장
      immer(         // 불변성 없이 직접 수정 가능
        (set, get) => ({
          items: [],

          addItem: (product) => set((state) => {
            const existing = state.items.find(i => i.id === product.id)
            if (existing) {
              existing.quantity += 1 // immer 덕분에 직접 수정 가능
            } else {
              state.items.push({ ...product, quantity: 1 })
            }
          }),

          removeItem: (id) => set((state) => {
            state.items = state.items.filter(i => i.id !== id)
          }),

          updateQuantity: (id, quantity) => set((state) => {
            const item = state.items.find(i => i.id === id)
            if (item) {
              item.quantity = Math.max(0, quantity)
              if (item.quantity === 0) {
                state.items = state.items.filter(i => i.id !== id)
              }
            }
          }),

          clearCart: () => set({ items: [] }),

          // get()으로 현재 상태 접근
          totalPrice: () => get().items.reduce(
            (sum, item) => sum + item.price * item.quantity, 0
          ),
          totalCount: () => get().items.reduce(
            (sum, item) => sum + item.quantity, 0
          ),
        })
      ),
      {
        name: 'cart-storage',  // localStorage 키
        // 특정 필드만 저장 (함수는 직렬화 불가 → 제외)
        partialize: (state) => ({ items: state.items }),
      }
    ),
    { name: 'CartStore' }  // DevTools 이름
  )
)`,
        language: 'typescript',
        content: `persist 미들웨어로 페이지 새로고침 후에도 장바구니가 유지되고, immer로 불변성 코드 없이 직접 수정 가능합니다.`,
      },
      {
        title: '슬라이스 패턴 — 스토어 분리',
        content: `앱이 커지면 하나의 큰 스토어보다 도메인별로 분리하는 게 유지보수에 좋습니다. 하지만 필요하면 합칠 수도 있습니다.`,
        code: `// store/slices/uiSlice.ts
interface UISlice {
  sidebarOpen: boolean
  modalStack: string[]
  toggleSidebar: () => void
  openModal: (id: string) => void
  closeModal: () => void
}

export const createUISlice = (
  set: (fn: (state: UISlice) => void) => void
): UISlice => ({
  sidebarOpen: false,
  modalStack: [],
  toggleSidebar: () => set((state) => { state.sidebarOpen = !state.sidebarOpen }),
  openModal: (id) => set((state) => { state.modalStack.push(id) }),
  closeModal: () => set((state) => { state.modalStack.pop() }),
})

// store/slices/userSlice.ts
interface UserSlice {
  user: User | null
  setUser: (user: User | null) => void
}

export const createUserSlice = (set: (fn: (state: UserSlice) => void) => void): UserSlice => ({
  user: null,
  setUser: (user) => set((state) => { state.user = user }),
})

// store/index.ts — 슬라이스 합치기
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type StoreState = UISlice & UserSlice

export const useAppStore = create<StoreState>()(
  immer((set) => ({
    ...createUISlice(set),
    ...createUserSlice(set),
  }))
)

// 사용 — 필요한 것만 구독 (불필요한 리렌더링 방지)
function Header() {
  // sidebarOpen만 구독 → user 변경 시 Header 리렌더 안 됨
  const { sidebarOpen, toggleSidebar } = useAppStore(
    (state) => ({ sidebarOpen: state.sidebarOpen, toggleSidebar: state.toggleSidebar })
  )
  return <button onClick={toggleSidebar}>{sidebarOpen ? '닫기' : '메뉴'}</button>
}`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'persist로 localStorage 자동 연동, partialize로 함수 제외하고 직렬화 가능한 것만 저장',
      'immer 미들웨어로 state.items.push() 같은 직관적인 업데이트 코드 작성',
      '슬라이스 패턴으로 도메인별 분리 후 합치기 — 대규모 앱에서 유지보수성 향상',
      '구독 시 필요한 필드만 selector로 추출 → 불필요한 리렌더링 방지',
    ],
    relatedProblemIds: ['rw-q-005'],
  },
  {
    id: 'rw-l-004',
    category: 'realworld',
    subcategory: 'auth',
    title: 'NextAuth.js 실전 — 인증 구현',
    description: 'OAuth + JWT 세션 + Middleware 보호 라우트 — 실제 프로젝트에서 바로 쓸 수 있는 설정',
    emoji: '🔑',
    readingTime: 9,
    tags: ['nextauth', 'oauth', 'jwt', 'middleware', 'session'],
    sections: [
      {
        title: 'NextAuth.js 설정',
        content: `NextAuth(Auth.js v5)는 Next.js에서 인증을 구현하는 표준 라이브러리입니다. Google, GitHub, Kakao 등 OAuth 프로바이더와 이메일/패스워드 방식을 지원합니다.

**Auth.js v5(beta) vs NextAuth v4:**
- v5: App Router 완전 지원, Edge Runtime, 설정 파일 구조 변경
- v4: Pages Router 중심, 여전히 많은 프로젝트에서 사용

아래는 **v4 기준**입니다 (현재 가장 많이 사용되는 버전).`,
        code: `// pages/api/auth/[...nextauth].ts (v4) 또는 auth.ts (v5)
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'

export const authOptions = {
  adapter: PrismaAdapter(prisma), // DB에 세션/유저 저장
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // 이메일+비밀번호 로그인
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user || !user.password) return null
        const valid = await bcrypt.compare(credentials.password, user.password)
        return valid ? user : null // null 반환 시 로그인 실패
      },
    }),
  ],
  // JWT 콜백 — 토큰에 추가 정보 주입
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role  // DB의 role을 토큰에 저장
        token.id = user.id
      }
      return token
    },
    // session 콜백 — useSession()으로 접근 가능한 데이터 설정
    async session({ session, token }) {
      session.user.role = token.role as string
      session.user.id = token.id as string
      return session
    },
  },
  pages: {
    signIn: '/login',     // 커스텀 로그인 페이지
    error: '/auth/error', // 에러 페이지
  },
  session: { strategy: 'jwt' }, // DB 없이 JWT만 사용 가능
}

export default NextAuth(authOptions)`,
        language: 'typescript',
      },
      {
        title: '세션 접근 — 서버 vs 클라이언트',
        content: `서버 컴포넌트, 클라이언트 컴포넌트, API Route에서 세션 접근 방법이 다릅니다. 혼동하기 쉬운 부분입니다.`,
        code: `// ✅ Server Component에서 — getServerSession
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/login')

  return <div>안녕하세요, {session.user.name}!</div>
}

// ✅ Client Component에서 — useSession
'use client'
import { useSession, signIn, signOut } from 'next-auth/react'

function AuthButton() {
  const { data: session, status } = useSession()
  // status: 'loading' | 'authenticated' | 'unauthenticated'

  if (status === 'loading') return <Spinner />
  if (!session) return <button onClick={() => signIn('google')}>Google 로그인</button>
  return (
    <div>
      <span>{session.user?.name}</span>
      <button onClick={() => signOut()}>로그아웃</button>
    </div>
  )
}

// ✅ API Route에서
import { getServerSession } from 'next-auth'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await getUserData(session.user.id)
  return Response.json(data)
}`,
        language: 'typescript',
      },
      {
        title: 'Middleware — 보호된 라우트',
        content: `미들웨어는 요청이 페이지에 도달하기 전에 실행됩니다. 인증이 필요한 라우트를 서버에서 보호하는 가장 안전한 방법입니다.`,
        code: `// middleware.ts (프로젝트 루트)
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // 역할 기반 접근 제어 (RBAC)
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/403', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      // true 반환 시 접근 허용, false 시 로그인 페이지로 리다이렉트
      authorized: ({ token }) => !!token,
    },
  }
)

// 미들웨어 적용 경로 설정
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/api/protected/:path*',
    // 정적 파일, 이미지, Next.js 내부 경로 제외
    '/((?!_next/static|_next/image|favicon.ico|login|register).*)',
  ],
}`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      'jwt 콜백에서 토큰에 role/id 추가, session 콜백에서 클라이언트에 노출',
      '서버 컴포넌트: getServerSession() / 클라이언트: useSession() — 혼동 주의',
      'middleware.ts에서 withAuth로 인증 확인, token.role로 RBAC 구현',
      'CredentialsProvider의 authorize에서 null 반환 시 로그인 실패 처리',
    ],
    relatedProblemIds: ['rw-q-006'],
  },
  {
    id: 'rw-l-005',
    category: 'realworld',
    subcategory: 'patterns',
    title: '실무에서 자주 쓰는 Custom Hook 모음',
    description:
      '무한 스크롤, 복사 버튼, 로컬스토리지 동기화, 네트워크 감지 — 당장 프로젝트에서 쓸 수 있는 훅',
    emoji: '🪝',
    readingTime: 8,
    tags: ['custom-hook', 'intersection-observer', 'infinite-scroll', 'clipboard'],
    sections: [
      {
        title: 'useIntersectionObserver — 무한 스크롤',
        content: `무한 스크롤은 프론트엔드 과제에서 자주 나오고, 실무에서도 자주 씁니다. Intersection Observer API를 Custom Hook으로 추상화하면 재사용하기 쉽습니다.`,
        code: `import { useEffect, useRef, useCallback } from 'react'

function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const targetRef = useRef<HTMLDivElement>(null)
  const callbackRef = useRef(callback)

  // 최신 callback 유지 (useCallback 의존성 문제 방지)
  useEffect(() => { callbackRef.current = callback })

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callbackRef.current()
      },
      { threshold: 0.1, ...options }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, []) // 의도적 빈 배열 — ref와 callbackRef로 최신값 참조

  return targetRef
}

// TanStack Query와 함께 — 무한 스크롤 구현
function ProductFeed() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['products'],
      queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam),
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    })

  const sentinelRef = useIntersectionObserver(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  })

  return (
    <div>
      {data?.pages.flatMap(page => page.items).map(product => (
        <ProductCard key={product.id} product={product} />
      ))}

      {/* 이 요소가 보이면 다음 페이지 로드 */}
      <div ref={sentinelRef} className="h-4">
        {isFetchingNextPage && <Spinner />}
      </div>
    </div>
  )
}`,
        language: 'typescript',
      },
      {
        title: 'useLocalStorage — 타입 안전한 로컬스토리지',
        code: `import { useState, useEffect, useCallback } from 'react'

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const next = value instanceof Function ? value(prev) : value
      try {
        localStorage.setItem(key, JSON.stringify(next))
      } catch (e) {
        console.warn(\`useLocalStorage: \${key} 저장 실패\`, e)
      }
      return next
    })
  }, [key])

  const removeValue = useCallback(() => {
    setStoredValue(initialValue)
    localStorage.removeItem(key)
  }, [key, initialValue])

  return [storedValue, setValue, removeValue] as const
}

// 사용
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light')
  return (
    <button onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}`,
        language: 'typescript',
        content: ``,
      },
      {
        title: 'useCopyToClipboard + useOnlineStatus',
        code: `// useCopyToClipboard
function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), resetDelay)
    } catch {
      // 구형 브라우저 fallback
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), resetDelay)
    }
  }, [resetDelay])

  return { copy, copied }
}

// 사용
function CodeBlock({ code }: { code: string }) {
  const { copy, copied } = useCopyToClipboard()
  return (
    <div className="relative">
      <pre>{code}</pre>
      <button onClick={() => copy(code)} className="absolute top-2 right-2">
        {copied ? '✅ 복사됨' : '📋 복사'}
      </button>
    </div>
  )
}

// useOnlineStatus — 네트워크 연결 감지
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    const online = () => setIsOnline(true)
    const offline = () => setIsOnline(false)
    window.addEventListener('online', online)
    window.addEventListener('offline', offline)
    return () => {
      window.removeEventListener('online', online)
      window.removeEventListener('offline', offline)
    }
  }, [])

  return isOnline
}

// 사용 — 오프라인 배너
function OfflineBanner() {
  const isOnline = useOnlineStatus()
  if (isOnline) return null
  return (
    <div className="fixed bottom-0 w-full bg-red-500 text-white text-center p-2">
      인터넷 연결을 확인해주세요
    </div>
  )
}`,
        language: 'typescript',
        content: ``,
      },
    ],
    keyPoints: [
      'useIntersectionObserver + useInfiniteQuery 조합으로 무한 스크롤 구현',
      'useLocalStorage: typeof window 체크로 SSR 에러 방지, 제네릭으로 타입 안전',
      'useCopyToClipboard: navigator.clipboard + execCommand fallback으로 크로스브라우저 지원',
      '모든 이벤트 리스너는 useEffect cleanup에서 반드시 제거',
    ],
    relatedProblemIds: ['rw-q-001', 'rw-q-002'],
  },
]
