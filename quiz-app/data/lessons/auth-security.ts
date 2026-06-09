import type { Lesson } from '@/types'

export const authSecurityLessons: Lesson[] = [
  {
    id: 'auth-sec-001',
    category: 'auth-security',
    subcategory: 'biometric',
    title: '생체 인식 인증 & Passkeys (WebAuthn)',
    description: '비밀번호 없는 미래 — 지문/Face ID가 피싱까지 막는 원리, navigator.credentials API, NestJS 구현까지',
    emoji: '🔏',
    readingTime: 10,
    sections: [
      {
        title: '왜 비밀번호는 한계에 왔는가',
        content: `비밀번호 방식의 근본 문제:

**서버 유출:** 비밀번호 해시가 DB에 저장되므로, 서버가 해킹되면 크랙 위험이 있습니다.

**피싱:** 사용자가 가짜 사이트에서 비밀번호를 입력하면 그대로 탈취됩니다.

**재사용:** 사람들은 여러 사이트에 같은 비밀번호를 사용합니다. 한 곳이 뚫리면 연쇄 피해가 발생합니다.

**2FA의 한계:** SMS OTP도 SIM 스와핑, MITM 공격에 취약합니다.

**Passkeys(WebAuthn/FIDO2)** 는 이 모든 문제를 공개키 암호화로 해결합니다.`,
      },
      {
        title: 'Passkeys 핵심 원리 — 공개키 암호화',
        content: `Passkeys는 **공개키/개인키 쌍**을 사용합니다.

| 키 | 저장 위치 | 역할 |
|---|---|---|
| 공개키 (Public Key) | 서버 DB | 서명 검증용 |
| 개인키 (Private Key) | 기기 보안 칩 (Secure Enclave) | 서명 생성용, 절대 외부 유출 없음 |

**생체 인식의 역할:** 지문/Face ID는 기기 안에 잠긴 개인키를 꺼내는 열쇠입니다. 생체 데이터 자체는 기기 밖으로 나가지 않습니다.

**피싱 면역:** 개인키는 등록한 도메인(예: myapp.com)에서만 동작합니다. 가짜 사이트(myapp-evil.com)에서는 키 자체가 작동하지 않습니다 — 이를 **Origin Binding**이라 합니다.`,
        code: `// 등록 흐름 요약
// 1. 서버 → 클라이언트: challenge (랜덤 바이트)
// 2. 기기: 생체 인식 확인 → 공개키/개인키 쌍 생성
// 3. 기기 → 서버: 공개키 전달 (개인키는 절대 전송 안 됨)
// 4. 서버: 공개키 저장

// 인증 흐름 요약
// 1. 서버 → 클라이언트: challenge (매번 새 랜덤값 — 재사용 공격 방지)
// 2. 기기: 생체 인식으로 개인키 잠금 해제
// 3. 기기: 개인키로 challenge에 서명(signature) 생성
// 4. 기기 → 서버: signature 전달
// 5. 서버: 저장된 공개키로 signature 검증 → 인증 성공`,
        language: 'typescript',
      },
      {
        title: 'Browser API — navigator.credentials',
        content: `WebAuthn은 **navigator.credentials** API를 통해 브라우저에서 사용합니다.

**등록:** \`navigator.credentials.create()\`
**인증:** \`navigator.credentials.get()\`

서버에서 직접 구현하기보다 **@simplewebauthn/browser** 라이브러리 사용을 권장합니다.`,
        code: `import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser"

// ─── 등록 ───────────────────────────────────────────────
async function registerPasskey() {
  // 1. 서버에서 등록 옵션(challenge 포함) 가져오기
  const optionsRes = await fetch("/auth/passkey/register/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: currentUser.id }),
  })
  const options = await optionsRes.json()

  // 2. 브라우저가 생체 인식 프롬프트 띄우고 credential 생성
  const credential = await startRegistration(options)

  // 3. 서버에 검증 요청 (공개키 저장)
  const verifyRes = await fetch("/auth/passkey/register/finish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credential),
  })
  const result = await verifyRes.json()
  console.log("Passkey 등록 완료:", result.verified)
}

// ─── 인증 ───────────────────────────────────────────────
async function loginWithPasskey() {
  // 1. 서버에서 인증 옵션(challenge 포함) 가져오기
  const optionsRes = await fetch("/auth/passkey/login/start", {
    method: "POST",
  })
  const options = await optionsRes.json()

  // 2. 브라우저가 생체 인식 프롬프트 — 개인키로 challenge 서명
  const assertion = await startAuthentication(options)

  // 3. 서버에서 서명 검증 → JWT 발급
  const verifyRes = await fetch("/auth/passkey/login/finish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assertion),
  })
  const { accessToken } = await verifyRes.json()
}`,
        language: 'typescript',
      },
      {
        title: 'NestJS 서버 구현',
        content: `서버에서는 **@simplewebauthn/server** 로 challenge 생성 및 서명 검증을 처리합니다. Challenge는 Redis에 임시 저장하여 검증 후 즉시 삭제합니다(Replay Attack 방지).`,
        code: `import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server"
import { Injectable } from "@nestjs/common"

@Injectable()
export class PasskeyService {
  constructor(
    private readonly redis: RedisService,
    private readonly userRepo: UserRepository,
  ) {}

  // ─── 등록 시작: challenge 생성 ─────────────────────────
  async startRegistration(userId: string) {
    const user = await this.userRepo.findById(userId)

    const options = await generateRegistrationOptions({
      rpName: "MyApp",
      rpID: "myapp.com",
      userID: userId,
      userName: user.email,
      userDisplayName: user.name,
      attestationType: "none",
      authenticatorSelection: {
        authenticatorAttachment: "platform", // 기기 내장 (Face ID, Touch ID, Windows Hello)
        residentKey: "required",             // Passkey: 사용자명 없이 로그인
        userVerification: "required",        // 생체/PIN 필수
      },
      supportedAlgorithmIDs: [-7, -257],     // ES256, RS256
    })

    // challenge를 Redis에 임시 저장 (5분 TTL)
    await this.redis.set(\`passkey:reg:\${userId}\`, options.challenge, 300)

    return options
  }

  // ─── 등록 완료: 공개키 저장 ────────────────────────────
  async finishRegistration(userId: string, credential: any) {
    const expectedChallenge = await this.redis.get(\`passkey:reg:\${userId}\`)

    const verification = await verifyRegistrationResponse({
      response: credential,
      expectedChallenge,
      expectedOrigin: "https://myapp.com",
      expectedRPID: "myapp.com",
    })

    if (!verification.verified) throw new Error("등록 검증 실패")

    const { credentialPublicKey, credentialID, counter } =
      verification.registrationInfo!

    // 공개키를 DB에 저장 (개인키는 서버에 절대 오지 않음)
    await this.userRepo.savePasskey(userId, {
      credentialID: Buffer.from(credentialID),
      credentialPublicKey: Buffer.from(credentialPublicKey),
      counter,
    })

    await this.redis.del(\`passkey:reg:\${userId}\`)
    return { verified: true }
  }

  // ─── 인증 시작 ─────────────────────────────────────────
  async startAuthentication() {
    const options = await generateAuthenticationOptions({
      rpID: "myapp.com",
      userVerification: "required",
    })

    await this.redis.set(\`passkey:auth:\${options.challenge}\`, "pending", 300)
    return options
  }

  // ─── 인증 완료: 서명 검증 → JWT 발급 ─────────────────
  async finishAuthentication(assertion: any) {
    const expectedChallenge = assertion.response.clientDataJSON
      // 실제로는 클라이언트에서 challenge를 함께 전달
    const storedCredential = await this.userRepo.findPasskeyByCredentialId(
      assertion.id,
    )

    const verification = await verifyAuthenticationResponse({
      response: assertion,
      expectedChallenge: storedCredential.lastChallenge,
      expectedOrigin: "https://myapp.com",
      expectedRPID: "myapp.com",
      authenticator: {
        credentialPublicKey: storedCredential.credentialPublicKey,
        credentialID: storedCredential.credentialID,
        counter: storedCredential.counter,
      },
    })

    if (!verification.verified) throw new Error("인증 실패")

    // counter 업데이트 (복제 공격 감지용)
    await this.userRepo.updatePasskeyCounter(
      storedCredential.id,
      verification.authenticationInfo.newCounter,
    )

    return { accessToken: this.jwtService.sign({ sub: storedCredential.userId }) }
  }
}`,
        language: 'typescript',
      },
      {
        title: '기기 분실 및 폴백 전략',
        content: `**기기 분실 시 복구:**
- **iCloud Keychain / Google Password Manager:** 같은 계정으로 연결된 다른 기기에서 자동 복원
- **Cross-Device Authentication:** QR 코드로 다른 기기의 Passkey를 활용 가능
- **복구 코드:** 회원가입 시 일회용 복구 코드 발급 필수

**폴백 처리:**
- Passkeys를 지원하지 않는 구형 기기를 위해 비밀번호 또는 이메일 OTP 폴백 제공
- 점진적 전환: 기존 사용자에게 Passkey 추가 등록 유도`,
        code: `// Passkeys 지원 여부 확인 후 UI 분기
async function checkPasskeySupport() {
  const isSupported =
    window.PublicKeyCredential &&
    (await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable())

  if (isSupported) {
    // Passkey 버튼 표시
    showPasskeyButton()
  } else {
    // 비밀번호/OTP 폴백 UI
    showPasswordForm()
  }
}

// Conditional UI (자동완성처럼 Passkey 제안)
// <input autocomplete="username webauthn" />
// navigator.credentials.get({ mediation: "conditional" })
// → 비밀번호 자동완성 목록에 Passkey가 나타남`,
        language: 'typescript',
      },
    ],
    keyPoints: [
      '개인키는 기기 보안 칩(Secure Enclave)에서 절대 나가지 않음 — 서버 유출 무의미',
      '생체 데이터(지문/얼굴)는 기기 로컬에서만 처리, 서버 전송 없음',
      'Origin Binding: 개인키는 등록된 도메인에서만 동작 → 피싱 원천 차단',
      'Challenge: 매 인증마다 새 랜덤값 → Replay Attack 방지, Redis에 TTL로 임시 저장',
      'Counter: 인증마다 증가, 이전 값 재사용 시 복제 공격 감지',
      '폴백 필수: isUserVerifyingPlatformAuthenticatorAvailable()로 지원 여부 확인 후 UI 분기',
      'simplewebauthn 라이브러리: 서버(@simplewebauthn/server) + 클라이언트(@simplewebauthn/browser)',
    ],
    relatedProblemIds: ['auth-q-013', 'auth-q-014', 'auth-q-015'],
    tags: ['webauthn', 'passkeys', 'fido2', 'biometric', 'navigator.credentials', 'public-key', 'secure-enclave'],
  },

  // ─── auth-sec-002 ────────────────────────────────────────────────────────────
  {
    id: 'auth-sec-002',
    category: 'auth-security',
    subcategory: 'nextauth',
    title: 'NextAuth.js JWT 전략 & 강제 로그아웃 구현',
    description: 'JWT callback · session callback 동작 원리, 5분 주기 권한 재검증, forceLogout 플래그 전파, RoleGuard 패턴까지 — 실무 코드로 익히기',
    emoji: '🔑',
    readingTime: 12,
    sections: [
      {
        title: 'NextAuth.js 두 가지 세션 전략',
        content: `NextAuth.js는 세션 데이터를 어디에 저장할지에 따라 두 가지 전략을 지원합니다.

| 전략 | 저장 위치 | 특징 |
|---|---|---|
| \`database\` (기본) | 서버 DB | 즉시 무효화 가능, 모든 요청마다 DB 조회 |
| \`jwt\` | 암호화된 Cookie | 서버리스 호환, DB 조회 없음, 즉시 무효화 어려움 |

**JWT 전략 선택 시 주의점:** 토큰은 만료 전까지 유효하므로 권한 변경이나 강제 로그아웃을 위해 별도 메커니즘이 필요합니다. 이를 해결하는 패턴이 **주기적 DB 재검증**입니다.`,
        code: `// next.config.ts or auth.ts
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',       // JWT 전략 선택
    maxAge: 30 * 24 * 60 * 60, // 30일 (토큰 최대 수명)
  },
  // ...
}`,
        language: 'typescript',
      },
      {
        title: 'JWT Callback — 토큰 생성과 갱신',
        content: `\`jwt\` 콜백은 두 가지 시점에 호출됩니다.

**1. 최초 로그인 시** (\`user\` 인자가 존재할 때)
→ \`authorize()\`가 반환한 user 객체를 토큰에 병합합니다.

**2. 이후 세션 조회 시** (\`user\` 인자가 없을 때)
→ 기존 token을 그대로 반환하거나, 주기적 재검증 로직을 실행합니다.

실무 패턴: \`lastRoleCheck\` 타임스탬프를 토큰에 저장하고, 일정 시간이 지나면 DB를 다시 조회합니다.`,
        code: `const ROLE_CHECK_INTERVAL_SECONDS = 300 // 5분

jwt: async ({ token, user }) => {
  // ① 최초 로그인 — user 객체가 존재함
  if (user) {
    const u = user as any
    return {
      ...token,
      id: u.id,
      role: u.role,
      lastRoleCheck: Math.floor(Date.now() / 1000),
    }
  }

  // ② 이후 호출 — 5분마다 DB 재검증
  const now = Math.floor(Date.now() / 1000)
  if (now - (token.lastRoleCheck ?? 0) > ROLE_CHECK_INTERVAL_SECONDS) {
    try {
      const trainer = await prisma.businesstrainers.findFirst({
        where: { id: token.id, useYn: 'Y' },
        select: { role: true },
      })

      // role 변경 또는 계정 비활성화 → forceLogout 플래그 세팅
      if (!trainer || trainer.role !== token.role) {
        return { ...token, forceLogout: true, error: 'RoleChanged', lastRoleCheck: now }
      }
    } catch (e) {
      console.error('role check failed', e)
    }
    return { ...token, forceLogout: undefined, error: undefined, lastRoleCheck: now }
  }

  return token // 5분 미경과 — 그대로 반환
},`,
        language: 'typescript',
      },
      {
        title: 'Session Callback — 토큰 → 세션 전파',
        content: `\`session\` 콜백은 클라이언트가 \`useSession()\` 또는 서버에서 \`getServerSession()\`을 호출할 때 실행됩니다.

JWT 토큰의 데이터를 \`session.user\`에 복사합니다. **이 콜백이 없으면 JWT에 저장한 커스텀 필드(role, forceLogout 등)가 클라이언트에 노출되지 않습니다.**`,
        code: `session: async ({ session, token }) => {
  const user = session.user
  if (user && token) {
    user.role = token.role           // 역할
    user.trainerId = token.id        // 트레이너 ID
    user.forceLogout = token.forceLogout  // 강제 로그아웃 플래그
  }
  if (token.error) session.error = token.error  // 'RoleChanged' 에러 전파
  return session
},

// TypeScript 타입 확장 (next-auth.d.ts)
declare module 'next-auth' {
  interface Session {
    user?: {
      role?: string
      trainerId?: string
      forceLogout?: boolean
    }
    error?: 'RoleChanged'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: string
    forceLogout?: boolean
    lastRoleCheck?: number
    error?: 'RoleChanged'
  }
}`,
        language: 'typescript',
      },
      {
        title: '강제 로그아웃 3중 방어 구조',
        content: `JWT 전략에서 강제 로그아웃은 토큰 자체를 무효화할 수 없으므로 3단계 방어로 구현합니다.

**① Middleware — 라우트 차단**
\`forceLogout=true\`인 토큰의 모든 페이지 접근을 차단합니다.

**② RoleGuard (클라이언트 컴포넌트) — 세션 감시**
페이지 이동마다 \`update()\`를 호출해 JWT callback을 재실행하고, \`forceLogout\` 감지 시 \`signOut()\`을 트리거합니다.

**③ 로그인 페이지 — 서버사이드 정리**
이미 \`forceLogout\` 세션이 있는 상태로 로그인 페이지에 오면 signout API로 쿠키를 먼저 정리합니다.`,
        code: `// ① src/middleware.ts
export default withAuth(
  (req) => NextResponse.next(),
  {
    callbacks: {
      authorized: ({ token }) => {
        if (token?.forceLogout) return false  // 토큰 있어도 차단
        return !!token
      },
    },
  }
)

// ② src/components/layouts/RoleGuard.tsx
'use client'
export default function RoleGuard() {
  const { data: session, update } = useSession()
  const pathname = usePathname()

  // 페이지 이동마다 세션 갱신 → JWT callback 재실행
  useEffect(() => { update() }, [pathname])

  // forceLogout 또는 RoleChanged 감지 → 로그아웃
  useEffect(() => {
    if (session?.error === 'RoleChanged' || session?.user?.forceLogout) {
      signOut({ callbackUrl: '/login' })
    }
  }, [session?.error, session?.user?.forceLogout])

  return null  // 렌더링 없음 — CMS layout에 마운트만
}

// ③ src/app/(auth)/login/page.tsx (Server Component)
const session = await getServerSession(authOptions)
if (session?.user?.forceLogout) {
  redirect(\`/api/auth/signout?callbackUrl=/login\`)
}`,
        language: 'typescript',
      },
      {
        title: '전체 흐름 요약',
        content: `**관리자가 트레이너를 삭제하면:**

\`\`\`
1. DELETE /api/trainers/:id
   → DB: trainer.useYn = 'N' (소프트 삭제)

2. 트레이너의 다음 페이지 이동 시
   → RoleGuard의 update() 호출
   → JWT callback 재실행 (5분 체크)

3. JWT callback: DB에서 useYn='N' 확인
   → token.forceLogout = true 세팅

4. session callback: token → session.user.forceLogout = true

5. RoleGuard: session.user.forceLogout 감지
   → signOut({ callbackUrl: '/login' })

6. Middleware: 이후 요청에서 forceLogout=true 토큰 차단
\`\`\`

**핵심 포인트:** \`update()\`를 호출해야만 JWT callback이 재실행됩니다. 자동으로 실행되지 않으므로 RoleGuard에서 pathname 변경 시마다 명시적으로 호출합니다.`,
      },
    ],
    keyPoints: [
      'JWT callback: user 인자 있으면 최초 로그인, 없으면 이후 호출 — 조건으로 분기',
      'session callback 없으면 커스텀 필드(role, forceLogout)가 클라이언트에 전달되지 않음',
      'update() 호출 = /api/auth/session 재요청 = JWT callback 재실행 트리거',
      '강제 로그아웃: Middleware(차단) + RoleGuard(감지) + Login page(정리) 3중 방어',
      'lastRoleCheck 타임스탬프로 매 요청마다 DB 조회하지 않고 5분 주기로 throttle',
      'next-auth.d.ts 타입 확장 필수 — 커스텀 필드를 TS가 인식하게',
      'forceLogout은 토큰 무효화가 아닌 플래그 방식 — JWT 전략의 특성상 직접 삭제 불가',
    ],
    relatedProblemIds: ['auth-q-016', 'auth-q-017', 'auth-q-018', 'auth-q-019', 'auth-q-020', 'auth-q-021', 'auth-q-022'],
    tags: ['nextauth', 'jwt-callback', 'session-callback', 'force-logout', 'withAuth', 'middleware', 'RoleGuard', 'update'],
  },

  // ─── auth-sec-003 ────────────────────────────────────────────────────────────
  {
    id: 'auth-sec-003',
    category: 'auth-security',
    subcategory: 'auth-methods',
    title: '로그인 기법 총비교 — Session부터 Passkeys까지',
    description: 'Session, JWT, OAuth 2.0, SSO/SAML, Magic Link, MFA, Passkeys — 각 기법의 원리와 장단점, 실무 선택 기준까지 한 번에',
    emoji: '🗝️',
    readingTime: 15,
    sections: [
      {
        title: '① Session 기반 인증 (Stateful)',
        content: `서버가 세션 데이터를 직접 관리하는 전통적인 방식입니다.

**동작:**
1. 로그인 → 서버가 Session ID 생성, DB/Redis에 저장
2. 클라이언트는 Session ID를 Cookie에 보관
3. 매 요청 시 Cookie의 Session ID → 서버 DB 조회 → 사용자 확인

**장점:** 즉시 로그아웃/세션 무효화 가능, 서버 완전 제어
**단점:** 서버 수평 확장 시 세션 공유 필요(Sticky Session 또는 Redis), 모든 요청마다 DB 조회`,
        code: `// Express + express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({ client: redisClient }), // Redis 세션 스토어
  cookie: { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 },
}))

// 로그인
app.post('/login', async (req, res) => {
  const user = await verifyUser(req.body)
  req.session.userId = user.id  // 세션에 저장
  res.json({ success: true })
})

// 로그아웃 (즉시 무효화)
app.post('/logout', (req, res) => {
  req.session.destroy()  // Redis에서 세션 삭제
  res.clearCookie('connect.sid')
  res.json({ success: true })
})`,
        language: 'typescript',
      },
      {
        title: '② JWT 기반 인증 (Stateless)',
        content: `서버가 상태를 저장하지 않는 방식입니다. 토큰 자체에 사용자 정보가 포함됩니다.

**동작:**
1. 로그인 → 서버가 JWT(Access Token + Refresh Token) 발급
2. 클라이언트가 API 요청 시 Authorization: Bearer {token} 헤더 첨부
3. 서버는 DB 조회 없이 서명만 검증

**장점:** 서버 수평 확장 쉬움, DB 조회 없음(성능), 마이크로서비스에 적합
**단점:** 토큰 탈취 시 만료 전까지 무효화 어려움, Payload 크기만큼 매 요청에 포함`,
        code: `// NestJS JWT 전략
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    })
  }
  async validate(payload: JwtPayload) {
    return { id: payload.sub, role: payload.role }
  }
}

// Access Token: 15분, Refresh Token: 7일
const accessToken = jwtService.sign(payload, { expiresIn: '15m' })
const refreshToken = jwtService.sign(payload, {
  expiresIn: '7d',
  secret: process.env.JWT_REFRESH_SECRET,
})

// JWT Blacklist (강제 로그아웃 — Redis)
async logout(accessToken: string) {
  const decoded = jwtService.decode(accessToken) as any
  const ttl = decoded.exp - Math.floor(Date.now() / 1000)
  await redis.set(\`blacklist:\${accessToken}\`, '1', 'EX', ttl)
}`,
        language: 'typescript',
      },
      {
        title: '③ OAuth 2.0 / OIDC (소셜 로그인)',
        content: `외부 인증 제공자(Google, Kakao, GitHub 등)에 인증을 위임하는 방식입니다.

**OAuth 2.0:** 리소스 접근 권한 위임 프로토콜
**OIDC (OpenID Connect):** OAuth 2.0 위에 사용자 신원 확인(Authentication) 추가

**Authorization Code Flow:**
1. 클라이언트 → 인증 제공자 로그인 페이지로 리다이렉트
2. 사용자 로그인 + 동의 → Authorization Code 발급
3. 서버가 Code + Client Secret으로 Access Token 교환
4. Access Token으로 사용자 정보 조회 → 자체 JWT 발급

**PKCE (Proof Key for Code Exchange):** SPA/모바일에서 Code 탈취 방지를 위해 사용`,
        code: `// NextAuth.js — OAuth 자동 처리
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'

export default NextAuth({
  providers: [
    GoogleProvider({           // OIDC 기반 — ID Token 포함
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_ID!,
      clientSecret: process.env.KAKAO_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // 최초 로그인 시 DB에 사용자 생성
      await upsertUser({ email: user.email, provider: account?.provider })
      return true
    },
    async jwt({ token, account }) {
      if (account) token.provider = account.provider
      return token
    },
  },
})`,
        language: 'typescript',
      },
      {
        title: '④ SSO / SAML (기업 환경)',
        content: `**SSO (Single Sign-On):** 한 번의 로그인으로 여러 서비스를 이용하는 방식입니다.

**SAML 2.0:** 기업 환경에서 주로 사용하는 SSO 프로토콜 (XML 기반)
**OIDC 기반 SSO:** 모던 환경에서 SAML 대체 (Google Workspace, Okta 등)

**동작 (SAML):**
1. 사용자가 서비스(SP: Service Provider) 접근
2. SP → IdP(Identity Provider, 예: Okta, Active Directory)로 리다이렉트
3. IdP에서 로그인 → SAML Assertion(XML 서명) 반환
4. SP가 Assertion 검증 → 세션 생성

**실무 포인트:** 직접 구현보다 Okta, Auth0, AWS Cognito 등 IdP 서비스를 사용합니다.`,
        code: `// OIDC 기반 SSO (NextAuth.js + Okta)
import OktaProvider from 'next-auth/providers/okta'

providers: [
  OktaProvider({
    clientId: process.env.OKTA_CLIENT_ID!,
    clientSecret: process.env.OKTA_CLIENT_SECRET!,
    issuer: process.env.OKTA_ISSUER,  // https://yourcompany.okta.com
  }),
]

// SAML은 passport-saml 라이브러리 사용
import { Strategy as SamlStrategy } from 'passport-saml'

passport.use(new SamlStrategy({
  entryPoint: 'https://idp.example.com/sso/saml',
  issuer: 'https://myapp.com',
  cert: process.env.IDP_CERT,
}, (profile, done) => {
  const user = { id: profile.nameID, email: profile.email }
  return done(null, user)
}))`,
        language: 'typescript',
      },
      {
        title: '⑤ Magic Link / Email OTP',
        content: `비밀번호 없이 이메일로 로그인 링크나 일회용 코드를 전송하는 방식입니다.

**Magic Link 동작:**
1. 사용자가 이메일 입력
2. 서버가 단기 토큰(5~15분) 생성 → 이메일로 링크 전송
3. 사용자가 링크 클릭 → 서버가 토큰 검증 → 세션 발급

**Email OTP 동작:** 위와 동일하지만 링크 대신 6자리 숫자 코드 전송

**장점:** 비밀번호 분실/유출 없음
**단점:** 이메일 접근이 필요, 느린 UX, 이메일 계정 탈취 시 취약`,
        code: `// NextAuth.js EmailProvider (Magic Link)
import EmailProvider from 'next-auth/providers/email'

providers: [
  EmailProvider({
    server: process.env.EMAIL_SERVER,     // SMTP 서버
    from: 'noreply@myapp.com',
    maxAge: 10 * 60,  // 링크 유효시간: 10분
  }),
]

// 커스텀 OTP 구현 (NestJS)
async sendOtp(email: string) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString() // 6자리
  const ttl = 5 * 60 // 5분
  await redis.set(\`otp:\${email}\`, otp, 'EX', ttl)
  await emailService.send({ to: email, subject: '로그인 코드', text: otp })
}

async verifyOtp(email: string, code: string) {
  const stored = await redis.get(\`otp:\${email}\`)
  if (stored !== code) throw new UnauthorizedException('잘못된 코드')
  await redis.del(\`otp:\${email}\`)  // 사용 후 즉시 삭제 (1회용)
  return jwtService.sign({ sub: email })
}`,
        language: 'typescript',
      },
      {
        title: '⑥ MFA — 다단계 인증',
        content: `인증 요소를 2개 이상 조합하는 방식입니다.

| 요소 | 종류 | 예시 |
|---|---|---|
| 지식 (Something you know) | 비밀번호, PIN | 가장 약함 |
| 소유 (Something you have) | TOTP 앱, SMS, 하드웨어 키 | 중간 |
| 생체 (Something you are) | 지문, 얼굴 | 강함 |

**TOTP (Time-based OTP):** Google Authenticator, Authy 등 앱에서 30초마다 갱신되는 6자리 코드. 서버와 시간 기반 알고리즘(HMAC-SHA1 + Unix timestamp)으로 동기화.

**SMS OTP의 약점:** SIM 스와핑, SS7 프로토콜 취약점으로 탈취 가능. TOTP 앱이 더 안전.`,
        code: `// TOTP 구현 (speakeasy 라이브러리)
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'

// TOTP 시크릿 생성 (최초 설정)
async setupMfa(userId: string) {
  const secret = speakeasy.generateSecret({ name: \`MyApp:\${userEmail}\` })
  await userRepo.saveMfaSecret(userId, secret.base32)

  // QR 코드 생성 (Google Authenticator에 스캔)
  const qrDataUrl = await qrcode.toDataURL(secret.otpauth_url!)
  return { qrDataUrl, secret: secret.base32 }
}

// TOTP 검증
async verifyMfa(userId: string, token: string) {
  const secret = await userRepo.getMfaSecret(userId)
  const isValid = speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1,  // ±30초 허용 (시계 오차 대비)
  })
  if (!isValid) throw new UnauthorizedException('OTP 코드 불일치')
  return true
}`,
        language: 'typescript',
      },
      {
        title: '기법 비교 — 실무 선택 기준',
        content: `| 기법 | 보안 | UX | 서버 확장 | 피싱 방어 | 적합한 상황 |
|---|---|---|---|---|---|
| Session | ★★★★ | ★★★ | ★★ (Redis 필요) | ★★ | 소규모 단일 서버 |
| JWT | ★★★ | ★★★★ | ★★★★★ | ★★ | MSA, 서버리스 |
| OAuth/OIDC | ★★★★ | ★★★★★ | ★★★★★ | ★★★ | 소셜 로그인, B2C |
| SSO/SAML | ★★★★★ | ★★★★ | ★★★★ | ★★★★ | 기업 내부 시스템 |
| Magic Link | ★★★ | ★★★★ | ★★★★ | ★★★ | 비밀번호 없는 서비스 |
| TOTP MFA | ★★★★★ | ★★ | ★★★★★ | ★★★★ | 금융, 관리자 계정 |
| Passkeys | ★★★★★ | ★★★★★ | ★★★★★ | ★★★★★ | 차세대 표준 |

**결론:**
- **일반 서비스 (빠른 개발):** NextAuth.js + OAuth(Google/Kakao) + JWT 전략
- **MSA/대규모:** JWT + Redis Blacklist + Refresh Token Rotation
- **기업 내부:** SSO (Okta/Azure AD) + SAML/OIDC
- **보안 최우선 (금융, 의료):** Passkeys + TOTP MFA 조합`,
      },
    ],
    keyPoints: [
      'Session(Stateful): 서버 DB 저장, 즉시 무효화 가능, 수평 확장 시 Redis 필요',
      'JWT(Stateless): 토큰 자체에 정보 포함, DB 조회 없음, 즉시 무효화 어려움 → Blacklist 패턴',
      'OAuth 2.0 = 권한 위임 프로토콜, OIDC = OAuth + 사용자 신원 확인 추가',
      'SSO: 한 번의 로그인으로 여러 서비스, 기업 환경은 SAML/Okta/Azure AD',
      'Magic Link/OTP: 비밀번호 없음, 이메일 기반, 1회용 토큰으로 구현',
      'TOTP MFA: 30초 주기 코드, SMS보다 안전 (SIM 스와핑 불가)',
      'Passkeys: 피싱 원천 차단(Origin Binding), 서버 유출 무의미, 생체 데이터 서버 전송 없음',
    ],
    relatedProblemIds: ['auth-q-023', 'auth-q-024', 'auth-q-025', 'auth-q-026', 'auth-q-027', 'auth-q-028', 'auth-q-029', 'auth-q-030'],
    tags: ['session', 'jwt', 'oauth', 'oidc', 'sso', 'saml', 'magic-link', 'totp', 'mfa', 'passkeys', 'refresh-token'],
  },
]
