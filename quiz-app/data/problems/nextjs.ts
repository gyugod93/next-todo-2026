import type { Problem } from '@/types'

export const nextjsProblems: Problem[] = [
  {
    id: 'next-001',
    category: 'nextjs',
    subcategory: 'Server Component',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'Server Component 제약',
    description: 'Next.js App Router에서 Server Component가 할 수 없는 것은?',
    options: [
      'DB 직접 쿼리',
      'useState / useEffect 사용',
      'fetch로 API 호출',
      '환경변수 접근',
    ],
    correctAnswer: 1,
    explanation: `Server Component는 서버에서만 실행됩니다.

❌ Server Component에서 불가:
- useState, useReducer (클라이언트 상태)
- useEffect, useLayoutEffect
- onClick, onChange 등 이벤트 핸들러
- 브라우저 API (window, document, localStorage)

✅ Server Component에서 가능:
- async/await로 DB 직접 쿼리
- 파일 시스템 접근 (fs 모듈)
- 서버 전용 환경변수 (NEXT_PUBLIC_ 없이도)
- fetch (자동 중복 제거 및 캐싱)

클라이언트 기능이 필요하면 파일 상단에 'use client' 추가.`,
    hints: ['Server Component는 서버에서만 실행됩니다'],
    deepDive: `🏗️ Server Component vs Client Component 선택 가이드

"use client"를 최대한 트리 아래쪽으로 밀어내는 것이 핵심입니다.

// ✅ 좋은 패턴: 인터랙션이 필요한 부분만 Client Component로
// app/posts/page.tsx (Server Component)
export default async function PostsPage() {
  const posts = await db.posts.findMany() // 서버에서 직접 DB 접근
  return (
    <div>
      <h1>포스트 목록</h1>
      {posts.map(post => (
        <PostCard key={post.id} post={post} /> // Server Component
      ))}
      <LikeButton /> // 'use client' — 인터랙션 필요
    </div>
  )
}

// ❌ 나쁜 패턴: 전체 페이지를 Client Component로
'use client'
export default function PostsPage() {
  const [posts, setPosts] = useState([])
  useEffect(() => { fetch('/api/posts').then(...) }, [])
  // DB 직접 접근 불가 → 추가 API 왕복 필요
}

Server Component가 기본이어야 하는 이유:
- JS 번들에 포함되지 않음 → 번들 크기 감소
- 서버 리소스 직접 접근 → API 왕복 없음
- 시크릿 환경변수 안전하게 사용 가능`,
    relatedProblems: ['next-002', 'next-003'],
  },
  {
    id: 'next-002',
    category: 'nextjs',
    subcategory: '렌더링 전략',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'ISR vs SSR 선택 기준',
    description: '쇼핑몰 상품 페이지 (데이터가 1시간마다 갱신)에 가장 적합한 방식은?',
    options: [
      'CSR — 클라이언트에서 매번 fetch',
      'SSG — 빌드 시 한 번만 생성',
      'ISR — 일정 시간마다 백그라운드 재생성',
      'SSR — 매 요청마다 서버에서 렌더링',
    ],
    correctAnswer: 2,
    explanation: `렌더링 방식 비교:

CSR: SEO 불리, 초기 로딩 느림 (TTFB는 빠름)
SSG: 빠르지만 배포 없이 데이터 갱신 불가
ISR ← 이 경우 최적: 빠르면서 주기적 갱신 가능
SSR: 실시간 데이터 필요할 때만 (주식, 재고)

Next.js ISR 설정:
// app/products/[id]/page.tsx
export const revalidate = 3600 // 1시간마다 재검증

async function ProductPage({ params }) {
  const product = await getProduct(params.id)
  return <div>{product.name}</div>
}

On-demand revalidation:
import { revalidatePath } from 'next/cache'
revalidatePath('/products') // 특정 이벤트에 즉시 재검증`,
    hints: ['데이터가 1시간마다 바뀐다면 매 요청마다 서버 렌더는 오버킬입니다'],
    deepDive: `📊 Next.js 렌더링 전략 결정 플로우차트

1. 데이터가 사용자마다 다른가? (세션, 개인화)
   YES → SSR (cookies/headers 사용)
   NO → 다음으로

2. 실시간 데이터가 필요한가? (주식, 채팅, 재고)
   YES → SSR + no-store cache
   NO → 다음으로

3. 데이터가 주기적으로 바뀌는가?
   YES → ISR (revalidate 설정)
   NO → 다음으로

4. 데이터가 빌드 시 고정되는가?
   YES → SSG (generateStaticParams)
   NO → ISR with 긴 주기

// Next.js 15 기준 캐시 기본값 변경:
// fetch 기본값이 'no-store' (이전: 'force-cache')
// → 의도하지 않은 캐싱 방지
// → ISR 원하면 명시적으로 revalidate 설정 필요`,
    relatedProblems: ['next-003', 'next-004'],
  },
  {
    id: 'next-003',
    category: 'nextjs',
    subcategory: '동적 렌더링',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: '동적 렌더링 트리거',
    description: 'Next.js에서 페이지를 동적 렌더링(Dynamic Rendering)으로 전환하는 것은?',
    options: [
      'export const revalidate = 3600',
      'cookies() 또는 headers() 함수 사용',
      'React.memo로 컴포넌트 감싸기',
      '파일명을 [id].tsx로 만들기',
    ],
    correctAnswer: 1,
    explanation: `동적 렌더링 트리거 (빌드 시 정적 생성 → 요청 시 서버 렌더로 전환):

1. cookies() / headers() 함수 사용 ← 요청별로 다른 값
2. searchParams 사용 (동적 라우트 파라미터)
3. export const dynamic = 'force-dynamic'
4. fetch with { cache: 'no-store' }

정적 렌더링 유지:
- revalidate 설정 (ISR)
- 외부 요청 없는 순수 컴포넌트
- fetch with { next: { revalidate: N } }

💡 파일명에 [id]가 있어도 generateStaticParams를 쓰면
   빌드 시 정적으로 생성됩니다.`,
    hints: ['요청 시점에만 알 수 있는 정보에 접근하면 동적 렌더링이 됩니다'],
    deepDive: `⚡ PPR (Partial Prerendering) — Next.js 15 실험적 기능

PPR은 정적(Static)과 동적(Dynamic)을 한 페이지에 섞는 기술입니다.

기존의 딜레마:
- 정적 렌더링: 빠르지만 개인화 불가
- 동적 렌더링: 개인화 가능하지만 느림

PPR 해결책: 정적 쉘을 즉시 전달 + 동적 부분은 스트리밍

// next.config.ts
export default {
  experimental: { ppr: true }
}

// app/product/[id]/page.tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <div>
      {/* 정적: 빌드 시 생성, CDN에서 즉시 제공 */}
      <ProductInfo />
      <Suspense fallback={<Skeleton />}>
        {/* 동적: 요청 시 스트리밍 */}
        <PersonalizedRecommendations />
      </Suspense>
    </div>
  )
}

동작:
1. 정적 쉘 즉시 응답 (CDN 캐시)
2. 동적 부분 스트리밍으로 후속 전달
→ 정적의 속도 + 동적의 유연성`,
    relatedProblems: ['next-002', 'next-013'],
  },
  {
    id: 'next-004',
    category: 'nextjs',
    subcategory: '데이터 패칭',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'fetch 캐싱 옵션',
    description: '매 요청마다 항상 최신 데이터를 가져와야 할 때 사용해야 하는 옵션은?',
    code: `// A
fetch(url, { cache: 'force-cache' })
// B
fetch(url, { cache: 'no-store' })
// C
fetch(url, { next: { revalidate: 60 } })
// D
fetch(url, { next: { revalidate: 0 } })`,
    options: [
      'A — force-cache',
      'B — no-store',
      'C — revalidate: 60',
      'D — revalidate: 0',
    ],
    correctAnswer: 1,
    explanation: `fetch 캐싱 옵션:

cache: 'force-cache' (Next.js 14 이하 기본값)
→ 빌드/최초 요청 시 캐싱, 이후 캐시 반환

cache: 'no-store' ← 이 경우 정답
→ 캐시 없이 매 요청마다 새로 fetch

next: { revalidate: 60 }
→ 60초마다 백그라운드에서 재검증 (ISR)

next: { revalidate: 0 }
→ no-store와 유사하게 동작

💡 Next.js 15부터 fetch의 기본 동작이 no-store로 변경됩니다.
   캐싱을 원하면 명시적으로 설정이 필요합니다.`,
    hints: ['캐시를 완전히 사용하지 않는 옵션을 찾으세요'],
    deepDive: `🗄️ Next.js 캐싱 레이어 전체 그림 (4계층)

Next.js에는 4개의 캐시 레이어가 존재합니다.

1. Request Memoization (렌더 중)
   - 동일 URL fetch를 렌더 1회 동안 중복 제거
   - 자동 적용, 렌더 끝나면 사라짐

2. Data Cache (fetch 캐시)
   - force-cache: 영구 캐시 (revalidate로 갱신)
   - no-store: 캐시 없음
   - revalidate: N초마다 갱신

3. Full Route Cache (HTML + RSC 페이로드)
   - 정적 라우트를 빌드 시 디스크에 저장
   - dynamic/dynamic data 사용 시 건너뜀

4. Router Cache (브라우저)
   - 방문한 페이지를 클라이언트 메모리에 저장
   - 뒤로가기/앞으로가기 즉시 응답

// 캐시 무효화:
revalidatePath('/products')      // 특정 경로
revalidateTag('products')        // 태그 기반
fetch(url, { next: { tags: ['products'] } })  // 태그 지정`,
    relatedProblems: ['next-002', 'next-003'],
  },
  {
    id: 'next-005',
    category: 'nextjs',
    subcategory: '라우팅',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Layout vs Template',
    description: 'Next.js의 layout.tsx와 template.tsx의 핵심 차이점은?',
    options: [
      'layout은 서버에서만, template은 클라이언트에서만 렌더링된다',
      'layout은 네비게이션 시 상태 유지, template은 매 네비게이션마다 새 인스턴스 생성',
      'layout은 CSS 스타일링 불가, template은 가능하다',
      '둘은 동일하며 이름만 다르다',
    ],
    correctAnswer: 1,
    explanation: `layout.tsx:
- 네비게이션 시 언마운트/마운트되지 않음
- 상태(useState, 스크롤 위치)가 유지됨
- 공유 UI (내비게이션, 사이드바)에 적합

template.tsx:
- 매 네비게이션마다 새로운 인스턴스 생성
- 상태가 리셋됨
- 각 페이지 진입 시 초기화가 필요한 경우 (입장 애니메이션, 로깅)

언제 template을 쓰나?
- 페이지 전환 애니메이션
- useEffect 기반 analytics
- 매 페이지 진입 시 초기화가 필요한 기능`,
    hints: ['네비게이션 시 상태 유지 여부를 생각해보세요'],
    deepDive: `📁 Next.js App Router 파일 컨벤션 전체 정리

각 라우트 폴더에 배치할 수 있는 특수 파일들:

page.tsx        — 해당 URL의 페이지 (공개 노출)
layout.tsx      — 상태 유지 공유 UI (네비게이션 간 유지)
template.tsx    — 상태 리셋 공유 UI (매 네비게이션마다 새로)
loading.tsx     — Suspense fallback 자동 적용
error.tsx       — 에러 경계 (Error Boundary 자동 적용)
not-found.tsx   — notFound() 호출 시 표시
global-error.tsx — 루트 레이아웃 에러 처리
route.ts        — API 엔드포인트 (page.tsx와 공존 불가)
default.tsx     — Parallel Routes 폴백

// 폴더 컨벤션:
(folder)        — Route Group: URL에 영향 없이 파일 구조화
[folder]        — Dynamic Segment: /blog/[slug]
[[...folder]]   — Optional Catch-all
[...folder]     — Catch-all Segment
@folder         — Parallel Route (슬롯)
_folder         — Private: 라우팅에서 제외`,
    relatedProblems: ['next-006'],
  },
  {
    id: 'next-006',
    category: 'nextjs',
    subcategory: '라우팅',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Parallel Routes 사용 사례',
    description: 'Next.js Parallel Routes(@folder 문법)의 주요 사용 사례로 가장 적합한 것은?',
    options: [
      '페이지 빌드 속도를 높이기 위해',
      '같은 URL에서 독립적인 여러 섹션을 동시에 렌더링 (예: 대시보드)',
      'API 요청을 병렬로 처리하기 위해',
      '중첩 레이아웃을 만들기 위해',
    ],
    correctAnswer: 1,
    explanation: `Parallel Routes: @folder 문법으로 같은 레이아웃에 여러 페이지를 슬롯처럼 배치

// app/dashboard/layout.tsx
export default function Layout({ children, analytics, team }) {
  return (
    <>
      {children}
      {analytics}   // @analytics/page.tsx
      {team}        // @team/page.tsx
    </>
  )
}

특징:
- 각 슬롯이 독립적으로 로딩/에러 처리 가능
- 각 슬롯에 별도의 loading.tsx, error.tsx 적용 가능
- 특정 슬롯의 로딩이 다른 슬롯에 영향 없음

활용 사례: 대시보드, 소셜 미디어 (피드 + 추천)`,
    hints: ['@folder 문법은 슬롯(slot)을 만드는 것입니다'],
    deepDive: `🪟 Intercepting Routes와 Parallel Routes 조합

Intercepting Routes는 URL을 가로채서 현재 레이아웃 안에서 렌더링합니다.
Parallel Routes와 함께 모달 패턴을 구현할 때 강력합니다.

// 폴더 구조:
app/
  feed/
    page.tsx              — 피드 메인
    @modal/               — Parallel Route (모달 슬롯)
      (.)photo/[id]/      — (.) = 같은 레벨 인터셉트
        page.tsx          — 피드 위에 오버레이로 표시
  photo/[id]/
    page.tsx              — 직접 접근 시 전체 페이지

동작:
- /feed에서 사진 클릭 → URL이 /photo/123으로 변경
  → @modal 슬롯이 인터셉트 → 피드 위에 모달로 표시
- /photo/123 직접 접근 → 전체 페이지로 표시
- 모달에서 새로고침 → 전체 페이지로 표시

→ Instagram/Pinterest 스타일의 "소프트 네비게이션" 구현
→ URL은 실제로 변경되어 공유 가능, 뒤로가기도 동작`,
    relatedProblems: ['next-005', 'next-014'],
  },
  {
    id: 'next-007',
    category: 'nextjs',
    subcategory: '정적 생성',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'generateStaticParams 역할',
    description: 'generateStaticParams 함수의 역할은?',
    code: `// app/posts/[id]/page.tsx
export async function generateStaticParams() {
  const posts = await fetchPosts()
  return posts.map(post => ({ id: String(post.id) }))
}

export default async function PostPage({ params }) {
  const post = await getPost(params.id)
  return <article>{post.title}</article>
}`,
    options: [
      '런타임에 동적으로 params를 생성한다',
      '빌드 시 정적으로 생성할 경로의 params를 지정한다',
      'DB에서 데이터를 미리 캐싱한다',
      '동적 라우트의 유효성을 검사한다',
    ],
    correctAnswer: 1,
    explanation: `generateStaticParams는 동적 라우트([id])에서
빌드 시 미리 생성할 경로 목록을 반환합니다.

동작:
1. 빌드 시 generateStaticParams 실행
2. 반환된 각 params로 페이지를 미리 생성
3. 요청 시 미리 만들어진 HTML 즉시 반환

정의되지 않은 경로가 요청되면?
export const dynamicParams = true (기본)
→ 요청 시 동적으로 렌더링

export const dynamicParams = false
→ 404 반환

💡 Next.js Pages Router의 getStaticPaths와 동일한 역할`,
    hints: ['빌드 타임 vs 런타임을 생각해보세요'],
    deepDive: `🚀 generateStaticParams 성능 최적화

대규모 사이트에서 모든 경로를 빌드 시 생성하면 빌드 시간이 급증합니다.
전략적으로 일부만 생성하고 나머지는 런타임에 처리하세요.

// 인기 있는 100개만 빌드 시 생성
export async function generateStaticParams() {
  const topPosts = await getTopPosts({ limit: 100 })
  return topPosts.map(post => ({ id: String(post.id) }))
}

// 나머지는 첫 요청 시 생성 후 캐싱 (ISR 동작)
export const dynamicParams = true
export const revalidate = 3600

// 중첩 동적 라우트 예시:
// app/[category]/[id]/page.tsx
export async function generateStaticParams() {
  const posts = await fetchPosts()
  return posts.map(post => ({
    category: post.category, // 두 params 모두 반환
    id: String(post.id),
  }))
}`,
    relatedProblems: ['next-002', 'next-003'],
  },
  {
    id: 'next-008',
    category: 'nextjs',
    subcategory: 'Server Actions',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Server Action 보안 취약점',
    description: '아래 Server Action 코드의 보안 문제는?',
    code: `'use server'

export async function deletePost(postId: string) {
  await db.posts.delete({ where: { id: postId } })
  revalidatePath('/posts')
}`,
    options: [
      "'use server' 디렉티브 위치가 잘못됐다",
      '인증/인가 없이 누구나 임의의 게시글을 삭제할 수 있다',
      'Server Action은 DELETE 작업에 사용할 수 없다',
      'revalidatePath 호출이 잘못됐다',
    ],
    correctAnswer: 1,
    explanation: `Server Action은 POST 엔드포인트로 노출됩니다.
인증/인가 없이 공개된 action은 누구나 호출 가능합니다.

✅ 올바른 Server Action 패턴:
'use server'
import { auth } from '@/lib/auth'

export async function deletePost(postId: string) {
  // 1. 인증 확인
  const session = await auth()
  if (!session) throw new Error('로그인 필요')

  // 2. 인가 확인
  const post = await db.posts.findUnique({ where: { id: postId } })
  if (post?.authorId !== session.user.id) throw new Error('권한 없음')

  // 3. 입력 검증 (zod 등)
  await db.posts.delete({ where: { id: postId } })
  revalidatePath('/posts')
}

Server Action 보안 체크리스트:
인증 → 인가 → 입력 검증 → Rate limiting`,
    hints: ['이 코드는 누구나 아무 게시글이나 삭제할 수 있습니다'],
    deepDive: `🔒 Server Action 완전 보안 패턴

// lib/safe-action.ts — 재사용 가능한 인증 래퍼
import { auth } from '@/lib/auth'
import { z } from 'zod'

export function createProtectedAction<T>(
  schema: z.ZodSchema<T>,
  handler: (data: T, userId: string) => Promise<unknown>
) {
  return async (formData: FormData | T) => {
    // 1. 인증
    const session = await auth()
    if (!session?.user?.id) throw new Error('Unauthorized')

    // 2. 입력 검증
    const parsed = schema.safeParse(formData)
    if (!parsed.success) throw new Error('Invalid input')

    // 3. 실행
    return handler(parsed.data, session.user.id)
  }
}

// 사용 예시
const deletePostAction = createProtectedAction(
  z.object({ postId: z.string().uuid() }),
  async ({ postId }, userId) => {
    const post = await db.posts.findUnique({ where: { id: postId } })
    if (post?.authorId !== userId) throw new Error('Forbidden')
    await db.posts.delete({ where: { id: postId } })
    revalidatePath('/posts')
  }
)`,
    relatedProblems: ['next-009', 'next-015'],
  },
  {
    id: 'next-009',
    category: 'nextjs',
    subcategory: '에러 처리',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'notFound() 동작',
    description: 'notFound()를 호출하면 어떻게 되나요?',
    code: `import { notFound } from 'next/navigation'

export default async function Page({ params }) {
  const post = await getPost(params.id)
  if (!post) notFound()
  return <div>{post.title}</div>
}`,
    options: [
      '500 Internal Server Error가 반환된다',
      '가장 가까운 not-found.tsx가 렌더링되고 404 상태코드가 반환된다',
      '홈페이지로 리다이렉트된다',
      'null을 반환하고 빈 페이지가 표시된다',
    ],
    correctAnswer: 1,
    explanation: `notFound()를 호출하면:
1. 렌더링 중단
2. 가장 가까운 not-found.tsx 파일을 렌더링
3. HTTP 404 상태코드 반환

not-found.tsx 탐색 순서:
app/posts/[id]/not-found.tsx → app/not-found.tsx

에러 파일 시스템:
- error.tsx: 예기치 않은 에러 (Error 경계)
- not-found.tsx: 리소스 없음 (404)
- forbidden.tsx: 접근 권한 없음 (403) [Next.js 15]
- unauthorized.tsx: 인증 필요 (401) [Next.js 15]`,
    hints: ['Next.js의 에러 파일 시스템을 생각해보세요'],
    deepDive: `🛡️ error.tsx vs not-found.tsx 올바른 사용법

// error.tsx — 예상치 못한 에러 (DB 연결 오류 등)
'use client' // Error Boundary는 Client Component여야 함
export default function Error({
  error,
  reset, // 재시도 함수
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>문제가 발생했습니다</h2>
      <button onClick={reset}>다시 시도</button>
    </div>
  )
}

// not-found.tsx — 리소스가 존재하지 않을 때
export default function NotFound() {
  return <div>페이지를 찾을 수 없습니다 (404)</div>
}

// ✅ 올바른 사용 패턴
async function Page({ params }) {
  try {
    const data = await db.post.findUnique(...)
    if (!data) notFound()  // 리소스 없음 → not-found.tsx
    return <div>{data.title}</div>
  } catch (e) {
    throw e  // DB 오류 등 → error.tsx가 처리
  }
}`,
    relatedProblems: ['next-008'],
  },
  {
    id: 'next-010',
    category: 'nextjs',
    subcategory: '이미지 최적화',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'next/image 필수 props',
    description: 'next/image 컴포넌트에서 width/height 대신 fill을 쓸 때 부모 요소에 필요한 CSS는?',
    code: `<div style={{ position: 'relative', height: '300px' }}>
  <Image
    src="/hero.jpg"
    alt="히어로 이미지"
    fill
    style={{ objectFit: 'cover' }}
  />
</div>`,
    options: [
      'display: flex',
      'position: relative (또는 absolute/fixed)',
      'overflow: hidden',
      'width: 100%',
    ],
    correctAnswer: 1,
    explanation: `next/image의 fill 속성:
- 이미지가 부모 요소를 가득 채웁니다
- 부모에 position: relative/absolute/fixed 가 필수

왜 필요한가?
fill 모드에서 이미지는 position: absolute로 렌더링됩니다.
absolute는 가장 가까운 positioned 조상을 기준으로 배치되므로
부모가 positioned여야 원하는 곳에 채워집니다.

next/image 장점:
- 자동 WebP/AVIF 변환
- 자동 lazy loading
- 자동 srcset 생성 (다양한 뷰포트 대응)
- LCP(Largest Contentful Paint) 최적화`,
    hints: ['fill 모드에서 이미지는 position: absolute로 렌더링됩니다'],
    deepDive: `🖼️ next/image priority와 LCP 최적화

LCP(Largest Contentful Paint): 페이지에서 가장 큰 콘텐츠가 렌더링되는 시간
→ Core Web Vitals 중 하나, SEO와 UX에 직접 영향

// ❌ 히어로 이미지에 lazy loading (기본값)
<Image src="/hero.jpg" alt="..." width={1200} height={600} />
// → 뷰포트에 들어올 때 로드 → LCP 지연

// ✅ 히어로 이미지는 priority 설정
<Image
  src="/hero.jpg"
  alt="..."
  width={1200}
  height={600}
  priority  // preload로 처리, lazy loading 비활성화
/>

// sizes prop으로 반응형 최적화
<Image
  src="/hero.jpg"
  alt="..."
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  // → 뷰포트 크기에 맞는 최적 이미지 요청
/>

규칙: viewport 상단에 보이는 이미지는 priority 설정`,
    relatedProblems: ['next-012'],
  },
  {
    id: 'next-011',
    category: 'nextjs',
    subcategory: 'Middleware',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Middleware 제약사항',
    description: 'Next.js Middleware에서 할 수 없는 것은?',
    options: [
      '쿠키 읽기/쓰기',
      '다른 URL로 리다이렉트',
      'Prisma ORM으로 DB 직접 쿼리',
      '응답 헤더 추가',
    ],
    correctAnswer: 2,
    explanation: `Middleware는 Edge Runtime에서 실행됩니다.
Edge Runtime은 경량화된 환경으로 Node.js의 전체 API를 지원하지 않습니다.

❌ Edge Runtime에서 불가:
- Prisma, Mongoose 등 Node.js 전용 ORM
- fs (파일 시스템)
- Node.js 기본 모듈 (crypto 일부 제외)

✅ Middleware에서 가능:
- 쿠키 읽기/쓰기 (request.cookies)
- 헤더 읽기/쓰기
- 리다이렉트 (NextResponse.redirect)
- 응답 재작성 (NextResponse.rewrite)
- JWT 검증 (jose 라이브러리 사용)

DB 접근이 필요한 인증은 API Route나 Server Action을 사용하세요.`,
    hints: ['Middleware는 Edge Runtime에서 실행됩니다'],
    deepDive: `🔐 Middleware 인증 패턴 (JWT + Edge Runtime)

Edge Runtime에서는 Node.js 모듈이 없으므로
jose 라이브러리(Web Crypto API 기반)로 JWT 검증합니다.

// middleware.ts
import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: Request) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
}

// DB 조회가 필요한 세밀한 권한은 Middleware에서 하지 말고
// Server Component나 Server Action에서 처리하세요.`,
    relatedProblems: ['next-008'],
  },
  {
    id: 'next-012',
    category: 'nextjs',
    subcategory: '메타데이터',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'generateMetadata 동작',
    description: 'generateMetadata가 페이지 컴포넌트와 같은 데이터를 fetch할 때 어떻게 동작하나요?',
    code: `export async function generateMetadata({ params }) {
  const post = await getPost(params.id) // fetch 호출
  return { title: post.title }
}

export default async function Page({ params }) {
  const post = await getPost(params.id) // 동일한 fetch 호출
  return <article>{post.content}</article>
}`,
    options: [
      'getPost가 두 번 호출되어 성능이 나쁘다',
      'Next.js가 동일한 fetch를 자동으로 중복 제거(deduplication)하여 한 번만 호출한다',
      'generateMetadata와 Page 중 하나만 fetch를 실행한다',
      '두 번째 호출은 캐시에서 가져온다',
    ],
    correctAnswer: 1,
    explanation: `Next.js는 렌더링 중 동일한 URL과 옵션의 fetch 요청을 자동으로 중복 제거합니다.
(Request Memoization)

동작:
1. generateMetadata → getPost 호출 → 캐싱
2. Page → getPost 호출 → 이미 캐싱된 결과 반환
→ 실제 네트워크 요청은 1번만 발생

이는 React의 cache()와 Next.js의 fetch 확장으로 구현됩니다.

💡 DB 쿼리는 자동 중복 제거가 안 되므로
   React의 cache()로 직접 메모이제이션해야 합니다:

import { cache } from 'react'
export const getPost = cache(async (id) => {
  return db.posts.findUnique({ where: { id } })
})`,
    hints: ['Next.js의 Request Memoization 개념을 생각해보세요'],
    deepDive: `🏷️ 메타데이터 완전 가이드 (정적 + 동적)

// 정적 메타데이터
export const metadata = {
  title: '내 사이트',
  description: '설명',
  openGraph: {
    title: 'OG 제목',
    description: 'OG 설명',
    images: [{ url: '/og.png' }],
  },
}

// 동적 메타데이터 (DB/API 기반)
export async function generateMetadata({ params }) {
  const post = await getPost(params.id)
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [{ url: post.coverImage }],
    },
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: post.title,
    },
  }
}

// 부모 메타데이터 상속 패턴
export async function generateMetadata(
  { params },
  parent: ResolvingMetadata  // 부모 메타데이터 접근
): Promise<Metadata> {
  const parentMeta = await parent
  return {
    title: post.title,
    openGraph: {
      ...parentMeta.openGraph, // 부모 OG 상속
      title: post.title,
    },
  }
}`,
    relatedProblems: ['next-007'],
  },
  {
    id: 'next-013',
    category: 'nextjs',
    subcategory: '캐싱',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'revalidateTag vs revalidatePath',
    description: '블로그 글을 수정했을 때 관련 페이지들의 캐시를 한번에 무효화하는 가장 적합한 방법은?',
    code: `// Server Action: 글 수정
export async function updatePost(postId: string, data: PostData) {
  await db.posts.update({ where: { id: postId }, data })

  // A: 특정 경로만 무효화
  revalidatePath(\`/posts/\${postId}\`)

  // B: 태그로 관련 모든 캐시 무효화
  revalidateTag('posts')
}`,
    options: [
      'A: revalidatePath — 수정된 글 페이지만 정확히 무효화',
      'B: revalidateTag — "posts" 태그가 달린 모든 fetch 캐시를 한번에 무효화',
      '둘 다 동일하게 동작한다',
      'revalidatePath는 ISR에서 사용 불가',
    ],
    correctAnswer: 1,
    explanation: `revalidateTag는 같은 태그로 묶인 모든 fetch 캐시를 한번에 무효화합니다.

// 데이터 패칭 시 태그 지정
const posts = await fetch('/api/posts', {
  next: { tags: ['posts'] }
})

const post = await fetch(\`/api/posts/\${id}\`, {
  next: { tags: ['posts', \`post-\${id}\`] }
})

// 글 수정 시 관련 모든 캐시 무효화
revalidateTag('posts')
// → /posts 목록, /posts/[id] 상세, 사이드바 추천글 등
// 'posts' 태그가 달린 모든 fetch가 무효화됨

revalidatePath vs revalidateTag:
- revalidatePath: 특정 URL 경로의 캐시 무효화
- revalidateTag: 태그 기반 — 여러 경로에 걸친 관련 데이터 무효화`,
    hints: ['여러 페이지에 걸쳐 있는 데이터를 태그로 묶을 수 있습니다'],
    deepDive: `🏷️ 태그 기반 캐시 전략 설계

태그 전략을 잘 설계하면 불필요한 전체 무효화를 피할 수 있습니다.

// 태그 상수 정의 (타입 안전성)
export const CACHE_TAGS = {
  posts: 'posts',
  post: (id: string) => \`post-\${id}\`,
  userPosts: (userId: string) => \`user-posts-\${userId}\`,
  categories: 'categories',
} as const

// 데이터 패칭 시 태그 지정
async function getPosts() {
  return fetch('/api/posts', {
    next: { tags: [CACHE_TAGS.posts] }
  }).then(r => r.json())
}

async function getPost(id: string) {
  return fetch(\`/api/posts/\${id}\`, {
    next: { tags: [CACHE_TAGS.posts, CACHE_TAGS.post(id)] }
  }).then(r => r.json())
}

// 무효화 전략:
// 특정 글만 수정 → revalidateTag(CACHE_TAGS.post(id))
// 새 글 작성 → revalidateTag(CACHE_TAGS.posts)
// 특정 유저 글 수정 → revalidateTag(CACHE_TAGS.userPosts(userId))`,
    relatedProblems: ['next-004', 'next-002'],
  },
  {
    id: 'next-014',
    category: 'nextjs',
    subcategory: '라우팅',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Intercepting Routes 동작',
    description: 'Next.js Intercepting Routes의 (.) 문법이 하는 일은?',
    code: `// 폴더 구조:
// app/feed/page.tsx
// app/feed/@modal/(.)photo/[id]/page.tsx
// app/photo/[id]/page.tsx`,
    options: [
      '/feed에서 /photo/[id]로 이동 시 app/photo/[id]/page.tsx를 전체 페이지로 렌더링',
      '/feed에서 /photo/[id]로 이동 시 URL은 변경되지만 현재 레이아웃 안에서 오버레이로 렌더링',
      '(.) 문법은 같은 폴더 내 파일을 import하는 것',
      '/photo/[id]를 완전히 숨겨서 직접 접근 불가로 만듦',
    ],
    correctAnswer: 1,
    explanation: `Intercepting Routes: 특정 컨텍스트에서 URL을 "가로채서" 다르게 렌더링

(.) = 같은 레벨의 라우트를 인터셉트
(..) = 한 레벨 위 라우트를 인터셉트
(...) = app 루트부터의 라우트를 인터셉트

동작:
- /feed에서 사진 클릭 → URL = /photo/123 으로 변경
  → @modal 슬롯이 /.photo/[id]/page.tsx 렌더링 (오버레이)
  → 피드 배경 유지, URL은 진짜 /photo/123

- /photo/123 직접 접근 / 새로고침
  → 인터셉트 없이 app/photo/[id]/page.tsx 전체 페이지 렌더링

활용: Instagram 스타일 사진 모달
→ 공유 가능한 URL + 모달 UX + 전체 페이지 fallback`,
    hints: ['(.) 는 같은 레벨 라우트를 "가로채는" 문법입니다'],
    deepDive: `📱 Intercepting Routes 실전 구현 (Instagram 패턴)

// app/layout.tsx
export default function RootLayout({ children, modal }) {
  return (
    <html>
      <body>
        {children}
        {modal} {/* 모달 슬롯 — 없으면 null */}
      </body>
    </html>
  )
}

// app/@modal/(.)photo/[id]/page.tsx
import { Modal } from '@/components/Modal'
export default async function PhotoModal({ params }) {
  const photo = await getPhoto(params.id)
  return (
    <Modal>
      <img src={photo.url} alt={photo.alt} />
    </Modal>
  )
}

// app/@modal/default.tsx — 인터셉트가 없을 때 렌더링할 것
export default function Default() { return null }

// components/Modal.tsx
'use client'
import { useRouter } from 'next/navigation'
export function Modal({ children }) {
  const router = useRouter()
  return (
    <div className="fixed inset-0 bg-black/80 z-50"
         onClick={() => router.back()} // 배경 클릭 시 뒤로가기
    >
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  )
}`,
    relatedProblems: ['next-006'],
  },
  {
    id: 'next-015',
    category: 'nextjs',
    subcategory: 'Server Actions',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Server Actions와 Form 통합',
    description: 'Server Actions를 form의 action으로 사용할 때의 장점이 아닌 것은?',
    code: `// app/actions.ts
'use server'
export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  await db.posts.create({ data: { title } })
  revalidatePath('/posts')
}

// app/posts/new/page.tsx
export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input name="title" />
      <button type="submit">게시</button>
    </form>
  )
}`,
    options: [
      'JavaScript 없이도 폼 제출이 동작한다 (Progressive Enhancement)',
      '클라이언트 상태 없이 서버에서 직접 DB 작업이 가능하다',
      '자동으로 CSRF 토큰이 추가되어 보안이 강화된다',
      '타입스크립트로 action 함수의 타입을 검증할 수 있다',
    ],
    correctAnswer: 3,
    explanation: `Server Actions를 form action으로 사용하는 장점:

✅ Progressive Enhancement:
JavaScript가 비활성화되어도 일반 HTML 폼처럼 동작

✅ 클라이언트 상태 불필요:
useState + fetch 조합 없이 서버에서 직접 처리

✅ 자동 CSRF 보호:
Next.js가 Server Actions에 자동으로 CSRF 토큰 처리

❌ TypeScript 타입 검증:
FormData는 타입이 없어 런타임 검증 필요
→ Zod로 별도 검증해야 함

formData.get('title') → string | File | null
→ as string 단언은 안전하지 않음, zod로 검증 권장`,
    hints: ['FormData는 타입 정보를 런타임에만 알 수 있습니다'],
    deepDive: `⚡ useFormState + useFormStatus로 Server Action UX 개선

// app/actions.ts
'use server'
export async function createPost(prevState: any, formData: FormData) {
  const result = PostSchema.safeParse({ title: formData.get('title') })
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }
  await db.posts.create({ data: result.data })
  revalidatePath('/posts')
  return { success: true }
}

// app/posts/new/page.tsx
'use client'
import { useFormState, useFormStatus } from 'react-dom'
import { createPost } from '../actions'

function SubmitButton() {
  const { pending } = useFormStatus() // 제출 중 상태
  return (
    <button type="submit" disabled={pending}>
      {pending ? '게시 중...' : '게시하기'}
    </button>
  )
}

export default function NewPostForm() {
  const [state, action] = useFormState(createPost, null)
  return (
    <form action={action}>
      <input name="title" />
      {state?.error?.title && <p>{state.error.title}</p>}
      <SubmitButton />
    </form>
  )
}`,
    relatedProblems: ['next-008', 'react-015'],
  },
]
