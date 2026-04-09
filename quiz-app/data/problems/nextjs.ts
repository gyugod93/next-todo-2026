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

cache: 'force-cache' (기본값)
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
  },
]
