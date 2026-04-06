import type { Problem } from '@/types'

export const nextjsProblems: Problem[] = [
  {
    id: 'next-001',
    category: 'nextjs',
    subcategory: 'App Router',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'Server Component vs Client Component',
    description:
      'Next.js App Router에서 아래 중 Server Component에서 할 수 없는 것은?',
    options: [
      'DB 직접 쿼리',
      'useState 사용',
      'fetch로 API 호출',
      '파일 시스템 접근',
    ],
    correctAnswer: 1,
    explanation: `Server Component는 서버에서만 실행됩니다.
따라서 브라우저 API, React 인터랙티비티 훅 사용 불가:

❌ Server Component에서 불가:
- useState, useReducer (상태)
- useEffect, useLayoutEffect
- onClick, onChange 등 이벤트 핸들러
- 브라우저 전용 API (window, document)

✅ Server Component에서 가능:
- async/await로 DB 직접 쿼리
- 파일 시스템 접근 (fs 모듈)
- 환경변수 접근 (서버 전용 포함)
- fetch (자동 캐싱 지원)

💡 'use client'를 파일 상단에 써야 Client Component가 됩니다.`,
    hints: ['Server Component는 서버에서만 실행됩니다'],
  },
  {
    id: 'next-002',
    category: 'nextjs',
    subcategory: '렌더링 전략',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'SSG vs ISR vs SSR',
    description:
      '쇼핑몰 상품 페이지 (데이터가 1시간마다 바뀜)에 가장 적합한 렌더링 방식은?',
    options: [
      'CSR - 클라이언트에서 매번 fetch',
      'SSG - 빌드 시 한 번만 생성',
      'ISR - 일정 시간마다 재생성',
      'SSR - 매 요청마다 서버 렌더링',
    ],
    correctAnswer: 2,
    explanation: `렌더링 방식 비교:

CSR (Client Side Rendering)
- 브라우저에서 JS로 데이터 fetch
- SEO 불리, 초기 로딩 느림

SSG (Static Site Generation)
- 빌드 시 HTML 생성, CDN 캐싱
- 빠르지만 데이터 업데이트 불가

ISR (Incremental Static Regeneration) ← 이 경우 최적
- SSG처럼 빠르게 제공하면서 주기적으로 재생성
- revalidate: 3600 → 1시간마다 갱신
- 사용자는 항상 빠른 정적 파일을 받음

SSR (Server Side Rendering)
- 매 요청마다 서버에서 생성
- 실시간 데이터 필요할 때 (주식, 실시간 재고)

Next.js ISR 코드:
// app/products/[id]/page.tsx
export const revalidate = 3600 // 1시간

async function ProductPage({ params }) {
  const product = await getProduct(params.id)
  return <div>{product.name}</div>
}`,
    hints: ['데이터가 1시간마다 바뀐다면? 매 요청마다 서버 렌더는 오버킬입니다'],
  },
  {
    id: 'next-003',
    category: 'nextjs',
    subcategory: 'Server Actions',
    type: 'bug-find',
    difficulty: 'hard',
    title: 'Server Action 버그',
    description:
      '아래 Server Action 코드에서 보안 문제를 찾고 수정하세요.',
    code: `// app/actions.ts
'use server'

export async function deletePost(postId: string) {
  await db.posts.delete({ where: { id: postId } })
  revalidatePath('/posts')
}

// app/posts/[id]/page.tsx
export default function PostPage({ params }) {
  return (
    <form action={deletePost.bind(null, params.id)}>
      <button type="submit">삭제</button>
    </form>
  )
}`,
    correctAnswer: `// app/actions.ts
'use server'

import { auth } from '@/lib/auth'

export async function deletePost(postId: string) {
  const session = await auth()
  if (!session) throw new Error('로그인이 필요합니다')

  const post = await db.posts.findUnique({ where: { id: postId } })
  if (!post) throw new Error('게시글을 찾을 수 없습니다')
  if (post.authorId !== session.user.id) {
    throw new Error('삭제 권한이 없습니다')
  }

  await db.posts.delete({ where: { id: postId } })
  revalidatePath('/posts')
}`,
    explanation: `보안 문제: Server Action에 인증/인가 검사가 없습니다.

누구나 deletePost를 호출해 남의 게시글을 삭제할 수 있습니다.

🔒 Server Action 보안 체크리스트:
1. 인증 확인: 로그인된 사용자인가?
2. 인가 확인: 해당 리소스에 권한이 있는가?
3. 입력 검증: postId가 유효한 형식인가? (zod 등)
4. Rate limiting: 너무 많은 요청을 막는가?

Server Action은 POST 엔드포인트이므로
일반 API Route와 동일한 보안 수준이 필요합니다.`,
    hints: [
      '이 코드는 누구나 아무 게시글이나 삭제할 수 있습니다',
      '인증(Authentication)과 인가(Authorization)를 추가하세요',
    ],
  },
  {
    id: 'next-004',
    category: 'nextjs',
    subcategory: '데이터 페칭',
    type: 'code-complete',
    difficulty: 'medium',
    title: '동적 메타데이터 생성',
    description:
      '게시글 상세 페이지에서 SEO를 위한 동적 메타데이터를 생성하세요.',
    code: `// app/posts/[id]/page.tsx
interface Props {
  params: { id: string }
}

// 여기를 완성하세요 (generateMetadata 함수)

export default async function PostPage({ params }: Props) {
  const post = await getPost(params.id)
  return <article>{post.content}</article>
}`,
    correctAnswer: `// app/posts/[id]/page.tsx
interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  const post = await getPost(params.id)

  if (!post) {
    return { title: '게시글을 찾을 수 없습니다' }
  }

  return {
    title: post.title,
    description: post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.slice(0, 160),
      images: post.thumbnail ? [{ url: post.thumbnail }] : [],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const post = await getPost(params.id)
  return <article>{post.content}</article>
}`,
    explanation: `generateMetadata는 App Router에서 동적 메타데이터를 생성하는 함수입니다.

특징:
- async/await 지원 (DB 조회 가능)
- 같은 fetch는 자동으로 중복 제거 (deduplication)
- 페이지 컴포넌트와 같은 params를 받음
- not-found 상황도 처리해야 함

OpenGraph는 SNS 공유 시 미리보기에 사용됩니다.
description은 검색엔진이 160자까지 표시합니다.`,
    hints: [
      'generateMetadata 함수는 export async function으로 선언합니다',
      'openGraph 프로퍼티로 SNS 공유 설정도 가능합니다',
    ],
  },
  {
    id: 'next-005',
    category: 'nextjs',
    subcategory: 'Middleware',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Middleware 실행 시점',
    description: 'Next.js Middleware에 대한 설명 중 옳은 것은?',
    options: [
      'Middleware는 페이지 컴포넌트가 렌더링된 후 실행된다',
      'Middleware는 Edge Runtime에서 실행되며 Node.js API를 전부 사용할 수 있다',
      'Middleware는 요청이 완료되기 전에 실행되어 응답을 수정하거나 리다이렉트할 수 있다',
      'Middleware는 /api 경로에만 적용된다',
    ],
    correctAnswer: 2,
    explanation: `Middleware 핵심 특성:

✅ 올바른 설명:
- 요청(Request) 완료 전에 실행
- 응답 수정, 리다이렉트, 헤더 추가 가능
- Edge Runtime에서 실행 (서버리스 함수보다 빠름)
- matcher로 특정 경로에만 적용 가능

❌ 잘못된 설명:
- 렌더링 후 X → 렌더링 전에 실행
- Node.js API 전부 사용 X → Edge Runtime은 제한적 (fs 등 불가)
- /api만 X → 모든 경로에 적용 가능

// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile'],
}`,
    hints: ['Middleware는 요청 사이클의 어느 시점에 실행될까요?'],
  },
]
