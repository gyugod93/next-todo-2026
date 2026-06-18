import type { Problem } from '@/types'

export const authAdvancedProblems: Problem[] = [
  // ─── NextAuth JWT / Session Callback ─────────────────────────────────────────

  {
    id: 'auth-q-016',
    category: 'auth-advanced',
    subcategory: 'nextauth',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'NextAuth.js — jwt vs database 세션 전략',
    description: 'NextAuth.js에서 `session: { strategy: "jwt" }`와 `session: { strategy: "database" }`의 차이로 올바른 것은?',
    conceptExplanation:
      'NextAuth.js는 세션 데이터를 어디에 저장할지 결정하는 두 가지 전략을 제공합니다. `jwt` 전략은 세션 데이터를 암호화된 JWT로 만들어 Cookie에 저장하며 서버 DB 조회가 없습니다(Stateless). `database` 전략은 세션을 DB에 저장하고 클라이언트는 세션 ID만 Cookie로 가집니다(Stateful). 전략 선택은 서버 확장성과 즉시 세션 무효화 필요 여부에 따라 달라집니다.',
    options: [
      '두 전략 모두 세션 데이터를 서버 DB에 저장한다',
      '`jwt` 전략은 세션 데이터를 암호화된 Cookie에 저장하고 DB 조회 없이 검증하며, `database` 전략은 서버 DB에 세션을 저장하고 매 요청마다 DB를 조회한다',
      '`database` 전략은 JWT 토큰을 사용하고, `jwt` 전략은 DB를 사용한다',
      '`jwt` 전략은 세션이 없어 로그인 상태를 유지할 수 없다',
    ],
    correctAnswer: 1,
    explanation:
      '`jwt` 전략: 세션 데이터를 서버가 서명한 JWT로 만들어 httpOnly Cookie에 저장합니다. 서버는 DB 조회 없이 서명 검증만으로 인증합니다(Stateless). 서버리스/수평 확장에 유리합니다. `database` 전략: 세션을 DB에 저장하고 클라이언트에는 Session ID만 Cookie로 전달합니다(Stateful). 즉시 세션 무효화가 가능하지만 매 요청마다 DB를 조회합니다.',
    hints: ['jwt 전략 = Stateless, database 전략 = Stateful'],
    deepDive:
      '```typescript\n// jwt 전략 — 서버리스/Vercel 환경에 적합\nexport const authOptions: NextAuthOptions = {\n  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },\n  // DB 어댑터 없이도 동작\n}\n\n// database 전략 — Prisma 어댑터 필요\nexport const authOptions: NextAuthOptions = {\n  session: { strategy: "database" },\n  adapter: PrismaAdapter(prisma),\n  // 세션 즉시 무효화 가능\n  // 모든 요청 시 DB sessions 테이블 조회\n}\n```\n\n선택 기준:\n• 서버리스(Vercel 등) → jwt\n• 즉각적인 권한 제어, 강제 로그아웃 → database\n• NextAuth 기본값: database (어댑터 없으면 jwt로 fallback)',
    relatedProblems: ['auth-q-007', 'auth-q-017'],
  },
  {
    id: 'auth-q-017',
    category: 'auth-advanced',
    subcategory: 'nextauth',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'NextAuth JWT callback — 최초 로그인 vs 이후 호출 분기',
    description: '다음 JWT callback 코드에서 `if (user)` 분기가 실행되는 시점은?',
    conceptExplanation:
      'NextAuth의 `jwt` 콜백은 토큰이 생성되거나 갱신될 때마다 호출됩니다. 콜백에 전달되는 `user` 인자는 `authorize()` 함수가 성공적으로 user 객체를 반환한 최초 로그인 시점에만 존재합니다. 이후 세션 조회나 갱신 시에는 `user`가 `undefined`가 되므로, `if (user)` 조건문으로 최초 로그인과 이후 호출을 구분하여 커스텀 필드를 토큰에 저장하는 패턴이 필요합니다.',
    code: `jwt: async ({ token, user }) => {
  if (user) {
    return { ...token, id: user.id, role: user.role }
  }
  return token
}`,
    options: [
      '매 API 요청마다 실행된다',
      '`useSession()` 훅이 호출될 때마다 실행된다',
      '`authorize()` 함수가 user 객체를 반환한 직후 — 즉 최초 로그인 성공 시에만 실행된다',
      '`update()` 함수를 호출할 때만 실행된다',
    ],
    correctAnswer: 2,
    explanation:
      '`jwt` 콜백의 `user` 인자는 `authorize()` (CredentialsProvider) 또는 OAuth 로그인이 성공하여 user 객체가 생성된 직후, 즉 최초 로그인 시에만 전달됩니다. 이후 세션 조회/갱신 시에는 `user`가 `undefined`이므로 `if (user)` 분기가 실행되지 않고 기존 `token`이 처리됩니다. 따라서 커스텀 필드를 토큰에 저장하려면 반드시 `if (user)` 블록에서 처리해야 합니다.',
    hints: ['user 인자는 최초 로그인 1회만 존재'],
    deepDive:
      'JWT callback이 호출되는 시점:\n1. 최초 로그인 성공 → user 있음 → 커스텀 데이터 토큰에 저장\n2. useSession() 호출 → user 없음 → token 반환\n3. update() 호출 → user 없음 → token 반환 + 주기적 재검증 가능\n4. getServerSession() 호출 → user 없음\n\n```typescript\njwt: async ({ token, user, trigger, session }) => {\n  // 최초 로그인\n  if (user) {\n    return { ...token, role: (user as any).role }\n  }\n  // update() 호출 시 (trigger === "update")\n  if (trigger === "update" && session?.role) {\n    token.role = session.role\n  }\n  return token\n}\n```',
    relatedProblems: ['auth-q-016', 'auth-q-018', 'auth-q-019'],
  },
  {
    id: 'auth-q-018',
    category: 'auth-advanced',
    subcategory: 'nextauth',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'NextAuth session callback의 역할',
    description: '다음 코드에서 session callback이 없다면 어떤 문제가 발생하는가?',
    conceptExplanation:
      'NextAuth에서 `jwt` 콜백과 `session` 콜백은 서로 다른 역할을 합니다. `jwt` 콜백은 JWT 토큰을 조작하고, `session` 콜백은 클라이언트에 노출할 세션 객체를 조작합니다. 두 객체는 독립적이므로 `jwt` 콜백에서 토큰에 커스텀 필드를 추가해도, `session` 콜백에서 명시적으로 복사하지 않으면 클라이언트의 `useSession()`에서 해당 필드를 읽을 수 없습니다.',
    code: `// jwt callback에서 role을 토큰에 저장
jwt: async ({ token, user }) => {
  if (user) return { ...token, role: (user as any).role }
  return token
},

// session callback 없는 경우
// session callback이 있는 경우:
// session: async ({ session, token }) => {
//   session.user.role = token.role
//   return session
// },`,
    options: [
      'JWT 토큰이 생성되지 않는다',
      '클라이언트에서 useSession()으로 가져온 session.user.role이 undefined가 된다. JWT에는 role이 있어도 session으로 전파되지 않기 때문이다',
      'API 요청 시 401 에러가 발생한다',
      '세션이 만료된다',
    ],
    correctAnswer: 1,
    explanation:
      'jwt callback에서 token에 `role`을 저장해도, session callback이 없으면 클라이언트의 `useSession()`이 반환하는 `session.user`에는 기본 필드(name, email, image)만 포함됩니다. 커스텀 필드를 클라이언트에서 사용하려면 session callback에서 `session.user.role = token.role` 처럼 명시적으로 복사해야 합니다.',
    hints: ['token ≠ session — 별도 객체, 명시적으로 복사 필요'],
    deepDive:
      '```typescript\n// session callback: token → session 전파\nsession: async ({ session, token }) => {\n  if (session.user) {\n    session.user.role = token.role           // 필수\n    session.user.trainerId = token.id\n    session.user.forceLogout = token.forceLogout\n  }\n  if (token.error) session.error = token.error\n  return session  // 반드시 return!\n},\n\n// 타입 확장 (next-auth.d.ts)\ndeclare module "next-auth" {\n  interface Session {\n    user?: {\n      role?: string\n      forceLogout?: boolean\n    }\n    error?: "RoleChanged"\n  }\n}\n\n// 클라이언트 사용\nconst { data: session } = useSession()\nconsole.log(session?.user?.role)  // session callback 없으면 undefined\n```',
    relatedProblems: ['auth-q-017', 'auth-q-019', 'auth-q-020'],
  },
  {
    id: 'auth-q-019',
    category: 'auth-advanced',
    subcategory: 'nextauth',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'update() 호출이 JWT callback을 재실행하는 이유',
    description: '다음 RoleGuard 코드에서 pathname이 변경될 때마다 `update()`를 호출하는 이유는?',
    conceptExplanation:
      'NextAuth의 `update()` 함수는 `/api/auth/session`에 PATCH 요청을 보내 서버의 JWT callback을 다시 실행시키고 갱신된 세션을 클라이언트에 반영합니다. JWT 방식은 서버가 클라이언트에 세션 변경 사항을 Push할 수 없으므로, 클라이언트가 능동적으로 갱신을 요청해야 합니다. 이를 이용해 페이지 이동 시마다 서버에서 최신 사용자 상태(권한 변경, 계정 비활성화 등)를 재확인하는 패턴을 구현할 수 있습니다.',
    code: `export default function RoleGuard() {
  const { data: session, update } = useSession()
  const pathname = usePathname()

  useEffect(() => {
    update()
  }, [pathname])

  useEffect(() => {
    if (session?.user?.forceLogout) {
      signOut({ callbackUrl: '/login' })
    }
  }, [session?.user?.forceLogout])

  return null
}`,
    options: [
      'update()는 세션을 삭제하는 함수다',
      'update()는 /api/auth/session에 PATCH 요청을 보내 JWT callback을 재실행시키고, 재검증된 세션(forceLogout 포함)을 클라이언트에 반영한다',
      'pathname이 변경되면 자동으로 세션이 만료되므로 갱신이 필요하다',
      'update()는 서버를 재시작하는 함수다',
    ],
    correctAnswer: 1,
    explanation:
      '`update()`를 호출하면 NextAuth가 `/api/auth/session`에 요청을 보내고, 서버에서 JWT callback이 다시 실행됩니다. JWT callback 내부에서 `lastRoleCheck` 기반 5분 주기 DB 재검증이 이루어지고, 트레이너가 비활성화(useYn=\'N\')된 경우 `forceLogout=true`가 세팅됩니다. 이 변경된 세션이 클라이언트에 반영되면 두 번째 useEffect가 감지하여 `signOut()`을 트리거합니다.',
    hints: ['update() = /api/auth/session 재요청 = JWT callback 재실행'],
    deepDive:
      '흐름:\n```\npathname 변경\n→ update() 호출\n→ PATCH /api/auth/session\n→ 서버: JWT callback 실행\n→ lastRoleCheck 체크 (5분 경과?)\n→ 경과 시: DB 조회 (trainer.useYn 확인)\n→ useYn=\'N\' 발견: token.forceLogout = true 세팅\n→ session callback: session.user.forceLogout = true 전파\n→ 클라이언트: session 업데이트\n→ useEffect 감지: signOut() 호출\n→ /login 리다이렉트\n```\n\n주의: update()를 호출하지 않으면 쿠키가 갱신되지 않아 변경사항이 클라이언트에 반영되지 않습니다. JWT는 서버가 직접 push할 수 없기 때문에 클라이언트가 능동적으로 갱신을 요청해야 합니다.',
    relatedProblems: ['auth-q-017', 'auth-q-020', 'auth-q-021'],
  },
  {
    id: 'auth-q-020',
    category: 'auth-advanced',
    subcategory: 'nextauth',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'forceLogout 플래그 전파 흐름',
    description: '관리자가 트레이너를 삭제(useYn=\'N\')했을 때 해당 트레이너가 강제 로그아웃되는 전체 흐름에서 순서가 올바른 것은?',
    conceptExplanation:
      'JWT 방식은 Stateless이기 때문에 서버가 발급한 토큰을 직접 삭제하거나 무효화할 수 없습니다. 이를 우회하기 위해 DB에 `forceLogout` 또는 `useYn` 같은 플래그를 저장하고, 클라이언트가 세션 갱신을 요청할 때 서버에서 해당 플래그를 확인하여 세션에 강제 로그아웃 신호를 담아 반환하는 패턴을 사용합니다. 이 방식은 즉각적이지 않고 클라이언트의 다음 갱신 요청 시점에 적용됩니다.',
    options: [
      'JWT 토큰 삭제 → DB 업데이트 → 클라이언트 리다이렉트',
      'DB에 useYn=\'N\' 저장 → 트레이너의 update() 호출 → JWT callback에서 DB 재검증 → token.forceLogout=true → session.user.forceLogout=true → signOut()',
      'signOut() 즉시 호출 → DB 업데이트',
      'Middleware가 DB를 직접 폴링하여 useYn=\'N\'을 감지 → 요청 차단',
    ],
    correctAnswer: 1,
    explanation:
      '강제 로그아웃은 직접 토큰을 삭제할 수 없는 JWT 전략의 한계를 우회합니다. ① DB에 useYn=\'N\' 저장(소프트 삭제), ② 트레이너가 페이지 이동 시 RoleGuard의 update() 호출, ③ JWT callback 재실행 → lastRoleCheck 경과 시 DB 조회, ④ useYn=\'N\' 확인 → token.forceLogout=true, error=\'RoleChanged\' 세팅, ⑤ session callback → session.user.forceLogout=true 전파, ⑥ RoleGuard가 감지 → signOut() 호출. Middleware는 이미 forceLogout=true인 토큰의 접근을 차단하는 역할을 합니다.',
    hints: ['JWT 전략에서는 토큰을 직접 삭제할 수 없어 플래그 방식 사용'],
    deepDive:
      '최악의 시나리오: 트레이너가 삭제 후 5분 이내에 페이지 이동을 하지 않으면 최대 5분간 접근 가능합니다(ROLE_CHECK_INTERVAL_SECONDS = 300). 이는 성능(매 요청마다 DB 조회 방지)과 보안의 트레이드오프입니다.\n\n더 빠른 강제 로그아웃이 필요한 경우:\n• database 전략 사용 → 세션 레코드 직접 삭제로 즉시 무효화\n• JWT Blacklist (Redis) → 삭제 즉시 토큰을 블랙리스트에 등록\n• ROLE_CHECK_INTERVAL_SECONDS를 줄임 (DB 부하 증가)',
    relatedProblems: ['auth-q-019', 'auth-q-021'],
  },
  {
    id: 'auth-q-021',
    category: 'auth-advanced',
    subcategory: 'nextauth',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'withAuth middleware — authorized 콜백',
    description: '다음 middleware 코드에서 `authorized` 콜백이 `false`를 반환하면 어떻게 되는가?',
    conceptExplanation:
      'NextAuth의 `withAuth`는 Next.js Middleware에서 사용하는 인증 래퍼 함수입니다. `authorized` 콜백은 현재 요청이 인증된 접근인지 결정하며, `token`(JWT 토큰 정보)을 인자로 받아 `true` 또는 `false`를 반환합니다. `true`를 반환하면 첫 번째 인자로 전달한 middleware 함수가 실행되고, `false`를 반환하면 미들웨어 함수를 건너뛰고 로그인 페이지로 리다이렉트됩니다.',
    code: `export default withAuth(
  (req) => {
    const requestHeaders = new Headers(req.headers)
    requestHeaders.set('x-current-pathname', req.nextUrl.pathname)
    return NextResponse.next({ request: { headers: requestHeaders } })
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        if (token?.forceLogout) return false
        return !!token
      },
    },
  }
)`,
    options: [
      '요청이 정상 처리되고 middleware 함수가 실행된다',
      '`false`를 반환하면 middleware 함수 실행이 건너뛰어지고, `signIn` 페이지로 리다이렉트된다',
      '500 서버 에러가 발생한다',
      '요청이 즉시 취소되고 브라우저가 닫힌다',
    ],
    correctAnswer: 1,
    explanation:
      '`authorized` 콜백이 `false`를 반환하면 NextAuth는 사용자를 자동으로 로그인 페이지(기본값: `/api/auth/signin`)로 리다이렉트합니다. middleware 함수(첫 번째 인자)는 실행되지 않습니다. 이 코드에서는 유효한 토큰이 있더라도 `forceLogout=true`이면 `false`를 반환하므로, 강제 로그아웃된 트레이너는 어떤 페이지에도 접근할 수 없습니다.',
    hints: ['authorized = false → signIn 페이지로 리다이렉트'],
    deepDive:
      '```typescript\nexport default withAuth(middlewareFn, {\n  callbacks: {\n    authorized: ({ token }) => {\n      // false 반환 → 로그인 페이지 리다이렉트\n      // true 반환 → middlewareFn 실행\n      return !!token && !token.forceLogout\n    },\n  },\n  pages: {\n    signIn: "/login",  // 커스텀 로그인 페이지\n  },\n})\n\n// config: matcher로 보호할 경로 설정\nexport const config = {\n  matcher: [\n    "/((?!register|api|login|key|privacy|terms|robots).*)"\n  ],\n}\n```\n\n`matcher` 패턴에서 `(?!...)` 는 부정 전방탐색으로, 해당 경로는 middleware를 건너뜁니다. 로그인 페이지(/login), API 라우트(/api), 공개 페이지를 제외하고 모든 페이지를 보호합니다.',
    relatedProblems: ['auth-q-019', 'auth-q-020'],
  },
  {
    id: 'auth-q-022',
    category: 'auth-advanced',
    subcategory: 'nextauth',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'next-auth.d.ts — TypeScript 모듈 확장',
    description: '다음 코드가 필요한 이유로 올바른 것은?',
    conceptExplanation:
      'TypeScript의 Declaration Merging(선언 병합)은 이미 정의된 외부 라이브러리의 타입을 `declare module` 문법으로 확장할 수 있는 기능입니다. NextAuth.js의 `Session`, `JWT` 등 기본 타입에는 커스텀 필드(role, forceLogout 등)가 없으므로, 이 필드들을 사용하면 TypeScript 타입 오류가 발생합니다. `.d.ts` 파일에서 해당 인터페이스를 병합 선언하여 커스텀 필드의 타입을 정의할 수 있습니다.',
    code: `// next-auth.d.ts
declare module 'next-auth' {
  interface Session {
    user?: {
      role?: string
      forceLogout?: boolean
    }
    error?: 'RoleChanged'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    forceLogout?: boolean
    lastRoleCheck?: number
  }
}`,
    options: [
      'NextAuth.js 런타임 동작을 변경하기 위해 필요하다',
      'NextAuth의 기본 User/Session/JWT 타입에는 role, forceLogout 같은 커스텀 필드가 없으므로, TypeScript에게 이 필드들이 존재함을 알려 타입 오류 없이 사용할 수 있게 한다',
      '이 파일이 없으면 NextAuth가 작동하지 않는다',
      '이 파일은 JWT 서명 알고리즘을 설정한다',
    ],
    correctAnswer: 1,
    explanation:
      'TypeScript의 Declaration Merging(선언 병합) 기능을 활용합니다. `declare module \'next-auth\'`로 기존 모듈의 타입을 확장하여, `session.user?.role`, `session.user?.forceLogout`, `token.lastRoleCheck` 같은 커스텀 필드에 TypeScript 타입 오류 없이 접근할 수 있게 됩니다. 런타임 동작과는 무관하며, 순수하게 타입 시스템에만 영향을 줍니다.',
    hints: ['Declaration Merging = 기존 타입을 확장하는 TypeScript 기능'],
    deepDive:
      '```typescript\n// next-auth.d.ts — 전체 예시\nimport { DefaultUser } from "next-auth"\n\ndeclare module "next-auth" {\n  interface User extends DefaultUser {\n    role?: "admin" | "trainer" | "user"\n    trainerId?: string\n    forceLogout?: boolean\n  }\n  interface Session {\n    user?: User  // 위에서 확장한 User 참조\n    error?: "RoleChanged"\n  }\n}\n\ndeclare module "next-auth/jwt" {\n  interface JWT {\n    id?: string\n    role?: "admin" | "trainer" | "user"\n    forceLogout?: boolean\n    lastRoleCheck?: number\n    error?: "RoleChanged"\n  }\n}\n\n// 이 파일은 tsconfig.json의 include에 포함되어야 합니다\n// tsconfig.json: { "include": ["next-auth.d.ts", "src/**/*"] }\n```',
    relatedProblems: ['auth-q-017', 'auth-q-018'],
  },

  // ─── 로그인 기법 비교 ──────────────────────────────────────────────────────────

  {
    id: 'auth-q-023',
    category: 'auth-advanced',
    subcategory: 'sso',
    type: 'multiple-choice',
    difficulty: 'easy',
    title: 'SSO(Single Sign-On) 핵심 개념',
    description: 'SSO(Single Sign-On)의 정의와 대표적인 사용 사례로 올바른 것은?',
    conceptExplanation:
      'SSO(Single Sign-On)는 중앙 인증 서버(IdP, Identity Provider)에서 한 번만 로그인하면 연동된 여러 서비스(SP, Service Provider)에 재인증 없이 접근할 수 있는 인증 방식입니다. 사용자는 하나의 자격 증명만 관리하면 되고, 보안 팀은 퇴직자 계정을 IdP 한 곳에서 비활성화하면 모든 연동 서비스 접근이 차단되는 중앙 집중식 관리가 가능합니다.',
    options: [
      'SSO는 여러 비밀번호를 하나의 마스터 비밀번호로 관리하는 비밀번호 매니저다',
      'SSO는 한 번의 로그인으로 여러 독립적인 서비스에 재인증 없이 접근할 수 있는 인증 방식이다. 기업 환경에서 사내 시스템들(HR, 그룹웨어, ERP)을 단일 인증으로 통합할 때 주로 사용된다',
      'SSO는 동일한 비밀번호를 여러 사이트에 재사용하는 관행을 의미한다',
      'SSO는 소셜 로그인(Google, Kakao)과 동일한 기술이다',
    ],
    correctAnswer: 1,
    explanation:
      'SSO는 중앙 IdP(Identity Provider)에서 한 번 인증하면, SP(Service Provider)들이 IdP에게 "이 사람이 인증됐나요?"를 확인하여 별도 로그인 없이 접근을 허용하는 방식입니다. 기업에서 구글 워크스페이스/Okta로 사원이 한 번 로그인하면 Slack, Jira, GitHub, 그룹웨어 등 모든 사내 시스템에 자동 로그인되는 것이 대표적인 예입니다.',
    hints: ['SSO = 한 번 로그인, 여러 서비스 이용'],
    deepDive:
      'SSO 구성 요소:\n• IdP (Identity Provider): 중앙 인증 서버 — Okta, Azure AD, Google Workspace\n• SP (Service Provider): 개별 서비스 — Slack, GitHub, 사내 시스템\n\nSSO 프로토콜:\n• SAML 2.0: XML 기반, 기업 환경, 레거시 시스템과 호환성 좋음\n• OIDC: JSON/JWT 기반, 모던 웹/모바일 앱, 구현 쉬움\n\nSSO 장점:\n• 사용자: 비밀번호 1개만 기억\n• 보안 팀: 퇴직 직원 계정을 IdP에서 한 번만 비활성화하면 모든 서비스 접근 차단\n• 개발팀: 개별 인증 구현 불필요',
    relatedProblems: ['auth-q-024', 'auth-q-006'],
  },
  {
    id: 'auth-q-024',
    category: 'auth-advanced',
    subcategory: 'sso',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'SAML vs OIDC 비교',
    description: 'SAML 2.0과 OIDC(OpenID Connect)를 비교한 것으로 올바른 것은?',
    conceptExplanation:
      'SAML(Security Assertion Markup Language) 2.0은 2005년에 만들어진 XML 기반 SSO 표준 프로토콜입니다. 기업 레거시 시스템 및 엔터프라이즈 환경과의 호환성이 높습니다. OIDC(OpenID Connect)는 2014년에 만들어진 OAuth 2.0 기반의 현대적인 인증 프로토콜로 JSON/JWT를 사용하며, 모바일 앱과 SPA에 적합합니다. 두 프로토콜은 모두 SSO 구현에 사용되나 기술 스택과 적합한 환경이 다릅니다.',
    options: [
      'SAML은 모바일 앱에 최적화되어 있고, OIDC는 레거시 엔터프라이즈 시스템에 적합하다',
      'SAML은 XML 기반으로 기업 레거시 시스템과 호환성이 높고, OIDC는 JWT/JSON 기반으로 모던 웹/모바일에 적합하며 구현이 더 간단하다',
      'SAML과 OIDC는 완전히 동일한 기술이며 이름만 다르다',
      'OIDC는 SSO를 지원하지 않는다',
    ],
    correctAnswer: 1,
    explanation:
      'SAML 2.0: 2005년 표준, XML + SOAP 기반, 기업의 Active Directory, 레거시 ERP/HR 시스템과 통합 시 주로 사용. XML 파싱 복잡. OIDC: 2014년 표준, JWT + REST 기반, 구글/카카오/GitHub 소셜 로그인, Okta 등 현대적 IdP에 사용. 라이브러리 지원 풍부, SPA/모바일에 적합. 새로 구축하는 시스템은 대부분 OIDC를 선택합니다.',
    hints: ['SAML = XML 구세대, OIDC = JWT 신세대'],
    deepDive:
      '비교표:\n\n| 항목 | SAML 2.0 | OIDC |\n|---|---|---||\n| 연도 | 2005 | 2014 |\n| 데이터 형식 | XML | JSON/JWT |\n| 전송 방식 | HTTP Redirect/POST | HTTP Redirect + REST |\n| 모바일 | 어려움 | 쉬움 |\n| 구현 복잡도 | 높음 | 낮음 |\n| 주요 사용처 | 기업 레거시 | 모던 웹/모바일 |\n\nNextAuth.js는 OIDC를 네이티브 지원:\n```typescript\n// Okta OIDC — SSO\nOktaProvider({\n  clientId: process.env.OKTA_CLIENT_ID,\n  issuer: "https://company.okta.com",\n})\n\n// SAML은 별도 라이브러리 필요\nimport { Strategy as SamlStrategy } from "passport-saml"\n```',
    relatedProblems: ['auth-q-023', 'auth-q-006'],
  },
  {
    id: 'auth-q-025',
    category: 'auth-advanced',
    subcategory: 'auth-methods',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'Magic Link vs Email OTP — 차이와 보안',
    description: 'Magic Link와 Email OTP의 차이 및 보안 특성으로 올바른 것은?',
    conceptExplanation:
      'Magic Link는 서버가 단기 토큰을 포함한 URL을 이메일로 전송하고, 사용자가 링크를 클릭하면 자동으로 로그인되는 비밀번호 없는 인증 방식입니다. Email OTP(One-Time Password)는 서버가 짧은 숫자 코드(보통 6자리)를 이메일로 전송하고 사용자가 직접 입력하는 방식입니다. 두 방식 모두 이메일 계정 보안에 의존하며, 토큰/코드는 1회용으로 짧은 유효 시간이 핵심 보안 요소입니다.',
    options: [
      'Magic Link는 비밀번호가 링크에 포함되어 있어 안전하지 않다',
      'Magic Link는 클릭 한 번으로 로그인되는 일회용 URL이고, Email OTP는 짧은 숫자 코드를 입력하는 방식이다. 둘 다 이메일 계정 보안에 의존하며 짧은 유효시간(5~15분)이 핵심 보안 요소다',
      'Magic Link는 재사용 가능하고 유효기간이 없다',
      'Email OTP는 SMS OTP보다 SIM 스와핑 공격에 취약하다',
    ],
    correctAnswer: 1,
    explanation:
      'Magic Link: 서버가 단기 토큰을 생성하여 URL에 포함(`/auth/verify?token=xxxxx`)하고, 사용자가 클릭하면 토큰 검증 후 세션 발급. Email OTP: 6자리 랜덤 숫자를 이메일로 전송, 사용자가 입력. 둘 다 ① 토큰/코드 1회용 ② 짧은 유효시간 ③ 사용 즉시 서버에서 삭제 세 가지가 보안 핵심입니다. SMS OTP와 달리 SIM 스와핑 공격 영향 없음.',
    hints: ['이메일 계정 = 인증의 신뢰 근거'],
    deepDive:
      '```typescript\n// Magic Link 구현 (NestJS)\nasync sendMagicLink(email: string) {\n  const token = crypto.randomBytes(32).toString("hex")\n  await redis.set(\`magic:\${token}\`, email, "EX", 15 * 60) // 15분\n  const link = \`https://myapp.com/auth/verify?token=\${token}\`\n  await emailService.send({ to: email, subject: "로그인 링크", html: link })\n}\n\nasync verifyMagicLink(token: string) {\n  const email = await redis.get(\`magic:\${token}\`)\n  if (!email) throw new UnauthorizedException("만료된 링크")\n  await redis.del(\`magic:\${token}\`) // 1회용\n  const user = await userRepo.findByEmail(email)\n  return jwtService.sign({ sub: user.id })\n}\n\n// NextAuth EmailProvider가 이 로직을 내장\n```\n\nSecurity tips:\n• 토큰은 crypto.randomBytes(32) 이상 — 예측 불가\n• 사용 후 즉시 Redis에서 삭제\n• 유효시간 10~15분 이내\n• 동일 이메일로 재요청 시 이전 토큰 무효화 권장',
    relatedProblems: ['auth-q-007', 'auth-q-026'],
  },
  {
    id: 'auth-q-026',
    category: 'auth-advanced',
    subcategory: 'jwt',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Refresh Token Rotation 심화',
    description: 'Refresh Token Rotation 패턴에서 탈취된 Refresh Token을 감지하는 원리로 올바른 것은?',
    conceptExplanation:
      'Refresh Token Rotation은 Access Token 갱신 시마다 이전 Refresh Token을 무효화하고 새로운 Refresh Token을 함께 발급하는 보안 패턴입니다. 정상 사용자는 항상 최신 Refresh Token을 가지게 됩니다. 이미 사용된 이전 Refresh Token으로 갱신을 시도하면 서버가 탈취를 감지하고 해당 사용자의 모든 세션을 강제 종료할 수 있습니다.',
    options: [
      'Refresh Token에 IP 주소가 저장되어 IP가 바뀌면 감지된다',
      '갱신 시 이전 Refresh Token을 무효화하고 새 Refresh Token을 발급한다. 공격자가 탈취한 토큰으로 갱신을 시도하면 이미 사용된 토큰이므로 감지되고, 해당 사용자의 모든 세션을 강제 종료할 수 있다',
      'Refresh Token은 탈취되어도 Access Token이 없으면 아무것도 할 수 없다',
      'Rotation은 성능 최적화를 위한 기법으로 보안과 무관하다',
    ],
    correctAnswer: 1,
    explanation:
      'Refresh Token Rotation: ① 갱신 요청 → 서버가 기존 RT 무효화 + 새 RT 발급. ② 정상 사용자는 항상 새 RT를 가짐. ③ 공격자가 탈취한 이전 RT로 갱신 시도 → 서버가 "이미 사용된 RT"를 감지 → 해당 사용자의 모든 RT를 무효화(세션 강제 종료). 이를 Refresh Token Reuse Detection이라고 합니다. 단, 동시 요청 발생 시 정상 사용자도 로그아웃될 수 있으므로 구현에 주의 필요.',
    hints: ['이미 사용된 RT로 갱신 요청 = 탈취 의심'],
    deepDive:
      '```typescript\n// Refresh Token Rotation (NestJS)\nasync refreshTokens(userId: string, oldRefreshToken: string) {\n  const user = await userRepo.findById(userId)\n\n  // ① 이전 RT와 DB 저장 RT 비교\n  const isValid = await bcrypt.compare(oldRefreshToken, user.hashedRefreshToken)\n  if (!isValid) {\n    // 이미 사용된 RT → 탈취 의심 → 모든 세션 무효화\n    await userRepo.clearAllRefreshTokens(userId)\n    throw new ForbiddenException("Token reuse detected")\n  }\n\n  // ② 새 토큰 발급\n  const newAccessToken = jwtService.sign({ sub: userId }, { expiresIn: "15m" })\n  const newRefreshToken = uuidv4()\n\n  // ③ 새 RT 저장 (해시 저장), 이전 RT 무효화\n  await userRepo.updateRefreshToken(userId, await bcrypt.hash(newRefreshToken, 10))\n\n  return { accessToken: newAccessToken, refreshToken: newRefreshToken }\n}\n```\n\nRT 저장 방법:\n• DB에 해시 저장 (bcrypt) — DB 유출 시 원본 RT 보호\n• httpOnly Cookie — XSS 방어\n• Rotate 시 기존 RT 즉시 무효화',
    relatedProblems: ['auth-q-002', 'auth-q-004'],
  },
  {
    id: 'auth-q-027',
    category: 'auth-advanced',
    subcategory: 'jwt',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'JWT Blacklist — 강제 로그아웃 구현',
    description: 'JWT(Stateless) 방식에서 즉각적인 강제 로그아웃을 구현하는 Blacklist 패턴으로 올바른 것은?',
    conceptExplanation:
      'JWT는 Stateless 방식이기 때문에 서버가 발급한 토큰을 취소하거나 무효화하는 표준 방법이 없습니다. JWT Blacklist는 이 한계를 극복하기 위해 로그아웃된 토큰을 Redis 같은 빠른 저장소에 기록하고, 모든 요청에서 해당 목록을 확인하여 무효화된 토큰을 거부하는 패턴입니다. 토큰 만료 시각(exp)과 동일한 TTL로 Redis에 저장하면 만료된 토큰이 자동으로 정리됩니다.',
    options: [
      'JWT는 Stateless이므로 강제 로그아웃 구현이 원천적으로 불가능하다',
      '로그아웃 시 해당 JWT를 Redis Blacklist에 저장하고, 모든 API 요청에서 Blacklist 조회 후 포함된 토큰은 거부한다. TTL을 토큰 만료 시간과 동일하게 설정하여 자동 정리한다',
      'Blacklist에 토큰을 저장하면 보안이 약해진다',
      'JWT를 DB에 전부 저장하는 방식으로만 강제 로그아웃이 가능하다',
    ],
    correctAnswer: 1,
    explanation:
      'JWT Blacklist 패턴: ① 로그아웃/강제 로그아웃 시 해당 JWT를 Redis에 저장(`SET blacklist:{token} 1 EX {남은TTL}`). ② Guard/Middleware에서 매 요청마다 Redis Blacklist 조회. ③ 블랙리스트에 있으면 401 반환. 단점: 매 요청마다 Redis 조회(DB보다 빠르지만 비용 발생), Blacklist가 커지면 메모리 사용 증가. TTL을 토큰 만료 시간과 동일하게 설정하면 만료된 토큰이 자동으로 Redis에서 제거됩니다.',
    hints: ['Redis TTL = 토큰 남은 만료 시간으로 설정 → 자동 정리'],
    deepDive:
      '```typescript\n// NestJS JwtAuthGuard with Blacklist\n@Injectable()\nexport class JwtAuthGuard extends AuthGuard("jwt") {\n  constructor(private readonly redis: RedisService) { super() }\n\n  async canActivate(context: ExecutionContext): Promise<boolean> {\n    // 1. JWT 서명 검증\n    const isValid = await super.canActivate(context) as boolean\n    if (!isValid) return false\n\n    // 2. Blacklist 조회\n    const request = context.switchToHttp().getRequest()\n    const token = request.headers.authorization?.replace("Bearer ", "")\n    const isBlacklisted = await this.redis.get(\`blacklist:\${token}\`)\n    if (isBlacklisted) throw new UnauthorizedException("로그아웃된 토큰")\n\n    return true\n  }\n}\n\n// 로그아웃 시 Blacklist 등록\nasync logout(token: string) {\n  const decoded = jwtService.decode(token) as { exp: number }\n  const ttl = decoded.exp - Math.floor(Date.now() / 1000)\n  if (ttl > 0) {\n    await redis.set(\`blacklist:\${token}\`, "1", "EX", ttl)\n  }\n}\n```',
    relatedProblems: ['auth-q-007', 'auth-q-020', 'auth-q-026'],
  },
  {
    id: 'auth-q-028',
    category: 'auth-advanced',
    subcategory: 'auth-methods',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: '로그인 기법 선택 기준',
    description: '다음 시나리오별로 가장 적합한 인증 방식을 매칭한 것으로 올바른 것은?',
    conceptExplanation:
      '인증 방식은 서비스의 특성, 사용자 유형(B2C/B2B), 보안 요구 수준, 기술 스택에 따라 최적의 선택이 달라집니다. OAuth/OIDC는 소셜 로그인, SSO는 기업 내부 시스템 통합, Magic Link/OTP는 비밀번호 없는 인증, MFA/Passkeys는 높은 보안 요구 서비스에 주로 사용됩니다. 실제 서비스에서는 하나의 방식만 고집하지 않고 상황에 따라 조합하여 사용합니다.',
    options: [
      'A) B2C 서비스 소셜 로그인 → SAML, B) 기업 내부 시스템 통합 → Magic Link, C) 금융 서비스 → 비밀번호만',
      'A) B2C 서비스 소셜 로그인 → OAuth/OIDC (Google, Kakao), B) 기업 내부 시스템 통합 → SSO (Okta/SAML/OIDC), C) 금융 서비스 → 비밀번호 + TOTP MFA 또는 Passkeys',
      'A) B2C 서비스 → JWT만, B) 기업 내부 → JWT만, C) 금융 → JWT만',
      '어떤 서비스든 Session 기반이 가장 안전하다',
    ],
    correctAnswer: 1,
    explanation:
      'B2C 소셜 로그인: OAuth 2.0/OIDC를 사용하는 Google, Kakao 등의 provider를 연동합니다(NextAuth.js 활용). 기업 내부 시스템: SSO로 직원이 한 번만 로그인하면 모든 사내 서비스 접근, 퇴직자 계정 일괄 관리. 금융/의료 등 보안 최우선 서비스: MFA(TOTP 앱)나 Passkeys로 추가 인증 레이어를 요구합니다. 하나의 정답이 아니라 서비스 특성에 따라 조합해서 사용합니다.',
    hints: ['서비스 유형에 따라 최적 기법이 다름'],
    deepDive:
      '실무 선택 가이드:\n\n| 상황 | 추천 방식 |\n|---|---|\n| 빠른 MVP, 소규모 앱 | NextAuth.js + Credentials + JWT |\n| B2C 소셜 로그인 | NextAuth.js + OAuth (Google/Kakao/GitHub) |\n| B2B SaaS | OIDC 기반 SSO (Okta, Auth0) |\n| 기업 레거시 통합 | SAML 2.0 |\n| 비밀번호 없는 서비스 | Magic Link + Email OTP |\n| 금융/의료 | 비밀번호 + TOTP MFA + Passkeys |\n| MSA/수평 확장 | JWT + Redis Blacklist + Refresh Rotation |\n| 즉각 권한 제어 필요 | Session + Redis |\n\n팁: 인증은 직접 구현보다 Auth0, Clerk, Supabase Auth 같은 인증 플랫폼 활용을 검토하세요.',
    relatedProblems: ['auth-q-007', 'auth-q-023', 'auth-q-030'],
  },
  {
    id: 'auth-q-029',
    category: 'auth-advanced',
    subcategory: 'web-security',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Session Fixation 공격',
    description: 'Session Fixation 공격과 방어 방법으로 올바른 것은?',
    conceptExplanation:
      'Session Fixation(세션 고정) 공격은 공격자가 미리 알고 있는 세션 ID를 피해자에게 사용하도록 유도한 뒤, 피해자가 그 세션 ID로 로그인하면 동일한 세션 ID로 피해자의 계정에 접근하는 공격입니다. 방어 핵심은 로그인 성공 직후 반드시 새로운 세션 ID를 재발급하는 것입니다. 이렇게 하면 공격자가 사전에 알고 있던 세션 ID가 무효화됩니다.',
    options: [
      'Session Fixation은 세션이 너무 오래 유지될 때 발생하는 성능 문제다',
      '공격자가 미리 알고 있는 Session ID를 피해자에게 사용하도록 유도한 뒤, 피해자 로그인 후 그 Session ID로 세션을 탈취하는 공격이다. 로그인 성공 시 반드시 새 Session ID를 발급하여 방어한다',
      'Session Fixation은 XSS와 동일한 공격이다',
      'Session Fixation은 JWT 방식에서만 발생한다',
    ],
    correctAnswer: 1,
    explanation:
      'Session Fixation: ① 공격자가 임의 Session ID 획득 → ② 피해자에게 그 Session ID를 강제 설정(URL 파라미터, JS 등으로) → ③ 피해자가 해당 Session ID로 로그인 → ④ 공격자가 동일 Session ID로 피해자 계정 접근. 방어: **로그인 성공 직후 반드시 새 Session ID를 재발급**합니다(`req.session.regenerate()`). Express-session은 기본적으로 이를 처리하지만 명시적으로 확인 필요.',
    hints: ['방어 핵심: 로그인 후 세션 ID 재발급'],
    deepDive:
      '```typescript\n// Express — Session Fixation 방어\napp.post("/login", async (req, res) => {\n  const user = await verifyUser(req.body)\n  if (!user) return res.status(401).json({ error: "인증 실패" })\n\n  // ✅ 로그인 성공 후 새 Session ID 재발급 (Session Fixation 방어)\n  req.session.regenerate((err) => {\n    if (err) return res.status(500).json({ error: "세션 오류" })\n    req.session.userId = user.id\n    req.session.role = user.role\n    res.json({ success: true })\n  })\n})\n\n// ❌ 잘못된 예 — 기존 Session ID 유지\napp.post("/login-bad", async (req, res) => {\n  const user = await verifyUser(req.body)\n  req.session.userId = user.id  // 기존 세션에 그냥 추가 → Session Fixation 취약\n  res.json({ success: true })\n})\n```\n\nNextAuth.js는 자동으로 로그인 시 새 세션을 생성하므로 Session Fixation에 안전합니다.',
    relatedProblems: ['auth-q-007', 'auth-q-010'],
  },
  {
    id: 'auth-q-030',
    category: 'auth-advanced',
    subcategory: 'auth-methods',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'MFA 인증 요소별 강도 비교',
    description: '다음 MFA 인증 수단을 보안 강도가 강한 순서로 올바르게 나열한 것은?',
    conceptExplanation:
      'MFA(Multi-Factor Authentication)는 두 가지 이상의 인증 요소를 조합하여 보안을 강화하는 방식입니다. 인증 요소는 지식(알고 있는 것), 소유(가지고 있는 것), 생체(본인 특성)로 나뉩니다. 각 MFA 수단은 피싱, SIM 스와핑 등 특정 공격에 대한 저항성이 다르며, 피싱 사이트에서 동작하지 않는 Origin Binding 여부가 보안 강도를 구분하는 핵심 기준입니다.',
    options: [
      'SMS OTP > TOTP(인증 앱) > 하드웨어 보안 키(YubiKey) > Passkeys',
      'Passkeys ≈ 하드웨어 보안 키(YubiKey) > TOTP(인증 앱) > SMS OTP',
      'SMS OTP가 가장 강력하다. 통신사가 보안을 보장하기 때문이다',
      '모든 MFA 수단은 동일한 보안 강도를 제공한다',
    ],
    correctAnswer: 1,
    explanation:
      'SMS OTP(가장 약함): SIM 스와핑, SS7 프로토콜 취약점으로 인터셉트 가능. 피싱 사이트에 코드 입력 가능. TOTP(인증 앱): SMS보다 안전, 피싱 사이트에 코드를 입력하면 실시간 탈취 가능(30초 이내). 하드웨어 보안 키(YubiKey): USB/NFC 물리적 키, 피싱 사이트에서 동작 안 함(Origin Binding). Passkeys: 하드웨어 키와 동등한 보안(Origin Binding) + 편의성 추가(생체 인식).',
    hints: ['피싱 방어 여부가 핵심 — Origin Binding이 있는가'],
    deepDive:
      '인증 요소 분류 및 강도:\n\n| 수단 | 종류 | 피싱 방어 | 탈취 난이도 |\n|---|---|---|---|\n| 비밀번호만 | 지식 | ❌ | 낮음 |\n| SMS OTP | 소유 | ❌ | 중간(SIM 스와핑) |\n| TOTP 앱 | 소유 | ❌ | 높음 |\n| 하드웨어 키(FIDO2) | 소유 | ✅ | 매우 높음 |\n| Passkeys | 소유+생체 | ✅ | 매우 높음 |\n\nNIST(미국 국립표준기술원) 권장:\n• SMS OTP는 더 이상 권장하지 않음 (Deprecated)\n• TOTP 앱 이상 권장\n• 피싱이 우려되는 환경은 FIDO2 필수\n\n실무 도입 전략:\n1단계: SMS OTP → 2단계: TOTP 앱 → 3단계: Passkeys (점진적 전환)',
    relatedProblems: ['auth-q-013', 'auth-q-028'],
  },

  // ─── OAuth 고급 / BFF / MSA ──────────────────────────────────────────────────

  {
    id: 'auth-q-039',
    category: 'auth-advanced',
    subcategory: 'oauth',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'OAuth 2.0 PKCE — SPA 코드 탈취 방어',
    description: 'SPA(Single Page App)에서 Authorization Code Flow에 PKCE를 적용하는 이유는?',
    conceptExplanation:
      'PKCE(Proof Key for Code Exchange)는 OAuth 2.0 Authorization Code Flow의 보안 확장 기법입니다. SPA는 Client Secret을 안전하게 보관할 수 없어 기존 Code Flow를 사용하면 Authorization Code 탈취 시 무방비합니다. PKCE는 클라이언트가 요청마다 고유한 Code Verifier를 생성하고 그 해시값(Code Challenge)을 인증 요청에 포함시켜, 토큰 교환 시 원본 Verifier를 제출해야만 토큰을 발급받을 수 있게 합니다.',
    options: [
      'PKCE는 모바일 앱에서만 사용되며 SPA와는 무관하다',
      'SPA는 Client Secret을 안전하게 보관할 수 없어 Authorization Code를 탈취당했을 때 무방비하다. PKCE는 Code Verifier/Challenge로 Code를 발급한 클라이언트만 토큰으로 교환할 수 있게 하여 탈취를 무력화한다',
      'PKCE는 Access Token의 만료 시간을 늘리는 기법이다',
      'PKCE를 사용하면 Authorization Code 없이 바로 Access Token을 받을 수 있다',
    ],
    correctAnswer: 1,
    explanation:
      '기존 Code Flow 취약점: Authorization Code가 redirect_uri로 전달될 때 탈취되면 공격자가 Client Secret(SPA에는 없음) 없이도 토큰 교환 가능. PKCE: ① 클라이언트가 랜덤 Code Verifier 생성 + SHA256 해시 → Code Challenge. ② 인증 요청 시 Code Challenge 포함. ③ 토큰 교환 시 원본 Code Verifier 제출. ④ 서버가 Verifier → Challenge 재계산 후 비교. 탈취자는 Verifier를 모르므로 교환 불가.',
    hints: ['PKCE = Proof Key for Code Exchange', 'Code Verifier는 클라이언트만 알고 있음'],
    deepDive:
      '```typescript\n// PKCE 구현 (클라이언트)\nimport { generateCodeVerifier, calculatePKCECodeChallenge } from "oauth4webapi"\n\nasync function loginWithPKCE() {\n  // 1. Code Verifier 생성 (랜덤 43~128자)\n  const codeVerifier = generateCodeVerifier()\n  sessionStorage.setItem("pkce_verifier", codeVerifier)\n\n  // 2. Code Challenge = BASE64URL(SHA256(verifier))\n  const codeChallenge = await calculatePKCECodeChallenge(codeVerifier)\n\n  // 3. 인증 요청 URL에 challenge 포함\n  const authUrl = new URL("https://auth.example.com/authorize")\n  authUrl.searchParams.set("code_challenge", codeChallenge)\n  authUrl.searchParams.set("code_challenge_method", "S256")\n  authUrl.searchParams.set("response_type", "code")\n  authUrl.searchParams.set("client_id", CLIENT_ID)\n  window.location.href = authUrl.toString()\n}\n\nasync function handleCallback(code: string) {\n  const codeVerifier = sessionStorage.getItem("pkce_verifier")!\n\n  // 4. 토큰 교환 시 verifier 제출\n  const response = await fetch("https://auth.example.com/token", {\n    method: "POST",\n    body: new URLSearchParams({\n      grant_type: "authorization_code",\n      code,\n      code_verifier: codeVerifier,  // 서버가 challenge와 비교\n      client_id: CLIENT_ID,\n    }),\n  })\n}\n```\n\nNextAuth.js는 PKCE를 자동으로 처리합니다.',
    relatedProblems: ['auth-q-005', 'auth-q-040'],
  },
  {
    id: 'auth-q-040',
    category: 'auth-advanced',
    subcategory: 'oauth',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Client Credentials Flow — 서버간(M2M) 인증',
    description: 'Client Credentials Flow가 사용되는 상황과 Authorization Code Flow와의 차이는?',
    conceptExplanation:
      'OAuth 2.0의 Client Credentials Flow는 사람(사용자) 없이 서버-서버(Machine-to-Machine) 간 통신에 사용되는 Grant Type입니다. 클라이언트가 자신의 자격 증명(client_id, client_secret)만으로 직접 Access Token을 발급받으며, 사용자 동의 화면이 없고 Refresh Token도 발급되지 않습니다. 마이크로서비스 간 API 호출, cron job, CI/CD 파이프라인 등에 주로 사용됩니다.',
    options: [
      'Client Credentials Flow는 사용자 로그인에 사용한다',
      'Client Credentials Flow는 사용자(사람) 없이 서버간(Machine-to-Machine) 통신에 사용된다. client_id와 client_secret만으로 Access Token을 발급받으며 Refresh Token이 없다',
      'Client Credentials Flow는 SPA에서 사용하기 가장 적합하다',
      'Client Credentials Flow는 Authorization Code보다 보안이 강하다',
    ],
    correctAnswer: 1,
    explanation:
      'Client Credentials Flow: 사용자가 없는 서버간 통신(cron job, 마이크로서비스간 API 호출, CI/CD 파이프라인 등)에 사용. client_id + client_secret으로 Authorization Server에 직접 토큰 요청. 사용자 동의 화면 없음, Refresh Token 없음(토큰 만료 시 재발급). Authorization Code Flow는 사용자가 직접 인증하는 경우에 사용.',
    hints: ['사용자 없는 서버간 통신 = Client Credentials', 'Refresh Token 없음 — 만료 시 재발급'],
    deepDive:
      '```typescript\n// NestJS — Client Credentials Flow로 외부 API 호출\n@Injectable()\nexport class ExternalApiService {\n  private accessToken: string | null = null\n  private tokenExpiry: number = 0\n\n  async getAccessToken(): Promise<string> {\n    // 만료 전 1분 여유를 두고 재발급\n    if (this.accessToken && Date.now() < this.tokenExpiry - 60000) {\n      return this.accessToken\n    }\n\n    const response = await fetch("https://auth.example.com/token", {\n      method: "POST",\n      headers: { "Content-Type": "application/x-www-form-urlencoded" },\n      body: new URLSearchParams({\n        grant_type: "client_credentials",\n        client_id: process.env.CLIENT_ID!,\n        client_secret: process.env.CLIENT_SECRET!,\n        scope: "read:data write:data",\n      }),\n    })\n    const data = await response.json()\n    this.accessToken = data.access_token\n    this.tokenExpiry = Date.now() + data.expires_in * 1000\n    return this.accessToken!\n  }\n\n  async callExternalApi(endpoint: string) {\n    const token = await this.getAccessToken()\n    return fetch(endpoint, {\n      headers: { Authorization: `Bearer ${token}` },\n    })\n  }\n}\n```\n\nOAuth 2.0 Grant Types:\n• Authorization Code (+PKCE): 사용자 로그인\n• Client Credentials: 서버간 통신\n• Device Authorization: TV/CLI\n• Refresh Token: 토큰 갱신',
    relatedProblems: ['auth-q-039', 'auth-q-045'],
  },
  {
    id: 'auth-q-041',
    category: 'auth-advanced',
    subcategory: 'jwt',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'JWT Claims 심화 — jti, aud, iss 활용',
    description: '다음 JWT payload에서 각 claim의 역할로 올바른 것은?',
    conceptExplanation:
      'JWT Claims는 Payload에 담기는 키-값 쌍으로, IANA에 표준 이름이 등록된 Registered Claims와 사용자 정의 Claims로 나뉩니다. `iss`(Issuer)는 토큰 발급자, `sub`(Subject)는 대상 사용자, `aud`(Audience)는 이 토큰을 사용할 수 있는 서비스 목록, `jti`(JWT ID)는 토큰의 고유 식별자입니다. 특히 `jti`는 Blacklist에서 토큰을 전체 저장하는 대신 ID만 저장하는 효율적인 방법으로 활용됩니다.',
    code: '{\n  "iss": "https://auth.myapp.com",\n  "sub": "user_123",\n  "aud": ["api.myapp.com", "admin.myapp.com"],\n  "exp": 1717200000,\n  "iat": 1717196400,\n  "nbf": 1717196400,\n  "jti": "550e8400-e29b-41d4-a716-446655440000",\n  "role": "admin"\n}',
    options: [
      'iss는 사용자 ID, aud는 서버 이름, jti는 만료 시간이다',
      'iss=토큰 발급자(검증용), sub=대상 사용자, aud=수신 허용 서비스(다른 서비스 토큰 재사용 방지), nbf=활성화 시작 시각, jti=토큰 고유ID(재사용 공격 감지·블랙리스트 키로 활용)',
      '모두 선택 사항이며 실무에서는 사용하지 않는다',
      'jti는 서버의 비밀 키다',
    ],
    correctAnswer: 1,
    explanation:
      'JWT 표준 Claims: iss(Issuer): 토큰을 발급한 서버 — 검증 시 예상 issuer와 일치 여부 확인. sub(Subject): 토큰의 주체(보통 userId). aud(Audience): 이 토큰을 받을 수 있는 서비스 목록 — api.myapp.com이 아닌 서비스는 이 토큰을 거부해야 함. nbf(Not Before): 이 시각 전에는 토큰 무효. jti(JWT ID): 토큰 고유 식별자 — Blacklist의 키로 활용하거나 Refresh Token Rotation에서 재사용 감지에 사용.',
    hints: ['jti = JWT 고유 ID → Blacklist 키로 활용', 'aud = 허용된 수신자 목록'],
    deepDive:
      '```typescript\n// JWT 발급 시 모든 claim 설정\nconst payload = {\n  iss: "https://auth.myapp.com",\n  sub: userId,\n  aud: ["api.myapp.com"],\n  jti: uuidv4(),  // 고유 ID — Blacklist 키\n  // exp, iat은 expiresIn 옵션으로 자동 설정\n}\nconst token = jwtService.sign(payload, { expiresIn: "15m" })\n\n// JWT 검증 시 iss, aud 확인\njwtService.verify(token, {\n  issuer: "https://auth.myapp.com",\n  audience: "api.myapp.com",  // aud 불일치 시 에러\n})\n\n// jti를 Blacklist 키로 사용 (토큰 전체 저장보다 효율적)\nasync logout(token: string) {\n  const decoded = jwtService.decode(token) as { jti: string; exp: number }\n  const ttl = decoded.exp - Math.floor(Date.now() / 1000)\n  await redis.set(`blacklist:jti:${decoded.jti}`, "1", "EX", ttl)\n}\n\n// 검증 시 jti Blacklist 확인\nasync validate(payload: JwtPayload) {\n  const isBlacklisted = await redis.get(`blacklist:jti:${payload.jti}`)\n  if (isBlacklisted) throw new UnauthorizedException()\n  return payload\n}\n```',
    relatedProblems: ['auth-q-001', 'auth-q-027'],
  },
  {
    id: 'auth-q-042',
    category: 'auth-advanced',
    subcategory: 'auth-patterns',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'BFF(Backend for Frontend) 인증 패턴',
    description: 'BFF 패턴에서 인증 토큰을 관리하는 방식으로 올바른 것은?',
    conceptExplanation:
      'BFF(Backend for Frontend)는 프론트엔드 전용 중간 서버 계층으로, 클라이언트(브라우저)와 실제 API 서버 사이에 위치합니다. 인증 측면에서 BFF는 Access Token, Refresh Token 같은 민감한 자격 증명을 서버 메모리나 httpOnly Cookie에 보관하여 브라우저 JavaScript가 직접 접근하지 못하게 합니다. Next.js의 서버 컴포넌트와 Server Action이 이 BFF 역할을 담당합니다.',
    options: [
      'BFF는 백엔드 코드를 프론트엔드에서 실행하는 기술이다',
      'BFF는 프론트엔드 전용 중간 서버로, Access Token을 서버(BFF) 메모리나 httpOnly Cookie에 보관하여 브라우저(클라이언트 JS)에 토큰이 노출되지 않게 한다. 브라우저와 BFF 간은 세션/Cookie, BFF와 API 서버 간은 Bearer Token으로 통신한다',
      'BFF에서는 모든 토큰을 localStorage에 저장한다',
      'BFF 패턴은 JWT를 사용할 수 없다',
    ],
    correctAnswer: 1,
    explanation:
      'BFF는 SPA/모바일 앱의 보안 취약점(토큰이 브라우저에 노출)을 해결합니다. 흐름: 브라우저 → BFF(인증 처리, 토큰 서버 보관) → API 서버. 브라우저는 토큰을 전혀 모르고, BFF가 자신의 서버 메모리나 Redis에 Refresh Token을 보관하며 API 요청에 Access Token을 자동 첨부합니다. Next.js의 서버 컴포넌트 + NextAuth.js가 사실상 BFF 역할을 합니다.',
    hints: ['BFF = 토큰을 브라우저에 노출하지 않는 중간 서버', 'Next.js Server Components + NextAuth = BFF 패턴'],
    deepDive:
      '```\nBFF 패턴 흐름:\n\n브라우저                BFF (Next.js)              API 서버\n   │                        │                          │\n   │─── 로그인 폼 제출 ────▶│                          │\n   │                        │──── 인증 요청 ──────────▶│\n   │                        │◀─── JWT Access/Refresh ──│\n   │                        │  (BFF가 서버에 보관)     │\n   │◀─── Session Cookie ────│                          │\n   │                        │                          │\n   │─── API 요청 (Cookie) ─▶│                          │\n   │                        │──── Bearer Token ───────▶│\n   │                        │◀─── 데이터 ──────────────│\n   │◀─── 데이터 ────────────│                          │\n\n브라우저는 JWT를 전혀 알지 못함 → XSS로 토큰 탈취 불가\n```\n\nNext.js에서 BFF 구현:\n```typescript\n// Server Action — 토큰 처리를 서버에서\nasync function loginAction(formData: FormData) {\n  "use server"\n  const response = await fetch(process.env.API_URL + "/auth/login", {\n    method: "POST",\n    body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") }),\n  })\n  const { accessToken, refreshToken } = await response.json()\n  // 토큰을 httpOnly Cookie에 저장 — 브라우저 JS 접근 불가\n  cookies().set("access_token", accessToken, { httpOnly: true, secure: true })\n  cookies().set("refresh_token", refreshToken, { httpOnly: true, secure: true })\n}\n```',
    relatedProblems: ['auth-q-003', 'auth-q-019', 'auth-q-045'],
  },
  {
    id: 'auth-q-043',
    category: 'auth-advanced',
    subcategory: 'oauth',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Token Introspection — 중앙 검증 vs 자체 검증',
    description: 'OAuth Token Introspection과 JWT 자체 검증(Self-contained)의 차이로 올바른 것은?',
    conceptExplanation:
      'JWT 자체 검증은 서버가 비밀 키로 서명을 확인하기만 하면 되므로 DB 조회 없이 빠르게 인증할 수 있는 방식입니다. Token Introspection(RFC 7662)은 리소스 서버가 Authorization Server의 전용 엔드포인트에 토큰을 제출하여 실시간으로 유효성을 확인하는 방식입니다. 자체 검증은 빠르지만 즉시 무효화가 어렵고, Introspection은 실시간 상태 확인이 가능하지만 네트워크 오버헤드가 있습니다.',
    options: [
      'Token Introspection은 JWT의 다른 이름이다',
      'JWT는 서명 검증만으로 자체 검증(DB 조회 없음)하지만 즉시 무효화가 어렵다. Token Introspection은 매 요청마다 Authorization Server에 토큰 유효성을 조회하여 즉시 무효화가 가능하지만 네트워크 오버헤드가 있다',
      'Token Introspection은 항상 JWT보다 빠르다',
      'JWT 자체 검증은 Authorization Server가 다운되면 작동하지 않는다',
    ],
    correctAnswer: 1,
    explanation:
      'JWT 자체 검증: 서명만 검증하면 되므로 빠름. 단점: 토큰 블랙리스트 없이는 즉시 무효화 불가. Token Introspection (RFC 7662): 리소스 서버가 Authorization Server의 /introspect 엔드포인트에 토큰을 제출하여 유효성 확인. 장점: 실시간 상태 확인, 즉시 무효화 가능. 단점: 매 요청마다 Authorization Server 호출 필요 → 레이턴시, AS 가용성 의존. 실무: JWT + Redis Blacklist가 둘의 절충안.',
    hints: ['자체 검증 = 빠르지만 즉시 무효화 어려움', 'Introspection = 실시간 검증이지만 오버헤드'],
    deepDive:
      '```typescript\n// Token Introspection 요청 (RFC 7662)\nconst response = await fetch("https://auth.example.com/introspect", {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/x-www-form-urlencoded",\n    Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,\n  },\n  body: new URLSearchParams({ token: accessToken }),\n})\n\nconst result = await response.json()\n// { active: true, sub: "user_123", scope: "read", exp: 1717200000 }\n// 또는\n// { active: false }  — 만료/무효화된 토큰\n\n// NestJS에서 Introspection 캐싱 (오버헤드 최소화)\n@Injectable()\nexport class IntrospectionGuard implements CanActivate {\n  async canActivate(context: ExecutionContext) {\n    const token = extractToken(context)\n\n    // Redis 캐시 먼저 확인 (30초 TTL)\n    const cached = await redis.get(`introspect:${token}`)\n    if (cached) return JSON.parse(cached).active\n\n    const result = await introspectToken(token)\n    await redis.set(`introspect:${token}`, JSON.stringify(result), "EX", 30)\n    return result.active\n  }\n}\n```',
    relatedProblems: ['auth-q-001', 'auth-q-027', 'auth-q-041'],
  },
  {
    id: 'auth-q-044',
    category: 'auth-advanced',
    subcategory: 'jwt',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'Refresh Token 저장 전략 — 보안 비교',
    description: 'Refresh Token을 저장하는 세 가지 방법의 보안 비교로 올바른 것은?',
    conceptExplanation:
      'Refresh Token은 장기간 유효한 민감한 자격 증명이므로 저장 위치가 보안에 큰 영향을 미칩니다. localStorage는 JavaScript에서 자유롭게 읽을 수 있어 XSS 공격에 취약하며, Refresh Token 저장에 부적합합니다. httpOnly Cookie는 JavaScript 접근이 차단되어 XSS를 방어합니다. 서버 DB에 해시하여 저장하면 서버에서 직접 무효화가 가능하며, 두 방법을 조합하면 가장 높은 보안 수준을 달성합니다.',
    options: [
      'localStorage가 구현이 가장 쉬우므로 권장된다',
      'httpOnly Cookie(XSS 방어)와 서버 DB 저장(즉시 무효화)이 각각 장점이 있으며, 최고 보안은 두 가지 조합이다. localStorage는 XSS에 취약하여 Refresh Token 저장에 적합하지 않다',
      'sessionStorage는 브라우저 탭을 닫으면 삭제되므로 가장 안전하다',
      'Refresh Token은 클라이언트에 저장하지 않아도 된다',
    ],
    correctAnswer: 1,
    explanation:
      'localStorage: XSS로 `localStorage.getItem("rt")` 즉시 탈취 가능 → 비권장. sessionStorage: 탭 종료 시 삭제되지만 동일 탭에서 XSS로 탈취 가능 → Refresh Token에 부적합. httpOnly Cookie: JS 접근 불가 → XSS 방어. CSRF 취약이지만 SameSite=Strict으로 방어. DB 저장: 서버에서 직접 무효화 가능, 해시 저장 필요. 최고 보안: httpOnly Cookie(클라이언트 저장) + DB 해시 저장(서버 검증 및 즉시 무효화).',
    hints: ['httpOnly Cookie = XSS 방어', 'DB 저장 = 서버에서 즉시 무효화'],
    deepDive:
      '```typescript\n// 최고 보안: httpOnly Cookie + DB 해시 저장\n\n// 로그인 시\nasync login(userId: string, res: Response) {\n  const refreshToken = uuidv4()  // 랜덤 UUID\n  const hashedRT = await bcrypt.hash(refreshToken, 10)  // 해시 후 DB 저장\n\n  await userRepo.updateRefreshToken(userId, hashedRT)\n\n  // 클라이언트에는 httpOnly Cookie로 전달\n  res.cookie("refresh_token", refreshToken, {\n    httpOnly: true,\n    secure: true,\n    sameSite: "strict",\n    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7일\n    path: "/auth/refresh",  // /auth/refresh 경로에서만 전송\n  })\n}\n\n// 갱신 시\nasync refresh(refreshToken: string, userId: string) {\n  const user = await userRepo.findById(userId)\n  const isValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken)\n  if (!isValid) throw new ForbiddenException()\n\n  // Rotation: 새 RT 발급 + 이전 RT 무효화\n  return this.login(userId, res)\n}\n```\n\n`path: "/auth/refresh"` 설정으로 갱신 요청에서만 RT Cookie 전송 → 다른 요청에서 RT 노출 최소화',
    relatedProblems: ['auth-q-002', 'auth-q-026', 'auth-q-003'],
  },
  {
    id: 'auth-q-045',
    category: 'auth-advanced',
    subcategory: 'auth-patterns',
    type: 'multiple-choice',
    difficulty: 'hard',
    title: 'MSA 인증 — API Gateway 패턴',
    description: '마이크로서비스 아키텍처(MSA)에서 인증을 처리하는 API Gateway 패턴으로 올바른 것은?',
    conceptExplanation:
      'MSA(마이크로서비스 아키텍처)에서 각 서비스마다 독립적으로 인증을 구현하면 코드 중복과 관리 부담이 커집니다. API Gateway 패턴은 외부 요청의 단일 진입점인 Gateway에서 JWT 검증을 중앙화하고, 검증된 사용자 정보를 헤더에 담아 내부 서비스로 전달하는 방식입니다. 내부 서비스는 Gateway를 신뢰하여 별도 인증 로직 없이 헤더의 사용자 정보를 바로 사용할 수 있습니다.',
    options: [
      'MSA에서는 각 마이크로서비스가 독립적으로 비밀번호를 관리해야 한다',
      'API Gateway가 모든 요청의 JWT를 검증하고 사용자 정보를 헤더에 추가하여 내부 서비스로 전달한다. 내부 서비스는 Gateway를 신뢰하여 별도 인증 없이 헤더의 사용자 정보를 사용한다',
      '각 마이크로서비스가 직접 JWT를 검증하는 것이 가장 안전하다',
      'MSA에서는 Session 방식만 사용 가능하다',
    ],
    correctAnswer: 1,
    explanation:
      'API Gateway 인증 패턴: 외부 요청 → Gateway(JWT 검증) → 내부 서비스(헤더의 사용자 정보 신뢰). 장점: 인증 로직 중앙화, 각 서비스에 jwt 라이브러리 불필요. 주의: 내부 네트워크 신뢰가 전제 — Gateway 우회 방지를 위해 내부 서비스가 외부에 직접 노출되면 안 됨. 서비스간 통신(S2S)은 JWT(짧은 만료) 또는 mTLS(상호 TLS) 사용.',
    hints: ['Gateway = 단일 진입점 + 인증 담당', '내부 서비스는 Gateway를 신뢰 — 외부 직접 접근 불가해야 함'],
    deepDive:
      '```typescript\n// API Gateway에서 JWT 검증 후 헤더 추가 (NestJS/Express)\napp.use(async (req, res, next) => {\n  const token = req.headers.authorization?.replace("Bearer ", "")\n  if (!token) return res.status(401).json({ error: "Unauthorized" })\n\n  try {\n    const payload = jwt.verify(token, process.env.JWT_SECRET)\n    // 내부 서비스에 사용자 정보를 헤더로 전달\n    req.headers["x-user-id"] = payload.sub\n    req.headers["x-user-role"] = payload.role\n    req.headers["x-user-email"] = payload.email\n    next()\n  } catch {\n    res.status(401).json({ error: "Invalid token" })\n  }\n})\n\n// 내부 마이크로서비스 — 헤더 신뢰\n@Get("/orders")\nasync getOrders(@Headers("x-user-id") userId: string) {\n  // JWT 재검증 없이 Gateway가 전달한 userId 사용\n  return this.orderService.findByUser(userId)\n}\n```\n\n내부 서비스 보호:\n- VPC/내부 네트워크에서만 접근 가능하도록 방화벽 설정\n- 외부에서 x-user-id 헤더 직접 주입 방지 (Gateway에서 헤더 sanitize)',
    relatedProblems: ['auth-q-040', 'auth-q-042'],
  },
  {
    id: 'auth-q-046',
    category: 'auth-advanced',
    subcategory: 'oauth',
    type: 'multiple-choice',
    difficulty: 'medium',
    title: 'OAuth 2.0 Scope 설계 — 최소 권한 원칙',
    description: 'OAuth scope를 설계할 때 올바른 원칙은?',
    conceptExplanation:
      'OAuth Scope는 클라이언트가 요청하는 권한의 범위를 나타내는 문자열입니다. `read:users`, `write:orders` 처럼 리소스별, 동작별로 세분화하여 정의합니다. 최소 권한 원칙(Principle of Least Privilege)은 클라이언트에게 필요한 최소한의 scope만 부여하여, 토큰이 탈취되더라도 공격자가 접근할 수 있는 리소스의 범위를 최소화하는 보안 원칙입니다.',
    options: [
      'scope는 단순히 API 경로 이름이므로 아무렇게나 정해도 된다',
      'scope는 최소 권한 원칙에 따라 읽기/쓰기를 분리하고 리소스별로 세분화해야 한다. 클라이언트에는 필요한 최소한의 scope만 부여하여 토큰 탈취 시 피해를 최소화한다',
      'scope는 하나만 있으면 충분하다',
      'scope가 많을수록 보안이 강화된다',
    ],
    correctAnswer: 1,
    explanation:
      '최소 권한 원칙(Principle of Least Privilege): 클라이언트가 필요한 최소 권한만 요청합니다. read:users와 write:users를 분리하면 읽기만 필요한 서비스에 쓰기 권한을 주지 않습니다. 토큰 탈취 시 피해 범위를 최소화합니다. 예: 모바일 앱은 read:profile만, 관리자 백엔드는 read:users write:users admin:billing 등 별도 부여.',
    hints: ['읽기/쓰기 분리', '리소스별 세분화', '필요한 것만'],
    deepDive:
      '```typescript\n// Scope 설계 예시\nconst SCOPES = {\n  // 사용자 관련\n  "read:profile": "본인 프로필 조회",\n  "write:profile": "본인 프로필 수정",\n  "read:users": "전체 사용자 목록 조회 (관리자)",\n  "write:users": "사용자 생성/수정/삭제 (관리자)",\n\n  // 주문 관련\n  "read:orders": "주문 조회",\n  "write:orders": "주문 생성/취소",\n\n  // 결제 관련\n  "read:billing": "결제 내역 조회",\n  "write:billing": "결제 처리",\n}\n\n// NestJS — Scope 검증 데코레이터\n@Controller("users")\nexport class UserController {\n  @Get()\n  @RequireScope("read:users")  // 커스텀 데코레이터\n  findAll() { ... }\n\n  @Delete(":id")\n  @RequireScope("write:users")\n  remove(@Param("id") id: string) { ... }\n}\n\n// JWT payload에 scope 포함\n{ sub: "client_123", scope: "read:orders write:orders", exp: ... }\n```\n\nScope 요청 UX:\n- 동의 화면에 scope를 사람이 읽을 수 있는 형태로 표시\n- "주문 내역을 읽고 새 주문을 만들 수 있습니다"\n- 민감 scope(결제, 계정 삭제)는 별도 확인 단계 추가',
    relatedProblems: ['auth-q-005', 'auth-q-040'],
  },
]
